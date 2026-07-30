import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/db';
import { getCurrentUserSession } from '@/lib/privy/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin || pin.length < 4) {
      return NextResponse.json({ error: 'PIN must be at least 4-6 digits' }, { status: 400 });
    }

    const session = await getCurrentUserSession();
    await db.setExecutionPin(session.userId, pin);

    return NextResponse.json({
      success: true,
      message: 'ArcEyes Execution PIN set successfully!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update PIN' }, { status: 500 });
  }
}
