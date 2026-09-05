"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Terminal, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck, 
  Box, 
  Sparkles,
  RefreshCw,
  Zap,
  Bot
} from 'lucide-react';
import { INITIAL_MCP_LOGS } from '@/lib/store';

export default function MCPAgentTerminal({ onTriggerEscrow }) {
  const [logs, setLogs] = useState(INITIAL_MCP_LOGS);
  const [runningTool, setRunningTool] = useState(null);
  const [agentStatus, setAgentStatus] = useState('AUTONOMOUS_MONITORING');

  // MCP Tool Definitions
  const tools = [
    {
      name: 'get_mandi_prices',
      description: 'Query APMC mandi price anomaly & distress sale index',
      icon: DollarSign,
      action: async () => {
        setRunningTool('get_mandi_prices');
        await new Promise(r => setTimeout(r, 1200));
        const newLog = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          tool: 'get_mandi_prices',
          args: { commodity: 'Nashik Grape', mandis: ['Mumbai Vashi', 'Pune', 'Azadpur'] },
          result: 'Price Anomaly Detected! Azadpur Mandi rate (+₹18/kg premium over local). Heat corridor on Direct NH48. Recommending solar cold-transit route.',
          status: 'SUCCESS',
        };
        setLogs(prev => [newLog, ...prev]);
        setRunningTool(null);
      }
    },
    {
      name: 'check_iot_shelf_life',
      description: 'Query ESP32 node for produce freshness decay rate',
      icon: RefreshCw,
      action: async () => {
        setRunningTool('check_iot_shelf_life');
        await new Promise(r => setTimeout(r, 1200));
        const newLog = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          tool: 'check_iot_shelf_life',
          args: { nodeId: 'NODE-01', decayModel: 'Arrhenius Kinetic' },
          result: 'Chamber 3.8°C | RH 91% | Ethylene 0.14ppm. Freshness Index: 97.4% (Grade A+). Zero decay acceleration detected.',
          status: 'SUCCESS',
        };
        setLogs(prev => [newLog, ...prev]);
        setRunningTool(null);
      }
    },
    {
      name: 'reserve_cold_hub_slot',
      description: 'Lock slot at Solar Micro-Cold Hub to prevent distress sale',
      icon: Box,
      action: async () => {
        setRunningTool('reserve_cold_hub_slot');
        await new Promise(r => setTimeout(r, 1200));
        const newLog = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          tool: 'reserve_cold_hub_slot',
          args: { hubId: 'NASHIK-HUB-A1', slotId: 'SLOT-04', load: '8.5 MT' },
          result: 'Micro-Cold Hub Slot Reserved! Gate-In Smart Lock Code #AGY-9921 generated. Solar storage active for 48 hours.',
          status: 'SUCCESS',
        };
        setLogs(prev => [newLog, ...prev]);
        setRunningTool(null);
      }
    },
    {
      name: 'trigger_escrow_release',
      description: 'Release Web3 Escrow funds to farmer wallet upon IoT Gate-In',
      icon: ShieldCheck,
      action: async () => {
        setRunningTool('trigger_escrow_release');
        await new Promise(r => setTimeout(r, 1500));
        const newLog = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          tool: 'trigger_escrow_release',
          args: { contract: '0x7a2...F19B', farmerWallet: '0x8F92...C42A', payout: '4,500 USDC' },
          result: 'Milestone 3 Verified! Smart Contract executed: 4,500 USDC instantly transferred to Farmer FPO Wallet. Tx Hash: 0x99a3...e21b',
          status: 'SUCCESS',
        };
        setLogs(prev => [newLog, ...prev]);
        setRunningTool(null);
        if (onTriggerEscrow) onTriggerEscrow();
      }
    },
  ];

  return (
    <section id="mcp-agent" className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Autonomous Supply Chain AI Agent Protocol</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Model Context Protocol (MCP) Agent Terminal
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Agent Mode:</span>
          <div className="flex items-center gap-2 glass-pill px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>AUTONOMOUS ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Exposed MCP Tools Dock */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Registered MCP Tools</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                4 Tools Exposed
              </span>
            </div>

            <p className="text-xs text-slate-300">
              The AgriFresh AI Agent continuously evaluates mandi price feeds, IoT sensor decay curves, and smart escrow rules. Click any tool below to manually invoke tool execution:
            </p>

            <div className="space-y-3">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isRunning = runningTool === tool.name;

                return (
                  <button
                    key={tool.name}
                    onClick={tool.action}
                    disabled={runningTool !== null}
                    className="w-full text-left p-3.5 rounded-2xl glass-card border border-white/5 hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all group flex items-start justify-between gap-3 disabled:opacity-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {tool.name}()
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-full bg-slate-800 text-slate-400 group-hover:text-emerald-400">
                      {isRunning ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Terminal Stream */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col h-full min-h-[460px]">
            {/* Terminal Header */}
            <div className="px-5 py-3.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-slate-400 ml-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  agrifresh-mcp-agent@runtime-node-01:~
                </span>
              </div>

              <span className="text-[11px] text-emerald-400 animate-pulse">
                • Streaming Logs
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-5 font-mono text-xs space-y-4 overflow-y-auto max-h-[400px] flex-1 bg-slate-950/90 text-slate-300">
              <div className="text-slate-500 text-[11px]">
                [SYSTEM]: Model Context Protocol v1.4 Initialized. Agent watching APMC feeds & ESP32 telemetry...
              </div>

              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">[{log.timestamp}]</span>
                        <span className="text-emerald-400 font-bold">TOOL EXECUTE:</span>
                        <span className="text-white font-bold">{log.tool}()</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        {log.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 pl-4 border-l border-emerald-500/30">
                      <span className="text-slate-500">INPUT:</span> {JSON.stringify(log.args)}
                    </div>

                    <div className="text-xs text-emerald-300 pl-4 border-l border-emerald-500/50 pt-0.5">
                      <span className="text-slate-400">OUTPUT:</span> {log.result}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
