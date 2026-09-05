"use client";

import React, { useState } from 'react';
import { 
  Box, 
  ShieldCheck, 
  Cpu, 
  MapPin, 
  Wallet, 
  Activity, 
  Sparkles,
  Zap,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ walletConnected, onConnectWallet, activeTab, setActiveTab }) {
  const [isHovered, setIsHovered] = useState(null);

  const navLinks = [
    { id: '3d-hub', label: '3D Spatial Hub', icon: Box },
    { id: 'telemetry', label: 'IoT Telemetry', icon: Activity },
    { id: 'route-ai', label: 'AI Heat-Bypass', icon: MapPin },
    { id: 'mcp-agent', label: 'Autonomous MCP', icon: Cpu },
    { id: 'smart-escrow', label: 'Web3 Escrow', icon: ShieldCheck },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
      {/* Brand Logo & SIH Tag */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pointer-events-auto flex items-center gap-3 glass-pill px-4 py-2 rounded-full border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/80"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-wide text-base">AgriFresh</span>
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SIH26033
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Govt. of India • DCA Cold-Chain</p>
        </div>
      </motion.div>

      {/* Floating Center Pill Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto hidden md:flex items-center gap-1 glass-pill px-2 py-1.5 rounded-full border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/70"
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;

          return (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                const el = document.getElementById(link.id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onMouseEnter={() => setIsHovered(link.id)}
              onMouseLeave={() => setIsHovered(null)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                isActive 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-teal-600/80 rounded-full border border-emerald-400/40"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="relative z-10">{link.label}</span>
            </button>
          );
        })}
      </motion.nav>

      {/* Wallet Connect & Status Tag */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pointer-events-auto flex items-center gap-3"
      >
        {/* Live ESP32 Status Tag */}
        <div className="hidden sm:flex items-center gap-2 glass-pill px-3 py-2 rounded-full border border-white/10 text-xs font-mono bg-slate-900/80">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-semibold text-[11px]">IoT Active</span>
        </div>

        {/* Web3 Connect Button */}
        <button
          onClick={onConnectWallet}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 shadow-xl border ${
            walletConnected
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-95 hover:shadow-emerald-500/25 border-emerald-400'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>
            {walletConnected ? '0x8F92...C42A (Verified)' : 'Connect Wallet'}
          </span>
        </button>
      </motion.div>
    </header>
  );
}
