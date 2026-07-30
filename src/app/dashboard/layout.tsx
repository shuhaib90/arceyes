'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { LayoutDashboard, Wallet, Cpu, CheckSquare, Activity, Key, Sparkles, Settings, Copy, Check, LogOut, Lock, KeyRound, ShieldAlert, Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [testMode, setTestMode] = useState(true);

  // New PIN Setup Modal State
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [savingPin, setSavingPin] = useState(false);

  let user: any = null;
  let authenticated = false;
  let login = () => {};
  let logout = () => {};

  try {
    const privy = usePrivy();
    user = privy.user;
    authenticated = privy.authenticated;
    login = privy.login;
    logout = privy.logout;
  } catch (e) {
    console.warn('Privy hook fallback:', e);
  }

  const walletAddress = user?.wallet?.address || '';

  // Trigger Create PIN modal on first sign up / login if not set up
  useEffect(() => {
    if (authenticated) {
      const pinSetupDone = localStorage.getItem('arceyes_pin_setup_completed');
      if (!pinSetupDone) {
        setShowPinModal(true);
      }
    }
  }, [authenticated]);

  const handleSaveInitialPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setPinError('PIN must be 4 to 6 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }

    try {
      setSavingPin(true);
      setPinError('');
      const res = await fetch('/api/execution/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: newPin }),
      });

      if (res.ok) {
        localStorage.setItem('arceyes_pin_setup_completed', 'true');
        setShowPinModal(false);
        setNewPin('');
        setConfirmPin('');
      } else {
        const data = await res.json();
        setPinError(data.error || 'Failed to save PIN');
      }
    } catch (err: any) {
      setPinError('Error saving security PIN');
    } finally {
      setSavingPin(false);
    }
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Connect AI', href: '/dashboard/connections', icon: Cpu },
    { name: 'Approvals', href: '/dashboard/approvals', icon: CheckSquare },
    { name: 'Activity', href: '/dashboard/activity', icon: Activity },
    { name: 'Permissions', href: '/dashboard/permissions', icon: Key },
    { name: 'ArcEyes NFT', href: '/dashboard/arceyes', icon: Sparkles },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col md:flex-row selection:bg-white selection:text-black">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/20 bg-black flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Brand */}
          <div className="p-6 border-b border-white/20 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 border border-white flex items-center justify-center bg-black text-base">👁</div>
              <span className="font-bold uppercase tracking-tighter text-lg">ARCEYES</span>
            </Link>
          </div>

          {/* Wallet Address Banner */}
          <div className="p-4 border-b border-white/20 bg-white/5 space-y-2">
            <div className="text-[10px] text-white/50 uppercase tracking-wider flex items-center justify-between">
              <span>EMBEDDED WALLET</span>
              <span className="text-white font-bold">ARC TESTNET</span>
            </div>
            <div className="flex items-center justify-between bg-black p-2 border border-white/30 text-xs font-bold">
              {walletAddress ? (
                <>
                  <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  <button onClick={handleCopy} className="hover:text-white text-white/70">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </>
              ) : (
                <span className="text-white/40 italic">Not Connected</span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase transition-all border ${
                    isActive
                      ? 'bg-white text-black border-white'
                      : 'text-white/70 border-transparent hover:border-white/30 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Developer Mode & Sign In / Out Footer */}
        <div className="p-4 border-t border-white/20 space-y-3">
          <div className="flex items-center justify-between p-2 border border-white/20 text-[11px]">
            <span className="text-white/70 uppercase font-bold">ARC TESTNET</span>
            <button
              onClick={() => setTestMode(!testMode)}
              className={`px-2 py-0.5 font-bold uppercase ${
                testMode ? 'bg-white text-black' : 'bg-white/20 text-white'
              }`}
            >
              {testMode ? 'ON' : 'OFF'}
            </button>
          </div>

          {authenticated ? (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 py-2 border border-white/20 text-xs uppercase font-bold text-white/60 hover:text-white hover:border-white transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={login}
              className="w-full flex items-center justify-center space-x-2 py-2 border border-white bg-white text-black text-xs uppercase font-extrabold hover:bg-black hover:text-white transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In with Privy</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>

      {/* CREATE EXECUTION PIN MODAL AFTER PRIVY SIGN-IN */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="border-2 border-white bg-black p-6 sm:p-8 max-w-lg w-full space-y-6 font-mono text-white selection:bg-white selection:text-black">
            <div className="flex items-center space-x-3 border-b border-white/20 pb-4">
              <div className="w-9 h-9 border border-white flex items-center justify-center bg-white text-black font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold uppercase">Create ArcEyes Execution PIN</h2>
                <div className="text-[10px] text-white/60">SECURITY SETUP &bull; PRIVY INTEGRATION</div>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed">
              Set a secret <strong>6-digit security PIN</strong>. You will enter this PIN on the ArcEyes website to unlock 1-hour trading sessions for financial transactions prepared by ChatGPT or Claude.
            </p>

            <form onSubmit={handleSaveInitialPin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase text-white/70">Create 6-Digit Execution PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full bg-white text-black font-mono text-xl tracking-widest border-2 border-white p-3 font-bold text-center"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase text-white/70">Confirm 6-Digit Execution PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Re-enter 6-digit PIN"
                  className="w-full bg-white text-black font-mono text-xl tracking-widest border-2 border-white p-3 font-bold text-center"
                />
              </div>

              {pinError && <div className="text-xs text-rose-400 font-bold">{pinError}</div>}

              <div className="border border-white/20 p-3 bg-white/5 text-[11px] text-white/70 flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">SECURITY GUARANTEE:</span> This PIN is entered ONLY on the ArcEyes website. It is NEVER shared with ChatGPT, Claude, or AI models.
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPin}
                className="w-full border-2 border-white bg-white text-black py-4 text-xs font-extrabold uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {savingPin ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Execution PIN &amp; Continue →</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
