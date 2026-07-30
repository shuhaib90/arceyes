import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const clientId = `client_arceyes_${Math.random().toString(36).substring(2, 10)}`;
    const clientSecret = `sec_arceyes_${Math.random().toString(36).substring(2, 18)}`;

    return NextResponse.json({
      client_id: clientId,
      client_secret: clientSecret,
      client_name: body.client_name || 'ChatGPT MCP Client',
      redirect_uris: body.redirect_uris || ['https://chatgpt.com/aip/plugin-oauth/callback'],
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      token_endpoint_auth_method: 'client_secret_post',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 400 });
  }
}
