"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sliders, 
  Box, 
  Layers, 
  Cpu, 
  Thermometer, 
  ShieldCheck, 
  Wallet, 
  Sparkles,
  RefreshCw,
  X,
  ChevronRight,
  BatteryCharging,
  Lock
} from 'lucide-react';

export default function InteractiveConfigurator({
  activeModel,
  onSelectModel,
  capacityLoad,
  onUpdateCapacity,
  selectedHotspot,
  onSelectHotspot,
  onConnectWallet,
  walletConnected
}) {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const models = [
    {
      id: 'micro-hub',
      name: '10MT Micro-Cold Hub',
      desc: 'Off-grid solar micro-hub for FPO village clusters',
      power: '3.2 kW Solar PV',
      capacity: '10 Metric Tons',
      tag: 'SIH Recommended',
    },
    {
      id: 'reefer-transit',
      name: '20MT Solar Reefer EV',
      desc: 'Refrigerated transit truck node with kinetic decay monitoring',
      power: 'Dual LiFePO4 Pack',
      capacity: '20 Metric Tons',
      tag: 'In-Transit',
    },
    {
      id: 'macro-hub',
      name: '50MT Macro Cold Depot',
      desc: 'Regional multi-chamber hub for Mandi bulk buyer dispatch',
      power: 'Grid + Solar Hybrid',
      capacity: '50 Metric Tons',
      tag: 'Bulk Storage',
    },
  ];

  return (
    <>
      {/* Floating Bottom Action Dock */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4 pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center justify-between gap-4 p-3 rounded-full glass-panel border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/85">
          {/* Quick Model Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectModel(m.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeModel === m.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 border border-emerald-300 font-bold'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-white/5'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>{m.name.split(' ')[0]} {m.name.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Drawer Toggle & Buy Direct CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 border border-white/10 transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Diagnostics & Config</span>
            </button>

            <button
              onClick={onConnectWallet}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/30 transition-all"
            >
              <Wallet className="w-4 h-4" />
              <span>{walletConnected ? 'Escrow Ready' : 'Buy Direct / Escrow'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Floating Right-Hand Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            className="fixed top-24 right-6 z-40 w-80 md:w-96 rounded-3xl glass-panel p-5 border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/90 text-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm tracking-wide text-white">Spatial Configurator</h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Model Details */}
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  Active Micro-Cold Hub Variant
                </label>
                <div className="mt-1.5 p-3 rounded-2xl bg-slate-850/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-400">
                      {models.find(m => m.id === activeModel)?.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {models.find(m => m.id === activeModel)?.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {models.find(m => m.id === activeModel)?.desc}
                  </p>
                </div>
              </div>

              {/* Load Capacity Simulator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                    Chamber Storage Load
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-400">{capacityLoad}% Occupied</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[35, 65, 90].map((val) => (
                    <button
                      key={val}
                      onClick={() => onUpdateCapacity(val)}
                      className={`py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                        capacityLoad === val
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-800/50 text-slate-400 border-white/5 hover:border-white/10'
                      }`}
                    >
                      {val}% Load
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Hotspot Diagnostics Overlay */}
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  3D Hotspot Diagnostic Telemetry
                </label>
                <div className="mt-1.5 p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                      Chamber Temp
                    </span>
                    <span className="font-mono font-bold text-white">3.8°C (Set: 4.0°C)</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                      Solar Battery
                    </span>
                    <span className="font-mono font-bold text-amber-300">98% (3.2 kW Active)</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      Smart Gate-In Lock
                    </span>
                    <span className="font-mono font-bold text-blue-300">Verified #AGY-9921</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onConnectWallet}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Trigger Automated Smart Escrow</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
