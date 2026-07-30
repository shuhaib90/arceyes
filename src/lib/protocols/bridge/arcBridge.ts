import { getTokenBySymbolOrAddress } from '@/lib/arc/tokens';

export interface BridgeQuote {
  token: string;
  amount: string;
  sourceChain: string;
  targetChain: string;
  estimatedFee: string;
  estimatedTime: string;
  protocol: string;
}

export class ArcBridgeAdapter {
  id = 'circle-cctp-bridge';
  name = 'Circle CCTP Cross-Chain Bridge';

  async getBridgeQuote(token: string, amount: string, sourceChain: string, targetChain: string): Promise<BridgeQuote> {
    const tokenInfo = getTokenBySymbolOrAddress(token);
    return {
      token: tokenInfo.symbol,
      amount,
      sourceChain,
      targetChain,
      estimatedFee: '0.0005 ARC',
      estimatedTime: '~ 1.5 minutes',
      protocol: this.name,
    };
  }

  async buildBridgeTransaction(quote: BridgeQuote, senderAddress: string) {
    return {
      to: '0x0000000000000000000000000000000000000000',
      data: '0x',
      value: '0',
      from: senderAddress,
      chainId: 763373,
    };
  }
}

export const arcBridgeAdapter = new ArcBridgeAdapter();
