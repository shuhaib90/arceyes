'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Wallet, Cpu, CheckSquare, ArrowUpRight, Copy, Check, ExternalLink, RefreshCw, QrCode, Shield, Sparkles, ArrowRight } from 'lucide-react';

export default function DashboardOverview() {
  const { user, authenticated, login } = usePrivy();
  const [copied, setCopied] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const walletAddress = user?.wallet?.address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

  useEffect(() => {
    // Show onboarding confirmation if newly logged in
    if (authenticated) {
      setShowOnboardingModal(true);
    }
  }, [authenticated]);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Sign-In Prompt Banner if not authenticated */}
      {!authenticated && (
        <div className="border-2 border-white p-6 bg-white text-black space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-black/60">INITIALIZE ARCEYES WALLET</div>
              <h2 className="text-2xl font-extrabold uppercase">Sign in with Google to Connect Your Embedded Wallet</h2>
            </div>
            <button
              onClick={login}
              className="border-2 border-black bg-black text-white px-8 py-3 text-xs font-extrabold uppercase hover:bg-white hover:text-black transition-all shrink-0"
            >
              Continue with Google →
            </button>
          </div>
        </div>
      )}

      {/* Onboarding Ready Confirmation Modal */}
      {showOnboardingModal && authenticated && (
        <div className="border-2 border-white p-6 bg-black space-y-4">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border border-white bg-white text-black flex items-center justify-center font-bold text-lg">👁</div>
              <h2 className="text-xl font-bold uppercase">Your ArcEyes Wallet is Ready</h2>
            </div>
            <button onClick={() => setShowOnboardingModal(false)} className="text-xs text-white/60 hover:text-white">✕ Dismiss</button>
          </div>

          <p className="text-xs text-white/70">
            Privy Google authentication complete. Your embedded EVM wallet has been generated on Arc Testnet:
          </p>

          <div className="p-3 border border-white font-mono text-sm font-bold bg-white/10 text-white break-all flex items-center justify-between">
            <span>{walletAddress}</span>
            <button onClick={handleCopy} className="border border-white bg-white text-black px-3 py-1 text-xs uppercase font-bold shrink-0">
              {copied ? 'Copied' : 'Copy Address'}
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight">Overview</h1>
          <p className="text-xs text-white/60 mt-1">ArcEyes Agentic Wallet &bull; Active on Arc Testnet</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/connections"
            className="border border-white bg-white text-black text-xs font-bold uppercase px-4 py-2 hover:bg-black hover:text-white transition-all"
          >
            + Connect AI Client
          </Link>
        </div>
      </div>

      {/* Grid: Portfolio & Wallet Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Card */}
        <div className="lg:col-span-2 border-2 border-white p-6 bg-black space-y-6">
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <span className="text-xs text-white/60 uppercase">TOTAL PORTFOLIO VALUE</span>
            <span className="text-xs bg-white/10 px-2 py-0.5 border border-white/20 font-bold">ARC TESTNET</span>
          </div>

          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white">$260.53</div>
            <div className="text-xs text-white/60 mt-1">≈ 14.50 ARC + 125.00 USDC + 2,450 XYZ</div>
          </div>

          {/* Token Breakdown Table */}
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between border-b border-white/10 pb-2 text-white/60 font-bold">
              <span>ASSET</span>
              <span>BALANCE</span>
              <span>USD VALUE</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/10">
              <span className="font-bold">ARC (Native)</span>
              <span>14.5000 ARC</span>
              <span>$35.53</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/10">
              <span className="font-bold">USDC (Arc)</span>
              <span>125.0000 USDC</span>
              <span>$125.00</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-bold">XYZ Token</span>
              <span>2,450.0000 XYZ</span>
              <span>$100.00</span>
            </div>
          </div>
        </div>

        {/* Wallet Address Card */}
        <div className="border border-white/30 p-6 bg-black flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs text-white/60 uppercase">EMBEDDED PRIVY WALLET</div>
            <div className="p-3 border border-white bg-white/5 space-y-2">
              <div className="text-[11px] text-white/50">ADDRESS</div>
              <div className="font-bold text-sm text-white break-all">{walletAddress}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="border border-white py-2.5 text-xs font-bold uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center space-x-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => setShowReceive(!showReceive)}
              className="border border-white bg-white text-black py-2.5 text-xs font-bold uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Receive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Receive Modal */}
      {showReceive && (
        <div className="border-2 border-white p-6 bg-black space-y-4">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <span className="font-bold text-sm uppercase">Receive Testnet Funds</span>
            <button onClick={() => setShowReceive(false)} className="text-white/60 hover:text-white">✕</button>
          </div>
          <p className="text-xs text-white/70">
            Send native ARC or ERC20 testnet tokens to your ArcEyes wallet address on Arc Testnet (Chain ID 763373):
          </p>
          <div className="p-3 border border-white font-mono text-sm font-bold bg-white text-black break-all text-center">
            {walletAddress}
          </div>
        </div>
      )}

      {/* AI Connections & Pending Approvals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Connections Summary */}
        <div className="border border-white/30 p-6 bg-black space-y-4">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span className="font-bold text-sm uppercase">AI Connections</span>
            </div>
            <Link href="/dashboard/connections" className="text-xs underline text-white/70 hover:text-white">
              Manage →
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3 border border-white/20 flex items-center justify-between bg-white/5">
              <div>
                <div className="font-bold text-sm uppercase">ChatGPT (OpenAI MCP)</div>
                <div className="text-[11px] text-white/60">8 Scopes Enabled &bull; Active</div>
              </div>
              <span className="text-xs font-bold bg-white text-black px-2 py-0.5 uppercase">CONNECTED</span>
            </div>

            <div className="p-3 border border-white/20 flex items-center justify-between bg-white/5">
              <div>
                <div className="font-bold text-sm uppercase">Claude (Anthropic)</div>
                <div className="text-[11px] text-white/60">5 Scopes Enabled &bull; Active</div>
              </div>
              <span className="text-xs font-bold bg-white text-black px-2 py-0.5 uppercase">CONNECTED</span>
            </div>
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div className="border-2 border-white p-6 bg-black space-y-4">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-white" />
              <span className="font-bold text-sm uppercase">Pending Approvals</span>
            </div>
            <span className="text-xs font-bold bg-white text-black px-2 py-0.5">1 PENDING</span>
          </div>

          <div className="p-4 border border-white bg-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase text-white">SWAP 10.00 USDC &rarr; 245.00 XYZ</span>
              <span className="text-[10px] text-white/60">ChatGPT</span>
            </div>
            <div className="text-[11px] text-white/70">
              Protocol: ArcDEX Aggregator &bull; Slippage: 0.5% &bull; Chain ID: 763373
            </div>
            <Link
              href="/approve/appr_demo_swap_100"
              className="block w-full text-center border border-white bg-white text-black py-2.5 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all"
            >
              Review &amp; Approve in Paybox →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent AI Activity Timeline */}
      <div className="border border-white/30 p-6 bg-black space-y-4">
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <span className="font-bold text-sm uppercase">Recent AI Activity</span>
          <Link href="/dashboard/activity" className="text-xs underline text-white/70 hover:text-white">
            View All Activity →
          </Link>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 border border-white/10 flex items-center justify-between bg-white/5">
            <div className="space-y-0.5">
              <div className="font-bold text-white uppercase">ChatGPT queried native ARC balance</div>
              <div className="text-white/60">Tool arc_get_wallet returned 0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
            </div>
            <span className="text-[10px] text-white/50 shrink-0">Just now</span>
          </div>

          <div className="p-3 border border-white/10 flex items-center justify-between bg-white/5">
            <div className="space-y-0.5">
              <div className="font-bold text-white uppercase">ChatGPT created swap approval</div>
              <div className="text-white/60">Prepared 10 USDC &rarr; 245 XYZ swap request (Approval ID: appr_demo_swap_100)</div>
            </div>
            <span className="text-[10px] text-white/50 shrink-0">18m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
