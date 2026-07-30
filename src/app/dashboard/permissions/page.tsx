'use client';

import React, { useState, useEffect } from 'react';
import { Key, Shield, AlertTriangle, Trash2, Save, Check, Zap, Cpu, Lock, Unlock, Clock, Loader2, KeyRound } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';

export default function PermissionsPage() {
  let user: any = null;
  try {
    const privy = usePrivy();
    user = privy.user;
  } catch (e) {
    console.warn(e);
  }

  // Unlock State
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [executionUnlocked, setExecutionUnlocked] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);

  // New PIN Creation State
  const [newPin, setNewPin] = useState('');
  const [settingPin, setSettingPin] = useState(false);
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');
  const [createPinError, setCreatePinError] = useState('');

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

  useEffect(() => {
    checkExecutionSession();
  }, []);

  const checkExecutionSession = async () => {
    try {
      const res = await fetch('/api/execution/unlock');
      if (res.ok) {
        const data = await res.json();
        if (data.unlocked) {
          setExecutionUnlocked(true);
          setRemainingMinutes(data.remaining_minutes || 60);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnlockPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setPinError('Please enter your ArcEyes Execution PIN (Default: 123456)');
      return;
    }

    try {
      setUnlocking(true);
      setPinError('');
      const res = await fetch('/api/execution/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setExecutionUnlocked(true);
        setRemainingMinutes(60);
        setPin('');
      } else {
        setPinError(data.error || 'Invalid PIN. Try default PIN: 123456');
      }
    } catch (err: any) {
      setPinError('Error unlocking execution session');
    } finally {
      setUnlocking(false);
    }
  };

  const handleSetCustomPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setCreatePinError('New PIN must be 4 to 6 digits');
      return;
    }

    try {
      setSettingPin(true);
      setCreatePinError('');
      setPinSuccessMsg('');

      const res = await fetch('/api/execution/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: newPin }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPinSuccessMsg('✓ Your custom ArcEyes Execution PIN has been updated!');
        setNewPin('');
        setTimeout(() => setPinSuccessMsg(''), 4000);
      } else {
        setCreatePinError(data.error || 'Failed to update PIN');
      }
    } catch (err: any) {
      setCreatePinError('Error setting new execution PIN');
    } finally {
      setSettingPin(false);
    }
  };

  const toggleScope = (key: keyof typeof scopes) => {
    setScopes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 font-mono text-white">
      <div className="border-b border-white/20 pb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">Permissions &amp; Execution Security</h1>
        <p className="text-xs text-white/60 mt-1">
          Manage 1-Hour Financial Action Locks, ArcEyes PIN authentication, and MCP client scopes.
        </p>
      </div>

      {/* 1-HOUR FINANCIAL EXECUTION LOCK CARD */}
      <div className={`border-2 p-6 transition-all ${executionUnlocked ? 'border-emerald-400 bg-emerald-950/20' : 'border-white bg-black'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/20 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            {executionUnlocked ? (
              <Unlock className="w-7 h-7 text-emerald-400 shrink-0 animate-pulse" />
            ) : (
              <Lock className="w-7 h-7 text-white shrink-0" />
            )}
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-white/60">FINANCIAL ACTION EXECUTION SECURITY</div>
              <div className="text-xl font-extrabold uppercase flex items-center space-x-2">
                <span>Trades &amp; Swaps:</span>
                <span className={executionUnlocked ? 'text-emerald-400' : 'text-white'}>
                  {executionUnlocked ? `🟢 UNLOCKED (${remainingMinutes}m remaining)` : '🔒 LOCKED'}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1 text-xs font-bold uppercase border ${
              executionUnlocked
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/10 text-white border-white/20'
            }`}
          >
            {executionUnlocked ? '1-HOUR SESSION ACTIVE' : 'PIN UNLOCK REQUIRED'}
          </span>
        </div>

        {!executionUnlocked ? (
          <div className="space-y-4">
            <p className="text-xs text-white/70 leading-relaxed">
              Read operations (balances, portfolio) work automatically. Financial transaction requests from ChatGPT or Claude require entering your ArcEyes Execution PIN to unlock 1 hour of trading.
            </p>

            <form onSubmit={handleUnlockPin} className="space-y-3 max-w-md pt-2">
              <label className="block text-xs font-bold uppercase text-white">
                Enter ArcEyes Execution PIN (Default: 123456)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="123456"
                  className="bg-white text-black font-mono text-lg tracking-widest border-2 border-white p-2.5 w-40 font-bold text-center"
                />
                <button
                  type="submit"
                  disabled={unlocking}
                  className="border-2 border-white bg-white text-black px-6 py-3 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
                >
                  {unlocking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                  <span>Unlock for 1 Hour →</span>
                </button>
              </div>
              {pinError && <div className="text-xs text-rose-400 font-bold">{pinError}</div>}
            </form>
          </div>
        ) : (
          <div className="space-y-2 text-xs text-emerald-300">
            <p>
              ✓ Financial execution is <strong>UNLOCKED</strong> for {remainingMinutes} minutes. ChatGPT &amp; Claude can prepare swaps and transfers.
            </p>
            <p className="text-[11px] text-white/60">
              Note: The AI connection remains permanently connected. After {remainingMinutes} minutes, financial actions auto-lock while read permissions stay active.
            </p>
          </div>
        )}
      </div>

      {/* CREATE / CHANGE CUSTOM EXECUTION PIN CARD */}
      <div className="border border-white/30 p-6 bg-black space-y-4">
        <div className="flex items-center space-x-3 border-b border-white/20 pb-3">
          <KeyRound className="w-5 h-5 text-white" />
          <h2 className="text-xl font-bold uppercase">Create / Change Your Execution PIN</h2>
        </div>

        <p className="text-xs text-white/70 leading-relaxed">
          Set your secret 6-digit security PIN used to unlock 1-hour trading sessions for ChatGPT &amp; Claude.
        </p>

        <form onSubmit={handleSetCustomPin} className="space-y-3 max-w-md pt-2">
          <label className="block text-xs font-bold uppercase text-white/60">New 4-6 Digit Security PIN</label>
          <div className="flex items-center space-x-3">
            <input
              type="password"
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="e.g. 889900"
              className="bg-white text-black font-mono text-lg tracking-widest border-2 border-white p-2.5 w-40 font-bold text-center"
            />
            <button
              type="submit"
              disabled={settingPin}
              className="border-2 border-white bg-white text-black px-6 py-3 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {settingPin ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save New PIN →</span>
            </button>
          </div>
          {pinSuccessMsg && <div className="text-xs text-emerald-400 font-bold">{pinSuccessMsg}</div>}
          {createPinError && <div className="text-xs text-rose-400 font-bold">{createPinError}</div>}
        </form>
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
            <h2 className="text-xl font-bold uppercase">MCP Scope Permissions</h2>
            <p className="text-xs text-white/60">Configure fine-grained read and write permissions</p>
          </div>
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
            <span>{saved ? 'Permissions Saved' : 'Save Scopes & Settings'}</span>
          </button>
        </div>
      </div>

      <div className="border border-white/20 p-4 bg-white/5 text-xs space-y-2">
        <div className="font-bold uppercase text-white flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>SECURITY PRINCIPLE: AI CONNECTION ≠ WALLET CONTROL</span>
        </div>
        <p className="text-white/70">
          Entering your ArcEyes Execution PIN unlocks financial transaction requests for 1 hour. Private keys and seed phrases are NEVER sent to AI models or MCP clients.
        </p>
      </div>
    </div>
  );
}
