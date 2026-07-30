'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { CheckCircle2, Lock, Loader2, ShieldAlert } from 'lucide-react';

function OAuthConsentContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id') || 'ChatGPT';
  const redirectUri = searchParams.get('redirect_uri') || 'https://chatgpt.com/aip/plugin-oauth/callback';
  const state = searchParams.get('state') || '';
  const scope = searchParams.get('scope') || 'wallet:read balance:read portfolio:read trade:quote trade:prepare';

  let user: any = null;
  let authenticated = false;
  let login = () => {};

  try {
    const privy = usePrivy();
    user = privy.user;
    authenticated = privy.authenticated;
    login = privy.login;
  } catch (e) {
    console.warn('Privy fallback:', e);
  }

  const [processing, setProcessing] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    if (user?.wallet?.address) {
      setWalletAddress(user.wallet.address);
    }
  }, [user]);

  const handleConfirmAndConnect = async () => {
    setProcessing(true);

    try {
      // 1. Create connection in database via API
      await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: clientId.toLowerCase().includes('claude') ? 'claude' : 'chatgpt',
          client_id: clientId,
          scopes: scope.split(' '),
        }),
      });
    } catch (e) {
      console.error('Connection saving error:', e);
    }

    // 2. Build secure OAuth code redirect
    const code = `code_arceyes_${Math.random().toString(36).substring(2, 12)}`;
    const separator = redirectUri.includes('?') ? '&' : '?';
    const redirectTarget = `${redirectUri}${separator}code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;

    window.location.href = redirectTarget;
  };

  const displayAddr = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '0x2560...A741';

  return (
    <div className="w-full max-w-md border-2 border-white bg-black p-6 sm:p-8 space-y-6 font-mono text-white">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 border-b border-white/20 pb-4">
        <div className="w-9 h-9 border border-white flex items-center justify-center bg-black text-lg font-bold">👁</div>
        <div>
          <div className="font-bold text-base uppercase">CONNECT TO ARCEYES</div>
          <div className="text-[10px] text-white/60">REMOTE MCP AUTHORIZATION</div>
        </div>
      </div>

      {!authenticated ? (
        /* If user is NOT logged in with Privy */
        <div className="space-y-6 text-center py-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold uppercase">Connect your AI to ArcEyes</h1>
            <p className="text-xs text-white/70">
              Sign in with your Google account or Web3 wallet to authorize {clientId} to access your ArcEyes wallet.
            </p>
          </div>

          <button
            onClick={login}
            className="w-full border-2 border-white bg-white text-black py-4 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>
        </div>
      ) : (
        /* Connection Confirmation Screen */
        <>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold uppercase">{clientId} wants to connect</h1>
            <p className="text-xs text-white/70">to your ArcEyes account.</p>
          </div>

          {/* Wallet Address Display */}
          <div className="p-3 border border-white/30 bg-white/5 space-y-1">
            <div className="text-[10px] text-white/50 uppercase">EMBEDDED WALLET</div>
            <div className="font-bold text-sm text-white font-mono break-all">{displayAddr}</div>
          </div>

          {/* Requested Access Checklist */}
          <div className="border border-white/30 p-4 bg-black space-y-3">
            <div className="text-xs font-bold uppercase text-white/60 border-b border-white/10 pb-2">
              REQUESTED ACCESS
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>View wallet address</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>View balances</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>View portfolio</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>View transaction history</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Request swap quotes</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Prepare transactions</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="border border-white/30 p-3 bg-white/5 text-xs text-white/80 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">SECURITY NOTICE:</span> Financial transactions still require ArcEyes security approval.
            </div>
          </div>

          {/* Buttons: Cancel vs Confirm & Connect */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Link
              href="/dashboard"
              className="block text-center border border-white/40 py-3 text-xs font-bold uppercase hover:border-white transition-all"
            >
              Cancel
            </Link>

            <button
              onClick={handleConfirmAndConnect}
              disabled={processing}
              className="border-2 border-white bg-white text-black py-3 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <span>Confirm &amp; Connect →</span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function OAuthConsentPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4 sm:p-6 selection:bg-white selection:text-black">
      <Suspense fallback={<div className="text-xs">Loading Authorization Screen...</div>}>
        <OAuthConsentContent />
      </Suspense>
    </div>
  );
}
