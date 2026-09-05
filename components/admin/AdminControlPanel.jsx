"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sliders, 
  Thermometer, 
  Clock, 
  Wind, 
  Radio, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RefreshCw, 
  CheckCircle2,
  X,
  Settings,
  Zap,
  Activity,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function AdminControlPanel({
  chamberTemp,
  onUpdateChamberTemp,
  transitDuration,
  onUpdateTransitDuration,
  ethyleneThreshold,
  onUpdateEthyleneThreshold,
  pingInterval,
  onUpdatePingInterval,
  autoEscrowEnabled,
  onToggleAutoEscrow
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Dynamic Freshness Score Engine (%)
  const calculateFreshnessScore = () => {
    const tempPenalty = Math.max(0, chamberTemp - 3.5) * 4.5;
    const durationPenalty = transitDuration * 1.4;
    const ethylenePenalty = (ethyleneThreshold - 0.05) * 75;
    const pingPenalty = (pingInterval - 1) * 1.2;

    const score = 100 - (tempPenalty + durationPenalty + ethylenePenalty + pingPenalty);
    return Math.min(99.4, Math.max(35.0, +score.toFixed(1)));
  };

  const freshnessScore = calculateFreshnessScore();

  const getFreshnessGrade = (score) => {
    if (score >= 88) return { label: 'Grade A+ (Certified Prime)', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', barColor: 'bg-emerald-500' };
    if (score >= 74) return { label: 'Grade A (Market Standard)', color: 'text-teal-300', bg: 'bg-teal-500/20', border: 'border-teal-500/40', barColor: 'bg-teal-400' };
    if (score >= 58) return { label: 'Grade B (Discount Sale Required)', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40', barColor: 'bg-amber-400' };
    return { label: 'Rot Risk Alert (Immediate Cold Relay)', color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40', barColor: 'bg-rose-500' };
  };

  const grade = getFreshnessGrade(freshnessScore);

  const handleSaveConfig = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <>
      {/* Admin Floating Control Button */}
      <div className="fixed top-24 left-6 z-40">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-pill border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 shadow-2xl bg-slate-900/90 hover:border-emerald-400 backdrop-blur-xl"
        >
          <Settings className="w-4 h-4 text-emerald-400 animate-spin-slow" />
          <span>Admin Logistics Dashboard</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
            {freshnessScore}% Fresh
          </span>
        </motion.button>
      </div>

      {/* Admin Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            className="fixed top-36 left-6 z-40 w-80 md:w-96 rounded-3xl glass-panel p-5 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl bg-slate-900/95 text-slate-100 max-h-[80vh] overflow-y-auto font-mono text-xs space-y-5 custom-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Admin Supply Chain Control</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* DYNAMIC FRESHNESS SCORE SIMULATOR DISPLAY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold flex items-center gap-1.5 text-xs">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Dynamic Predicted Freshness Index
                </span>
                <span className={`text-base font-extrabold ${grade.color}`}>
                  {freshnessScore}%
                </span>
              </div>

              {/* Progress Meter Bar */}
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${freshnessScore}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className={`h-full rounded-full ${grade.barColor}`}
                />
              </div>

              {/* Grade Badge */}
              <div className={`p-2 rounded-xl border text-[11px] font-bold text-center ${grade.bg} ${grade.color} ${grade.border}`}>
                {grade.label}
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                <span>Est. Shelf Life: <strong className="text-white">{(freshnessScore * 0.14).toFixed(1)} Days</strong></span>
                <span>Degradation: <strong className="text-rose-400">{(100 - freshnessScore).toFixed(1)}%</strong></span>
              </div>
            </div>

            {/* Controls List */}
            <div className="space-y-4">
              {/* 1. Chamber Set Temperature (°C) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-1.5 font-bold">
                    <Thermometer className="w-4 h-4 text-emerald-400" />
                    Chamber Set Temperature
                  </span>
                  <span className="text-emerald-400 font-bold text-sm">{chamberTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.5"
                  value={chamberTemp}
                  onChange={(e) => onUpdateChamberTemp(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1.0°C (Deep Chill)</span>
                  <span>3.5°C (Optimal)</span>
                  <span>10.0°C (High Decay)</span>
                </div>
              </div>

              {/* 2. Transit Max Duration (Hours) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-1.5 font-bold">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Max Transit Duration
                  </span>
                  <span className="text-cyan-400 font-bold text-sm">{transitDuration} Hours</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  step="1"
                  value={transitDuration}
                  onChange={(e) => onUpdateTransitDuration(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>2h Express</span>
                  <span>12h Standard</span>
                  <span>24h Max Relay</span>
                </div>
              </div>

              {/* 3. Ethylene Scrubber Trigger (PPM) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-1.5 font-bold">
                    <Wind className="w-4 h-4 text-amber-400" />
                    Ethylene Scrubber Trigger
                  </span>
                  <span className="text-amber-400 font-bold text-sm">{ethyleneThreshold} PPM</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.01"
                  value={ethyleneThreshold}
                  onChange={(e) => onUpdateEthyleneThreshold(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.05 PPM (Active Scrubber)</span>
                  <span>0.50 PPM (High Ripening)</span>
                </div>
              </div>

              {/* 4. ESP32 Sensor Telemetry Interval */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-1.5 font-bold">
                    <Radio className="w-4 h-4 text-blue-400" />
                    ESP32 Ping Interval
                  </span>
                  <span className="text-blue-400 font-bold text-sm">{pingInterval}s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={pingInterval}
                  onChange={(e) => onUpdatePingInterval(parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1s Realtime</span>
                  <span>10s Power Save</span>
                </div>
              </div>

              {/* 5. Gate-In Auto Escrow Rule */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">Gate-In Auto-Escrow</span>
                  <span className="text-[10px] text-slate-400">Release funds on IoT scan</span>
                </div>
                <button
                  onClick={onToggleAutoEscrow}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    autoEscrowEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-white/5'
                  }`}
                >
                  {autoEscrowEnabled ? 'ENABLED' : 'MANUAL'}
                </button>
              </div>

              {/* Apply & Save Button */}
              <button
                onClick={handleSaveConfig}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Apply Admin Logistics Overrides</span>
              </button>

              {saveToast && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-center text-[11px] font-bold"
                >
                  ✓ Freshness Index Updated & Telemetry Pushed to IoT Nodes!
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
