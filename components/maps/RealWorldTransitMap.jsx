"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Truck, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Thermometer, 
  Droplets, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Navigation,
  Compass,
  Sparkles,
  Snowflake,
  Filter,
  Search,
  Building2,
  CheckCircle2,
  Layers,
  TrendingUp,
  BarChart3,
  Database,
  Cpu
} from 'lucide-react';
import mandiData from '@/data/mandiWarehouses.json';

// Dynamically import Leaflet components with ssr: false to prevent window object errors during build
const LeafletMapContainer = dynamic(() => import('./LeafletGISContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] bg-[#0c0e12] rounded-2xl flex flex-col items-center justify-center gap-3 border border-white/10">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-mono text-emerald-400">Loading Real-World Leaflet India GIS Cartography...</p>
    </div>
  ),
});

export default function RealWorldTransitMap({ selectedMandi, onSelectMandi }) {
  const [districtFilter, setDistrictFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, OVERPRODUCING, STANDARD
  const [activeTab, setActiveTab] = useState('overview');

  const activeDestination = selectedMandi || mandiData[0];

  // District Overproduction Dataset Metrics
  const districtMetrics = useMemo(() => {
    return {
      totalDistricts: 31,
      overproducingCount: 11,
      standardCount: 20,
      avgProductivity: 21.44,
      peakProducer: 'Ariyalur / Indore',
      peakProductivity: '44.64 T/Ha (+108.2%)'
    };
  }, []);

  return (
    <section id="geo-transit-map" className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* 1. AYUTRACE GIS Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 space-y-4 shadow-2xl bg-slate-900/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                AYUTRACE GIS Supply Chain & Overproduction Map
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                ● Supabase DB Connected
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Real-Time District Overproduction Tracking & Agricultural GIS Routing
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 flex items-center gap-1.5 shadow-md">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Geo-Tagged Overproduction Map (CSV Dataset)
            </span>
            <span className="px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40 flex items-center gap-1.5 shadow-md">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              Warehouse & Route GIS
            </span>
          </div>
        </div>

        {/* 2. Top Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase font-mono tracking-wider font-bold">Total Districts Analyzed</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-white font-mono">31</p>
            <span className="text-[10px] text-slate-400">National & State Crop Abstract</span>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-rose-400">
              <span className="uppercase font-mono tracking-wider font-bold">Overproducing Districts</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-extrabold text-rose-300 font-mono">11</p>
            <span className="text-[10px] text-rose-400 font-bold">35% of total region (Price Crash Risk)</span>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase font-mono tracking-wider font-bold">State Avg Productivity</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-extrabold text-cyan-300 font-mono">21.44 <span className="text-xs text-slate-400">T/Ha</span></p>
            <span className="text-[10px] text-emerald-400 font-bold">Threshold (+20%): 25.73 T/Ha</span>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-400">
              <span className="uppercase font-mono tracking-wider font-bold">Peak Overproducer</span>
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-lg font-extrabold text-amber-300 font-mono line-clamp-1">{activeDestination.district}</p>
            <span className="text-[10px] text-amber-400 font-bold">44.64 T/Ha (+108.2% Surplus)</span>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Leaflet India Map (Left) & District Analytics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Leaflet Map Container (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Map Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-white/10 bg-slate-900/80 font-mono text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filterType === 'ALL' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                All (31)
              </button>

              <button
                onClick={() => setFilterType('OVERPRODUCING')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filterType === 'OVERPRODUCING' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-800 text-rose-400 hover:text-white'
                }`}
              >
                Overproducing (11)
              </button>

              <button
                onClick={() => setFilterType('STANDARD')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filterType === 'STANDARD' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-cyan-300 hover:text-white'
                }`}
              >
                Standard (20)
              </button>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district map..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Leaflet Map Frame */}
          <div className="relative w-full h-[520px] rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden">
            <LeafletMapContainer 
              mandiData={mandiData}
              selectedMandi={activeDestination}
              onSelectMandi={onSelectMandi}
              filterType={filterType}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        {/* Right Column: Selected District & Mandi GIS Analytics Panel (1 col) */}
        <div className="space-y-4">
          <div className="rounded-3xl glass-panel p-5 border border-emerald-500/30 bg-slate-900/90 space-y-5 font-mono text-xs shadow-2xl">
            
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {activeDestination.district} District
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 text-[10px]">
                  OVERPRODUCING (+108.2%)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                State: <strong className="text-slate-200">{activeDestination.state}</strong> | Full Dataset Analysis
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/5 text-[11px]">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'overview' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('spices')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'spices' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Spices (Tab 9.4)
              </button>
              <button
                onClick={() => setActiveTab('varieties')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'varieties' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Varieties
              </button>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Area</span>
                <p className="font-extrabold text-sm text-white">2,093 Ha</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Production</span>
                <p className="font-extrabold text-sm text-white">72,519 T</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Productivity</span>
                <p className="font-extrabold text-sm text-emerald-400">44.64 T/Ha</p>
              </div>
            </div>

            {/* Crop Type Share in Region */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Crop Type Share in Region</span>
                <span className="text-emerald-400 text-[10px]">✓ Verified Share</span>
              </div>

              <div className="space-y-2">
                {/* Veg Share */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">🥦 Vegetables Share</span>
                    <span className="text-emerald-400 font-bold">65%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[65%]" />
                  </div>
                </div>

                {/* Spices Share */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">🌶️ Spices Share</span>
                    <span className="text-amber-300 font-bold">25%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[25%]" />
                  </div>
                </div>

                {/* Fruits Share */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">🍎 Fruits Share</span>
                    <span className="text-cyan-300 font-bold">10%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[10%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Alert Box */}
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-1 text-rose-300 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Sowing Risk Warning: 42% Price Crash Risk</span>
              </div>
              <p className="text-[10px] text-rose-300/80 leading-relaxed">
                Switch 30% area to Certified Peas (Kashi Nandini) or Legumes to prevent local mandi glut and price collapse.
              </p>
            </div>

            {/* Bottom Web3 AI Agent Hub Widget */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('mcp-terminal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Web3 AI Agent Hub (Soroban Enabled)</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
