import { NFTAdapter } from '../types';

export class ArcEyesNFTAdapter implements NFTAdapter {
  id = 'arceyes-genesis-nft';
  name = 'ArcEyes Genesis Pass';

  async getCollectionInfo(contractAddress: string) {
    return {
      name: 'ArcEyes Genesis Pass',
      symbol: 'EYES',
      totalSupply: 1000,
      mintPriceArc: '0.05 ARC',
      contractAddress: '0x8888888888888888888888888888888888888888',
      perks: ['Higher MCP API rate limits', 'Zero DEX aggregator fee surcharge', 'Priority transaction queue', 'Holder Genesis Badge'],
    };
  }

  async buildMintTransaction(contractAddress: string, recipient: string, quantity: number) {
    return {
      to: contractAddress || '0x8888888888888888888888888888888888888888',
      data: '0x1249c58b000000000000000000000000' + recipient.replace('0x', ''),
      value: '50000000000000000', // 0.05 ARC in Wei
      from: recipient,
      chainId: 763373,
    };
  }
}

export const arcEyesNFTAdapter = new ArcEyesNFTAdapter();
