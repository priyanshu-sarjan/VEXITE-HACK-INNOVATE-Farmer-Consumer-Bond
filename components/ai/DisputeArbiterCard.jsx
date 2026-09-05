"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw,
  Zap,
  DollarSign
} from 'lucide-react';

export default function DisputeArbiterCard() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [settlement, setSettlement] = useState(null);

  const handleRunArbitration = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/dispute-arbiter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: 'AGRI-GRAPE-8821',
          issueDescription: 'Batch #AGRI-GRAPE-8821 arrived 3.5 hours late due to ambient heat corridor congestion. Buyer requested 15% discount. Farmer claims cold-hub pre-cooling maintained quality.',
        }),
      });

      const data = await res.json();
      setSettlement(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                Gemini Agentic Dispute Arbiter
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Function Calling
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Autonomous AI Agent auditing APMC modal pricing & transit IoT telemetry to settle buyer disputes
              </p>
            </div>
          </div>

          <button
            onClick={handleRunArbitration}
            disabled={isEvaluating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Invoking Agent Tools...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Run Agentic Dispute Arbiter</span>
              </>
            )}
          </button>
        </div>

        {/* Dispute Details */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span>Case File ID: #DISPUTE-8821</span>
            <span className="text-amber-400 font-bold">STATUS: PENDING ARBITRATION</span>
          </div>
          <p className="text-slate-200">
            <strong className="text-white">Issue Claim:</strong> Batch #AGRI-GRAPE-8821 (8.5 MT Seedless Grapes) arrived at Mumbai Vashi Mandi 3.5 hours behind schedule. Buyer flagged ambient heat corridor delay.
          </p>
        </div>

        {/* Agentic Execution Results */}
        {settlement && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Arbitration Verdict Executed
              </span>
              <span className="text-[10px] text-slate-400">Tools: fetch_mandi_benchmark, audit_transit_telemetry</span>
            </div>

            <p className="text-slate-300 bg-slate-900 p-3 rounded-xl border border-white/5">
              <strong className="text-emerald-400 block mb-1">Agent Reasoning:</strong>
              {settlement.agentReasoning}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Original Escrow</span>
                <p className="font-bold text-white text-base">${settlement.finalSettlement?.originalEscrowAmountUsdc} USDC</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Adjusted Farmer Payout</span>
                <p className="font-bold text-emerald-400 text-base">${settlement.finalSettlement?.adjustedFarmerPayoutUsdc} USDC</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Buyer Compromise Credit</span>
                <p className="font-bold text-amber-300 text-base">${settlement.finalSettlement?.buyerRefundUsdc} USDC</p>
              </div>
            </div>

            <p className="text-[11px] text-emerald-300 font-bold">
              Verdict Summary: {settlement.finalSettlement?.verdict}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
