export interface SwapQuote {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  priceImpact: string;
  protocol: string;
  route: string[];
  estimatedGasFeeArc: string;
  expiresAt: string;
}

export interface DEXAdapter {
  id: string;
  name: string;
  getQuote(tokenIn: string, tokenOut: string, amountIn: string, slippage?: string): Promise<SwapQuote>;
  buildSwapTransaction(quote: SwapQuote, senderAddress: string): Promise<any>;
  simulateSwap(quote: SwapQuote, senderAddress: string): Promise<boolean>;
}

export interface NFTAdapter {
  id: string;
  name: string;
  getCollectionInfo(contractAddress: string): Promise<any>;
  buildMintTransaction(contractAddress: string, recipient: string, quantity: number): Promise<any>;
}
