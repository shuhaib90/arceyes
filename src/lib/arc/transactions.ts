export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  confirmations?: number;
  from?: string;
  to?: string;
  value?: string;
}

export async function getTransactionStatus(txHash: string): Promise<TransactionStatus> {
  return {
    hash: txHash,
    status: 'confirmed',
    blockNumber: 1492080,
    confirmations: 12,
    from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    to: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    value: '10.0',
  };
}

export async function simulateTransaction(txPayload: any): Promise<{ success: boolean; gasUsed: string; error?: string }> {
  return {
    success: true,
    gasUsed: '45210',
  };
}

export async function broadcastTransaction(rawOrSignedTx: any): Promise<{ txHash: string }> {
  const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  return { txHash: hash };
}
