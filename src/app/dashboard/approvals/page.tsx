'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckSquare, ExternalLink, ArrowRight, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export default function ApprovalsDashboardPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');

  const approvals = [
    {
      id: 'appr_demo_swap_100',
      action: 'swap',
      client: 'ChatGPT',
      pay: '10.00 USDC',
      receive: '245.00 XYZ',
      protocol: 'ArcDEX Aggregator',
      status: 'pending',
      time: '18 mins ago',
      expires: 'In 28 mins',
    },
    {
      id: 'appr_demo_send_50',
      action: 'transfer',
      client: 'Claude',
      pay: '5.00 USDC',
      recipient: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      protocol: 'Arc Token Transfer',
      status: 'confirmed',
      time: '2 hours ago',
      txHash: '0xa492b012...890f',
    },
    {
      id: 'appr_demo_mint_1',
      action: 'nft_mint',
      client: 'ChatGPT',
      pay: '0.05 ARC',
      receive: '1 ArcEyes Genesis NFT',
      protocol: 'ArcEyes Genesis Pass',
      status: 'confirmed',
      time: '1 day ago',
      txHash: '0x789f2134...12ab',
    },
  ];

  const filtered = approvals.filter((a) => (filter === 'all' ? true : a.status === filter));

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight">Approvals</h1>
          <p className="text-xs text-white/60 mt-1">Review and manage transaction authorization requests from AI clients.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs">
          {(['all', 'pending', 'confirmed', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 font-bold uppercase border ${
                filter === f ? 'bg-white text-black border-white' : 'border-white/20 text-white/70 hover:border-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals Table */}
      <div className="space-y-4">
        {filtered.map((appr) => (
          <div
            key={appr.id}
            className={`border-2 p-5 bg-black flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              appr.status === 'pending' ? 'border-white' : 'border-white/20'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="font-extrabold text-base uppercase text-white">
                  {appr.action.toUpperCase()}: {appr.pay} {appr.receive ? `→ ${appr.receive}` : ''}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${
                    appr.status === 'pending'
                      ? 'bg-white text-black border-white'
                      : 'bg-white/10 text-white border-white/20'
                  }`}
                >
                  {appr.status}
                </span>
              </div>

              <div className="text-xs text-white/60 space-x-4">
                <span>Requested by: <strong className="text-white">{appr.client}</strong></span>
                <span>Protocol: <strong className="text-white">{appr.protocol}</strong></span>
                <span>Time: {appr.time}</span>
              </div>
            </div>

            <div className="shrink-0">
              {appr.status === 'pending' ? (
                <Link
                  href={`/approve/${appr.id}`}
                  className="inline-block border border-white bg-white text-black px-6 py-2.5 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all"
                >
                  Approve in Paybox →
                </Link>
              ) : (
                <a
                  href={`https://explorer.testnet.arc.network/tx/${appr.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block border border-white/40 px-4 py-2 text-xs uppercase font-bold hover:border-white"
                >
                  View Tx ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
