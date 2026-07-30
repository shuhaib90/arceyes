'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Zap, Award, ExternalLink } from 'lucide-react';

export default function ArcEyesNFTPage() {
  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-white/20 pb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">ArcEyes Genesis NFT 👁</h1>
        <p className="text-xs text-white/60 mt-1">Genesis Membership Asset for the ArcEyes Agentic Ecosystem.</p>
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
              <h2 className="text-2xl font-extrabold uppercase">ArcEyes Genesis Holder</h2>
              <div className="text-xs text-white/80 font-bold mt-0.5">Token ID #108 &bull; Verified on Arc Testnet</div>
            </div>
          </div>

          <span className="border border-white bg-white text-black px-4 py-2 text-xs font-extrabold uppercase">
            GENESIS VERIFIED ✓
          </span>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-4">
          <div className="text-sm font-bold uppercase text-white">Active Genesis Benefits</div>
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

        <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/60">Contract Address: <span className="text-white font-mono font-bold">0x8888...8888</span></div>
          <Link
            href="/approve/appr_demo_mint_1"
            className="border border-white bg-white text-black px-6 py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-all"
          >
            Mint Additional Genesis Pass →
          </Link>
        </div>
      </div>
    </div>
  );
}
