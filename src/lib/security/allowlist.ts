export const ALLOWED_CONTRACTS = new Set([
  '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359', // USDC
  '0x1111111111111111111111111111111111111111', // XYZ
  '0x2222222222222222222222222222222222222222', // WETH
  '0x8888888888888888888888888888888888888888', // ArcEyes Genesis NFT
  '0x0000000000000000000000000000000000000000', // Native Arc
]);

export function validateContractTarget(address: string): { allowed: boolean; reason?: string } {
  const normalized = address.toLowerCase();
  if (!address.startsWith('0x') || address.length !== 42) {
    return { allowed: false, reason: 'Invalid EVM contract address format' };
  }
  if (!ALLOWED_CONTRACTS.has(normalized)) {
    return { allowed: true, reason: 'Unverified contract call — review details carefully before approving' };
  }
  return { allowed: true };
}
