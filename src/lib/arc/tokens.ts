export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI?: string;
}

export const ARC_TOKENS: Record<string, TokenInfo> = {
  ARC: {
    symbol: 'ARC',
    name: 'Arc Native',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin (Arc)',
    decimals: 6,
    address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  },
  XYZ: {
    symbol: 'XYZ',
    name: 'XYZ Protocol Token',
    decimals: 18,
    address: '0x1111111111111111111111111111111111111111',
  },
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    address: '0x2222222222222222222222222222222222222222',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0x4444444444444444444444444444444444444444',
  },
};

export function getTokenBySymbolOrAddress(identifier: string): TokenInfo {
  const upper = identifier.toUpperCase();
  if (ARC_TOKENS[upper]) return ARC_TOKENS[upper];
  for (const token of Object.values(ARC_TOKENS)) {
    if (token.address.toLowerCase() === identifier.toLowerCase()) return token;
  }
  return {
    symbol: upper.slice(0, 6),
    name: `${upper} Token`,
    decimals: 18,
    address: identifier.startsWith('0x') ? identifier : '0x9999999999999999999999999999999999999999',
  };
}
