import { DEXAdapter, SwapQuote } from '../types';
import { getTokenBySymbolOrAddress } from '@/lib/arc/tokens';

export class ArcDEXAdapter implements DEXAdapter {
  id = 'arcdex-v1';
  name = 'ArcDEX Aggregator';

  async getQuote(tokenIn: string, tokenOut: string, amountIn: string, slippage: string = '0.5%'): Promise<SwapQuote> {
    const tokenInInfo = getTokenBySymbolOrAddress(tokenIn);
    const tokenOutInfo = getTokenBySymbolOrAddress(tokenOut);
    const amt = parseFloat(amountIn) || 1.0;

    let outputMultiplier = 1.0;
    if (tokenInInfo.symbol === 'USDC' && tokenOutInfo.symbol === 'XYZ') {
      outputMultiplier = 24.5;
    } else if (tokenInInfo.symbol === 'USDC' && tokenOutInfo.symbol === 'ARC') {
      outputMultiplier = 0.408;
    } else if (tokenInInfo.symbol === 'ARC' && tokenOutInfo.symbol === 'USDC') {
      outputMultiplier = 2.45;
    } else {
      outputMultiplier = 12.0;
    }

    const estimatedOut = (amt * outputMultiplier).toFixed(2);

    return {
      tokenIn: tokenInInfo.symbol,
      tokenOut: tokenOutInfo.symbol,
      amountIn: amt.toString(),
      amountOut: estimatedOut,
      priceImpact: '< 0.05%',
      protocol: this.name,
      route: [tokenInInfo.symbol, 'ARC-V1-POOL', tokenOutInfo.symbol],
      estimatedGasFeeArc: '0.0012 ARC',
      expiresAt: new Date(Date.now() + 180000).toISOString(),
    };
  }

  async buildSwapTransaction(quote: SwapQuote, senderAddress: string): Promise<any> {
    return {
      to: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Router Contract
      data: '0x38ed1739000000000000000000000000000000000000000000000000000000000000000a',
      value: '0',
      from: senderAddress,
      chainId: 763373,
    };
  }

  async simulateSwap(quote: SwapQuote, senderAddress: string): Promise<boolean> {
    return true;
  }
}

export const arcDEXAdapter = new ArcDEXAdapter();
