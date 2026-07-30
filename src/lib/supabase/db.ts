import { ApprovalRequest, ActivityLog, AIConnection, Profile, Wallet, NFTStatus } from './types';
import { supabaseServer } from './server';

class ArcEyesDB {
  private profiles: Map<string, Profile> = new Map();
  private wallets: Map<string, Wallet> = new Map();
  private connections: Map<string, AIConnection> = new Map();
  private approvals: Map<string, ApprovalRequest> = new Map();
  private activityLogs: ActivityLog[] = [];
  private nftStatuses: Map<string, NFTStatus> = new Map();

  // Profile Methods
  async getProfileByPrivyId(privyUserId: string): Promise<Profile | null> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('profiles').select('*').eq('privy_user_id', privyUserId).single();
      if (data) return data as Profile;
    }

    for (const p of this.profiles.values()) {
      if (p.privy_user_id === privyUserId) return p;
    }

    const newProfile: Profile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      privy_user_id: privyUserId,
      display_name: 'Arc User',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabaseServer) {
      await supabaseServer.from('profiles').insert(newProfile);
    }
    this.profiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  // Wallet Methods
  async getWalletByUserId(userId: string, userAddress?: string): Promise<Wallet | null> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('wallets').select('*').eq('user_id', userId).single();
      if (data) return data as Wallet;
    }

    if (this.wallets.has(userId)) return this.wallets.get(userId)!;

    if (!userAddress) return null;

    const defaultWallet: Wallet = {
      id: `wlt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      privy_wallet_id: `pwlt_${Date.now()}`,
      address: userAddress,
      chain_id: 763373,
      created_at: new Date().toISOString(),
    };

    if (supabaseServer) {
      await supabaseServer.from('wallets').insert(defaultWallet);
    }
    this.wallets.set(userId, defaultWallet);
    return defaultWallet;
  }

  // Connections
  async getConnections(userId: string): Promise<AIConnection[]> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('ai_connections').select('*').eq('user_id', userId);
      if (data) return data as AIConnection[];
    }
    return Array.from(this.connections.values()).filter((c) => c.user_id === userId);
  }

  async updateConnectionScopes(connectionId: string, scopes: string[]): Promise<AIConnection | null> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('ai_connections').update({ scopes }).eq('id', connectionId).select().single();
      if (data) return data as AIConnection;
    }
    const conn = this.connections.get(connectionId);
    if (!conn) return null;
    conn.scopes = scopes;
    this.connections.set(connectionId, conn);
    return conn;
  }

  async updateAutonomousSettings(connectionId: string, enabled: boolean, maxLimitUsd: number): Promise<AIConnection | null> {
    if (supabaseServer) {
      const { data } = await supabaseServer
        .from('ai_connections')
        .update({ autonomous_enabled: enabled, max_auto_amount_usd: maxLimitUsd })
        .eq('id', connectionId)
        .select()
        .single();
      if (data) return data as AIConnection;
    }

    const conn = this.connections.get(connectionId);
    if (!conn) return null;
    conn.autonomous_enabled = enabled;
    conn.max_auto_amount_usd = maxLimitUsd;
    this.connections.set(connectionId, conn);
    return conn;
  }

  async revokeConnection(connectionId: string): Promise<boolean> {
    if (supabaseServer) {
      const { error } = await supabaseServer.from('ai_connections').update({ status: 'revoked' }).eq('id', connectionId);
      if (!error) return true;
    }
    const conn = this.connections.get(connectionId);
    if (!conn) return false;
    conn.status = 'revoked';
    this.connections.set(connectionId, conn);
    return true;
  }

  // Approvals (Paybox Core)
  async createApprovalRequest(request: Omit<ApprovalRequest, 'id' | 'created_at' | 'status' | 'approved_at' | 'rejected_at' | 'transaction_hash' | 'error'>): Promise<ApprovalRequest> {
    const id = `appr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newApproval: ApprovalRequest = {
      ...request,
      id,
      status: 'pending',
      created_at: new Date().toISOString(),
      approved_at: null,
      rejected_at: null,
      transaction_hash: null,
      error: null,
    };

    if (supabaseServer) {
      const { data } = await supabaseServer.from('approval_requests').insert(newApproval).select().single();
      if (data) return data as ApprovalRequest;
    }

    this.approvals.set(id, newApproval);
    this.logActivity(request.user_id, request.connection_id, 'approval_created', {
      approval_id: id,
      action: request.action,
      summary: `Created approval request for ${request.action.toUpperCase()}`,
    });

    return newApproval;
  }

  async getApprovalById(id: string): Promise<ApprovalRequest | null> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('approval_requests').select('*').eq('id', id).single();
      if (data) return data as ApprovalRequest;
    }
    return this.approvals.get(id) || null;
  }

  async updateApprovalStatus(id: string, status: ApprovalRequest['status'], txHash?: string, errorMsg?: string): Promise<ApprovalRequest | null> {
    if (supabaseServer) {
      const updates: any = { status };
      if (status === 'approved' || status === 'confirmed') updates.approved_at = new Date().toISOString();
      if (status === 'rejected') updates.rejected_at = new Date().toISOString();
      if (txHash) updates.transaction_hash = txHash;
      if (errorMsg) updates.error = errorMsg;

      const { data } = await supabaseServer.from('approval_requests').update(updates).eq('id', id).select().single();
      if (data) return data as ApprovalRequest;
    }

    const appr = this.approvals.get(id);
    if (!appr) return null;
    appr.status = status;
    if (status === 'approved' || status === 'confirmed') {
      appr.approved_at = appr.approved_at || new Date().toISOString();
    }
    if (status === 'rejected') {
      appr.rejected_at = new Date().toISOString();
    }
    if (txHash) {
      appr.transaction_hash = txHash;
    }
    if (errorMsg) {
      appr.error = errorMsg;
    }
    this.approvals.set(id, appr);

    this.logActivity(appr.user_id, appr.connection_id, `approval_${status}`, {
      approval_id: id,
      tx_hash: txHash,
      error: errorMsg,
    });

    return appr;
  }

  async getPendingApprovals(userId: string): Promise<ApprovalRequest[]> {
    if (supabaseServer) {
      const { data } = await supabaseServer
        .from('approval_requests')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['pending', 'signing', 'broadcasting']);
      if (data) return data as ApprovalRequest[];
    }
    return Array.from(this.approvals.values()).filter(
      (a) => a.user_id === userId && (a.status === 'pending' || a.status === 'signing' || a.status === 'broadcasting')
    );
  }

  async getAllApprovals(userId: string): Promise<ApprovalRequest[]> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('approval_requests').select('*').eq('user_id', userId);
      if (data) return data as ApprovalRequest[];
    }
    return Array.from(this.approvals.values()).filter((a) => a.user_id === userId);
  }

  // Activity Logs
  async logActivity(userId: string, connectionId: string | null, type: string, metadata: Record<string, any>) {
    const newLog: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      connection_id: connectionId,
      type,
      metadata,
      created_at: new Date().toISOString(),
    };

    if (supabaseServer) {
      await supabaseServer.from('activity_logs').insert(newLog);
    }
    this.activityLogs.unshift(newLog);
  }

  async getActivityLogs(userId: string): Promise<ActivityLog[]> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('activity_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (data) return data as ActivityLog[];
    }
    return this.activityLogs.filter((l) => l.user_id === userId);
  }

  // NFT Status
  async getNFTStatus(userId: string, walletAddress?: string): Promise<NFTStatus | null> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('nft_status').select('*').eq('user_id', userId).single();
      if (data) return data as NFTStatus;
    }
    return {
      user_id: userId,
      wallet_address: walletAddress || '',
      owns_arceyes: false,
      token_ids: [],
      last_checked_at: new Date().toISOString(),
    };
  }
}

export const db = new ArcEyesDB();
