'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Eye, ArrowRight, ShieldCheck, Cpu, Zap, CheckCircle2, Copy, ExternalLink, Terminal, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { login, authenticated, user } = usePrivy();
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const steps = [
    { title: 'ASK', desc: 'User speaks to ChatGPT: "Swap 10 USDC to XYZ on Arc."' },
    { title: 'PREVIEW', desc: 'ArcEyes MCP calculates route & prepares pending approval.' },
    { title: 'APPROVE', desc: 'User opens ArcEyes Paybox window & reviews transaction.' },
    { title: 'EXECUTE', desc: 'Privy embedded wallet signs; transaction broadcasts on Arc.' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Top Banner - Arc Testnet */}
      <div className="bg-white text-black text-xs font-mono py-1.5 px-4 text-center border-b border-white font-bold tracking-wider uppercase">
        ⚡ ARC TESTNET ACTIVE &bull; CHAIN ID 763373 &bull; AGENTIC WALLET LAYER
      </div>

      {/* Navigation Header */}
      <header className="border-b border-white/20 px-6 py-4 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 border border-white flex items-center justify-center bg-black font-mono text-xl">
            👁
          </div>
          <span className="font-mono text-xl tracking-tighter uppercase font-extrabold text-white">
            ARCEYES
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-mono uppercase tracking-wider text-white/70">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#supported-ai" className="hover:text-white transition-colors">Supported AI</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {authenticated ? (
            <Link
              href="/dashboard"
              className="border border-white bg-white text-black font-mono text-sm uppercase px-5 py-2 hover:bg-black hover:text-white transition-all font-bold"
            >
              Enter Dashboard →
            </Link>
          ) : (
            <button
              onClick={login}
              className="border border-white bg-white text-black font-mono text-sm uppercase px-5 py-2 hover:bg-black hover:text-white transition-all font-bold"
            >
              Get Started
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-16 max-w-6xl mx-auto border-b border-white/20">
        <div className="inline-flex items-center space-x-2 border border-white/30 bg-black px-3 py-1 text-xs font-mono text-white/80 uppercase mb-8">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>Agentic MCP Action Layer for Arc EVM</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase tracking-tight leading-none mb-8">
          Your AI.<br />
          Your Wallet.<br />
          <span className="text-white underline decoration-2 underline-offset-8">Your Arc.</span>
        </h1>

        <p className="text-lg sm:text-2xl text-white/80 max-w-2xl font-light mb-10 leading-relaxed">
          Connect ArcEyes to your favorite AI assistant and execute onchain actions on Arc EVM through simple natural language conversation.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={login}
            className="border-2 border-white bg-white text-black font-mono text-base font-bold uppercase px-8 py-4 hover:bg-black hover:text-white transition-all text-center flex items-center justify-center space-x-3"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#how-it-works"
            className="border-2 border-white/40 bg-black text-white font-mono text-base font-bold uppercase px-8 py-4 hover:border-white transition-all text-center"
          >
            How It Works
          </a>
        </div>

        <div className="mt-16 p-4 border border-white/20 bg-black/60 font-mono text-xs text-white/60 flex flex-wrap items-center justify-between gap-4">
          <div><span className="text-white font-bold">CORE PRINCIPLE:</span> AI requests &bull; ArcEyes verifies &bull; User approves &bull; Privy signs &bull; Arc executes</div>
          <div className="text-white font-bold uppercase">No Private Keys Shared With AI</div>
        </div>
      </section>

      {/* Visual Execution Flow Section */}
      <section id="how-it-works" className="px-6 py-20 max-w-6xl mx-auto border-b border-white/20">
        <div className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2">01 / ARCHITECTURE</div>
        <h2 className="text-3xl sm:text-5xl font-bold uppercase mb-12">The ArcEyes Protocol Flow</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              onClick={() => setActiveStep(idx)}
              className={`border p-6 cursor-pointer transition-all ${
                activeStep === idx
                  ? 'border-white bg-white text-black'
                  : 'border-white/20 bg-black text-white hover:border-white/60'
              }`}
            >
              <div className="font-mono text-xs uppercase mb-4 opacity-70">STEP 0{idx + 1}</div>
              <h3 className="font-mono text-2xl font-bold uppercase mb-2">{step.title}</h3>
              <p className="text-xs font-mono leading-relaxed opacity-90">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Diagram Display */}
        <div className="border border-white p-8 bg-black">
          <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-6 font-mono text-xs text-white/60">
            <span>VISUAL EXECUTION PIPELINE</span>
            <span className="text-white font-bold">STATUS: READY FOR APPROVAL</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-sm">
            {/* Step 1: ChatGPT */}
            <div className="border border-white/30 p-5 bg-black">
              <div className="text-xs text-white/60 mb-2">INPUT CLIENT</div>
              <div className="font-bold text-lg mb-2">ChatGPT / Claude</div>
              <p className="text-xs text-white/70 mb-4">&quot;Swap 10 USDC to XYZ on Arc.&quot;</p>
              <div className="text-xs bg-white/10 p-2 border border-white/20 text-white/80">
                Calls Remote MCP &rarr; <span className="text-white font-bold">arc_prepare_swap</span>
              </div>
            </div>

            {/* Step 2: ArcEyes Approval */}
            <div className="border-2 border-white p-5 bg-white text-black">
              <div className="text-xs font-bold mb-2">ARCEYES PAYBOX</div>
              <div className="font-bold text-lg mb-2">Approval Window</div>
              <div className="text-xs space-y-1 mb-4 font-bold">
                <div>PAY: 10.00 USDC</div>
                <div>RECEIVE: 245.00 XYZ</div>
                <div>NETWORK: Arc Testnet</div>
              </div>
              <div className="bg-black text-white text-center py-2 text-xs font-bold uppercase">
                User Reviews &amp; Clicks Approve
              </div>
            </div>

            {/* Step 3: Broadcast */}
            <div className="border border-white/30 p-5 bg-black">
              <div className="text-xs text-white/60 mb-2">SIGNING &amp; EXECUTION</div>
              <div className="font-bold text-lg mb-2">Privy Embedded Wallet</div>
              <p className="text-xs text-white/70 mb-4">Privy signs locally &bull; Arc Eyes broadcasts to Arc RPC.</p>
              <div className="text-xs bg-white/10 p-2 border border-white/20 text-white/80">
                Result &rarr; <span className="text-white font-bold">Confirmed on Arc EVM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* One Wallet. Any AI. Section */}
      <section id="supported-ai" className="px-6 py-20 max-w-6xl mx-auto border-b border-white/20">
        <div className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2">02 / INTEGRATIONS</div>
        <h2 className="text-3xl sm:text-5xl font-bold uppercase mb-12">One Wallet. Any AI.</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-white/20 p-8 hover:border-white transition-all bg-black group">
            <div className="font-mono text-xs text-white/60 mb-4">PRIMARY INTEGRATION</div>
            <h3 className="text-2xl font-bold uppercase mb-4 group-hover:text-white">ChatGPT</h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Connect ArcEyes directly as a custom MCP tool server inside OpenAI ChatGPT desktop or web app.
            </p>
            <Link
              href="/connect/chatgpt"
              className="inline-flex items-center text-xs font-mono uppercase font-bold text-white underline underline-offset-4"
            >
              Setup Guide →
            </Link>
          </div>

          <div className="border border-white/20 p-8 hover:border-white transition-all bg-black group">
            <div className="font-mono text-xs text-white/60 mb-4">PRIMARY INTEGRATION</div>
            <h3 className="text-2xl font-bold uppercase mb-4 group-hover:text-white">Claude</h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Plug ArcEyes MCP server into Anthropic Claude Desktop or remote agent workflows seamlessly.
            </p>
            <Link
              href="/connect/claude"
              className="inline-flex items-center text-xs font-mono uppercase font-bold text-white underline underline-offset-4"
            >
              Setup Guide →
            </Link>
          </div>

          <div className="border border-white/20 p-8 hover:border-white transition-all bg-black group">
            <div className="font-mono text-xs text-white/60 mb-4">STANDARD MCP TRANSPORT</div>
            <h3 className="text-2xl font-bold uppercase mb-4 group-hover:text-white">Other MCP Clients</h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Use standard Remote Streamable HTTP MCP transport URL <code className="bg-white/10 px-1 py-0.5 text-xs font-mono">/api/mcp</code> for any AI agent framework.
            </p>
            <Link
              href="/connect/mcp"
              className="inline-flex items-center text-xs font-mono uppercase font-bold text-white underline underline-offset-4"
            >
              Endpoint Specs →
            </Link>
          </div>
        </div>
      </section>

      {/* Just Ask Conversation Mockup */}
      <section className="px-6 py-20 max-w-6xl mx-auto border-b border-white/20">
        <div className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2">03 / EXPERIENCE</div>
        <h2 className="text-3xl sm:text-5xl font-bold uppercase mb-12">Just Ask</h2>

        <div className="border-2 border-white p-6 sm:p-10 bg-black font-mono">
          {/* User Message */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-8 h-8 border border-white flex items-center justify-center text-xs font-bold bg-white text-black shrink-0">
              YOU
            </div>
            <div className="border border-white/30 p-4 bg-white/5 text-sm sm:text-base max-w-lg">
              Swap 10 USDC to XYZ on Arc.
            </div>
          </div>

          {/* AI Message */}
          <div className="flex items-start space-x-4 mb-8">
            <div className="w-8 h-8 border border-white flex items-center justify-center text-xs font-bold bg-black text-white shrink-0">
              AI
            </div>
            <div className="space-y-4 max-w-lg">
              <div className="border border-white/30 p-4 bg-white/5 text-sm leading-relaxed">
                I found the best route on ArcDEX Aggregator. 10 USDC will return approximately <span className="text-white font-bold">245 XYZ</span>.
              </div>

              {/* ArcEyes Pending Approval Card inside AI response */}
              <div className="border-2 border-white p-5 bg-white text-black space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase border-b border-black/20 pb-2">
                  <span>👁 ARCEYES APPROVAL REQUESTED</span>
                  <span>PENDING</span>
                </div>
                <div className="text-sm font-extrabold">SWAP 10 USDC &rarr; 245 XYZ</div>
                <div className="text-xs space-y-1 text-black/80 font-mono">
                  <div>Network: Arc Testnet</div>
                  <div>Slippage: 0.5%</div>
                </div>
                <Link
                  href="/approve/appr_demo_swap_100"
                  className="block w-full text-center bg-black text-white py-3 text-xs uppercase font-bold border border-black hover:bg-white hover:text-black transition-all"
                >
                  Review &amp; Approve in ArcEyes →
                </Link>
              </div>
            </div>
          </div>

          {/* Confirmed Result Message */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 border border-white flex items-center justify-center text-xs font-bold bg-black text-white shrink-0">
              AI
            </div>
            <div className="border border-white/30 p-4 bg-white/5 text-sm text-white/90">
              ✓ Swap completed successfully on Arc EVM. 10 USDC &rarr; 245 XYZ confirmed.
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="px-6 py-20 max-w-6xl mx-auto border-b border-white/20">
        <div className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2">04 / TRUST ARCHITECTURE</div>
        <h2 className="text-3xl sm:text-5xl font-bold uppercase mb-12">Built For Security</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
          <div className="border border-white/30 p-8 bg-black space-y-4">
            <div className="text-xl font-bold text-white uppercase">01. ZERO KEY EXPOSURE</div>
            <p className="text-xs text-white/70 leading-relaxed">
              Neither ChatGPT, Claude, nor ArcEyes backend servers ever touch your private keys. Embedded EVM wallets are managed by Privy.
            </p>
          </div>

          <div className="border border-white/30 p-8 bg-black space-y-4">
            <div className="text-xl font-bold text-white uppercase">02. HUMAN-IN-THE-LOOP</div>
            <p className="text-xs text-white/70 leading-relaxed">
              No financial transaction can execute autonomously without your explicit authorization in the ArcEyes approval window.
            </p>
          </div>

          <div className="border border-white/30 p-8 bg-black space-y-4">
            <div className="text-xl font-bold text-white uppercase">03. GRANULAR SCOPES</div>
            <p className="text-xs text-white/70 leading-relaxed">
              Manage permission scopes per AI client (<code className="text-white">wallet:read</code>, <code className="text-white">trade:quote</code>, <code className="text-white">trade:prepare</code>) and revoke access at any time.
            </p>
          </div>

          <div className="border border-white/30 p-8 bg-black space-y-4">
            <div className="text-xl font-bold text-white uppercase">04. TRANSACTION SIMULATION</div>
            <p className="text-xs text-white/70 leading-relaxed">
              Every prepared transaction is validated, simulated, and audited against contract allowlists before presenting the confirmation screen.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="px-6 py-20 max-w-6xl mx-auto text-center font-mono">
        <div className="w-12 h-12 border border-white flex items-center justify-center mx-auto text-2xl mb-6">
          👁
        </div>
        <h2 className="text-4xl sm:text-6xl font-extrabold uppercase mb-6">Ask your AI.<br />Approve with ArcEyes.<br />Execute on Arc.</h2>
        <p className="text-sm text-white/70 max-w-md mx-auto mb-8">
          The secure action layer between AI assistants and Arc EVM.
        </p>

        <div className="mb-12">
          {authenticated ? (
            <Link
              href="/dashboard"
              className="inline-block border-2 border-white bg-white text-black text-sm uppercase font-bold px-10 py-4 hover:bg-black hover:text-white transition-all"
            >
              Open ArcEyes Dashboard →
            </Link>
          ) : (
            <button
              onClick={login}
              className="inline-block border-2 border-white bg-white text-black text-sm uppercase font-bold px-10 py-4 hover:bg-black hover:text-white transition-all"
            >
              Continue with Google &amp; Get Started
            </button>
          )}
        </div>

        <div className="border-t border-white/20 pt-8 text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>&copy; {new Date().getFullYear()} ArcEyes &bull; Agentic Wallet Infrastructure</div>
          <div className="flex space-x-6">
            <Link href="/docs/architecture" className="hover:text-white">Architecture</Link>
            <Link href="/docs/mcp" className="hover:text-white">MCP Specs</Link>
            <Link href="/docs/security" className="hover:text-white">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
