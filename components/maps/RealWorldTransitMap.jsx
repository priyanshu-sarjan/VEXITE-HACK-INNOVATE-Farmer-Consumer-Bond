"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import mandiData from '@/data/mandiWarehouses.json';

// Default origin FPO farm node
const ORIGIN_FPO = {
  id: 'FPO-NASHIK',
  name: 'Nashik Grape & Vegetable FPO Farm',
  district: 'Nashik',
  state: 'Madhya Pradesh',
  type: 'FPO Farm',
  category: 'Origin Hub',
  lat: 20.0059,
  lng: 73.7898,
  hasColdStorage: true,
  capacityMT: 10000
};

export default function RealWorldTransitMap({ selectedMandi, onSelectMandi }) {
  const [progress, setProgress] = useState(0.35); // 0 to 1 along route
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [districtFilter, setDistrictFilter] = useState('All');
  const [hoveredMandi, setHoveredMandi] = useState(null);

  // Active target mandi destination (defaults to BPL-001 or prop)
  const activeDestination = selectedMandi || mandiData[0];

  // Filter dataset mandis for map display
  const mapMandis = useMemo(() => {
    if (districtFilter === 'All') return mandiData;
    return mandiData.filter(m => m.district === districtFilter);
  }, [districtFilter]);

  // Smooth transit animation timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) return 0; // loop transit
        return prev + 0.006 * speedMultiplier;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Calculate coordinates along route from ORIGIN_FPO to activeDestination
  const currentPos = useMemo(() => {
    const startLat = ORIGIN_FPO.lat;
    const startLng = ORIGIN_FPO.lng;
    const endLat = activeDestination.lat;
    const endLng = activeDestination.lng;

    // Intermediate waypoint for realistic curved routing
    const midLat = (startLat + endLat) / 2 + 0.2;
    const midLng = (startLng + endLng) / 2 - 0.15;

    let lat, lng;
    if (progress <= 0.5) {
      const t = progress * 2;
      lat = startLat + (midLat - startLat) * t;
      lng = startLng + (midLng - startLng) * t;
    } else {
      const t = (progress - 0.5) * 2;
      lat = midLat + (endLat - midLat) * t;
      lng = midLng + (endLng - midLng) * t;
    }

    return { lat: +lat.toFixed(4), lng: +lng.toFixed(4) };
  }, [progress, activeDestination]);

  // Map SVG coordinate projection for India coordinates (Bounding box: Lat 12° to 30° N, Lng 72° to 82° E)
  const projectToSVG = (lat, lng) => {
    const minLat = 12.0, maxLat = 29.5;
    const minLng = 72.0, maxLng = 82.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * 900 + 40;
    const y = 520 - ((lat - minLat) / (maxLat - minLat)) * 480;

    return { x: +x.toFixed(1), y: +y.toFixed(1) };
  };

  const svgOriginPos = projectToSVG(ORIGIN_FPO.lat, ORIGIN_FPO.lng);
  const svgDestPos = projectToSVG(activeDestination.lat, activeDestination.lng);
  const svgTruckPos = projectToSVG(currentPos.lat, currentPos.lng);

  // Curved route polyline
  const midLat = (ORIGIN_FPO.lat + activeDestination.lat) / 2 + 0.2;
  const midLng = (ORIGIN_FPO.lng + activeDestination.lng) / 2 - 0.15;
  const svgMidPos = projectToSVG(midLat, midLng);

  const routePathD = `M ${svgOriginPos.x} ${svgOriginPos.y} Q ${svgMidPos.x} ${svgMidPos.y} ${svgDestPos.x} ${svgDestPos.y}`;

  // Distance estimation in KM (Haversine formula)
  const estimatedDistKm = useMemo(() => {
    const R = 6371; // Earth radius km
    const dLat = (activeDestination.lat - ORIGIN_FPO.lat) * (Math.PI / 180);
    const dLng = (activeDestination.lng - ORIGIN_FPO.lng) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(ORIGIN_FPO.lat * (Math.PI / 180)) * Math.cos(activeDestination.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 1.25); // including road curvature factor
  }, [activeDestination]);

  return (
    <section id="geo-transit-map" className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>50+ Geotagged Agricultural Mandis & Real-World Transit Tracker</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Live Geo-Tagged Map & Multi-Mandi Transit Corridor
          </h2>
        </div>

        {/* Controls & District Quick Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 glass-pill rounded-full p-1 border border-white/10 bg-slate-900/80 text-xs font-mono">
            {['All', 'Bhopal', 'Gwalior', 'Indore', 'Delhi', 'Chennai'].map((d) => (
              <button
                key={d}
                onClick={() => setDistrictFilter(d)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  districtFilter === d
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 p-1.5 glass-pill rounded-full border border-white/10 bg-slate-900/80 font-mono text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => setProgress(0)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="Reset Transit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Real-World Vector Map Canvas */}
      <div className="relative w-full h-[580px] rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden bg-[#0a0c0f]">
        {/* Top Floating Telemetry Status Badge */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-3 glass-pill px-4 py-2 rounded-full border border-white/10 text-xs font-mono bg-slate-900/90 shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white font-bold">Truck MH-15-EV</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-bold">GPS: {currentPos.lat}° N, {currentPos.lng}° E</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-300 font-bold">Target: {activeDestination.name} ({estimatedDistKm} km)</span>
        </div>

        {/* SVG Vector Map Canvas */}
        <svg className="w-full h-full absolute inset-0 z-10">
          {/* Active Curved Transit Route Path */}
          <path
            d={routePathD}
            fill="none"
            stroke="#1e293b"
            strokeWidth="6"
            strokeLinecap="round"
          />

          <path
            d={routePathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="8 4"
            strokeLinecap="round"
            className="animate-shimmer"
          />

          {/* Render Origin FPO Marker */}
          <g transform={`translate(${svgOriginPos.x}, ${svgOriginPos.y})`} className="cursor-pointer">
            <circle r="14" fill="rgba(245, 158, 11, 0.2)" className="animate-ping" />
            <circle r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            <text x="12" y="4" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" className="drop-shadow-md">
              ORIGIN: Nashik FPO Farm
            </text>
          </g>

          {/* Render 50+ Mandi Pins */}
          {mapMandis.map((mandi) => {
            const { x, y } = projectToSVG(mandi.lat, mandi.lng);
            const isSelected = activeDestination.id === mandi.id;

            return (
              <g
                key={mandi.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer"
                onClick={() => onSelectMandi(mandi)}
                onMouseEnter={() => setHoveredMandi(mandi)}
                onMouseLeave={() => setHoveredMandi(null)}
              >
                {/* Outer Glow for Selected Mandi */}
                {isSelected && (
                  <circle r="18" fill="rgba(16, 185, 129, 0.3)" className="animate-ping" />
                )}

                {/* Mandi Pin Circle */}
                <circle
                  r={isSelected ? 9 : mandi.hasColdStorage ? 6 : 4.5}
                  fill={isSelected ? '#10b981' : mandi.hasColdStorage ? '#06b6d4' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />

                {/* Mandi Name Label (Always shown for selected or on hover) */}
                {(isSelected || hoveredMandi?.id === mandi.id) && (
                  <g transform="translate(12, -4)">
                    <rect
                      x="-4"
                      y="-12"
                      width={mandi.name.length * 6.5 + 20}
                      height="20"
                      rx="6"
                      fill="#0f172a"
                      stroke={isSelected ? '#10b981' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x="4"
                      y="2"
                      fill={isSelected ? '#34d399' : '#f1f5f9'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {mandi.id}: {mandi.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Moving Transit Truck Marker */}
          <g transform={`translate(${svgTruckPos.x}, ${svgTruckPos.y})`} className="transition-transform duration-100 ease-linear pointer-events-none">
            <circle r="20" fill="rgba(16, 185, 129, 0.3)" className="animate-ping" />
            <circle r="12" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <g transform="translate(-7, -7) scale(0.6)">
              <Truck className="w-6 h-6 text-slate-950 stroke-[3]" />
            </g>
          </g>
        </svg>

        {/* Floating Active Mandi Details Card (Bottom Right Overlay) */}
        <div className="absolute bottom-4 right-4 z-20 w-80 md:w-96 rounded-2xl glass-panel p-4 border border-emerald-500/30 shadow-2xl bg-slate-950/95 text-xs font-mono space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-bold line-clamp-1">{activeDestination.name}</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              {activeDestination.id}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-900 border border-white/5 space-y-0.5">
              <span className="text-slate-400 text-[10px]">District & State:</span>
              <p className="text-white font-bold">{activeDestination.district}, {activeDestination.state}</p>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-white/5 space-y-0.5">
              <span className="text-slate-400 text-[10px]">Total Capacity:</span>
              <p className="text-emerald-400 font-bold">{activeDestination.capacityMT.toLocaleString()} MT</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Cold Chain Infrastructure:</span>
              {activeDestination.hasColdStorage ? (
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Snowflake className="w-3 h-3" /> Active Solar Cold Hub
                </span>
              ) : (
                <span className="text-amber-400 font-bold">Standard Grain Storage</span>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="text-slate-400">Geotag Coordinates:</span>
              <span className="text-white font-bold">{activeDestination.lat}° N, {activeDestination.lng}° E</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-slate-400">Estimated Transit Distance:</span>
            <span className="text-emerald-400 font-bold">{estimatedDistKm} km (~{Math.round(estimatedDistKm / 55)} hrs)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
