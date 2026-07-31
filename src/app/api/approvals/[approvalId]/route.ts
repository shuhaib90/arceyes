import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/db';
import { broadcastTransaction } from '@/lib/arc/transactions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    const { approvalId } = await params;
    const approval = await db.getApprovalById(approvalId);

    if (!approval) {
      return NextResponse.json({ error: 'Approval request not found' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(approval, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching approval' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    const { approvalId } = await params;
    const body = await req.json().catch(() => ({}));
    const { action, signedTx } = body;

    const approval = await db.getApprovalById(approvalId);
    if (!approval) {
      return NextResponse.json({ error: 'Approval request not found' }, { status: 404, headers: corsHeaders });
    }

    if (action === 'reject') {
      const updated = await db.updateApprovalStatus(approvalId, 'rejected', undefined, 'User rejected approval in ArcEyes window');
      return NextResponse.json(updated || { ...approval, status: 'rejected' }, { headers: corsHeaders });
    }

    if (action === 'approve') {
      let txHash = signedTx?.hash;

      if (!txHash) {
        const broadcastResult = await broadcastTransaction(signedTx);
        txHash = broadcastResult.txHash;
      }

      const updated = await db.updateApprovalStatus(approvalId, 'confirmed', txHash);
      return NextResponse.json(
        updated || {
          ...approval,
          status: 'confirmed',
          approved_at: new Date().toISOString(),
          transaction_hash: txHash,
        },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing approval' }, { status: 500, headers: corsHeaders });
  }
}
