"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Sprout, 
  Store, 
  ShoppingBag, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  X, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthenticate }) {
  const [mode, setMode] = useState('signup'); // 'signin' or 'signup'
  const [selectedRole, setSelectedRole] = useState('FARMER'); // 'FARMER', 'TRADER', 'CONSUMER'
  const [formData, setFormData] = useState({
    name: 'Ramesh Patil',
    emailOrPhone: 'ramesh.farmer@agrifresh.in',
    password: '••••••••',
    location: 'Nashik, Maharashtra',
    businessName: 'Nashik Grape Producer FPO',
  });

  const roles = [
    {
      id: 'FARMER',
      title: 'Farmer / FPO Member',
      icon: Sprout,
      color: 'emerald',
      desc: 'Sell harvest directly, book solar cold hubs, get advance credit & AI vision grading',
    },
    {
      id: 'TRADER',
      title: 'Trader / APMC Buyer',
      icon: Store,
      color: 'teal',
      desc: 'Buy bulk produce, track heat-bypass transit, lock escrow contracts & audit quality',
    },
    {
      id: 'CONSUMER',
      title: 'Consumer / Retailer',
      icon: ShoppingBag,
      color: 'cyan',
      desc: 'Farm-to-table direct orders, freshness index verification & price transparency',
    },
  ];

  const handleQuickDemoAuth = (roleId) => {
    const demoProfiles = {
      FARMER: { name: 'Ramesh Patil', role: 'FARMER', location: 'Nashik, MH', businessName: 'Nashik Grape Producers Co.' },
      TRADER: { name: 'Vikram Shah', role: 'TRADER', location: 'Mumbai Vashi Mandi', businessName: 'Shah Bulk Agro Supplies' },
      CONSUMER: { name: 'Priya Sharma', role: 'CONSUMER', location: 'Bandram, Mumbai', businessName: 'Retail Buyer' },
    };

    onAuthenticate(demoProfiles[roleId]);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthenticate({
      name: formData.name || 'AgriFresh User',
      role: selectedRole,
      location: formData.location || 'India',
      businessName: formData.businessName || 'FPO / Market Member',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl bg-slate-900/95 text-slate-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  AgriFresh Identity Auth
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Role-Based Access
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Customized interface for Farmers, Mandi Traders & Direct Consumers
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Quick One-Click Demo Role Login (Ideal for Hackathons!) */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider font-bold block">
                ⚡ Instant One-Click Demo Logins
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleQuickDemoAuth(r.id)}
                      className="p-2 rounded-xl bg-slate-850 border border-white/5 hover:border-emerald-500/40 hover:bg-slate-800 transition-all text-left space-y-1"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                        <Icon className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="truncate">{r.id}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">Demo Access</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Selector Cards */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-slate-400 tracking-wider block">
                Select Your Access Role
              </label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                          : 'bg-slate-850/50 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white">{r.title}</h4>
                          <p className="text-[11px] text-slate-400">{r.desc}</p>
                        </div>
                      </div>

                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">District / Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Email or Mobile Number</label>
                <input
                  type="text"
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate & Customize Portal ({selectedRole})</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
