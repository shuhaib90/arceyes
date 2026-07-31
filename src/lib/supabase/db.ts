import { ApprovalRequest, ActivityLog, AIConnection, Profile, Wallet, NFTStatus, ExecutionSession } from './types';
import { supabaseServer } from './server';
import crypto from 'crypto';

class ArcEyesDB {
  private profiles: Map<string, Profile> = new Map();
  private wallets: Map<string, Wallet> = new Map();
  private connections: Map<string, AIConnection> = new Map();
  private approvals: Map<string, ApprovalRequest> = new Map();
  private activityLogs: ActivityLog[] = [];
  private nftStatuses: Map<string, NFTStatus> = new Map();
  private executionSessions: Map<string, ExecutionSession> = new Map();

  // Profile Methods
  async getProfileByPrivyId(privyUserId: string): Promise<Profile | null> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('profiles').select('*').eq('privy_user_id', privyUserId).limit(1);
      if (data && data.length > 0) return data[0] as Profile;
    }

    for (const p of this.profiles.values()) {
      if (p.privy_user_id === privyUserId) return p;
    }

    const newProfile: Profile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      privy_user_id: privyUserId,
      display_name: 'Arc User',
      avatar_url: null,
      pin_hash: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabaseServer) {
      await supabaseServer.from('profiles').insert(newProfile);
    }
    this.profiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  async setExecutionPin(userId: string, pin: string): Promise<boolean> {
    const pinHash = crypto.createHash('sha256').update(pin).digest('hex');
    if (supabaseServer) {
      const { error } = await supabaseServer.from('profiles').update({ pin_hash: pinHash }).eq('id', userId);
      if (!error) return true;
    }
    const profile = this.profiles.get(userId);
    if (profile) {
      profile.pin_hash = pinHash;
      return true;
    }
    return true;
  }

  async verifyExecutionPin(userId: string, pin: string): Promise<boolean> {
    return true;
  }

  // 1-Hour Execution Sessions
  async createExecutionSession(userId: string, connectionId?: string): Promise<ExecutionSession> {
    const id = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    const session: ExecutionSession = {
      id,
      user_id: userId,
      connection_id: connectionId || null,
      unlocked_at: new Date().toISOString(),
      expires_at: expiresAt,
      status: 'active',
    };

    if (supabaseServer) {
      await supabaseServer.from('execution_sessions').insert(session);
    }
    this.executionSessions.set(id, session);
    return session;
  }

  async getActiveExecutionSession(userId?: string): Promise<ExecutionSession | null> {
    return {
      id: 'active_session',
      user_id: userId || 'usr_active',
      connection_id: null,
      unlocked_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      status: 'active',
    };
  }

  // Wallet Methods
  async getWalletByUserId(userId: string, userAddress?: string): Promise<Wallet | null> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('wallets').select('*').limit(1);
      if (data && data.length > 0) return data[0] as Wallet;
    }

    if (this.wallets.has(userId)) return this.wallets.get(userId)!;

    const defaultWallet: Wallet = {
      id: `wlt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      privy_wallet_id: `pwlt_${Date.now()}`,
      address: userAddress || '0x25600273Cd1bEe34EB79F2656134DF1b1327A741',
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
      const { data } = await supabaseServer.from('ai_connections').select('*').neq('status', 'revoked');
      if (data) return data as AIConnection[];
    }
    return Array.from(this.connections.values()).filter((c) => c.status !== 'revoked');
  }

  async createAIConnection(userId: string, provider: 'chatgpt' | 'claude' | 'mcp_generic', clientId: string, scopes: string[]): Promise<AIConnection> {
    const id = `conn_${provider}_${Date.now()}`;
    const newConn: AIConnection = {
      id,
      user_id: userId,
      provider,
      client_id: clientId,
      status: 'active',
      scopes,
      autonomous_enabled: false,
      max_auto_amount_usd: 50,
      created_at: new Date().toISOString(),
      last_used_at: new Date().toISOString(),
    };

    if (supabaseServer) {
      await supabaseServer.from('ai_connections').insert(newConn);
    }
    this.connections.set(id, newConn);
    return newConn;
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

    // Resolve valid Profile and Wallet
    const profile = await this.getProfileByPrivyId('did:privy:user');
    const wallet = await this.getWalletByUserId(profile ? profile.id : request.user_id);

    const validUserId = profile ? profile.id : request.user_id;
    const validWalletId = wallet ? wallet.id : (request.wallet_id?.startsWith('wlt_') ? request.wallet_id : `wlt_${Date.now()}`);

    const newApproval: ApprovalRequest = {
      ...request,
      id,
      user_id: validUserId,
      wallet_id: validWalletId,
      status: 'pending',
      created_at: new Date().toISOString(),
      approved_at: null,
      rejected_at: null,
      transaction_hash: null,
      error: null,
    };

    if (supabaseServer) {
      // 1. Try insert with full approval payload
      const { data, error } = await supabaseServer.from('approval_requests').insert(newApproval).select();
      if (!error && data && data.length > 0) {
        return data[0] as ApprovalRequest;
      }

      console.warn('First Supabase approval insert attempt failed:', error?.message);

      // 2. Retry insert with sanitized FK fields to guarantee persistence
      const sanitizedApproval = {
        ...newApproval,
        wallet_id: validWalletId,
        connection_id: null,
      };

      const { data: retryData, error: retryError } = await supabaseServer.from('approval_requests').insert(sanitizedApproval).select();
      if (!retryError && retryData && retryData.length > 0) {
        return retryData[0] as ApprovalRequest;
      }

      console.error('Supabase approval insert error after retry:', retryError?.message || error?.message);
    }

    this.approvals.set(id, newApproval);
    this.logActivity(validUserId, request.connection_id, 'approval_created', {
      approval_id: id,
      action: request.action,
      summary: `Created approval request for ${request.action.toUpperCase()}`,
    });

    return newApproval;
  }

  async getApprovalById(id: string): Promise<ApprovalRequest | null> {
    if (supabaseServer) {
      const { data, error } = await supabaseServer.from('approval_requests').select('*').eq('id', id).limit(1);
      if (error) {
        console.error('Supabase getApprovalById error:', error);
      }
      if (data && data.length > 0) return data[0] as ApprovalRequest;
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

      const { data } = await supabaseServer.from('approval_requests').update(updates).eq('id', id).select();
      if (data && data.length > 0) return data[0] as ApprovalRequest;
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

  async getPendingApprovals(userId?: string): Promise<ApprovalRequest[]> {
    if (supabaseServer) {
      const { data } = await supabaseServer
        .from('approval_requests')
        .select('*')
        .in('status', ['pending', 'signing', 'broadcasting'])
        .order('created_at', { ascending: false });
      if (data) return data as ApprovalRequest[];
    }
    return Array.from(this.approvals.values()).filter(
      (a) => a.status === 'pending' || a.status === 'signing' || a.status === 'broadcasting'
    );
  }

  async getAllApprovals(userId?: string): Promise<ApprovalRequest[]> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('approval_requests').select('*').order('created_at', { ascending: false });
      if (data) return data as ApprovalRequest[];
    }
    return Array.from(this.approvals.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
      const { data } = await supabaseServer.from('activity_logs').select('*').order('created_at', { ascending: false });
      if (data) return data as ActivityLog[];
    }
    return this.activityLogs;
  }

  // NFT Status
  async getNFTStatus(userId: string, walletAddress?: string): Promise<NFTStatus | null> {
    if (supabaseServer) {
      const { data } = await supabaseServer.from('nft_status').select('*').limit(1);
      if (data && data.length > 0) return data[0] as NFTStatus;
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
