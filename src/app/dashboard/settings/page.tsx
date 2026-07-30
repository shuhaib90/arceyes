'use client';

import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Settings, Shield, Terminal, Cpu, Database, RefreshCw, Copy, Check } from 'lucide-react';

export default function SettingsDashboardPage() {
  let user: any = null;
  try {
    const privy = usePrivy();
    user = privy.user;
  } catch (e) {
    console.warn(e);
  }

  const [copied, setCopied] = useState(false);
  const walletAddress = user?.wallet?.address || '';

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-mono text-white">
      <div className="border-b border-white/20 pb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">Settings &amp; Advanced</h1>
        <p className="text-xs text-white/60 mt-1">Manage user profile, RPC configuration, active sessions, and developer information.</p>
      </div>

      {/* Profile & Wallet Section */}
      <div className="border border-white/30 p-6 bg-black space-y-4">
        <h2 className="text-xl font-bold uppercase border-b border-white/20 pb-3">User Identity &amp; Wallet</h2>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/60">AUTHENTICATION METHOD</span>
            <span className="font-bold text-white uppercase">Google Login (Privy Auth)</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/60">PRIVY USER DID</span>
            <span className="font-bold text-white font-mono">{user?.id || 'Not Signed In'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">EMBEDDED WALLET ADDRESS</span>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white font-mono">{walletAddress || 'Not Connected'}</span>
              {walletAddress && (
                <button onClick={handleCopy} className="hover:text-white text-white/60">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Blockchain & Developer Info */}
      <div className="border border-white/30 p-6 bg-black space-y-4">
        <h2 className="text-xl font-bold uppercase border-b border-white/20 pb-3">Advanced Developer Info</h2>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/60">BLOCKCHAIN NETWORK</span>
            <span className="font-bold text-white uppercase">Arc Testnet</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/60">CHAIN ID</span>
            <span className="font-bold text-white font-mono">763373</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/60">RPC ENDPOINT</span>
            <span className="font-bold text-white font-mono">https://rpc.testnet.arc.network</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/60">REMOTE MCP SERVER URL</span>
            <span className="font-bold text-white font-mono">https://arceyes-agent.vercel.app/api/mcp</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">MCP TRANSPORT</span>
            <span className="font-bold text-white">Streamable HTTP Transport</span>
          </div>
        </div>
      </div>
    </div>
  );
}
