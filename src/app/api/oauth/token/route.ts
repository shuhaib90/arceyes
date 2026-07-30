import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let grantType = 'authorization_code';
    let code = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      grantType = params.get('grant_type') || 'authorization_code';
      code = params.get('code') || '';
    } else {
      const body = await req.json().catch(() => ({}));
      grantType = body.grant_type || 'authorization_code';
      code = body.code || '';
    }

    const accessToken = `arceyes_access_${Math.random().toString(36).substring(2, 16)}`;
    const refreshToken = `arceyes_refresh_${Math.random().toString(36).substring(2, 16)}`;

    return NextResponse.json(
      {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600 * 24 * 30, // 30 days
        refresh_token: refreshToken,
        scope: 'wallet:read balance:read portfolio:read trade:quote trade:prepare transaction:prepare nft:read defi:read',
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Token issuance failed' }, { status: 400, headers: corsHeaders });
  }
}
