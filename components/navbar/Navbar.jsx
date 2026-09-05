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
  Navigation
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ walletConnected, onConnectWallet, activeTab, setActiveTab }) {
  const [isHovered, setIsHovered] = useState(null);

  const navLinks = [
    { id: '3d-hub', label: '3D Spatial Hub', icon: Box },
    { id: 'real-world-map', label: 'Real-World Transit', icon: Navigation },
    { id: 'telemetry', label: 'IoT Telemetry', icon: Activity },
    { id: 'route-ai', label: 'AI Heat-Bypass', icon: MapPin },
    { id: 'mcp-agent', label: 'Autonomous MCP', icon: Cpu },
    { id: 'smart-escrow', label: 'Web3 Escrow', icon: ShieldCheck },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6 max-w-7xl mx-auto pointer-events-none">
      {/* Main Unified Header Glass Frame */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto w-full p-2 md:p-2.5 rounded-full glass-panel border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/90 flex items-center justify-between gap-3"
      >
        {/* Brand Logo & SIH Tag Frame */}
        <div className="flex items-center gap-3 pl-2">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-wide text-xs md:text-sm">AgriFresh</span>
              <span className="text-[9px] md:text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SIH26033
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-400 font-medium">Govt. of India • DCA Cold-Chain</p>
          </div>
        </div>

        {/* Center Pill Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-full border border-white/5">
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
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
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
        </nav>

        {/* Right Section: IoT Status & Framed Web3 Wallet Button */}
        <div className="flex items-center gap-2 pr-1">
          {/* Live ESP32 Status Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono bg-slate-950/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-semibold text-[10px]">IoT Active</span>
          </div>

          {/* Web3 Wallet Button Framed inside Header */}
          <div className="p-0.5 rounded-full bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-500/40">
            <button
              onClick={onConnectWallet}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shadow-md ${
                walletConnected
                  ? 'bg-slate-950 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:brightness-110'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-mono text-xs whitespace-nowrap">
                {walletConnected ? '0x8F92...C42A (Verified)' : 'Connect Wallet'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
