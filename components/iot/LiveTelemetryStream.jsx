"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, 
  Thermometer, 
  Droplets, 
  Wind, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Activity,
  Cpu
} from 'lucide-react';
import { subscribeToTelemetry, insertTelemetryData } from '@/services/telemetryService';

export default function LiveTelemetryStream() {
  const [telemetry, setTelemetry] = useState({
    deviceId: 'ESP32-SOLAR-POD-01',
    temperatureC: 3.8,
    humidityRh: 91.2,
    ethylenePpm: 0.14,
    remainingShelfLifeDays: 14.2,
    recordedAt: new Date().toLocaleTimeString(),
  });

  const [alerts, setAlerts] = useState([]);

  // Subscribe to live Supabase channel
  useEffect(() => {
    const unsubscribe = subscribeToTelemetry((newRecord) => {
      setTelemetry({
        deviceId: newRecord.device_id,
        temperatureC: newRecord.temperature_c,
        humidityRh: newRecord.humidity_rh,
        ethylenePpm: newRecord.ethylene_ppm,
        remainingShelfLifeDays: newRecord.remaining_shelf_life_days,
        recordedAt: new Date(newRecord.recorded_at).toLocaleTimeString(),
      });

      // Threshold check alerts
      const newAlerts = [];
      if (newRecord.temperature_c > 6.0) newAlerts.push('High Temperature Alert (>6.0°C)');
      if (newRecord.ethylene_ppm > 0.35) newAlerts.push('Ethylene Scrubber Triggered (>0.35 PPM)');
      setAlerts(newAlerts);
    });

    // Simulate periodic ESP32 sensor ping
    const interval = setInterval(() => {
      const simulatedTemp = +(3.5 + Math.random() * 0.8).toFixed(2);
      const simulatedEthylene = +(0.12 + Math.random() * 0.05).toFixed(3);
      
      const newReading = {
        deviceId: 'ESP32-SOLAR-POD-01',
        temperatureC: simulatedTemp,
        humidityRh: 91.5,
        ethylenePpm: simulatedEthylene,
        remainingShelfLifeDays: +(14.5 - simulatedTemp * 0.2).toFixed(1),
        recordedAt: new Date().toLocaleTimeString(),
      };

      setTelemetry(newReading);
      insertTelemetryData(newReading);
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 shadow-2xl bg-slate-900/90 font-mono text-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <Radio className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-sm text-white">Live Supabase IoT Telemetry Channel</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
              ● Channel: public:iot_telemetry
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Device ID: <strong className="text-white">{telemetry.deviceId}</strong></span>
            <span>• Ping: <strong className="text-emerald-400">{telemetry.recordedAt}</strong></span>
          </div>
        </div>

        {/* Telemetry Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Temperature */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Chamber Temperature</span>
              <Thermometer className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-400">{telemetry.temperatureC}°C</p>
            <span className="text-[10px] text-slate-500">Target Range: 2.0°C - 5.0°C</span>
          </div>

          {/* Humidity */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Relative Humidity</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-extrabold text-cyan-300">{telemetry.humidityRh}%</p>
            <span className="text-[10px] text-slate-500">Optimal Moisture Retained</span>
          </div>

          {/* Ethylene */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Ethylene Level</span>
              <Wind className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-amber-300">{telemetry.ethylenePpm} PPM</p>
            <span className="text-[10px] text-slate-500">Scrubber Active (&lt;0.35 PPM)</span>
          </div>

          {/* Shelf Life */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Est. Shelf Life</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-extrabold text-purple-300">{telemetry.remainingShelfLifeDays} Days</p>
            <span className="text-[10px] text-emerald-400 font-bold">Grade A+ Freshness Retained</span>
          </div>
        </div>

        {/* Dynamic Alerts Banner */}
        {alerts.length > 0 && (
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-2 text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Telemetry Warning: {alerts.join(' | ')}</span>
          </div>
        )}
      </div>
    </section>
  );
}
