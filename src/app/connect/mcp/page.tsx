'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal, Server } from 'lucide-react';

export default function GenericMCPPage() {
  const mcpUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/mcp` : 'http://localhost:3000/api/mcp';

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-white/20 pb-6">
        <Link href="/dashboard/connections" className="flex items-center space-x-2 text-xs text-white/70 hover:text-white uppercase font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Connections</span>
        </Link>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border border-white flex items-center justify-center text-xs">👁</div>
          <span className="font-bold text-sm uppercase">ARCEYES MCP</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="inline-block border border-white bg-white text-black px-3 py-1 text-xs font-bold uppercase">
          MCP SPECIFICATION
        </div>
        <h1 className="text-4xl font-extrabold uppercase tracking-tight">Generic Remote MCP Integration</h1>
        <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
          ArcEyes provides a standard Remote Model Context Protocol (MCP) server over Streamable HTTP transport.
        </p>
      </div>

      <div className="border border-white/30 p-6 bg-black space-y-6">
        <h2 className="text-xl font-bold uppercase border-b border-white/20 pb-3">Server Endpoint Details</h2>

        <div className="space-y-4 text-xs">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/60">ENDPOINT URL</span>
            <span className="font-bold text-white font-mono">{mcpUrl}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/60">TRANSPORT</span>
            <span className="font-bold text-white">Streamable HTTP (JSON-RPC 2.0)</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/60">NETWORK</span>
            <span className="font-bold text-white">Arc Testnet (Chain ID 763373)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">AUTHENTICATION</span>
            <span className="font-bold text-white">OAuth / Session Authorization Scopes</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/20">
          <div className="font-bold text-sm uppercase mb-3">Available Tools</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2 border border-white/20 bg-white/5 font-mono">arc_get_wallet</div>
            <div className="p-2 border border-white/20 bg-white/5 font-mono">arc_get_balance</div>
            <div className="p-2 border border-white/20 bg-white/5 font-mono">arc_get_portfolio</div>
            <div className="p-2 border border-white/20 bg-white/5 font-mono">arc_get_swap_quote</div>
            <div className="p-2 border border-white/20 bg-white/5 font-mono">arc_prepare_swap</div>
            <div className="p-2 border border-white/20 bg-white/5 font-mono">arc_prepare_send</div>
            <div className="p-2 border border-white/20 bg-white/5 font-mono">arc_get_approval_status</div>
            <div className="p-2 border border-white/20 bg-white/5 font-mono">arc_get_nfts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
