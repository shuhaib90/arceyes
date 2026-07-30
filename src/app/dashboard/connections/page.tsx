'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, ArrowRight, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';

export default function ConnectionsPage() {
  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-white/20 pb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">Connect Your AI</h1>
        <p className="text-xs text-white/60 mt-1">
          Use your ArcEyes wallet directly from the AI assistant you already use via Remote MCP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ChatGPT Card */}
        <div className="border-2 border-white p-6 bg-black space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <span className="font-bold text-lg uppercase">ChatGPT</span>
              <span className="text-xs bg-white text-black px-2 py-0.5 font-bold uppercase">CONNECTED</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Connect ArcEyes as a custom Remote MCP Server in ChatGPT. Execute swaps, transfers, and portfolio queries directly in chat.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <Link
              href="/connect/chatgpt"
              className="block w-full text-center border border-white bg-white text-black py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-all"
            >
              ChatGPT Setup Guide →
            </Link>
          </div>
        </div>

        {/* Claude Card */}
        <div className="border-2 border-white p-6 bg-black space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <span className="font-bold text-lg uppercase">Claude</span>
              <span className="text-xs bg-white text-black px-2 py-0.5 font-bold uppercase">CONNECTED</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Plug ArcEyes MCP endpoint into Anthropic Claude Desktop or remote Claude agent workflows.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <Link
              href="/connect/claude"
              className="block w-full text-center border border-white bg-white text-black py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-all"
            >
              Claude Setup Guide →
            </Link>
          </div>
        </div>

        {/* Generic MCP Client Card */}
        <div className="border border-white/30 p-6 bg-black space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <span className="font-bold text-lg uppercase">Other MCP Client</span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 font-bold uppercase">GENERIC HTTP</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Integrate with any custom MCP-compatible AI agent using Streamable HTTP Remote MCP transport.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <Link
              href="/connect/mcp"
              className="block w-full text-center border border-white/40 text-white py-3 text-xs font-bold uppercase hover:border-white transition-all"
            >
              View MCP Specs →
            </Link>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="border border-white/30 p-6 bg-white/5 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-sm uppercase">
          <ShieldCheck className="w-5 h-5 text-white" />
          <span>Security Guarantee</span>
        </div>
        <p className="text-xs text-white/70 leading-relaxed">
          AI assistants receive permission only to query data and prepare pending transactions. Private keys and seed phrases are generated and kept exclusively inside your Privy embedded wallet and are never sent to AI providers or ArcEyes servers.
        </p>
      </div>
    </div>
  );
}
