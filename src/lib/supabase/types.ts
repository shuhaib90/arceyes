export type ApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'signing'
  | 'broadcasting'
  | 'submitted'
  | 'confirmed'
  | 'failed';

export type ActionType = 'swap' | 'transfer' | 'nft_mint' | 'contract_call' | 'bridge';

export interface Profile {
  id: string;
  privy_user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  privy_wallet_id: string;
  address: string;
  chain_id: number;
  created_at: string;
}

export interface AIConnection {
  id: string;
  user_id: string;
  provider: 'chatgpt' | 'claude' | 'mcp_generic';
  client_id: string;
  status: 'active' | 'suspended' | 'revoked';
  scopes: string[];
  autonomous_enabled: boolean;
  max_auto_amount_usd: number;
  created_at: string;
  last_used_at: string;
}

export interface MCPSession {
  id: string;
  user_id: string;
  connection_id: string;
  client: string;
  scopes: string[];
  expires_at: string;
  created_at: string;
  revoked_at: string | null;
}

export interface ApprovalRequest {
  id: string;
  user_id: string;
  wallet_id: string;
  connection_id: string | null;
  action: ActionType;
  request_payload: {
    tokenIn?: string;
    tokenOut?: string;
    amountIn?: string;
    amountOut?: string;
    recipient?: string;
    sourceChain?: string;
    targetChain?: string;
    contractAddress?: string;
    methodName?: string;
    args?: any[];
    slippage?: string;
    protocol?: string;
  };
  transaction_preview: {
    payTokenSymbol: string;
    payAmount: string;
    receiveTokenSymbol?: string;
    receiveAmount?: string;
    recipient?: string;
    network: string;
    protocol: string;
    estimatedFeeArc: string;
    slippagePct: string;
    requestingClient: string;
    warning?: string;
  };
  status: ApprovalStatus;
  expires_at: string;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  transaction_hash: string | null;
  error: string | null;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  connection_id: string | null;
  type: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface NFTStatus {
  user_id: string;
  wallet_address: string;
  owns_arceyes: boolean;
  token_ids: number[];
  last_checked_at: string;
}
