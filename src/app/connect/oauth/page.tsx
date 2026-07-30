'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

function OAuthConsentContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id') || 'ChatGPT';
  const redirectUri = searchParams.get('redirect_uri') || 'https://chatgpt.com/aip/plugin-oauth/callback';
  const state = searchParams.get('state') || '';
  const scope = searchParams.get('scope') || 'wallet:read balance:read trade:quote trade:prepare';

  const code = `code_arceyes_${Math.random().toString(36).substring(2, 12)}`;
  const separator = redirectUri.includes('?') ? '&' : '?';
  const redirectTarget = `${redirectUri}${separator}code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;

  return (
    <div className="w-full max-w-md border-2 border-white bg-black p-6 sm:p-8 space-y-6">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 border-b border-white/20 pb-4">
        <div className="w-9 h-9 border border-white flex items-center justify-center bg-black text-lg">👁</div>
        <div>
          <div className="font-bold text-base uppercase">ARCEYES OAUTH</div>
          <div className="text-[10px] text-white/60">REMOTE MCP AUTHORIZATION</div>
        </div>
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-extrabold uppercase mb-2">Connect ChatGPT to ArcEyes?</h1>
        <p className="text-xs text-white/70">
          ChatGPT is requesting permission to access your ArcEyes wallet action layer over Remote MCP.
        </p>
      </div>

      {/* Granted Scopes Checklist */}
      <div className="border border-white/30 p-4 bg-white/5 space-y-3">
        <div className="text-xs font-bold uppercase text-white/60 border-b border-white/10 pb-2">
          REQUESTED PERMISSIONS
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>View wallet address</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>View native ARC &amp; token balances</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>View portfolio breakdown &amp; USD valuations</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>View transaction history &amp; DeFi positions</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>Request DEX trade quotes</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>Prepare pending transaction approvals</span>
          </div>
        </div>
      </div>

      {/* Security Guarantee Banner */}
      <div className="border border-white p-3 bg-black text-xs text-white space-y-1">
        <div className="font-extrabold uppercase flex items-center space-x-2">
          <Lock className="w-4 h-4" />
          <span>SECURITY GUARANTEE</span>
        </div>
        <p className="text-white/70 text-[11px]">
          ChatGPT will <span className="text-white font-bold underline">NEVER</span> receive your private key or seed phrase. All financial execution requires your explicit approval in the ArcEyes Paybox window.
        </p>
      </div>

      {/* Direct HTML Callback Form */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <Link
          href="/dashboard"
          className="block text-center border border-white/40 py-3 text-xs font-bold uppercase hover:border-white transition-all"
        >
          Cancel
        </Link>
        
        <a
          href={redirectTarget}
          className="block text-center border-2 border-white bg-white text-black py-3 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all"
        >
          Authorize →
        </a>
      </div>
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
