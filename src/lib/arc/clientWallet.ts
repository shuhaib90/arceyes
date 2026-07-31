import { parseEther } from 'viem';

export async function sendArcTransactionWithPrivy(
  provider: any,
  fromAddress: string,
  toAddress: string,
  amountArc: string
): Promise<string> {
  const hexChainId = '0xba9b9'; // 763373 in hex

  // 1. Attempt to switch wallet network to Arc Testnet
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError: any) {
    if (switchError?.code === 4902 || switchError?.message?.includes('Unrecognized chain') || switchError?.message?.includes('switch')) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: hexChainId,
              chainName: 'Arc Testnet',
              nativeCurrency: { name: 'Arc', symbol: 'ARC', decimals: 18 },
              rpcUrls: ['https://rpc.testnet.arc.network'],
              blockExplorerUrls: ['https://testnet.arcscan.app'],
            },
          ],
        });
      } catch (addError) {
        console.warn('Could not add Arc Testnet chain:', addError);
      }
    }
  }

  // 2. Format Value in Hex Wei
  const parsedWei = parseEther(amountArc || '0.001');
  const hexValue = '0x' + parsedWei.toString(16);

  // 3. Send transaction via eth_sendTransaction
  const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: fromAddress,
        to: toAddress,
        value: hexValue,
        chainId: hexChainId,
      },
    ],
  });

  return txHash;
}
