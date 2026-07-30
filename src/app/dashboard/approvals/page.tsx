'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckSquare, ShieldCheck, Loader2 } from 'lucide-react';
import { ApprovalRequest } from '@/lib/supabase/types';

export default function ApprovalsDashboardPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/approvals');
      if (res.ok) {
        const data = await res.json();
        setApprovals(data);
      } else {
        setApprovals([]);
      }
    } catch (e) {
      console.error(e);
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = approvals.filter((a) => (filter === 'all' ? true : a.status === filter));

  return (
    <div className="space-y-8 font-mono text-white">
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

      {/* Approvals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center space-y-3 border border-white/30 bg-black">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-white" />
            <div className="text-xs uppercase font-bold text-white/60">Fetching Approval Requests...</div>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((appr) => (
            <div
              key={appr.id}
              className={`border-2 p-5 bg-black flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                appr.status === 'pending' ? 'border-white' : 'border-white/20'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-extrabold text-base uppercase text-white">
                    {appr.action.toUpperCase()}
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
                  <span>Requested: <strong className="text-white">{new Date(appr.created_at).toLocaleString()}</strong></span>
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
                ) : appr.transaction_hash ? (
                  <a
                    href={`https://explorer.testnet.arc.network/tx/${appr.transaction_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block border border-white/40 px-4 py-2 text-xs uppercase font-bold hover:border-white"
                  >
                    View Tx ↗
                  </a>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 border border-white/30 bg-black text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-white/40 mx-auto" />
            <div className="text-sm font-bold uppercase">No Approval Requests</div>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              All agentic transaction requests have been evaluated. When an AI agent submits a transaction requiring approval, it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
