import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/db';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ connectionId: string }> }) {
  try {
    const { connectionId } = await params;
    const success = await db.revokeConnection(connectionId);

    if (success) {
      return NextResponse.json({ success: true, message: `Connection ${connectionId} revoked immediately.` });
    }
    return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
