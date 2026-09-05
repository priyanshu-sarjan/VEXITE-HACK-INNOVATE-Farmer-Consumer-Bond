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
  Scale,
  UserCheck
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
import RealWorldTransitMap from '@/components/maps/RealWorldTransitMap';
import RoleAuthModal from '@/components/auth/RoleAuthModal';
import MandiSelectorDrawer from '@/components/ui/MandiSelectorDrawer';
import mandiData from '@/data/mandiWarehouses.json';
import FarmerPortal from '@/components/dashboard/FarmerPortal';
import MarketplaceView from '@/components/dashboard/MarketplaceView';
import LiveTelemetryStream from '@/components/iot/LiveTelemetryStream';

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

  // Selected Mandi/Warehouse State from 50+ Mandi Dataset
  const [selectedMandi, setSelectedMandi] = useState(mandiData[0]);

  // Role-Based Auth User State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Ramesh Patil',
    role: 'FARMER',
    location: 'Nashik, MH',
    businessName: 'Nashik Grape Producers Co-op',
  });

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
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthOpen(true)}
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
        
        {/* ---------------- 3D HERO SECTION & MANDI DIRECTORY ---------------- */}
        <section id="3d-hub" className="px-4 md:px-8 max-w-7xl mx-auto space-y-6">
          {/* Hero Titles */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-mono text-emerald-400 border border-emerald-500/30"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Logged in as: <strong className="text-white">{userProfile.name}</strong> ({userProfile.role}) • {userProfile.location}</span>
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
              {userProfile.role === 'FARMER' && "Farmer Portal: Camera Produce Grading, Voice Trade Negotiator, Solar Micro-Cold Storage & Escrow Advances."}
              {userProfile.role === 'TRADER' && "Trader Portal: Direct B2B Bulk Purchasing, Real-World Transit Tracking & Multi-Party Quality Audits."}
              {userProfile.role === 'CONSUMER' && "Consumer Portal: Farm-to-Fork Traceability, Certified Freshness Index & Direct Farm Orders."}
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

              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all shadow-lg"
              >
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Switch Access Role ({userProfile.role})</span>
              </button>
            </div>
          </div>

          {/* Interactive 50+ Mandi & Warehouse Directory Drawer */}
          <MandiSelectorDrawer 
            selectedMandi={selectedMandi}
            onSelectMandi={setSelectedMandi}
          />

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
              selectedMandi={selectedMandi}
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

        {/* ---------------- REAL-WORLD GEO-TAGGED MAP & FLEET TRACKER ---------------- */}
        <RealWorldTransitMap 
          selectedMandi={selectedMandi}
          onSelectMandi={setSelectedMandi}
        />

        {/* ---------------- FARMER PORTAL & HARVEST LISTER (FARMER ROLE) ---------------- */}
        {userProfile.role === 'FARMER' && (
          <FarmerPortal 
            userProfile={userProfile}
            onLockEscrow={() => {
              const el = document.getElementById('smart-escrow');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* ---------------- DIRECT B2B / B2C MARKETPLACE ---------------- */}
        <MarketplaceView 
          userProfile={userProfile}
          onLockEscrow={() => {
            const el = document.getElementById('smart-escrow');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* ---------------- REAL-TIME SUPABASE IOT TELEMETRY STREAM ---------------- */}
        <LiveTelemetryStream />

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

      </main>

      {/* Auth Identity Modal */}
      <RoleAuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userProfile={userProfile}
        onAuthenticate={(profile) => setUserProfile(profile)}
      />

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
