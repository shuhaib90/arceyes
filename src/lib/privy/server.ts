import { PrivyClient } from '@privy-io/server-auth';

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
const appSecret = process.env.PRIVY_APP_SECRET || '';

export const privyServerClient =
  appId && appSecret
    ? new PrivyClient(appId, appSecret)
    : null;

export async function verifyPrivyAuthToken(authToken: string) {
  if (!privyServerClient) {
    return { verified: false, error: 'Privy server client not initialized' };
  }

  try {
    const claims = await privyServerClient.verifyAuthToken(authToken);
    const user = await privyServerClient.getUser(claims.userId);
    const wallet = user.wallet;

    return {
      verified: true,
      userId: claims.userId,
      address: wallet?.address || null,
    };
  } catch (err: any) {
    return { verified: false, error: err.message || 'Invalid auth token' };
  }
}
