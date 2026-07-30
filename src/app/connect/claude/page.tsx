'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Copy, Check, ArrowLeft, Terminal, Cpu, Loader2 } from 'lucide-react';

export default function ClaudeConnectPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [registering, setRegistering] = useState(false);
  const mcpUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/mcp` : 'https://arceyes-agent.vercel.app/api/mcp';

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

  const handleConfirmClaudeConnection = async () => {
    try {
      setRegistering(true);
      await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'claude',
          client_id: 'claude_desktop_mcp',
          scopes: ['wallet:read', 'balance:read', 'portfolio:read', 'trade:quote', 'trade:prepare'],
        }),
      });
      router.push('/dashboard/connections');
    } catch (e) {
      console.error(e);
      router.push('/dashboard/connections');
    } finally {
      setRegistering(false);
    }
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

      {/* Claude Desktop Config */}
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

      {/* Action Card to Activate Claude Connection */}
      <div className="border-2 border-white p-6 bg-white/5 space-y-4 text-center">
        <Cpu className="w-8 h-8 mx-auto text-emerald-400" />
        <div className="font-extrabold text-lg uppercase">Register Claude Agent Connection</div>
        <p className="text-xs text-white/70 max-w-md mx-auto">
          Click below to confirm adding Claude Agent to your active dashboard connections.
        </p>
        <button
          onClick={handleConfirmClaudeConnection}
          disabled={registering}
          className="border-2 border-white bg-white text-black px-8 py-3.5 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
        >
          {registering ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Claude Connection →</span>}
        </button>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/dashboard" className="border border-white/40 px-6 py-3 text-xs uppercase font-bold hover:border-white">
          ← Return to Dashboard
        </Link>
        <Link href="/dashboard/permissions" className="border border-white bg-white text-black px-6 py-3 text-xs uppercase font-bold hover:bg-black hover:text-white transition-all">
          Manage Scopes →
        </Link>
      </div>
    </div>
  );
}
