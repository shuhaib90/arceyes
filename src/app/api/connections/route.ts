import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/db';
import { getCurrentUserSession } from '@/lib/privy/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    const session = await getCurrentUserSession();
    const connections = await db.getConnections(session.userId);
    return NextResponse.json(connections, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch connections' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { provider = 'chatgpt', client_id = 'mcp_client', scopes } = body;

    const session = await getCurrentUserSession();
    const defaultScopes = scopes || ['wallet:read', 'balance:read', 'portfolio:read', 'trade:quote', 'trade:prepare'];

    const newConnection = await db.createAIConnection(
      session.userId,
      provider.toLowerCase().includes('claude') ? 'claude' : 'chatgpt',
      client_id,
      defaultScopes
    );

    return NextResponse.json(newConnection, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create connection' }, { status: 500, headers: corsHeaders });
  }
}
