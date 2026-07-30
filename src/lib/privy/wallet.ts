import { db } from '@/lib/supabase/db';

export async function getUserWallet(userId: string) {
  return await db.getWalletByUserId(userId);
}

export async function signTransaction(walletAddress: string, txData: any) {
  // Client-side signing invoked via Privy useWallets() / sendTransaction() hook.
  // Neither private key nor seed phrase is ever sent to server or AI client.
  return {
    signedPayload: txData,
    signer: walletAddress,
  };
}
