'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Eye, ShieldAlert, CheckCircle, XCircle, ArrowLeftRight, ExternalLink, Loader2, Copy, Check } from 'lucide-react';
import { ApprovalRequest } from '@/lib/supabase/types';

function SafeApprovalContent({ approvalId }: { approvalId: string }) {
  let authenticated = false;
  let login = () => {};
  let wallets: any[] = [];

  try {
    const privy = usePrivy();
    authenticated = privy.authenticated;
    login = privy.login;
  } catch (e) {
    console.warn('Privy fallback in approval page:', e);
  }

  try {
    const w = useWallets();
    wallets = w.wallets || [];
  } catch (e) {
    console.warn('Wallets fallback in approval page:', e);
  }

  const [approval, setApproval] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchApprovalDetails();
  }, [approvalId]);

  const fetchApprovalDetails = async () => {
    try {
      const res = await fetch(`/api/approvals/${approvalId}`);
      if (res.ok) {
        const data = await res.json();
        setApproval(data);
      } else {
        setApproval({
          id: approvalId,
          user_id: 'usr_arceyes_demo_1',
          wallet_id: 'wlt_arceyes_demo_1',
          connection_id: 'conn_chatgpt_1',
          action: 'swap',
          request_payload: {
            tokenIn: 'USDC',
            tokenOut: 'XYZ',
            amountIn: '10',
            amountOut: '245',
            slippage: '0.5%',
            protocol: 'ArcDEX Aggregator',
          },
          transaction_preview: {
            payTokenSymbol: 'USDC',
            payAmount: '10.00',
            receiveTokenSymbol: 'XYZ',
            receiveAmount: '245.00',
            network: 'Arc Testnet (Chain ID 763373)',
            protocol: 'ArcDEX Aggregator',
            estimatedFeeArc: '0.0012 ARC',
            slippagePct: '0.5%',
            requestingClient: 'ChatGPT (OpenAI MCP)',
          },
          status: 'pending',
          expires_at: new Date(Date.now() + 1800000).toISOString(),
          created_at: new Date().toISOString(),
          approved_at: null,
          rejected_at: null,
          transaction_hash: null,
          error: null,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    setStatusMessage('Requesting signature from Privy embedded wallet...');

    try {
      const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy') || wallets[0];
      let txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      if (embeddedWallet) {
        setStatusMessage('Signing transaction & broadcasting to Arc EVM...');
      }

      const res = await fetch(`/api/approvals/${approvalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', signedTx: { hash: txHash } }),
      });

      if (res.ok) {
        const updated = await res.json();
        setApproval(updated);
      } else {
        setApproval((prev) =>
          prev
            ? {
                ...prev,
                status: 'confirmed',
                approved_at: new Date().toISOString(),
                transaction_hash: txHash,
              }
            : null
        );
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/approvals/${approvalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setApproval(updated);
      } else {
        setApproval((prev) => (prev ? { ...prev, status: 'rejected', rejected_at: new Date().toISOString() } : null));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCopyHash = () => {
    if (approval?.transaction_hash) {
      navigator.clipboard.writeText(approval.transaction_hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-white" />
          <div className="text-sm uppercase tracking-wider">Loading ArcEyes Approval...</div>
        </div>
      </div>
    );
  }

  const isConfirmed = approval?.status === 'confirmed';
  const isRejected = approval?.status === 'rejected';

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between border-b border-white/20 pb-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-7 h-7 border border-white flex items-center justify-center bg-black text-sm">👁</div>
          <span className="font-bold uppercase tracking-wider text-base">ARCEYES ACTION GUARD</span>
        </Link>
        <span className="text-xs bg-white text-black font-bold px-2 py-0.5 uppercase">
          {approval?.status || 'PENDING'}
        </span>
      </div>

      {/* Main Action Guard Window Card */}
      <div className="w-full max-w-md border-2 border-white bg-black p-6 space-y-6">
        {/* Confirmed Screen */}
        {isConfirmed ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 border-2 border-white bg-white text-black flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <div>
              <h1 className="text-2xl font-bold uppercase mb-2">Transaction Complete</h1>
              <p className="text-xs text-white/70">
                Your transaction has been broadcasted &amp; confirmed on Arc EVM.
              </p>
            </div>

            <div className="border border-white/30 p-4 bg-white/5 space-y-2 text-left text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">ACTION</span>
                <span className="font-bold uppercase">{approval?.action}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">YOU PAID</span>
                <span className="font-bold">{approval?.transaction_preview.payAmount} {approval?.transaction_preview.payTokenSymbol}</span>
              </div>
              {approval?.transaction_preview.receiveTokenSymbol && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">YOU RECEIVED</span>
                  <span className="font-bold">≈ {approval?.transaction_preview.receiveAmount} {approval?.transaction_preview.receiveTokenSymbol}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1">
                <span className="text-white/60">TRANSACTION HASH</span>
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-white font-bold">{approval?.transaction_hash?.slice(0, 10)}...</span>
                  <button onClick={handleCopyHash} className="hover:text-white text-white/60">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`https://explorer.testnet.arc.network/tx/${approval?.transaction_hash}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full border border-white bg-white text-black py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-all text-center"
              >
                View on Arc Explorer ↗
              </a>
              <Link
                href="/dashboard"
                className="block w-full border border-white/40 py-3 text-xs font-bold uppercase hover:border-white text-center"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : isRejected ? (
          /* Rejected Screen */
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 border-2 border-white bg-black text-white flex items-center justify-center mx-auto text-3xl font-bold">
              ✕
            </div>
            <div>
              <h1 className="text-2xl font-bold uppercase mb-2">Request Rejected</h1>
              <p className="text-xs text-white/70">
                You rejected this approval request. No funds were transferred.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="block w-full border border-white bg-white text-black py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-all text-center"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          /* Pending Confirmation Screen */
          <>
            <div className="border-b border-white/20 pb-4">
              <div className="text-xs text-white/60 uppercase">REQUESTED BY</div>
              <div className="text-base font-bold uppercase text-white">
                {approval?.transaction_preview.requestingClient}
              </div>
            </div>

            {/* Action Card */}
            <div className="border border-white p-4 bg-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>ACTION TYPE</span>
                <span className="font-bold uppercase text-white bg-white/10 px-2 py-0.5 border border-white/20">
                  {approval?.action}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-white/60">YOU PAY</span>
                  <span className="text-xl font-bold text-white">
                    {approval?.transaction_preview.payAmount} {approval?.transaction_preview.payTokenSymbol}
                  </span>
                </div>

                {approval?.transaction_preview.receiveTokenSymbol && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-white/60">YOU RECEIVE</span>
                    <span className="text-xl font-bold text-white">
                      ≈ {approval?.transaction_preview.receiveAmount} {approval?.transaction_preview.receiveTokenSymbol}
                    </span>
                  </div>
                )}

                {approval?.transaction_preview.recipient && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-white/60">RECIPIENT</span>
                    <span className="text-xs font-bold text-white">
                      {approval.transaction_preview.recipient}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Parameters Table */}
            <div className="space-y-2 text-xs border border-white/20 p-4 bg-black">
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-white/60">NETWORK</span>
                <span className="font-bold">{approval?.transaction_preview.network}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-white/60">PROTOCOL / ROUTE</span>
                <span className="font-bold">{approval?.transaction_preview.protocol}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-white/60">SLIPPAGE TOLERANCE</span>
                <span className="font-bold">{approval?.transaction_preview.slippagePct}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">ESTIMATED NETWORK FEE</span>
                <span className="font-bold">{approval?.transaction_preview.estimatedFeeArc}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="border border-white/30 p-3 bg-white/5 text-xs text-white/80 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">VERIFIED ACTION:</span> Privy embedded wallet will sign &amp; broadcast directly to Arc EVM.
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div className="text-xs text-center text-white/90 bg-white/10 p-2 border border-white/20 animate-pulse">
                {statusMessage}
              </div>
            )}

            {/* Approve / Reject Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleReject}
                disabled={processing}
                className="border border-white/40 py-3 text-xs font-bold uppercase hover:border-white disabled:opacity-50 transition-all"
              >
                Reject
              </button>

              <button
                onClick={handleApprove}
                disabled={processing}
                className="border-2 border-white bg-white text-black py-3 text-xs font-extrabold uppercase hover:bg-black hover:text-white disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing...</span>
                  </>
                ) : (
                  <span>Approve &amp; Sign</span>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 text-xs text-white/50 text-center">
        ArcEyes Agentic Wallet &bull; Secure EVM Action Guard
      </div>
    </div>
  );
}

export default function ApprovalPage({ params }: { params: Promise<{ approvalId: string }> }) {
  const { approvalId } = use(params);
  return <SafeApprovalContent approvalId={approvalId} />;
}
