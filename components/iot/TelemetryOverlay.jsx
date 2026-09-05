"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Wind, 
  Clock, 
  MapPin, 
  Radio, 
  Truck, 
  Battery, 
  Sparkles,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_NODES } from '@/lib/store';

// 3D Tilt Card Component
function TiltCard({ children, className = "" }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setRotateX(((y - centerY) / centerY) * -8);
    setRotateY(((x - centerX) / centerX) * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`glass-card rounded-2xl p-5 border border-white/10 transition-shadow duration-300 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function TelemetryOverlay({ activeNodeId, onSelectNode }) {
  const [nodes, setNodes] = useState(INITIAL_NODES);

  // Simulated ESP32 Real-Time Sensor Telemetry Stream Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          // Subtle realistic fluctuation
          const deltaTemp = (Math.random() - 0.5) * 0.1;
          const deltaRh = Math.floor((Math.random() - 0.5) * 2);
          const deltaEth = (Math.random() - 0.5) * 0.01;

          return {
            ...node,
            temp: +(node.temp + deltaTemp).toFixed(1),
            humidity: Math.min(99, Math.max(75, node.humidity + deltaRh)),
            ethylene: +(Math.max(0.05, node.ethylene + deltaEth)).toFixed(2),
            lastPing: 'Just now',
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  return (
    <section id="telemetry" className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>ESP32 Cellular/LoRaWAN Geo-Tagged Node Stream</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Real-Time Produce Shelf-Life Telemetry
          </h2>
        </div>

        {/* Node Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 glass-pill rounded-full border border-white/10 bg-slate-900/80">
          {nodes.map((node) => (
            <button
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeNode.id === node.id
                  ? 'bg-emerald-500 text-slate-950 shadow-lg font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{node.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Node Summary Banner */}
      <div className="p-4 rounded-2xl glass-panel border border-emerald-500/20 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400">Current Geo-Location:</span>
            <p className="text-white font-bold">{activeNode.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400">Crop Cargo:</span>
            <p className="text-emerald-400 font-bold">{activeNode.crop} ({activeNode.quantity})</p>
          </div>

          <div>
            <span className="text-slate-400">Gate-In Status:</span>
            <p className="text-blue-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeNode.gateInVerified ? 'Verified & Sealed' : 'En Route'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Interactive 3D Tilt Telemetry Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Internal Chamber Temp */}
        <TiltCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Internal Temperature</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {activeNode.temp}°C
            </span>
            <span className="text-xs text-emerald-400 font-mono font-semibold">Optimal</span>
          </div>
          <p className="text-xs text-slate-400">Target Range: 3.5°C - 4.5°C</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Compressor: Active</span>
            <span className="text-emerald-400 font-mono">PID Locked</span>
          </div>
        </TiltCard>

        {/* Card 2: Relative Humidity */}
        <TiltCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Relative Humidity</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {activeNode.humidity}%
            </span>
            <span className="text-xs text-blue-400 font-mono font-semibold">RH</span>
          </div>
          <p className="text-xs text-slate-400">Prevents Produce Moisture Loss</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ultrasonic Humidifier:</span>
            <span className="text-blue-400 font-mono">AUTO 90%</span>
          </div>
        </TiltCard>

        {/* Card 3: Ethylene Gas Sensor */}
        <TiltCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Ethylene Level</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {activeNode.ethylene}
            </span>
            <span className="text-xs text-cyan-400 font-mono font-semibold">PPM</span>
          </div>
          <p className="text-xs text-slate-400">Catalytic Scrubber Active</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ripening Acceleration:</span>
            <span className="text-cyan-400 font-mono">Inhibited</span>
          </div>
        </TiltCard>

        {/* Card 4: Kinetic Decay Shelf-Life Index */}
        <TiltCard className="border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Freshness Index</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-emerald-400 tracking-tight font-mono text-glow-emerald">
              {activeNode.shelfLifeIndex}%
            </span>
            <span className="text-xs text-emerald-300 font-mono font-semibold">Grade A+</span>
          </div>
          <p className="text-xs text-slate-400">Kinetic Decay Shelf-Life Algorithm</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Est. Remaining Shelf-Life:</span>
            <span className="text-emerald-400 font-mono font-bold">14.2 Days</span>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
