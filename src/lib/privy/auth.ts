import { db } from '@/lib/supabase/db';
import { supabaseServer } from '@/lib/supabase/server';

export interface UserSession {
  userId: string;
  privyUserId: string;
  walletAddress: string;
  displayName: string;
}

export async function getCurrentUserSession(privyUserId?: string): Promise<UserSession> {
  let effectivePrivyId = privyUserId;

  // Query Supabase for latest active profile if not provided
  if (!effectivePrivyId && supabaseServer) {
    const { data: latestWallet } = await supabaseServer
      .from('wallets')
      .select('user_id, address, profiles!inner(id, privy_user_id, display_name)')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (latestWallet && latestWallet.profiles) {
      const prof: any = latestWallet.profiles;
      return {
        userId: latestWallet.user_id,
        privyUserId: prof.privy_user_id || 'did:privy:user',
        walletAddress: latestWallet.address,
        displayName: prof.display_name || 'ArcEyes User',
      };
    }
  }

  // Fallback to active DB profile lookup
  const profile = await db.getProfileByPrivyId(effectivePrivyId || 'usr_active');
  const wallet = await db.getWalletByUserId(profile!.id);

  return {
    userId: profile!.id,
    privyUserId: profile!.privy_user_id,
    walletAddress: wallet ? wallet.address : '',
    displayName: profile!.display_name || 'ArcUser',
  };
}
