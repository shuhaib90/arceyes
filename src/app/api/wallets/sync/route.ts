import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, privyUserId } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const privyId = privyUserId || 'did:privy:user';
    const profile = await db.getProfileByPrivyId(privyId);
    if (profile) {
      await db.getWalletByUserId(profile.id, address);
    }

    return NextResponse.json({ success: true, address });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
