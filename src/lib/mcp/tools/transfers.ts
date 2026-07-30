import { db } from '@/lib/supabase/db';
import { getCurrentUserSession } from '@/lib/privy/auth';
import { getTokenBySymbolOrAddress } from '@/lib/arc/tokens';
import { registry } from '@/lib/protocols/registry';
import { broadcastTransaction } from '@/lib/arc/transactions';

export async function handlePrepareSend(token: string, amount: string, recipient: string, clientName: string = 'ChatGPT') {
  const session = await getCurrentUserSession();
  const tokenInfo = getTokenBySymbolOrAddress(token);

  const connections = await db.getConnections(session.userId);
  const conn = connections.find((c) => c.provider === 'chatgpt' || c.provider === 'claude') || connections[0];
  const numAmount = parseFloat(amount) || 0;

  const isAutoApproved = conn?.autonomous_enabled && numAmount <= (conn?.max_auto_amount_usd || 50);

  if (isAutoApproved) {
    const broadcastResult = await broadcastTransaction({ action: 'transfer', token: tokenInfo.symbol, amount, recipient });

    const autoApproval = await db.createApprovalRequest({
      user_id: session.userId,
      wallet_id: 'wlt_arceyes_demo_1',
      connection_id: conn ? conn.id : null,
      action: 'transfer',
      request_payload: {
        tokenIn: tokenInfo.symbol,
        amountIn: amount,
        recipient,
      },
      transaction_preview: {
        payTokenSymbol: tokenInfo.symbol,
        payAmount: amount,
        recipient,
        network: 'Arc Testnet (Chain ID 763373)',
        protocol: 'Arc Token Transfer',
        estimatedFeeArc: '0.0008 ARC',
        slippagePct: '0.0%',
        requestingClient: `${clientName} (Autonomous AI Delegate)`,
      },
      expires_at: new Date(Date.now() + 1800000).toISOString(),
    });

    await db.updateApprovalStatus(autoApproval.id, 'confirmed', broadcastResult.txHash);

    return {
      status: 'auto_approved_and_confirmed',
      approval_id: autoApproval.id,
      transactionHash: broadcastResult.txHash,
      message: `✓ Autonomous execution active: Transfer of ${amount} ${tokenInfo.symbol} to ${recipient} auto-approved & confirmed on Arc EVM.`,
      explorerUrl: `https://explorer.testnet.arc.network/tx/${broadcastResult.txHash}`,
    };
  }

  const approval = await db.createApprovalRequest({
    user_id: session.userId,
    wallet_id: 'wlt_arceyes_demo_1',
    connection_id: conn ? conn.id : null,
    action: 'transfer',
    request_payload: {
      tokenIn: tokenInfo.symbol,
      amountIn: amount,
      recipient,
    },
    transaction_preview: {
      payTokenSymbol: tokenInfo.symbol,
      payAmount: amount,
      recipient,
      network: 'Arc Testnet (Chain ID 763373)',
      protocol: 'Arc Token Transfer',
      estimatedFeeArc: '0.0008 ARC',
      slippagePct: '0.0%',
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
    message: `ArcEyes requires approval to send ${amount} ${tokenInfo.symbol} to ${recipient}. Please approve here: ${approvalUrl}`,
    expires_at: approval.expires_at,
  };
}

export async function handlePrepareBridge(token: string, amount: string, sourceChain: string, targetChain: string, clientName: string = 'ChatGPT') {
  const session = await getCurrentUserSession();
  const bridgeAdapter = registry.getPrimaryBridge();
  const quote = await bridgeAdapter.getBridgeQuote(token, amount, sourceChain, targetChain);

  const connections = await db.getConnections(session.userId);
  const conn = connections.find((c) => c.provider === 'chatgpt' || c.provider === 'claude') || connections[0];
  const numAmount = parseFloat(amount) || 0;

  const isAutoApproved = conn?.autonomous_enabled && numAmount <= (conn?.max_auto_amount_usd || 50);

  if (isAutoApproved) {
    const broadcastResult = await broadcastTransaction({ action: 'bridge', quote });

    const autoApproval = await db.createApprovalRequest({
      user_id: session.userId,
      wallet_id: 'wlt_arceyes_demo_1',
      connection_id: conn ? conn.id : null,
      action: 'bridge',
      request_payload: {
        tokenIn: quote.token,
        amountIn: amount,
        sourceChain,
        targetChain,
        protocol: quote.protocol,
      },
      transaction_preview: {
        payTokenSymbol: quote.token,
        payAmount: amount,
        network: `${sourceChain} → ${targetChain}`,
        protocol: quote.protocol,
        estimatedFeeArc: quote.estimatedFee,
        slippagePct: '0.0%',
        requestingClient: `${clientName} (Autonomous AI Delegate)`,
      },
      expires_at: new Date(Date.now() + 1800000).toISOString(),
    });

    await db.updateApprovalStatus(autoApproval.id, 'confirmed', broadcastResult.txHash);

    return {
      status: 'auto_approved_and_confirmed',
      approval_id: autoApproval.id,
      transactionHash: broadcastResult.txHash,
      message: `✓ Autonomous execution active: Bridge of ${amount} ${quote.token} from ${sourceChain} to ${targetChain} auto-approved & confirmed via Circle CCTP.`,
      explorerUrl: `https://explorer.testnet.arc.network/tx/${broadcastResult.txHash}`,
    };
  }

  const approval = await db.createApprovalRequest({
    user_id: session.userId,
    wallet_id: 'wlt_arceyes_demo_1',
    connection_id: conn ? conn.id : null,
    action: 'bridge',
    request_payload: {
      tokenIn: quote.token,
      amountIn: amount,
      sourceChain,
      targetChain,
      protocol: quote.protocol,
    },
    transaction_preview: {
      payTokenSymbol: quote.token,
      payAmount: amount,
      network: `${sourceChain} → ${targetChain}`,
      protocol: quote.protocol,
      estimatedFeeArc: quote.estimatedFee,
      slippagePct: '0.0%',
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
    message: `ArcEyes requires approval to bridge ${amount} ${quote.token} from ${sourceChain} to ${targetChain}. Approve here: ${approvalUrl}`,
    expires_at: approval.expires_at,
  };
}
