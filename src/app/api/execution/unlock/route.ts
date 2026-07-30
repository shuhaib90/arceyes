import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/db';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'usr_demo';
    const activeSession = await db.getActiveExecutionSession(userId);

    if (activeSession) {
      const remainingMs = new Date(activeSession.expires_at).getTime() - Date.now();
      const remainingMins = Math.max(0, Math.floor(remainingMs / 60000));
      return NextResponse.json({
        unlocked: true,
        expires_at: activeSession.expires_at,
        remaining_minutes: remainingMins,
      });
    }

    return NextResponse.json({ unlocked: false, remaining_minutes: 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, userId = 'usr_demo', connectionId } = body;

    if (!pin) {
      return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
    }

    const isValid = await db.verifyExecutionPin(userId, pin);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid ArcEyes Execution PIN' }, { status: 401 });
    }

    const session = await db.createExecutionSession(userId, connectionId);
    return NextResponse.json({
      success: true,
      session,
      message: 'Execution unlocked for 1 hour.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
