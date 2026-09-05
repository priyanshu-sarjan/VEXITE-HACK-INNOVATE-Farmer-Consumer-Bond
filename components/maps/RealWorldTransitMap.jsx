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
  Cpu,
  Flame,
  Globe
} from 'lucide-react';
import mandiData from '@/data/mandiWarehouses.json';
import realSpicesData from '@/data/realDistrictSpicesData.json';

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
  const [activeLayer, setActiveLayer] = useState('DISTRICTS'); // 'DISTRICTS' | 'MANDIS' | 'ALL'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, OVERPRODUCING, STANDARD
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'spices' | 'global'
  
  // Selected District state (defaults to Ariyalur - Peak Overproducer)
  const [selectedDistrict, setSelectedDistrict] = useState(realSpicesData.districts[0]);

  // Combined Active Selected Item
  const activeLocation = selectedMandi || selectedDistrict;

  // Handle location click on map
  const handleSelectLocation = (item) => {
    if (item.district && item.productivity) {
      setSelectedDistrict(item);
    } else if (onSelectMandi) {
      onSelectMandi(item);
    }
  };

  return (
    <section id="geo-transit-map" className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-6 font-mono">
      
      {/* 1. AYUTRACE GIS Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 space-y-4 shadow-2xl bg-slate-900/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                AYUTRACE Geotagged Agricultural GIS & Overproduction Map
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                ● Live Real-World Dataset
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Real-Time District Overproduction & Crop Spices GIS Layer
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5 shadow-md">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              31 Geotagged Districts (CSV Real Data)
            </span>
            <span className="px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-1.5 shadow-md">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              50+ Mandi & Warehouse GIS
            </span>
          </div>
        </div>

        {/* 2. Top Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-bold">Total Area Analyzed</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-white">198,990 <span className="text-xs text-slate-400">Ha</span></p>
            <span className="text-[10px] text-slate-400">31 Tamil Nadu Districts CSV</span>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-rose-400">
              <span className="uppercase tracking-wider font-bold">Overproducing Clusters</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-extrabold text-rose-300">13 <span className="text-xs text-rose-400">Districts</span></p>
            <span className="text-[10px] text-rose-400 font-bold">Yield &gt; 25.0 T/Ha (Price Crash Warning)</span>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-bold">State Avg Productivity</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-extrabold text-cyan-300">21.44 <span className="text-xs text-slate-400">T/Ha</span></p>
            <span className="text-[10px] text-emerald-400 font-bold">Total Output: 4,266,642 Tonnes</span>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-400">
              <span className="uppercase tracking-wider font-bold">Peak Overproducer</span>
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-lg font-extrabold text-amber-300 line-clamp-1">{selectedDistrict.district}</p>
            <span className="text-[10px] text-amber-400 font-bold">{selectedDistrict.productivity} T/Ha ({selectedDistrict.areaHa.toLocaleString()} Ha)</span>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Leaflet India Map (Left) & District Analytics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Leaflet Map Container (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Map Filters & Layer Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-white/10 bg-slate-900/80 text-xs">
            
            {/* Layer Selection */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-white/10">
              <button
                onClick={() => setActiveLayer('DISTRICTS')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] flex items-center gap-1 ${
                  activeLayer === 'DISTRICTS' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🌶️ 31 Districts</span>
              </button>
              <button
                onClick={() => setActiveLayer('MANDIS')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] flex items-center gap-1 ${
                  activeLayer === 'MANDIS' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📦 Mandis & Warehouses</span>
              </button>
              <button
                onClick={() => setActiveLayer('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] flex items-center gap-1 ${
                  activeLayer === 'ALL' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🌐 All GIS</span>
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all text-[11px] ${
                  filterType === 'ALL' ? 'bg-slate-800 text-white border border-white/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('OVERPRODUCING')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all text-[11px] ${
                  filterType === 'OVERPRODUCING' ? 'bg-rose-500 text-white shadow-md' : 'text-rose-400 hover:text-white'
                }`}
              >
                Surplus (&gt;25 T/Ha)
              </button>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district or crop..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Leaflet Map Frame */}
          <div className="relative w-full h-[520px] rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden">
            <LeafletMapContainer 
              mandiData={mandiData}
              districtData={realSpicesData.districts}
              selectedLocation={selectedDistrict}
              onSelectLocation={handleSelectLocation}
              filterType={filterType}
              searchQuery={searchQuery}
              activeLayer={activeLayer}
            />
          </div>
        </div>

        {/* Right Column: Geotagged District Data & CSV Analytics Panel (1 col) */}
        <div className="space-y-4">
          <div className="rounded-3xl glass-panel p-5 border border-emerald-500/30 bg-slate-900/90 space-y-4 text-xs shadow-2xl max-h-[580px] overflow-y-auto">
            
            {/* Header */}
            <div className="space-y-1 border-b border-white/10 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {selectedDistrict.district} District
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${
                  selectedDistrict.isOverproducing 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {selectedDistrict.isOverproducing ? 'SURPLUS HIGH YIELD' : 'BALANCED HARVEST'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                State: <strong className="text-slate-200">{selectedDistrict.state}</strong> | Geotagged Real CSV Data
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/5 text-[11px]">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'overview' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                District Overview
              </button>
              <button
                onClick={() => setActiveTab('spices')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'spices' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Spices (Tab 9.4)
              </button>
              <button
                onClick={() => setActiveTab('global')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'global' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Global Share
              </button>
            </div>

            {/* Tab 1: District Geotagged Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* 3 Metric Box */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase">Cultivated Area</span>
                    <p className="font-extrabold text-sm text-white">{selectedDistrict.areaHa.toLocaleString()} Ha</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase">Production</span>
                    <p className="font-extrabold text-sm text-white">{selectedDistrict.productionTonnes.toLocaleString()} T</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase">Productivity</span>
                    <p className={`font-extrabold text-sm ${selectedDistrict.productivity > 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {selectedDistrict.productivity} T/Ha
                    </p>
                  </div>
                </div>

                {/* Major Spices Grown */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-bold block">Major Spices & Crops Cultivated:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDistrict.majorSpices.map((spice, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                        🌱 {spice}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Risk Warning Box */}
                <div className={`p-3 rounded-2xl border space-y-1 text-[11px] ${
                  selectedDistrict.isOverproducing
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Mandi Price Crash Risk
                    </span>
                    <span>{selectedDistrict.priceCrashRiskPercent}% Risk</span>
                  </div>
                  <p className="text-[10px] opacity-90 leading-relaxed">
                    {selectedDistrict.isOverproducing
                      ? `Productivity (${selectedDistrict.productivity} T/Ha) exceeds regional average (21.44 T/Ha) by ${((selectedDistrict.productivity - 21.44) / 21.44 * 100).toFixed(1)}%. Recommend AI crop rotation to prevent market glut.`
                      : `Production is balanced. Recommend direct farm-to-consumer contracts for high profit margin.`
                    }
                  </p>
                </div>

                {/* Quick Selection List for all 31 Districts */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-bold text-slate-300 block">Select District from Geotagged Dataset:</span>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {realSpicesData.districts.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDistrict(d)}
                        className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedDistrict.id === d.id
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950/60 border-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <span className="font-bold text-[11px]">{d.district}</span>
                        <span className="text-[10px] text-slate-400">{d.productivity} T/Ha</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: National Spices Production Trend */}
            {activeTab === 'spices' && (
              <div className="space-y-3">
                <span className="text-[11px] text-slate-300 font-bold block">
                  National Spices Production & Productivity Abstract:
                </span>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {realSpicesData.nationalSpicesTimeSeries.map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-400">🌶️ {s.spice}</span>
                        <span className="text-white">{s.production2014}k Tonnes</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Area: {s.area2014}k Ha</span>
                        <span>Productivity: <strong className="text-cyan-300">{s.productivity2014} T/Ha</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Global Production Share */}
            {activeTab === 'global' && (
              <div className="space-y-3">
                <span className="text-[11px] text-slate-300 font-bold block flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-400" /> Global Horticulture Share (Tonnes):
                </span>

                <div className="space-y-2">
                  {realSpicesData.globalFruitVegShare.map((g, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                      <div className="flex justify-between font-bold text-xs">
                        <span className="text-white">{g.country}</span>
                        <span className="text-emerald-400">{g.vegProdTonnes.toLocaleString()} T (Veg)</span>
                      </div>
                      {g.fruitProdTonnes > 0 && (
                        <p className="text-[10px] text-cyan-300 text-right">Fruit Output: {g.fruitProdTonnes.toLocaleString()} Tonnes</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom AI Hub Navigation */}
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

