'use client';

import React, { useState } from 'react';
import { Key, Shield, AlertTriangle, Trash2, Save, Check, Zap, Cpu } from 'lucide-react';

export default function PermissionsPage() {
  const [autonomousEnabled, setAutonomousEnabled] = useState(false);
  const [maxAmountUsd, setMaxAmountUsd] = useState('50');

  const [scopes, setScopes] = useState({
    'wallet:read': true,
    'balance:read': true,
    'portfolio:read': true,
    'trade:quote': true,
    'trade:prepare': true,
    'transaction:prepare': true,
    'nft:read': true,
    'defi:read': true,
  });

  const [saved, setSaved] = useState(false);

  const toggleScope = (key: keyof typeof scopes) => {
    setScopes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-white/20 pb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight font-mono">Permissions &amp; Delegated Execution</h1>
        <p className="text-xs text-white/60 mt-1">
          Configure permission scopes and enable/disable Autonomous AI Delegated Execution for connected AI assistants.
        </p>
      </div>

      {/* Autonomous AI Delegated Execution Banner Card */}
      <div className={`border-2 p-6 transition-all ${autonomousEnabled ? 'border-white bg-white text-black' : 'border-white/30 bg-black text-white'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-current pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <Zap className={`w-6 h-6 shrink-0 ${autonomousEnabled ? 'text-black' : 'text-white'}`} />
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider">DELEGATED AUTONOMOUS EXECUTION</div>
              <div className="text-base font-extrabold uppercase">Pre-Approved AI Execution (No-Approval Mode)</div>
            </div>
          </div>

          <button
            onClick={() => setAutonomousEnabled(!autonomousEnabled)}
            className={`px-6 py-2.5 text-xs font-extrabold uppercase border transition-all ${
              autonomousEnabled
                ? 'bg-black text-white border-black hover:bg-white hover:text-black'
                : 'bg-white text-black border-white hover:bg-black hover:text-white'
            }`}
          >
            {autonomousEnabled ? 'ACTIVE: AUTONOMOUS' : 'OFF: MANUAL APPROVAL REQUIRED'}
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="leading-relaxed font-mono">
            {autonomousEnabled
              ? '⚡ Autonomous execution is ON. When ChatGPT or Claude executes a swap, transfer, or bridge within your configured max limit, ArcEyes will auto-approve & broadcast immediately without waiting for manual confirmation in the Paybox UI.'
              : '🔒 Manual Approval mode is ACTIVE. Every transaction prepared by ChatGPT or Claude creates a Pending Approval request and requires your explicit authorization in the ArcEyes Paybox window.'}
          </p>

          {autonomousEnabled && (
            <div className="p-4 border border-black/30 bg-black/5 space-y-2">
              <label className="block text-xs font-bold uppercase text-black">
                Max Auto-Execution Limit Per Transaction (USD Value)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={maxAmountUsd}
                  onChange={(e) => setMaxAmountUsd(e.target.value)}
                  className="bg-white text-black font-mono text-sm border-2 border-black p-2 w-36 font-bold"
                  placeholder="50"
                />
                <span className="text-xs font-bold text-black uppercase">$ {maxAmountUsd}.00 Max USD / Transaction</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scopes Section */}
      <div className="border-2 border-white p-6 bg-black space-y-6">
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div>
            <h2 className="text-xl font-bold uppercase">ChatGPT &amp; Claude Scope Permissions</h2>
            <p className="text-xs text-white/60">Connected Client IDs: conn_chatgpt_1, conn_claude_1</p>
          </div>
          <button
            onClick={() => alert('Connection Revoked')}
            className="border border-white/40 text-white hover:bg-white hover:text-black text-xs font-bold uppercase px-4 py-2 transition-all flex items-center space-x-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Revoke Access</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {Object.entries(scopes).map(([key, enabled]) => (
            <div
              key={key}
              onClick={() => toggleScope(key as any)}
              className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${
                enabled ? 'border-white bg-white/10 text-white' : 'border-white/20 bg-black text-white/40'
              }`}
            >
              <div>
                <div className="font-bold uppercase">{key}</div>
                <div className="text-[10px] text-white/60">
                  {key.startsWith('wallet') && 'Allows viewing wallet address'}
                  {key.startsWith('balance') && 'Allows viewing ARC and token balances'}
                  {key.startsWith('portfolio') && 'Allows fetching portfolio USD value'}
                  {key.startsWith('trade:quote') && 'Allows requesting DEX swap quotes'}
                  {key.startsWith('trade:prepare') && 'Allows preparing swap approval requests'}
                  {key.startsWith('transaction:prepare') && 'Allows preparing transfer & bridge requests'}
                  {key.startsWith('nft') && 'Allows fetching NFT holdings'}
                  {key.startsWith('defi') && 'Allows viewing liquidity & lending positions'}
                </div>
              </div>

              <div
                className={`w-6 h-6 border flex items-center justify-center font-bold text-xs ${
                  enabled ? 'border-white bg-white text-black' : 'border-white/30 text-transparent'
                }`}
              >
                ✓
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            onClick={handleSave}
            className="border border-white bg-white text-black text-xs font-extrabold uppercase px-8 py-3 hover:bg-black hover:text-white transition-all flex items-center space-x-2"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Permissions Saved' : 'Save Scopes & Delegated Settings'}</span>
          </button>
        </div>
      </div>

      <div className="border border-white/20 p-4 bg-white/5 text-xs space-y-2">
        <div className="font-bold uppercase text-white flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>STRICT PRIVACY BOUNDARY</span>
        </div>
        <p className="text-white/70">
          Private keys, seed phrases, and Privy signing credentials can NEVER be granted or accessed by AI clients.
        </p>
      </div>
    </div>
  );
}
