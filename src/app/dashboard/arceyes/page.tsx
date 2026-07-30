'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Sparkles, ShieldCheck, Zap, Award, ExternalLink, Loader2 } from 'lucide-react';

export default function ArcEyesNFTPage() {
  let user: any = null;
  let authenticated = false;

  try {
    const privy = usePrivy();
    user = privy.user;
    authenticated = privy.authenticated;
  } catch (e) {
    console.warn(e);
  }

  const walletAddress = user?.wallet?.address || '';
  const [ownsNft, setOwnsNft] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      checkNftStatus(walletAddress);
    }
  }, [walletAddress]);

  const checkNftStatus = async (addr: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'arc_get_nft_status',
            arguments: { address: addr },
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.result?.content?.[0]?.text || '';
        if (text.includes('Owns NFT: Yes') || text.includes('true')) {
          setOwnsNft(true);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-mono text-white">
      <div className="border-b border-white/20 pb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">ArcEyes Genesis NFT 👁</h1>
        <p className="text-xs text-white/60 mt-1">Genesis Membership Asset for the ArcEyes Agentic Ecosystem on Arc Testnet.</p>
      </div>

      {/* Holder Status Card */}
      <div className="border-2 border-white p-8 bg-black space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/20 pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 border-2 border-white bg-white text-black text-3xl font-bold flex items-center justify-center">
              👁
            </div>
            <div>
              <div className="text-xs text-white/60 uppercase">MEMBERSHIP STATUS</div>
              <h2 className="text-2xl font-extrabold uppercase">
                {ownsNft ? 'ArcEyes Genesis Holder' : 'Standard Member'}
              </h2>
              <div className="text-xs text-white/80 font-bold mt-0.5">
                {loading
                  ? 'Checking Arc Testnet on-chain status...'
                  : ownsNft
                  ? 'Verified Genesis Pass on Arc Testnet'
                  : 'No Genesis Pass detected in wallet'}
              </div>
            </div>
          </div>

          <span
            className={`border px-4 py-2 text-xs font-extrabold uppercase ${
              ownsNft ? 'bg-white text-black border-white' : 'border-white/40 text-white/70'
            }`}
          >
            {ownsNft ? 'GENESIS VERIFIED ✓' : 'STANDARD ACCESS'}
          </span>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-4">
          <div className="text-sm font-bold uppercase text-white">Genesis Pass Benefits</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 border border-white/30 bg-white/5 space-y-1">
              <div className="font-bold text-white uppercase">⚡ 10x MCP API Rate Limits</div>
              <div className="text-white/60">Increased throughput for ChatGPT &amp; Claude automation queries.</div>
            </div>

            <div className="p-4 border border-white/30 bg-white/5 space-y-1">
              <div className="font-bold text-white uppercase">🛡 Zero Aggregator Surcharge</div>
              <div className="text-white/60">0% protocol fee on all ArcDEX swap routes prepared by AI.</div>
            </div>

            <div className="p-4 border border-white/30 bg-white/5 space-y-1">
              <div className="font-bold text-white uppercase">🚀 Priority Approval Queue</div>
              <div className="text-white/60">Instant transaction simulation and nonce prioritization.</div>
            </div>

            <div className="p-4 border border-white/30 bg-white/5 space-y-1">
              <div className="font-bold text-white uppercase">👁 Genesis Holder Badge</div>
              <div className="text-white/60">Exclusive Genesis badge across all ArcEyes agentic interfaces.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
