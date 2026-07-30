import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('client_id') || 'chatgpt';
  const redirectUri = searchParams.get('redirect_uri') || 'https://chatgpt.com/aip/plugin-oauth/callback';
  const state = searchParams.get('state') || '';
  const scope = searchParams.get('scope') || 'wallet:read balance:read trade:quote trade:prepare';

  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';

  // Redirect to ArcEyes OAuth Authorization Consent screen
  const targetUrl = `${protocol}://${host}/connect/oauth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(scope)}`;

  return NextResponse.redirect(targetUrl);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { redirect_uri, state } = body;

    const code = `code_arceyes_${Math.random().toString(36).substring(2, 12)}`;
    const redirectTarget = `${redirect_uri}?code=${code}&state=${encodeURIComponent(state || '')}`;

    return NextResponse.json({
      code,
      redirect_url: redirectTarget,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authorization failed' }, { status: 400 });
  }
}
