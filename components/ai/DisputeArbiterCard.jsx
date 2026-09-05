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
  Truck,
  Users,
  Wrench,
  Radio,
  Sun,
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
          issueDescription: 'Batch #AGRI-GRAPE-8821 arrived 3.5 hours late with 12% produce decay. Perform end-to-end liability audit across driver, loading labour, refrigeration mechanic, and IoT maintenance engineer.',
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

  const getActorIcon = (actor) => {
    if (actor.includes('Driver')) return Truck;
    if (actor.includes('Loading')) return Users;
    if (actor.includes('Refrigeration') || actor.includes('HVAC')) return Wrench;
    if (actor.includes('IoT')) return Radio;
    return Sun;
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
                Gemini Multi-Party Responsibility Arbiter
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  End-to-End Audit
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Audits start-to-end supply chain actors (Driver, Labour, HVAC Mechanic, IoT Tech) to attribute exact fault % and protect farmer payouts
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
                <span>Auditing 5 Supply Chain Actors...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Run Start-to-End Fault Audit</span>
              </>
            )}
          </button>
        </div>

        {/* Dispute Incident Summary */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span>Case File ID: #DISPUTE-8821 (Nashik Grape Batch)</span>
            <span className="text-amber-400 font-bold">STATUS: MULTI-PARTY LIABILITY AUDIT</span>
          </div>
          <p className="text-slate-200">
            <strong className="text-white">Incident Claim:</strong> Batch #AGRI-GRAPE-8821 arrived 3.5 hours late at Mumbai Vashi Mandi with partial bruising (+12% decay). Gemini AI is calculating individual accountability for Driver, Loading Labour, Refrigeration Mechanic, and IoT Telemetry Tech.
          </p>
        </div>

        {/* Multi-Party Stakeholder Fault Matrix Results */}
        {settlement && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-5 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Start-to-End Stakeholder Liability Breakdown
              </span>
              <span className="text-[10px] text-slate-400">Tool: audit_supply_chain_liability()</span>
            </div>

            {/* Stakeholder Liability List */}
            <div className="space-y-3">
              {settlement.multiPartyLiability?.map((item, idx) => {
                const Icon = getActorIcon(item.actor);
                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-xs">{item.actor}</h4>
                          <p className="text-[11px] text-slate-400">{item.role} • <span className="text-amber-300">{item.faultType}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="font-extrabold text-sm text-emerald-400">{item.liabilityPercentage}% Fault</span>
                          <p className="text-[10px] text-slate-400">
                            {item.penaltyDeductionUsdc > 0 ? `-$${item.penaltyDeductionUsdc} USDC Penalty` : 'System Absorbed'}
                          </p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.penaltyDeductionUsdc > 0 
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar for Fault Percentage */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.liabilityPercentage >= 25 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${item.liabilityPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Financial Settlement Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Original Escrow</span>
                <p className="font-bold text-white text-base">${settlement.finalSettlement?.originalEscrowAmountUsdc} USDC</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-1">
                <span className="text-slate-400 text-[10px]">Protected Farmer Payout</span>
                <p className="font-bold text-emerald-400 text-base">${settlement.finalSettlement?.adjustedFarmerPayoutUsdc} USDC</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Buyer Compromise Credit</span>
                <p className="font-bold text-amber-300 text-base">${settlement.finalSettlement?.buyerRefundUsdc} USDC</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/40 space-y-1">
                <span className="text-slate-400 text-[10px]">Recovered from Logistics Bonds</span>
                <p className="font-bold text-blue-400 text-base">${settlement.finalSettlement?.recoveredFromLogisticsBondsUsdc} USDC</p>
              </div>
            </div>

            <p className="text-[11px] text-emerald-300 font-bold bg-slate-900 p-3 rounded-xl border border-white/5">
              <ShieldCheck className="w-4 h-4 inline mr-1 text-emerald-400" />
              Verdict: {settlement.finalSettlement?.verdict}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
