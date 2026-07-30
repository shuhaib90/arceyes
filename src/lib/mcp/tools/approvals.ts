import { db } from '@/lib/supabase/db';

export async function handleGetApprovalStatus(approvalId: string) {
  const approval = await db.getApprovalById(approvalId);
  if (!approval) {
    return {
      status: 'not_found',
      error: `Approval request ID ${approvalId} not found`,
    };
  }

  return {
    approvalId: approval.id,
    status: approval.status,
    action: approval.action,
    transactionHash: approval.transaction_hash,
    error: approval.error,
    input: {
      amount: approval.request_payload.amountIn,
      token: approval.request_payload.tokenIn,
      recipient: approval.request_payload.recipient,
    },
    output: {
      amount: approval.request_payload.amountOut,
      token: approval.request_payload.tokenOut,
    },
    approvedAt: approval.approved_at,
    expiresAt: approval.expires_at,
  };
}
