"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Html, 
  Float, 
  ContactShadows, 
  Environment,
  Text
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Thermometer, 
  Sun, 
  Wind, 
  ShieldCheck, 
  Activity, 
  Zap,
  Maximize2
} from 'lucide-react';

// Custom Mouse Parallax Camera Controller
function ParallaxCamera({ activeHotspot }) {
  const cameraRef = useRef();

  useFrame((state) => {
    if (!cameraRef.current) return;
    
    // Target base position
    let targetX = state.pointer.x * 1.5;
    let targetY = 3.5 + state.pointer.y * 0.8;
    let targetZ = 10;

    // Shift camera slightly when focusing a hotspot
    if (activeHotspot === 'chamber') {
      targetX = -2; targetY = 2.5; targetZ = 7;
    } else if (activeHotspot === 'solar') {
      targetX = 1; targetY = 5.5; targetZ = 8;
    } else if (activeHotspot === 'ethylene') {
      targetX = 2.5; targetY = 2; targetZ = 7;
    } else if (activeHotspot === 'gate-in') {
      targetX = -3.5; targetY = 2; targetZ = 6;
    }

    // Smooth Lerp Camera Position
    cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, targetX, 0.04);
    cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, 0.04);
    cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.04);

    cameraRef.current.lookAt(0, 1.2, 0);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 3.5, 10]}
      fov={45}
    />
  );
}

// Animated HVAC Cooling Fan
function FanBlades() {
  const fanRef = useRef();
  useFrame((_, delta) => {
    if (fanRef.current) fanRef.current.rotation.z += delta * 8;
  });

  return (
    <group ref={fanRef} position={[2.82, 1.8, 0]}>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.04, 0.9, 0.12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, Math.PI / 3]}>
        <boxGeometry args={[0.04, 0.9, 0.12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, -Math.PI / 3]}>
        <boxGeometry args={[0.04, 0.9, 0.12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
    </group>
  );
}

// Procedural Solar Micro-Cold Hub 3D Model
function SolarColdHubModel({ activeHotspot, onSelectHotspot, capacityLoad }) {
  const hubRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Gentle Spring Wobble on Mouse Hover
  useFrame((state) => {
    if (!hubRef.current) return;
    const t = state.clock.getElapsedTime();
    hubRef.current.rotation.y = THREE.MathUtils.lerp(
      hubRef.current.rotation.y, 
      Math.sin(t * 0.5) * 0.05 + (state.pointer.x * 0.1), 
      0.05
    );
  });

  return (
    <group 
      ref={hubRef} 
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Container Main Shell */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 2.6, 2.6]} />
        <meshStandardMaterial 
          color="#1e293b" 
          roughness={0.3} 
          metalness={0.7} 
        />
      </mesh>

      {/* Outer Insulated Ribs */}
      {[-2.2, -1.3, -0.4, 0.5, 1.4].map((xPos, idx) => (
        <mesh key={idx} position={[xPos, 1.6, 0]}>
          <boxGeometry args={[0.12, 2.65, 2.65]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Front Cold Hub Glass Inspection Window */}
      <mesh position={[-2.61, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.2, 2.0]} />
        <meshPhysicalMaterial 
          color="#06b6d4" 
          transmission={0.85} 
          opacity={1} 
          transparent 
          roughness={0.1}
          ior={1.5}
        />
      </mesh>

      {/* Internal Crate Mockup inside glass */}
      <mesh position={[-1.8, 1.0, 0]}>
        <boxGeometry args={[1.2, 1.2 * (capacityLoad / 100), 1.8]} />
        <meshStandardMaterial color="#10b981" roughness={0.6} transparent opacity={0.7} />
      </mesh>

      {/* Solar Panel Roof Array */}
      <group position={[0, 3.0, 0]}>
        {/* Frame */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[4.8, 0.1, 2.4]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>

        {/* Solar Cells Grid */}
        {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
          <mesh key={i} position={[x, 0.06, 0]}>
            <boxGeometry args={[1.0, 0.02, 2.2]} />
            <meshStandardMaterial 
              color="#1e3a8a" 
              metalness={0.95} 
              roughness={0.1} 
              emissive="#1d4ed8" 
              emissiveIntensity={0.2} 
            />
          </mesh>
        ))}
      </group>

      {/* External HVAC Compressor & Condenser */}
      <group position={[2.7, 1.6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 2.0, 1.8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        {/* Fan Grille */}
        <mesh position={[0.26, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.02, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        
        {/* Rotating Blades */}
        <FanBlades />

        {/* LED Status Light */}
        <mesh position={[0.26, 0.8, 0.6]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* ----------------- 3D INTERACTIVE HOTSPOTS ----------------- */}

      {/* Hotspot 1: Chamber Interior */}
      <group position={[-1.8, 2.2, 1.35]}>
        <Html distanceFactor={12} position={[0, 0, 0]}>
          <button
            onClick={() => onSelectHotspot('chamber')}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-md text-xs font-semibold ${
              activeHotspot === 'chamber'
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/40 scale-110'
                : 'bg-slate-900/80 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <Thermometer className="w-3.5 h-3.5" />
            <span>3.8°C / 91% RH</span>
          </button>
        </Html>
      </group>

      {/* Hotspot 2: Solar PV Roof */}
      <group position={[0, 3.4, 0]}>
        <Html distanceFactor={12} position={[0, 0, 0]}>
          <button
            onClick={() => onSelectHotspot('solar')}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-md text-xs font-semibold ${
              activeHotspot === 'solar'
                ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-lg shadow-amber-500/40 scale-110'
                : 'bg-slate-900/80 text-amber-400 border-amber-500/40 hover:bg-amber-500/20'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
            <span>Solar: 3.2 kW (98%)</span>
          </button>
        </Html>
      </group>

      {/* Hotspot 3: Ethylene Scrubber */}
      <group position={[2.0, 1.8, 1.35]}>
        <Html distanceFactor={12} position={[0, 0, 0]}>
          <button
            onClick={() => onSelectHotspot('ethylene')}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-md text-xs font-semibold ${
              activeHotspot === 'ethylene'
                ? 'bg-cyan-400 text-slate-950 border-cyan-200 shadow-lg shadow-cyan-500/40 scale-110'
                : 'bg-slate-900/80 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/20'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Ethylene: 0.14 ppm</span>
          </button>
        </Html>
      </group>

      {/* Hotspot 4: Smart Gate-In IoT Lock */}
      <group position={[-2.6, 1.2, 1.35]}>
        <Html distanceFactor={12} position={[0, 0, 0]}>
          <button
            onClick={() => onSelectHotspot('gate-in')}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-md text-xs font-semibold ${
              activeHotspot === 'gate-in'
                ? 'bg-blue-500 text-white border-blue-300 shadow-lg shadow-blue-500/40 scale-110'
                : 'bg-slate-900/80 text-blue-400 border-blue-500/40 hover:bg-blue-500/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Gate-In Verified</span>
          </button>
        </Html>
      </group>

    </group>
  );
}

// Terrain Floor & Environment
function GroundTerrain() {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Main Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0b1912" roughness={0.9} />
      </mesh>

      {/* Curved Lush Green Hillock */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial color="#143622" roughness={0.7} />
      </mesh>

      {/* Decorative Low-Poly Rocks & Scrub */}
      {[-4, -2, 3, 5].map((x, i) => (
        <mesh key={i} position={[x * 1.5, 0.1, (i % 2 === 0 ? -4 : 4)]}>
          <dodecahedronGeometry args={[0.3 + (i % 3) * 0.15]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function ColdHubCanvas({ activeHotspot, onSelectHotspot, capacityLoad }) {
  return (
    <div className="relative w-full h-[82vh] rounded-3xl overflow-hidden border border-white/10 glass-panel shadow-2xl">
      {/* Top 3D Viewport Controls & Status Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 glass-pill px-3 py-1.5 rounded-full text-xs font-mono text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Interactive 3D Spatial Viewport</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {activeHotspot && (
            <button
              onClick={() => onSelectHotspot(null)}
              className="glass-pill px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all"
            >
              Reset View
            </button>
          )}
        </div>
      </div>

      {/* 3D Canvas R3F */}
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        {/* Natural Atmospheric Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[10, 15, 8]} 
          intensity={1.6} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-8, 6, -5]} intensity={0.5} color="#06b6d4" />
        <pointLight position={[6, 4, 6]} intensity={0.4} color="#10b981" />

        {/* Dynamic Parallax Camera Controller */}
        <ParallaxCamera activeHotspot={activeHotspot} />

        {/* 3D Solar Micro-Cold Hub Model */}
        <SolarColdHubModel 
          activeHotspot={activeHotspot} 
          onSelectHotspot={onSelectHotspot} 
          capacityLoad={capacityLoad}
        />

        {/* Lush Terrain Base */}
        <GroundTerrain />

        {/* Soft Contact Shadows */}
        <ContactShadows 
          position={[0, -0.28, 0]} 
          opacity={0.7} 
          scale={16} 
          blur={2.5} 
          far={6} 
        />

        {/* Environment Sky Map Lighting */}
        <Environment preset="city" />

        {/* Orbit Controls (constrained for clean framing) */}
        <OrbitControls 
          enableZoom={true}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={5}
          maxDistance={18}
          enablePan={false}
        />
      </Canvas>

      {/* Bottom Hint Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-[11px] text-slate-400 font-mono">
        <Maximize2 className="w-3 h-3 text-emerald-400" />
        <span>Click 3D Hotspots or Drag Mouse to Rotate Parallax Camera</span>
      </div>
    </div>
  );
}
