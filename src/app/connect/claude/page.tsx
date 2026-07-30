'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ArrowLeft, Terminal } from 'lucide-react';

export default function ClaudeConnectPage() {
  const [copied, setCopied] = useState(false);
  const mcpUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/mcp` : 'http://localhost:3000/api/mcp';

  const claudeConfigJson = JSON.stringify(
    {
      mcpServers: {
        arceyes: {
          url: mcpUrl,
          transport: 'http',
        },
      },
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(claudeConfigJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          CLAUDE INTEGRATION
        </div>
        <h1 className="text-4xl font-extrabold uppercase tracking-tight">Connect ArcEyes to Claude</h1>
        <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
          Integrate ArcEyes Remote MCP server into Anthropic Claude Desktop or remote Claude agent environments.
        </p>
      </div>

      <div className="border border-white/30 p-6 bg-black space-y-6">
        <h2 className="text-xl font-bold uppercase border-b border-white/20 pb-3">Claude Desktop Configuration</h2>

        <p className="text-xs text-white/70">
          Add the following block to your <code className="bg-white/10 px-1 py-0.5 text-white font-bold">claude_desktop_config.json</code> file:
        </p>

        <div className="relative bg-white/5 border border-white/30 p-4">
          <pre className="text-xs text-white font-mono overflow-x-auto">{claudeConfigJson}</pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 border border-white bg-white text-black px-3 py-1 text-xs font-bold uppercase"
          >
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/dashboard" className="border border-white/40 px-6 py-3 text-xs uppercase font-bold hover:border-white">
          ← Return to Dashboard
        </Link>
        <Link href="/dashboard/permissions" className="border border-white bg-white text-black px-6 py-3 text-xs uppercase font-bold hover:bg-black hover:text-white transition-all">
          Manage Claude Scopes →
        </Link>
      </div>
    </div>
  );
}
