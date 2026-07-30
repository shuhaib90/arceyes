import { createPublicClient, http } from 'viem';
import { arcTestnet } from './chain';

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

export async function getNetworkStatus() {
  try {
    const blockNumber = await publicClient.getBlockNumber();
    return {
      chain: 'Arc Testnet',
      chainId: arcTestnet.id,
      latestBlock: Number(blockNumber),
      rpcStatus: 'online',
    };
  } catch (err) {
    return {
      chain: 'Arc Testnet',
      chainId: arcTestnet.id,
      latestBlock: 1492042,
      rpcStatus: 'simulated',
    };
  }
}
