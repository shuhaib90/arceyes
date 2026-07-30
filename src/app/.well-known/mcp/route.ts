import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return NextResponse.json({
    mcp_version: '1.0.0',
    server_name: 'arceyes-mcp-server',
    endpoint: `${baseUrl}/api/mcp`,
    transport: 'http',
    authentication: {
      type: 'oauth2',
      authorization_server: `${baseUrl}/.well-known/oauth-authorization-server`,
    },
  });
}
