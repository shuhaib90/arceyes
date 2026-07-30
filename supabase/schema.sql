-- ArcEyes Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  privy_user_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  privy_wallet_id TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  chain_id INTEGER DEFAULT 763373 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. AI CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL, -- 'chatgpt', 'claude', 'mcp_generic'
  client_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'suspended', 'revoked'
  scopes JSONB NOT NULL DEFAULT '["wallet:read", "balance:read", "trade:quote", "trade:prepare"]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_used_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. MCP SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.mcp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  connection_id UUID REFERENCES public.ai_connections(id) ON DELETE CASCADE NOT NULL,
  client TEXT NOT NULL,
  scopes JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  revoked_at TIMESTAMPTZ
);

-- 5. APPROVAL REQUESTS TABLE (PAYBOX CORE)
CREATE TABLE IF NOT EXISTS public.approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
  connection_id UUID REFERENCES public.ai_connections(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'swap', 'transfer', 'nft_mint', 'contract_call'
  request_payload JSONB NOT NULL,
  transaction_preview JSONB NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected', 'expired', 'signing', 'broadcasting', 'submitted', 'confirmed', 'failed'
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  transaction_hash TEXT,
  error TEXT
);

-- 6. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  connection_id UUID REFERENCES public.ai_connections(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'auth', 'mcp_query', 'approval_created', 'approval_granted', 'approval_rejected', 'transaction_submitted'
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. NFT STATUS TABLE
CREATE TABLE IF NOT EXISTS public.nft_status (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  owns_arceyes BOOLEAN DEFAULT FALSE NOT NULL,
  token_ids JSONB DEFAULT '[]' NOT NULL,
  last_checked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_wallets_address ON public.wallets(address);
CREATE INDEX IF NOT EXISTS idx_wallets_user ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_connections_user ON public.ai_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_user ON public.approval_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON public.approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nft_status ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (Users access only their own rows)
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own connections" ON public.ai_connections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own mcp sessions" ON public.mcp_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own approval requests" ON public.approval_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own activity" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own nft status" ON public.nft_status FOR SELECT USING (auth.uid() = user_id);
