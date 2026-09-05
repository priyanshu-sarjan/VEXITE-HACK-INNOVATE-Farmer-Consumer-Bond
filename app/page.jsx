"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Box, 
  Activity, 
  MapPin, 
  Cpu, 
  ShieldCheck, 
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Camera,
  Mic,
  Scale
} from 'lucide-react';

import Navbar from '@/components/navbar/Navbar';
import InteractiveConfigurator from '@/components/ui/InteractiveConfigurator';
import TelemetryOverlay from '@/components/iot/TelemetryOverlay';
import RouteOptimizer from '@/components/logistics/RouteOptimizer';
import MCPAgentTerminal from '@/components/mcp/MCPAgentTerminal';
import SmartEscrow from '@/components/web3/SmartEscrow';

import ProduceGraderModal from '@/components/ai/ProduceGraderModal';
import VoiceNegotiatorModal from '@/components/ai/VoiceNegotiatorModal';
import DisputeArbiterCard from '@/components/ai/DisputeArbiterCard';
import FarmerVoiceAssistantWidget from '@/components/ai/FarmerVoiceAssistantWidget';
import AdminControlPanel from '@/components/admin/AdminControlPanel';

// Dynamically import Three.js 3D Canvas with ssr: false to prevent SSR hydration mismatch
const ColdHubCanvas = dynamic(() => import('@/components/canvas/ColdHubCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[82vh] rounded-3xl glass-panel flex flex-col items-center justify-center gap-3 border border-white/10">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-mono text-emerald-400">Initializing 3D Spatial Canvas & WebGL Shaders...</p>
    </div>
  ),
});

export default function Home() {
  const [activeTab, setActiveTab] = useState('3d-hub');
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeModel, setActiveModel] = useState('micro-hub');
  const [capacityLoad, setCapacityLoad] = useState(65);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState('NODE-01');

  // Admin Control Settings State
  const [chamberTemp, setChamberTemp] = useState(3.8);
  const [transitDuration, setTransitDuration] = useState(12);
  const [ethyleneThreshold, setEthyleneThreshold] = useState(0.14);
  const [pingInterval, setPingInterval] = useState(2);
  const [autoEscrowEnabled, setAutoEscrowEnabled] = useState(true);

  // Gemini AI Modals state
  const [isGraderOpen, setIsGraderOpen] = useState(false);
  const [isNegotiatorOpen, setIsNegotiatorOpen] = useState(false);

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  return (
    <div className="relative min-h-screen bg-[#121316] bg-grid-pattern overflow-hidden">
      {/* Floating Navbar */}
      <Navbar 
        walletConnected={walletConnected}
        onConnectWallet={handleConnectWallet}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Admin Supply Chain Control Dashboard Drawer */}
      <AdminControlPanel 
        chamberTemp={chamberTemp}
        onUpdateChamberTemp={setChamberTemp}
        transitDuration={transitDuration}
        onUpdateTransitDuration={setTransitDuration}
        ethyleneThreshold={ethyleneThreshold}
        onUpdateEthyleneThreshold={setEthyleneThreshold}
        pingInterval={pingInterval}
        onUpdatePingInterval={setPingInterval}
        autoEscrowEnabled={autoEscrowEnabled}
        onToggleAutoEscrow={() => setAutoEscrowEnabled(!autoEscrowEnabled)}
      />

      {/* Main Content Area */}
      <main className="pt-24 pb-32 space-y-16">
        
        {/* ---------------- 3D HERO SECTION ---------------- */}
        <section id="3d-hub" className="px-4 md:px-8 max-w-7xl mx-auto space-y-6">
          {/* Hero Titles */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-mono text-emerald-400 border border-emerald-500/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH 2026 Problem ID: SIH26033 • Best Use of Google Gemini API</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-white"
            >
              AgriFresh <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">3D Spatial Cold-Chain</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-slate-400 font-medium"
            >
              Powered by Google Gemini 2.5 Flash Multimodal Vision, Multilingual Voice Trade Contracts, Multi-Party Stakeholder Dispute Arbitration, and Admin Supply Chain Controls.
            </motion.p>

            {/* Quick Action Badges for Gemini Features */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsGraderOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all shadow-lg"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>📷 Gemini Vision Quality Grader</span>
              </button>

              <button
                onClick={() => setIsNegotiatorOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition-all shadow-lg"
              >
                <Mic className="w-4 h-4 text-teal-400" />
                <span>🎙️ Multilingual Voice Trade Negotiator</span>
              </button>
            </div>
          </div>

          {/* Interactive 3D Canvas Viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ColdHubCanvas 
              activeHotspot={selectedHotspot}
              onSelectHotspot={setSelectedHotspot}
              capacityLoad={capacityLoad}
            />
          </motion.div>
        </section>

        {/* Floating Spatial Configurator Drawer & Action Dock */}
        <InteractiveConfigurator 
          activeModel={activeModel}
          onSelectModel={setActiveModel}
          capacityLoad={capacityLoad}
          onUpdateCapacity={setCapacityLoad}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={setSelectedHotspot}
          onConnectWallet={handleConnectWallet}
          walletConnected={walletConnected}
        />

        {/* ---------------- IOT TELEMETRY OVERLAY ---------------- */}
        <TelemetryOverlay 
          activeNodeId={activeNodeId}
          onSelectNode={setActiveNodeId}
        />

        {/* ---------------- AI ROUTE OPTIMIZER ---------------- */}
        <RouteOptimizer />

        {/* ---------------- GEMINI MULTI-PARTY RESPONSIBILITY ARBITER ---------------- */}
        <DisputeArbiterCard />

        {/* ---------------- AUTONOMOUS MCP AGENT TERMINAL ---------------- */}
        <MCPAgentTerminal 
          onTriggerEscrow={() => {
            const el = document.getElementById('smart-escrow');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* ---------------- WEB3 SMART ESCROW ---------------- */}
        <SmartEscrow 
          walletConnected={walletConnected}
          onConnectWallet={handleConnectWallet}
        />

        {/* ---------------- DIRECT B2B MARKET LISTINGS ---------------- */}
        <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest">
                Direct Farmer-to-Consumer / B2B Bond Market
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                Verified Cold-Hub Produce Listings
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Nashik Thompson Seedless Grapes',
                fpo: 'Nashik Farmer Producer Co.',
                hub: 'Nashik Solar Hub A1',
                price: '₹78 / kg',
                qty: '8.5 MT Available',
                freshness: '97.4% Grade A+',
              },
              {
                title: 'Ratnagiri GI Alphonso Mangoes',
                fpo: 'Konkan Fruit Growers Society',
                hub: 'Reefer Transit MH-15-EV',
                price: '₹140 / kg',
                qty: '12.0 MT Available',
                freshness: '94.8% Grade A+',
              },
              {
                title: 'Nagpur Organic Kinnow Oranges',
                fpo: 'Vidarbha Agri Collective',
                hub: 'Azadpur Smart Cold Depot',
                price: '₹52 / kg',
                qty: '22.4 MT Available',
                freshness: '98.9% Grade A+',
              },
            ].map((item, idx) => (
              <div key={idx} className="glass-card rounded-3xl p-5 border border-white/10 space-y-4 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {item.freshness}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{item.price}</span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.fpo}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 text-xs font-mono text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cold Hub:</span>
                    <span className="text-white">{item.hub}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stock:</span>
                    <span className="text-emerald-400">{item.qty}</span>
                  </div>
                </div>

                <button
                  onClick={handleConnectWallet}
                  className="w-full py-2.5 rounded-2xl bg-slate-800 text-emerald-300 font-bold text-xs hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Reserve Batch via Smart Escrow</span>
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Floating Farmer Voice & Knowledge Assistant Widget (Bottom-Left Icon) */}
      <FarmerVoiceAssistantWidget 
        onOpenGrader={() => setIsGraderOpen(true)}
        onOpenNegotiator={() => setIsNegotiatorOpen(true)}
      />

      {/* Gemini Multimodal Vision Quality Grader Modal */}
      <ProduceGraderModal 
        isOpen={isGraderOpen}
        onClose={() => setIsGraderOpen(false)}
        onLockEscrow={() => {
          const el = document.getElementById('smart-escrow');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Multilingual Voice Negotiator Modal */}
      <VoiceNegotiatorModal 
        isOpen={isNegotiatorOpen}
        onClose={() => setIsNegotiatorOpen(false)}
        onContractGenerated={() => {
          const el = document.getElementById('smart-escrow');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center font-mono text-xs text-slate-500 bg-slate-950">
        <p>AgriFresh 3D Spatial Platform • SIH 2026 Problem Statement ID: SIH26033</p>
        <p className="mt-1 text-[11px] text-slate-600">Ministry of Consumer Affairs, Food & Public Distribution — Best Use of Google Gemini API</p>
      </footer>
    </div>
  );
}
