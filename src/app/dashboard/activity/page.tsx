'use client';

import React, { useState } from 'react';
import { Activity, Cpu, Shield, ArrowUpRight, Filter } from 'lucide-react';

export default function ActivityDashboardPage() {
  const [filter, setFilter] = useState<'all' | 'chatgpt' | 'claude' | 'security'>('all');

  const activities = [
    {
      id: 'act_1',
      client: 'ChatGPT',
      type: 'mcp_query',
      title: 'ChatGPT queried native ARC balance',
      detail: 'Tool arc_get_balance returned 14.50 ARC',
      time: '18 mins ago',
      category: 'chatgpt',
    },
    {
      id: 'act_2',
      client: 'ChatGPT',
      type: 'approval_created',
      title: 'Created approval for 10 USDC → 245 XYZ swap',
      detail: 'Approval ID: appr_demo_swap_100 (Pending Review)',
      time: '25 mins ago',
      category: 'chatgpt',
    },
    {
      id: 'act_3',
      client: 'Claude',
      type: 'mcp_query',
      title: 'Claude viewed portfolio breakdown',
      detail: 'Tool arc_get_portfolio returned $260.53 total value',
      time: '3 hours ago',
      category: 'claude',
    },
    {
      id: 'act_4',
      client: 'System Security',
      type: 'security',
      title: 'Google OAuth Privy login authenticated',
      detail: 'Embedded wallet 0x71C7...976F attached to session',
      time: '1 day ago',
      category: 'security',
    },
  ];

  const filtered = activities.filter((a) => (filter === 'all' ? true : a.category === filter));

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight">Activity Audit Log</h1>
          <p className="text-xs text-white/60 mt-1">Complete, unalterable timeline of all AI queries, approval requests, and security events.</p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {(['all', 'chatgpt', 'claude', 'security'] as const).map((f) => (
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

      <div className="border border-white/30 p-6 bg-black space-y-4">
        <div className="space-y-3 text-xs">
          {filtered.map((act) => (
            <div key={act.id} className="p-4 border border-white/20 bg-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white uppercase">{act.title}</span>
                <span className="text-[10px] text-white/50">{act.time}</span>
              </div>
              <div className="text-white/70">{act.detail}</div>
              <div className="text-[10px] text-white/40 uppercase pt-1">Client: {act.client}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
