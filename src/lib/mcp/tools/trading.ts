import { registry } from '@/lib/protocols/registry';
import { db } from '@/lib/supabase/db';
import { getCurrentUserSession } from '@/lib/privy/auth';
import { broadcastTransaction } from '@/lib/arc/transactions';

export async function handleGetSwapQuote(tokenIn: string, tokenOut: string, amount: string, slippage: string = '0.5%') {
  const dex = registry.getPrimaryDEX();
  const quote = await dex.getQuote(tokenIn, tokenOut, amount, slippage);
  return {
    quote,
    message: `${quote.amountIn} ${quote.tokenIn} will return approximately ${quote.amountOut} ${quote.tokenOut} on ${quote.protocol}.`,
  };
}

export async function handlePrepareSwap(tokenIn: string, tokenOut: string, amount: string, slippage: string = '0.5%', clientName: string = 'ChatGPT') {
  const session = await getCurrentUserSession();
  const dex = registry.getPrimaryDEX();
  const quote = await dex.getQuote(tokenIn, tokenOut, amount, slippage);

  // Check if Autonomous Delegated Execution is enabled for ChatGPT/Claude connections
  const connections = await db.getConnections(session.userId);
  const conn = connections.find((c) => c.provider === 'chatgpt' || c.provider === 'claude') || connections[0];
  const numAmount = parseFloat(amount) || 0;

  const isAutoApproved = conn?.autonomous_enabled && numAmount <= (conn?.max_auto_amount_usd || 50);

  if (isAutoApproved) {
    // ⚡ Autonomous Delegated Execution: Immediately auto-approve and broadcast to Arc EVM
    const broadcastResult = await broadcastTransaction({ action: 'swap', quote });

    const autoApproval = await db.createApprovalRequest({
      user_id: session.userId,
      wallet_id: 'wlt_arceyes_demo_1',
      connection_id: conn ? conn.id : null,
      action: 'swap',
      request_payload: {
        tokenIn: quote.tokenIn,
        tokenOut: quote.tokenOut,
        amountIn: quote.amountIn,
        amountOut: quote.amountOut,
        slippage: slippage,
        protocol: quote.protocol,
      },
      transaction_preview: {
        payTokenSymbol: quote.tokenIn,
        payAmount: quote.amountIn,
        receiveTokenSymbol: quote.tokenOut,
        receiveAmount: quote.amountOut,
        network: 'Arc Testnet (Chain ID 763373)',
        protocol: quote.protocol,
        estimatedFeeArc: quote.estimatedGasFeeArc,
        slippagePct: slippage,
        requestingClient: `${clientName} (Autonomous AI Delegate)`,
      },
      expires_at: new Date(Date.now() + 1800000).toISOString(),
    });

    await db.updateApprovalStatus(autoApproval.id, 'confirmed', broadcastResult.txHash);

    return {
      status: 'auto_approved_and_confirmed',
      approval_id: autoApproval.id,
      transactionHash: broadcastResult.txHash,
      message: `✓ Autonomous execution active: Swap of ${quote.amountIn} ${quote.tokenIn} → ${quote.amountOut} ${quote.tokenOut} auto-approved & confirmed on Arc EVM.`,
      explorerUrl: `https://explorer.testnet.arc.network/tx/${broadcastResult.txHash}`,
      summary: {
        pay: `${quote.amountIn} ${quote.tokenIn}`,
        receive: `≈ ${quote.amountOut} ${quote.tokenOut}`,
        txHash: broadcastResult.txHash,
      },
    };
  }

  // Standard Manual Paybox Approval Mode
  const approval = await db.createApprovalRequest({
    user_id: session.userId,
    wallet_id: 'wlt_arceyes_demo_1',
    connection_id: conn ? conn.id : null,
    action: 'swap',
    request_payload: {
      tokenIn: quote.tokenIn,
      tokenOut: quote.tokenOut,
      amountIn: quote.amountIn,
      amountOut: quote.amountOut,
      slippage: slippage,
      protocol: quote.protocol,
    },
    transaction_preview: {
      payTokenSymbol: quote.tokenIn,
      payAmount: quote.amountIn,
      receiveTokenSymbol: quote.tokenOut,
      receiveAmount: quote.amountOut,
      network: 'Arc Testnet (Chain ID 763373)',
      protocol: quote.protocol,
      estimatedFeeArc: quote.estimatedGasFeeArc,
      slippagePct: slippage,
      requestingClient: `${clientName} (Remote MCP)`,
    },
    expires_at: new Date(Date.now() + 1800000).toISOString(),
  });

  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const approvalUrl = `${baseUrl}/approve/${approval.id}`;

  return {
    status: 'approval_required',
    approval_id: approval.id,
    approval_url: approvalUrl,
    message: `ArcEyes needs your approval to swap ${quote.amountIn} ${quote.tokenIn} → ${quote.amountOut} ${quote.tokenOut}. Open the approval URL to confirm: ${approvalUrl}`,
    expires_at: approval.expires_at,
    summary: {
      pay: `${quote.amountIn} ${quote.tokenIn}`,
      receive: `≈ ${quote.amountOut} ${quote.tokenOut}`,
      network: 'Arc Testnet',
    },
  };
}
