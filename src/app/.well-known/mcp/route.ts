import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: Request) {
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return NextResponse.json(
    {
      mcp_version: '1.0.0',
      server_name: 'arceyes-mcp-server',
      endpoint: `${baseUrl}/api/mcp`,
      transport: 'http',
      authentication: {
        type: 'oauth2',
        authorization_server: `${baseUrl}/.well-known/oauth-authorization-server`,
      },
    },
    { headers: corsHeaders }
  );
}
