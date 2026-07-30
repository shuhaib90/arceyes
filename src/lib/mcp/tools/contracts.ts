import { validateContractTarget } from '@/lib/security/allowlist';
import { db } from '@/lib/supabase/db';
import { getCurrentUserSession } from '@/lib/privy/auth';

export async function handleReadContract(contractAddress: string, methodName: string, args: any[] = []) {
  const check = validateContractTarget(contractAddress);
  if (!check.allowed) {
    throw new Error(check.reason);
  }
  return {
    contractAddress,
    methodName,
    result: '0x000000000000000000000000000000000000000000000005f5e100', // Simulated read result
    formattedResult: '100000000',
  };
}

export async function handlePrepareContractCall(contractAddress: string, methodName: string, args: any[] = [], clientName: string = 'ChatGPT') {
  const session = await getCurrentUserSession();
  const check = validateContractTarget(contractAddress);

  const approval = await db.createApprovalRequest({
    user_id: session.userId,
    wallet_id: 'wlt_arceyes_demo_1',
    connection_id: 'conn_chatgpt_1',
    action: 'contract_call',
    request_payload: {
      contractAddress,
      methodName,
      args,
    },
    transaction_preview: {
      payTokenSymbol: 'ARC',
      payAmount: '0.00',
      recipient: contractAddress,
      network: 'Arc Testnet (Chain ID 763373)',
      protocol: `Custom Contract (${methodName})`,
      estimatedFeeArc: '0.0018 ARC',
      slippagePct: '0.0%',
      requestingClient: `${clientName} (Remote MCP)`,
      warning: check.reason,
    },
    expires_at: new Date(Date.now() + 1800000).toISOString(),
  });

  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const approvalUrl = `${baseUrl}/approve/${approval.id}`;

  return {
    status: 'approval_required',
    approval_id: approval.id,
    approval_url: approvalUrl,
    message: `ArcEyes requires approval to execute contract call ${methodName} on ${contractAddress}. Approve here: ${approvalUrl}`,
    expires_at: approval.expires_at,
  };
}
