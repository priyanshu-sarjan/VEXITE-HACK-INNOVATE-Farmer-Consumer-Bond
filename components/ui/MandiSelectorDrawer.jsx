"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Snowflake, 
  Search, 
  Filter, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  Warehouse
} from 'lucide-react';
import mandiData from '@/data/mandiWarehouses.json';

export default function MandiSelectorDrawer({ selectedMandi, onSelectMandi }) {
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [coldStorageOnly, setColdStorageOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const districts = ['All', 'Bhopal', 'Gwalior', 'Indore', 'Delhi', 'Chennai'];

  const filteredMandis = useMemo(() => {
    return mandiData.filter((item) => {
      const matchDistrict = selectedDistrict === 'All' || item.district === selectedDistrict;
      const matchCold = !coldStorageOnly || item.hasColdStorage;
      const matchSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchDistrict && matchCold && matchSearch;
    });
  }, [selectedDistrict, coldStorageOnly, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 space-y-4">
      {/* Header Bar */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">50+ Verified Mandis & Cold Warehouses</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30">
                  {filteredMandis.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Click any mandi to load 3D spatial cold-chain model & geotagged transit telemetry
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all self-start md:self-auto"
          >
            <span>{isOpen ? 'Collapse Mandi Directory' : 'Expand Mandi Directory'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Controls & Search */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-2 border-t border-white/5"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* District Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-emerald-400" /> District:
                </span>
                {districts.map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setSelectedDistrict(dist)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedDistrict === dist
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5'
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>

              {/* Search & Toggle Group */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search mandi, category, type..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <button
                  onClick={() => setColdStorageOnly(!coldStorageOnly)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    coldStorageOnly
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-800/80 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Snowflake className={`w-3.5 h-3.5 ${coldStorageOnly ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>Cold Storage Only</span>
                </button>
              </div>
            </div>

            {/* Mandi Cards Horizontal Scroll Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {filteredMandis.map((mandi) => {
                const isSelected = selectedMandi?.id === mandi.id;

                return (
                  <motion.div
                    key={mandi.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onSelectMandi(mandi)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all space-y-2 relative overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-xl shadow-emerald-500/10'
                        : 'bg-slate-900/60 border-white/5 hover:border-white/20 hover:bg-slate-800/60'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-950 border border-white/5">
                        {mandi.id}
                      </span>
                      {mandi.hasColdStorage && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                          <Snowflake className="w-3 h-3" /> Cold Hub
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-white line-clamp-1">{mandi.name}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{mandi.district}, {mandi.state}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-white/5 text-slate-400">
                      <span>Type: <strong className="text-slate-200">{mandi.type}</strong></span>
                      <span className="text-emerald-400 font-bold">{mandi.capacityMT.toLocaleString()} MT</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Selected Mandi Active Details Bar */}
      {selectedMandi && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              {selectedMandi.id.split('-')[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">{selectedMandi.name}</h4>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900 text-emerald-400 border border-emerald-500/30">
                  {selectedMandi.type}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {selectedMandi.category} • Capacity: <strong className="text-emerald-400">{selectedMandi.capacityMT.toLocaleString()} MT</strong> • Coordinates: ({selectedMandi.lat.toFixed(4)}, {selectedMandi.lng.toFixed(4)})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                const el = document.getElementById('geo-transit-map');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>Locate on Geo Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
