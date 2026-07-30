'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, ShieldCheck, Plus, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { AIConnection } from '@/lib/supabase/types';

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<AIConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      const res = await fetch(`/api/connections/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConnections((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-mono text-white">
      {/* Page Title (PayBox Style) */}
      <div className="border-b border-white/20 pb-6 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Agents.</h1>
        <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
          Each agent integration — Claude Code, an OpenAI agent, your own MCP server — runs under its own key. Pick which credentials it can use and how each one is approved.
        </p>
      </div>

      {/* CONNECT AN AGENT Card (PayBox Style) */}
      <div className="border border-white/30 p-6 bg-white/5 space-y-4">
        <div className="text-xs font-bold uppercase text-white/60 tracking-wider">CONNECT AN AGENT</div>

        <div className="space-y-3">
          <Link
            href="/connect/claude"
            className="block border-2 border-white bg-black p-4 text-center font-bold text-sm uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center space-x-3"
          >
            <span>Connect with Claude</span>
          </Link>

          <Link
            href="/connect/chatgpt"
            className="block border-2 border-white bg-black p-4 text-center font-bold text-sm uppercase hover:bg-black hover:border-emerald-400 text-white transition-all flex items-center justify-center space-x-3"
          >
            <span>Connect with ChatGPT</span>
          </Link>
        </div>
      </div>

      {/* Active Agents Section (PayBox Style) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm uppercase">Agents</span>
            <span className="text-xs bg-white/10 px-2 py-0.5 text-white/70 font-mono font-bold">
              {connections.length} active
            </span>
          </div>

          <Link
            href="/connect/mcp"
            className="border border-white bg-white text-black px-4 py-1.5 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create client</span>
          </Link>
        </div>

        {/* Agent Cards Grid */}
        {loading ? (
          <div className="p-8 text-center space-y-3 border border-white/20 bg-black">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-white" />
            <div className="text-xs uppercase font-bold text-white/60">Fetching Active Agents...</div>
          </div>
        ) : connections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((conn) => (
              <div key={conn.id} className="border border-white/30 p-5 bg-black space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 font-bold uppercase">
                      {conn.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-white/50">{new Date(conn.last_used_at).toLocaleTimeString()}</span>
                  </div>

                  <div className="font-extrabold text-base uppercase text-white">{conn.provider} Agent</div>
                  <div className="text-xs text-white/50 font-mono break-all">
                    Client ID: {conn.client_id} &bull; {conn.scopes.length} grants
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-3 border-t border-white/10 text-xs">
                  <Link href="/dashboard/permissions" className="font-bold underline text-white hover:text-white/70">
                    Details →
                  </Link>
                  <button
                    onClick={() => handleRevoke(conn.id)}
                    className="font-bold text-rose-400 hover:text-rose-300 border border-rose-500/30 px-2 py-0.5"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-white/30 bg-black text-center space-y-3">
            <Cpu className="w-10 h-10 text-white/30 mx-auto" />
            <div className="text-sm font-bold uppercase">No Agents Connected</div>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              Select Claude or ChatGPT above to configure Remote MCP credentials and grant agentic execution permissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
