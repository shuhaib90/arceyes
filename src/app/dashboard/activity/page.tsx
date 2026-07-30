'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Shield, ShieldCheck, Loader2 } from 'lucide-react';
import { ActivityLog } from '@/lib/supabase/types';

export default function ActivityDashboardPage() {
  const [filter, setFilter] = useState<'all' | 'chatgpt' | 'claude' | 'security'>('all');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/activity');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (e) {
      console.error(e);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    if (filter === 'chatgpt') return log.connection_id?.includes('chatgpt') || log.type.includes('chatgpt');
    if (filter === 'claude') return log.connection_id?.includes('claude') || log.type.includes('claude');
    if (filter === 'security') return log.type.includes('security') || log.type.includes('auth');
    return true;
  });

  return (
    <div className="space-y-8 font-mono text-white">
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
        {loading ? (
          <div className="p-8 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-white" />
            <div className="text-xs uppercase font-bold text-white/60">Fetching Activity Audit Logs...</div>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="space-y-3 text-xs">
            {filteredLogs.map((act) => (
              <div key={act.id} className="p-4 border border-white/20 bg-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white uppercase">{act.type}</span>
                  <span className="text-[10px] text-white/50">{new Date(act.created_at).toLocaleString()}</span>
                </div>
                <div className="text-white/70">{JSON.stringify(act.metadata)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-white/30 mx-auto" />
            <div className="text-sm font-bold uppercase">No Activity Logs Found</div>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              Real-time MCP queries and tool executions by connected AI agents will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
