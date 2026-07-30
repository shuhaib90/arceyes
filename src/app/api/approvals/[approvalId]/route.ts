import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase/db';
import { broadcastTransaction } from '@/lib/arc/transactions';

export async function GET(req: Request, { params }: { params: Promise<{ approvalId: string }> }) {
  const { approvalId } = await params;
  const approval = await db.getApprovalById(approvalId);

  if (!approval) {
    return NextResponse.json({ error: 'Approval request not found' }, { status: 404 });
  }

  return NextResponse.json(approval);
}

export async function POST(req: Request, { params }: { params: Promise<{ approvalId: string }> }) {
  const { approvalId } = await params;
  const body = await req.json();
  const { action, signedTx } = body;

  const approval = await db.getApprovalById(approvalId);
  if (!approval) {
    return NextResponse.json({ error: 'Approval request not found' }, { status: 404 });
  }

  if (action === 'reject') {
    const updated = await db.updateApprovalStatus(approvalId, 'rejected', undefined, 'User rejected approval in ArcEyes window');
    return NextResponse.json(updated);
  }

  if (action === 'approve') {
    // 1. Update state to signing & broadcasting
    await db.updateApprovalStatus(approvalId, 'broadcasting');

    // 2. Broadcast signed transaction to Arc EVM
    const broadcastResult = await broadcastTransaction(signedTx);

    // 3. Confirm execution
    const updated = await db.updateApprovalStatus(approvalId, 'confirmed', broadcastResult.txHash);
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
