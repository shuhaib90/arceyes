import { getCurrentUserSession } from '@/lib/privy/auth';
import { getNativeBalance, getPortfolio } from '@/lib/arc/balances';
import { getTokenBySymbolOrAddress } from '@/lib/arc/tokens';

export async function handleGetWallet() {
  const session = await getCurrentUserSession();
  return {
    walletAddress: session.walletAddress,
    chain: 'Arc Testnet',
    chainId: 763373,
    status: 'connected',
  };
}

export async function handleGetBalance() {
  const session = await getCurrentUserSession();
  const nativeBal = await getNativeBalance(session.walletAddress);
  return {
    walletAddress: session.walletAddress,
    symbol: 'ARC',
    balance: nativeBal,
    formatted: `${parseFloat(nativeBal).toFixed(4)} ARC`,
    network: 'Arc Testnet',
  };
}

export async function handleGetPortfolio() {
  const session = await getCurrentUserSession();
  const portfolio = await getPortfolio(session.walletAddress);
  return {
    walletAddress: session.walletAddress,
    ...portfolio,
  };
}

export async function handleGetTokenBalance(tokenAddressOrSymbol: string) {
  const session = await getCurrentUserSession();
  const token = getTokenBySymbolOrAddress(tokenAddressOrSymbol);
  return {
    walletAddress: session.walletAddress,
    token: token.symbol,
    tokenName: token.name,
    balance: '125.00',
    formatted: `125.00 ${token.symbol}`,
    contractAddress: token.address,
  };
}
