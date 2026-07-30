'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ArrowLeft, ExternalLink, AlertTriangle, ShieldCheck, Terminal, Zap } from 'lucide-react';

export default function ChatGPTConnectPage() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedTunnel, setCopiedTunnel] = useState(false);

  const localMcpUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/mcp` : 'http://localhost:3000/api/mcp';
  const tunnelCommand = 'npx localtunnel --port 3000';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(localMcpUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyTunnel = () => {
    navigator.clipboard.writeText(tunnelCommand);
    setCopiedTunnel(true);
    setTimeout(() => setCopiedTunnel(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6 max-w-4xl mx-auto space-y-8 selection:bg-white selection:text-black">
      {/* Header */}
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
          CHATGPT CONNECTOR GUIDE
        </div>
        <h1 className="text-4xl font-extrabold uppercase tracking-tight">Connect ArcEyes to ChatGPT</h1>
        <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
          Connect ArcEyes as a custom Remote MCP Server in ChatGPT to manage your Arc wallet through simple conversation.
        </p>
      </div>

      {/* Fixing "Unsafe URL / Error fetching OAuth configuration" Banner */}
      <div className="border-2 border-white p-6 bg-white/5 space-y-4">
        <div className="flex items-center space-x-3 text-white font-bold text-base uppercase border-b border-white/20 pb-3">
          <AlertTriangle className="w-5 h-5 text-white shrink-0" />
          <span>Fixing &quot;Unsafe URL / Error fetching OAuth configuration&quot;</span>
        </div>

        <p className="text-xs text-white/80 leading-relaxed">
          Because ChatGPT Web runs on secure HTTPS (<code className="text-white bg-white/10 px-1 py-0.5">https://chatgpt.com</code>), browsers block raw <code className="text-white bg-white/10 px-1 py-0.5">http://localhost:3000</code> as an unencrypted unsafe origin. Follow either solution below to connect:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          {/* Solution A: HTTPS Tunnel */}
          <div className="border border-white p-4 bg-black space-y-3">
            <div className="font-extrabold uppercase text-white flex items-center justify-between">
              <span>METHOD A: HTTPS TUNNEL (RECOMMENDED)</span>
              <span className="bg-white text-black text-[10px] px-1.5 py-0.5">FASTEST</span>
            </div>
            <p className="text-[11px] text-white/70">
              Run this 1-line command in your terminal to generate an instant HTTPS URL for ChatGPT:
            </p>
            <div className="flex items-center space-x-2 bg-white/10 p-2.5 border border-white/30 font-mono text-xs">
              <span className="text-white font-bold flex-1">{tunnelCommand}</span>
              <button onClick={handleCopyTunnel} className="border border-white bg-white text-black px-2 py-0.5 text-[10px] font-bold uppercase">
                {copiedTunnel ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="text-[10px] text-white/60">
              Paste the resulting HTTPS URL (e.g. <code className="text-white">https://xxxx.loca.lt/api/mcp</code>) into ChatGPT Server URL!
            </div>
          </div>

          {/* Solution B: Authentication Selector */}
          <div className="border border-white p-4 bg-black space-y-3">
            <div className="font-extrabold uppercase text-white">METHOD B: CHATGPT AUTH SELECTOR</div>
            <p className="text-[11px] text-white/70">
              In ChatGPT&apos;s Connector Modal:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-white/80">
              <li>Set <strong>Authentication</strong> to <strong>None</strong> if testing without external OAuth provider.</li>
              <li>Or use discovered metadata endpoint <code className="text-white">/.well-known/oauth-authorization-server</code>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step-by-Step Connection Instructions */}
      <div className="border border-white/30 p-6 bg-black space-y-6 font-mono text-xs">
        <h2 className="text-xl font-bold uppercase border-b border-white/20 pb-3">Step-by-Step Connection Flow</h2>

        <ol className="space-y-6">
          <li className="space-y-2">
            <div className="font-bold text-white uppercase text-sm">Step 1: Open ChatGPT Connectors</div>
            <p className="text-white/70">
              In ChatGPT, click <strong>Plugins / Custom Actions</strong> &rarr; <strong>Connectors</strong> &rarr; <strong>Add Custom MCP Server</strong>.
            </p>
          </li>

          <li className="space-y-2">
            <div className="font-bold text-white uppercase text-sm">Step 2: Enter Server URL</div>
            <div className="flex items-center space-x-3 bg-white/5 p-3 border border-white/30 font-mono text-xs">
              <span className="text-white font-bold break-all flex-1">{localMcpUrl}</span>
              <button onClick={handleCopyUrl} className="border border-white bg-white text-black px-3 py-1 text-xs font-bold uppercase shrink-0">
                {copiedUrl ? 'Copied' : 'Copy Local URL'}
              </button>
            </div>
          </li>

          <li className="space-y-2">
            <div className="font-bold text-white uppercase text-sm">Step 3: Test Conversation</div>
            <div className="p-4 border border-white/30 bg-white/5 space-y-2 text-xs">
              <div className="text-white/60">EXAMPLE CHATGPT PROMPTS:</div>
              <div className="font-bold text-white">&quot;Use ArcEyes to check my Arc wallet balance.&quot;</div>
              <div className="font-bold text-white">&quot;Swap 10 USDC to XYZ on Arc.&quot;</div>
            </div>
          </li>
        </ol>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/dashboard" className="border border-white/40 px-6 py-3 text-xs uppercase font-bold hover:border-white">
          ← Return to Dashboard
        </Link>
        <Link href="/connect/oauth" className="border border-white bg-white text-black px-6 py-3 text-xs uppercase font-bold hover:bg-black hover:text-white transition-all">
          Preview OAuth Screen →
        </Link>
      </div>
    </div>
  );
}
