'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { LayoutDashboard, Wallet, Cpu, CheckSquare, Activity, Key, Sparkles, Settings, Copy, Check, LogOut, Lock } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [testMode, setTestMode] = useState(true);

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
    </div>
  );
}
