"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Wallet, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Unlock, 
  DollarSign,
  ExternalLink,
  Award
} from 'lucide-react';

export default function SmartEscrow({ walletConnected, onConnectWallet }) {
  const [escrowStatus, setEscrowStatus] = useState('LOCKED');
  const [isProcessing, setIsProcessing] = useState(false);

  const stages = [
    { id: 1, label: 'Buyer Funds Deposited', detail: '4,500 USDC locked in Escrow Contract', done: true },
    { id: 2, label: 'IoT Cold Chain Sealed', detail: 'ESP32 temp stream active (3.8°C avg)', done: true },
    { id: 3, label: 'Hub Gate-In Verified', detail: 'Smart Lock Scan #AGY-9921 confirmed', done: escrowStatus !== 'LOCKED' },
    { id: 4, label: 'Freshness Audit & Payout', detail: 'Grade A+ (>92%) triggers instant release', done: escrowStatus === 'RELEASED' },
  ];

  const handleSimulatePayout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setEscrowStatus('RELEASED');
      setIsProcessing(false);
      
      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  return (
    <section id="smart-escrow" className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Web3 Zero-Trust Escrow Protocol</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Direct Farmer Payout & Escrow Contract
          </h2>
        </div>

        {/* Connect Wallet */}
        <button
          onClick={onConnectWallet}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xl ${
            walletConnected
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>{walletConnected ? 'Connected: 0x8F92...C42A' : 'Connect Web3 Wallet'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Escrow Contract Details */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Smart Contract ID</span>
                <p className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </p>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                escrowStatus === 'RELEASED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                {escrowStatus === 'RELEASED' ? 'RELEASED & PAID' : 'FUNDS LOCKED IN ESCROW'}
              </div>
            </div>

            {/* Produce Batch Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Produce Batch</span>
                <p className="font-bold text-white">AGRI-GRAPE-8821</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Farmer FPO Payout</span>
                <p className="font-bold text-emerald-400 font-mono">4,500 USDC</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px]">Freshness Gate</span>
                <p className="font-bold text-cyan-400">97.4% (&gt;92% req)</p>
              </div>
            </div>

            {/* 4 Stage Milestone Steps */}
            <div className="space-y-3 pt-2">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    stage.done
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                      : 'bg-slate-900/40 border-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      stage.done ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {stage.done ? <CheckCircle2 className="w-4 h-4" /> : stage.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{stage.label}</h4>
                      <p className="text-[11px] text-slate-400">{stage.detail}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    stage.done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {stage.done ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            {/* Payout Trigger Button */}
            <button
              onClick={handleSimulatePayout}
              disabled={escrowStatus === 'RELEASED' || isProcessing}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
                escrowStatus === 'RELEASED'
                  ? 'bg-slate-800 text-slate-400 border border-white/10 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 hover:brightness-110 shadow-emerald-500/20'
              }`}
            >
              {escrowStatus === 'RELEASED' ? (
                <>
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>4,500 USDC Released to Nashik FPO Wallet</span>
                </>
              ) : isProcessing ? (
                <span>Verifying IoT Gate-In & Executing Smart Contract...</span>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Simulate IoT Gate-In & Release Escrow</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Benefits & Government Compliance */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              SIH26033 Platform Compliance
            </h3>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>No Intermediary Commission:</strong> Direct FPO-to-Buyer settlement bypassing APMC middleman markups.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Automated Quality Penalties:</strong> If kinetic shelf-life drops below 80%, price dynamically adjusts per contract parameters.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Zero Distress Sales:</strong> Farmers deposit produce in Micro-Cold Hub and receive immediate 60% credit advance.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
