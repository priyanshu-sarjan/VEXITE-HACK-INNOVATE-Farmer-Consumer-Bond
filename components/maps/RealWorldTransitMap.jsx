"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles
} from 'lucide-react';

// Real-world route waypoints (Nashik to Mumbai Vashi Mandi)
const ROUTE_POINTS = [
  { id: 'POINT-A', name: 'Location A: Nashik Solar FPO Hub', lat: 20.0059, lng: 73.7898, type: 'ORIGIN', desc: 'Harvest Loaded & Solar Pre-Cooled' },
  { id: 'POINT-1', name: 'Igatpuri Solar Pre-Cooling Relay', lat: 19.6952, lng: 73.5604, type: 'RELAY', desc: 'Battery Recharge & Ethylene Scrubbing' },
  { id: 'POINT-2', name: 'Thane High-Heat Bypass Corridor', lat: 19.2183, lng: 72.9781, type: 'WARNING', desc: 'High Ambient Temp (+38.2°C) Avoidance' },
  { id: 'POINT-B', name: 'Location B: Mumbai Vashi APMC Mandi', lat: 19.0760, lng: 72.8777, type: 'DESTINATION', desc: 'Direct B2B Gate-In & Escrow Payout' },
];

export default function RealWorldTransitMap() {
  const [progress, setProgress] = useState(0.25); // 0 to 1 along route
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState(ROUTE_POINTS[0]);

  // Smooth transit animation timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) return 0; // loop transit
        return prev + 0.005 * speedMultiplier;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Interpolate current latitude & longitude along route points
  const getCurrentPosition = (t) => {
    const totalSegments = ROUTE_POINTS.length - 1;
    const scaledT = t * totalSegments;
    const index = Math.min(Math.floor(scaledT), totalSegments - 1);
    const segmentT = scaledT - index;

    const p1 = ROUTE_POINTS[index];
    const p2 = ROUTE_POINTS[index + 1];

    const lat = p1.lat + (p2.lat - p1.lat) * segmentT;
    const lng = p1.lng + (p2.lng - p1.lng) * segmentT;

    return { lat: +lat.toFixed(4), lng: +lng.toFixed(4), currentSegment: index };
  };

  const currentPos = getCurrentPosition(progress);

  // Map SVG Coordinate projection helpers for visual rendering
  const projectToSVG = (lat, lng) => {
    // Map bounding box: Lat 18.9° to 20.2° N, Lng 72.7° to 74.0° E
    const minLat = 18.9, maxLat = 20.2;
    const minLng = 72.7, maxLng = 74.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = 500 - ((lat - minLat) / (maxLat - minLat)) * 500;

    return { x: +x.toFixed(1), y: +y.toFixed(1) };
  };

  const svgTruckPos = projectToSVG(currentPos.lat, currentPos.lng);
  const svgWaypoints = ROUTE_POINTS.map(p => ({ ...p, ...projectToSVG(p.lat, p.lng) }));

  // Generate SVG polyline path
  const svgPathD = svgWaypoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  return (
    <section id="real-world-map" className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Geo-Tagged Real-World Transit & Fleet Tracker</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Live Geo-Tagged Route: Location A → Location B
          </h2>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-2 p-1.5 glass-pill rounded-full border border-white/10 bg-slate-900/80 font-mono text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Simulation' : 'Play Transit'}</span>
          </button>

          <button
            onClick={() => setProgress(0)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Reset Route"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            <span className="text-slate-400 text-[10px]">Speed:</span>
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  speedMultiplier === s ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Real-World Vector Map Canvas */}
      <div className="relative w-full h-[520px] rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden bg-[#0d0f12]">
        {/* Real-World Map Background Grid & Vector Topography */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {/* Top Floating Telemetry Status Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-3 glass-pill px-4 py-2 rounded-full border border-white/10 text-xs font-mono bg-slate-900/80">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white font-bold">Truck MH-15-EV</span>
          <span className="text-slate-400">|</span>
          <span className="text-emerald-400">GPS: {currentPos.lat}° N, {currentPos.lng}° E</span>
          <span className="text-slate-400">|</span>
          <span className="text-amber-300 font-bold">Speed: 62 km/h</span>
        </div>

        {/* SVG Vector Map Canvas */}
        <svg className="w-full h-full absolute inset-0 z-10">
          {/* Animated Route Polyline Path */}
          <path
            d={svgPathD}
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Glowing Polyline Path */}
          <path
            d={svgPathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="8 4"
            strokeLinecap="round"
            className="animate-shimmer"
          />

          {/* Waypoint Connection Nodes */}
          {svgWaypoints.map((pt) => {
            const isSelected = selectedPoint.id === pt.id;
            return (
              <g key={pt.id} className="cursor-pointer" onClick={() => setSelectedPoint(pt)}>
                {/* Outer Glow Halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 16 : 10}
                  fill={pt.type === 'WARNING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
                  className="animate-pulse"
                />

                {/* Waypoint Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={6}
                  fill={pt.type === 'WARNING' ? '#f59e0b' : pt.type === 'DESTINATION' ? '#06b6d4' : '#10b981'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Waypoint Label */}
                <text
                  x={pt.x + 12}
                  y={pt.y + 4}
                  fill="#f3f4f6"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow-md"
                >
                  {pt.name}
                </text>
              </g>
            );
          })}

          {/* Animated Moving Truck Marker */}
          <g transform={`translate(${svgTruckPos.x}, ${svgTruckPos.y})`} className="transition-transform duration-100 ease-linear">
            {/* Pulsing Beacon Halo */}
            <circle r="22" fill="rgba(16, 185, 129, 0.25)" className="animate-ping" />
            <circle r="14" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

            {/* Truck Icon Graphic */}
            <g transform="translate(-8, -8) scale(0.65)">
              <Truck className="w-6 h-6 text-slate-950 stroke-[3]" />
            </g>
          </g>
        </svg>

        {/* Floating Interactive Waypoint Diagnostic Panel (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 w-80 rounded-2xl glass-panel p-4 border border-white/10 shadow-2xl bg-slate-900/90 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {selectedPoint.name}
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold">
              {selectedPoint.type}
            </span>
          </div>

          <p className="text-slate-300 text-[11px]">{selectedPoint.desc}</p>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span>Coordinates:</span>
            <span className="text-white font-bold">{selectedPoint.lat}° N, {selectedPoint.lng}° E</span>
          </div>
        </div>
      </div>
    </section>
  );
}
