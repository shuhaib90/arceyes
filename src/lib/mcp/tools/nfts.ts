import { db } from '@/lib/supabase/db';
import { getCurrentUserSession } from '@/lib/privy/auth';
import { registry } from '@/lib/protocols/registry';

export async function handleGetNFTs() {
  const session = await getCurrentUserSession();
  const nftStatus = await db.getNFTStatus(session.userId);
  return {
    walletAddress: session.walletAddress,
    ownsArcEyesGenesis: nftStatus?.owns_arceyes || false,
    tokenIds: nftStatus?.token_ids || [],
    collections: [
      {
        name: 'ArcEyes Genesis Pass',
        symbol: 'EYES',
        count: nftStatus?.token_ids.length || 0,
        tokenIds: nftStatus?.token_ids || [],
        contractAddress: '0x8888888888888888888888888888888888888888',
      },
    ],
  };
}

export async function handlePrepareNFTMint(contractAddress?: string, quantity: number = 1, clientName: string = 'ChatGPT') {
  const session = await getCurrentUserSession();
  const nftAdapter = registry.getPrimaryNFT();
  const targetContract = contractAddress || '0x8888888888888888888888888888888888888888';

  const approval = await db.createApprovalRequest({
    user_id: session.userId,
    wallet_id: 'wlt_arceyes_demo_1',
    connection_id: 'conn_chatgpt_1',
    action: 'nft_mint',
    request_payload: {
      contractAddress: targetContract,
      amountIn: '0.05',
      tokenIn: 'ARC',
    },
    transaction_preview: {
      payTokenSymbol: 'ARC',
      payAmount: (0.05 * quantity).toFixed(2),
      receiveTokenSymbol: 'ArcEyes Genesis NFT',
      receiveAmount: quantity.toString(),
      network: 'Arc Testnet (Chain ID 763373)',
      protocol: nftAdapter.name,
      estimatedFeeArc: '0.0015 ARC',
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
    message: `ArcEyes requires approval to mint ${quantity} ${nftAdapter.name} for 0.05 ARC. Approve here: ${approvalUrl}`,
    expires_at: approval.expires_at,
  };
}
