"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Flame, 
  ShieldCheck, 
  Navigation, 
  Thermometer, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const FRESHNESS_DECAY_DATA = [
  { hour: '0h', standardRoute: 100, aiRoute: 100 },
  { hour: '4h', standardRoute: 94, aiRoute: 98 },
  { hour: '8h (Thane Heat Corridor)', standardRoute: 81, aiRoute: 96 },
  { hour: '12h', standardRoute: 72, aiRoute: 95 },
  { hour: '16h (Mandi Gate-In)', standardRoute: 64, aiRoute: 94 },
];

export default function RouteOptimizer() {
  const [activeRouteMode, setActiveRouteMode] = useState('ai-bypass');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="route-ai" className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>SIH 2026 AI Heat Corridor Bypass Logistics</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Dynamic Route & Produce Decay Optimization
          </h2>
        </div>

        {/* Route Selector Toggle */}
        <div className="flex items-center gap-2 p-1.5 glass-pill rounded-full border border-white/10 bg-slate-900/80">
          <button
            onClick={() => setActiveRouteMode('standard')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeRouteMode === 'standard'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Standard Highway Route
          </button>

          <button
            onClick={() => setActiveRouteMode('ai-bypass')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeRouteMode === 'ai-bypass'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Heat-Bypass Route (Recommended)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Visualizer & Heat Warnings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Nashik FPO Hub → Mumbai Vashi Mandi
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                168 km Transit
              </span>
            </div>

            {/* Heat Warning Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              activeRouteMode === 'standard'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            }`}>
              <div className="flex items-start gap-3">
                {activeRouteMode === 'standard' ? (
                  <Flame className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="font-bold text-xs">
                    {activeRouteMode === 'standard' 
                      ? 'High-Heat Corridor Detected on NH48 Highway'
                      : 'AI Route: Micro-Cold Hub Relay Stations Engaged'
                    }
                  </h4>
                  <p className="text-[11px] opacity-90">
                    {activeRouteMode === 'standard'
                      ? 'Ambient heat spike (+38.2°C) near Thane congestion zone accelerates fruit respiration and ethylene output.'
                      : 'Reroutes container transit through shaded expressway & engages Nashik Solar Micro-Hub slot for pre-cooling.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Route Stats Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Estimated ETA</span>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  3h 45m
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Produce Loss Saved</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {activeRouteMode === 'standard' ? 'High Risk (-36%)' : '+30.0% Loss Avoided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Recharts Freshness Decay Curve */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Kinetic Freshness Decay Curve</h3>
                <p className="text-xs text-slate-400">Comparing Produce Quality Index (%) over Transit Duration</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                Grade A Target ≥ 90%
              </span>
            </div>

            {/* Recharts Area Graph */}
            <div className="w-full h-64">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={FRESHNESS_DECAY_DATA}>
                    <defs>
                      <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="standardGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2d35" />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                    <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121316', borderColor: '#2a2d35', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="aiRoute" 
                      name="AI Heat-Bypass Route (%)" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#aiGradient)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="standardRoute" 
                      name="Standard Highway Route (%)" 
                      stroke="#f59e0b" 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      fillOpacity={1} 
                      fill="url(#standardGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-500">
                  Loading Freshness Decay Curve...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
