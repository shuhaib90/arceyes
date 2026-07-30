'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Cpu, CheckSquare, Copy, Check, QrCode, Lock, Plus, ShieldCheck, Activity } from 'lucide-react';
import { AIConnection } from '@/lib/supabase/types';

export default function DashboardOverview() {
  let user: any = null;
  let authenticated = false;
  let login = () => {};

  try {
    const privy = usePrivy();
    user = privy.user;
    authenticated = privy.authenticated;
    login = privy.login;
  } catch (e) {
    console.warn('Privy hook fallback:', e);
  }

  const [copied, setCopied] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [arcBalance, setArcBalance] = useState<string>('0.0000');
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [connections, setConnections] = useState<AIConnection[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);

  const walletAddress = user?.wallet?.address || '';

  // Fetch real on-chain balance from Arc Testnet RPC
  useEffect(() => {
    if (walletAddress) {
      fetchArcBalance(walletAddress);
      fetchConnections();
    } else {
      setArcBalance('0.0000');
      setConnections([]);
      setLoadingConnections(false);
    }
  }, [walletAddress]);

  const fetchArcBalance = async (addr: string) => {
    try {
      setLoadingBalance(true);
      const res = await fetch('https://rpc.testnet.arc.network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: [addr, 'latest'],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          const wei = BigInt(data.result);
          const arc = Number(wei) / 1e18;
          setArcBalance(arc.toFixed(4));
        }
      }
    } catch (e) {
      console.error('RPC Balance Fetch Error:', e);
      setArcBalance('0.0000');
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchConnections = async () => {
    try {
      setLoadingConnections(true);
      const res = await fetch('/api/connections');
      if (res.ok) {
        const data = await res.json();
        setConnections(data || []);
      } else {
        setConnections([]);
      }
    } catch (e) {
      console.error(e);
      setConnections([]);
    } finally {
      setLoadingConnections(false);
    }
  };

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-mono text-white">
      {/* Top Banner Header (PayBox Inspired) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight">Overview</h1>
          <p className="text-xs text-white/60 mt-1">Your credential vault &amp; agentic wallet for AI agents</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-2 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All Clear</span>
          </span>
          <Link
            href="/dashboard/connections"
            className="border border-white bg-white text-black text-xs font-bold uppercase px-4 py-2 hover:bg-black hover:text-white transition-all flex items-center space-x-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Agent</span>
          </Link>
        </div>
      </div>

      {/* Privy Sign-In Card if unauthenticated */}
      {!authenticated && (
        <div className="border-2 border-white p-6 sm:p-8 bg-white text-black space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5">
                  PRIVY AUTHENTICATION
                </span>
                <span className="text-xs font-bold uppercase border border-black px-2 py-0.5">
                  ARC TESTNET (763373)
                </span>
              </div>
              <h2 className="text-2xl font-extrabold uppercase">Sign In to Provision Embedded EVM Wallet</h2>
              <p className="text-xs text-black/70 max-w-xl">
                Authenticate with Google or Web3 wallet to connect AI agents like ChatGPT and Claude to your ArcEyes wallet.
              </p>
            </div>
            <button
              onClick={login}
              className="border-2 border-black bg-black text-white px-8 py-3.5 text-xs font-extrabold uppercase hover:bg-white hover:text-black transition-all shrink-0 flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Connect with Privy →</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Weekly Overview Card */}
        <div className="lg:col-span-2 border border-white/30 p-6 bg-black space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-white" />
              <span className="font-bold text-sm uppercase">Activity Log</span>
            </div>
            <span className="text-[11px] text-white/50">Last 7 days</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-extrabold text-white">0</span>
              <span className="text-xs text-white/60 uppercase font-bold">events this week</span>
            </div>

            {/* Weekly Bar Graph View */}
            <div className="grid grid-cols-7 gap-2 pt-4 items-end h-24 border-b border-white/10 pb-2 text-center text-[10px] text-white/40">
              {['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Today'].map((day, idx) => (
                <div key={day} className="flex flex-col items-center justify-end h-full space-y-2">
                  <div className={`w-full ${idx === 6 ? 'h-16 bg-emerald-500' : 'h-1 bg-white/10'}`}></div>
                  <span>{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-white/50 pt-2">
            <span>● Activity</span>
            <Link href="/dashboard/activity" className="text-white hover:underline font-bold">
              View all activity →
            </Link>
          </div>
        </div>

        {/* Connected AI Agents Card (Real Database Query) */}
        <div className="border border-white/30 p-6 bg-black space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-white" />
              <span className="font-bold text-sm uppercase">Connected Agents</span>
            </div>
            <Link href="/dashboard/connections" className="text-xs text-white/60 hover:text-white underline">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {loadingConnections ? (
              <div className="p-6 text-center text-xs text-white/40 italic">Checking active AI connections...</div>
            ) : connections.length > 0 ? (
              connections.map((conn) => (
                <div key={conn.id} className="p-4 border border-white/20 bg-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white uppercase">{conn.provider} Agent</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 border border-emerald-500/30 uppercase font-bold">
                      {conn.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/50 font-mono">
                    {conn.scopes.length} Scopes &bull; Arc Testnet
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 border border-white/20 bg-white/5 text-center space-y-3">
                <div className="font-bold text-xs uppercase text-white/70">No Agents Connected</div>
                <p className="text-[11px] text-white/50 max-w-xs mx-auto">
                  Connect ChatGPT or Claude via MCP to grant agentic wallet permissions.
                </p>
              </div>
            )}
          </div>

          <Link
            href="/dashboard/connections"
            className="block text-center border border-white py-2.5 text-xs font-bold uppercase hover:bg-white hover:text-black transition-all"
          >
            + Connect New Agent
          </Link>
        </div>
      </div>

      {/* Credentials / Wallets Section (PayBox Inspired) */}
      <div className="border border-white/30 p-6 bg-black space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div>
            <span className="text-xs text-white/60 uppercase">Vault Credentials</span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {loadingBalance ? '0.0000 ARC' : `${arcBalance} ARC`}
              <span className="text-xs text-white/50 font-normal ml-3">across your wallets</span>
            </div>
          </div>

          <button
            onClick={() => setShowReceive(true)}
            className="border border-white bg-white text-black px-5 py-2.5 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all flex items-center space-x-2 shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>+ Fund / Receive</span>
          </button>
        </div>

        {/* Wallets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 border border-white/30 bg-white/5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm uppercase">evm-default</span>
                <span className="text-[10px] text-white/50 uppercase border border-white/20 px-2 py-0.5">PRIVY EVM</span>
              </div>
              <div className="text-[11px] text-white/50">Arc Testnet (Chain ID 763373)</div>
              {walletAddress ? (
                <div className="p-2 bg-black border border-white/20 text-xs font-mono font-bold break-all">
                  {walletAddress}
                </div>
              ) : (
                <div className="text-xs text-white/40 italic">Sign in with Privy to view wallet</div>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
              <button
                onClick={handleCopy}
                disabled={!walletAddress}
                className="flex-1 border border-white/40 py-2 text-[11px] font-bold uppercase hover:border-white disabled:opacity-30 transition-all flex items-center justify-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => setShowReceive(true)}
                className="flex-1 border border-white bg-white text-black py-2 text-[11px] font-extrabold uppercase hover:bg-black hover:text-white transition-all"
              >
                Fund Wallet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receive Modal */}
      {showReceive && (
        <div className="border-2 border-white p-6 bg-black space-y-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <span className="font-bold text-sm uppercase">Fund EVM Wallet</span>
            <button onClick={() => setShowReceive(false)} className="text-white/60 hover:text-white text-sm">✕</button>
          </div>
          <p className="text-xs text-white/70">
            Deposit native ARC or testnet ERC20 tokens to your embedded wallet on Arc Testnet (763373):
          </p>
          <div className="p-3 border border-white font-mono text-xs font-bold bg-white text-black break-all text-center">
            {walletAddress || 'Not Connected'}
          </div>
          <a
            href="https://faucet.testnet.arc.network"
            target="_blank"
            rel="noreferrer"
            className="block text-center border border-white py-2.5 text-xs font-bold uppercase hover:bg-white hover:text-black transition-all"
          >
            Open Arc Testnet Faucet ↗
          </a>
        </div>
      )}

      {/* Pending Approvals Section */}
      <div className="border border-white/30 p-6 bg-black space-y-4">
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-white" />
            <span className="font-bold text-sm uppercase">Pending Approvals</span>
          </div>
          <Link href="/dashboard/approvals" className="text-xs underline text-white/70 hover:text-white">
            View all →
          </Link>
        </div>

        <div className="p-8 border border-white/20 bg-white/5 text-center space-y-3">
          <ShieldCheck className="w-8 h-8 text-white/40 mx-auto" />
          <div className="text-sm font-bold uppercase">No Pending Approvals</div>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            All AI agent transaction requests have been evaluated. When an AI agent submits a new transaction requiring user consent, it will appear here for signing.
          </p>
        </div>
      </div>
    </div>
  );
}
