import { db } from '@/lib/supabase/db';

export interface UserSession {
  userId: string;
  privyUserId: string;
  walletAddress: string;
  displayName: string;
}

export async function getCurrentUserSession(privyUserId?: string): Promise<UserSession> {
  const effectivePrivyId = privyUserId || 'did:privy:cm0x_demo_user';
  const profile = await db.getProfileByPrivyId(effectivePrivyId);
  const wallet = await db.getWalletByUserId(profile!.id);

  return {
    userId: profile!.id,
    privyUserId: profile!.privy_user_id,
    walletAddress: wallet!.address,
    displayName: profile!.display_name || 'ArcEyes User',
  };
}
