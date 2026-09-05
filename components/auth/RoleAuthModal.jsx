"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  Sprout, 
  Building2, 
  ShoppingBag, 
  X, 
  Phone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Globe,
  Lock,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { signInWithOtp, verifyOtp, signInWithGoogle, signOut } from '@/services/authService';

export default function RoleAuthModal({ isOpen, onClose, userProfile, onAuthenticate }) {
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'google'
  const [selectedRole, setSelectedRole] = useState('farmer'); // 'farmer' | 'trader' | 'consumer'
  
  // Form State
  const [phone, setPhone] = useState('+919876543210');
  const [fullName, setFullName] = useState('Ramesh Patil');
  const [district, setDistrict] = useState('Nashik');
  const [otpToken, setOtpToken] = useState('');
  
  // Workflow step: 1 = Enter Info & Send OTP, 2 = Verify OTP
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const res = await signInWithOtp(phone);
    setIsLoading(false);

    if (res.success) {
      setStep(2);
      setStatusMessage({ 
        type: 'success', 
        text: `OTP sent to ${res.formattedPhone || phone}! Check your phone for SMS code.` 
      });
    } else {
      // Strictly do NOT auto-advance to step 2 if Supabase OTP failed!
      setStatusMessage({ 
        type: 'error', 
        text: `❌ Supabase Auth Error: ${res.error}` 
      });
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!otpToken || otpToken.trim().length === 0) {
      setStatusMessage({ type: 'error', text: 'Please enter the 6-digit OTP code received on your phone.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    const res = await verifyOtp(phone, otpToken.trim(), selectedRole, fullName, district);
    setIsLoading(false);

    if (!res.success) {
      // Strictly BLOCK authentication if Supabase verifyOtp fails!
      setStatusMessage({ 
        type: 'error', 
        text: `❌ Invalid OTP Code: ${res.error || 'Verification failed. Please check the code and try again.'}` 
      });
      return;
    }

    const profileData = {
      id: res.user?.id,
      name: fullName,
      role: selectedRole.toUpperCase(),
      location: `${district}, IN`,
      phone: phone,
      businessName: selectedRole === 'farmer' ? `${district} Farmer Co-op` : selectedRole === 'trader' ? `${district} Mandi Traders` : 'Direct Consumer',
    };

    onAuthenticate(profileData);
    setStatusMessage({ type: 'success', text: '🎉 Phone OTP Verified! Session created in Supabase Auth.' });
    setTimeout(() => {
      onClose();
      setStep(1);
      setOtpToken('');
    }, 1200);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signInWithGoogle();
    setIsLoading(false);
  };

  const handleQuickDemoRole = (role, name, loc) => {
    const profile = {
      name: name,
      role: role.toUpperCase(),
      location: loc,
      phone: '+919876543210',
      businessName: role === 'farmer' ? 'Nashik Grape FPO' : role === 'trader' ? 'Vashi APMC Mandi Traders' : 'Retail Consumer',
    };
    onAuthenticate(profile);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-3xl glass-panel p-6 border border-emerald-500/30 shadow-2xl bg-slate-900/95 text-slate-100 max-h-[90vh] overflow-y-auto font-mono text-xs space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Supabase Authentication & Role Portal</h3>
                <p className="text-[11px] text-slate-400">Project: fpofksbeiaftslekpbcr • Phone OTP & OAuth</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Role Selection Segmented Control */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              1. Select Your Ecosystem Role:
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'farmer', name: 'Farmer', icon: Sprout, desc: 'FPO / Crop Lister', color: 'emerald' },
                { id: 'trader', name: 'Trader', icon: Building2, desc: 'Mandi Bulk Buyer', color: 'cyan' },
                { id: 'consumer', name: 'Consumer', icon: ShoppingBag, desc: 'Farm-to-Fork Direct', color: 'amber' },
              ].map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="font-bold text-xs">{r.name}</p>
                    <p className="text-[9px] text-slate-500 leading-none">{r.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auth Method Tabs (Phone OTP vs Google) */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-white/5">
            <button
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all text-xs flex items-center justify-center gap-1.5 ${
                authMethod === 'phone' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone OTP Verification</span>
            </button>

            <button
              onClick={() => setAuthMethod('google')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all text-xs flex items-center justify-center gap-1.5 ${
                authMethod === 'google' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google OAuth</span>
            </button>
          </div>

          {/* Form Content */}
          {authMethod === 'phone' ? (
            step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Phone Number (+91)</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+919876543210"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">District / Mandi</label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Nashik / Indore / Bhopal"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                  <span>Send Verification Code (SMS OTP)</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-400 text-[11px]">
                  Verification code sent to <strong>{phone}</strong>. Enter OTP below:
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold tracking-widest text-emerald-400 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:text-white"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>Verify & Login</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-4 py-2">
              <p className="text-slate-300 text-[11px] text-center">
                Sign in with your Google Account to access custom <strong>{selectedRole.toUpperCase()}</strong> features.
              </p>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-white text-slate-950 font-extrabold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Continue with Google OAuth</span>
              </button>
            </div>
          )}

          {statusMessage && (
            <div className={`p-3 rounded-xl text-[11px] font-bold text-center border ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : statusMessage.type === 'error'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            }`}>
              {statusMessage.text}
            </div>
          )}

          {/* Developer Guidance Tip for Supabase Phone Auth */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-[10px] text-amber-200/90 leading-relaxed space-y-1">
            <p className="font-bold flex items-center gap-1 text-amber-400">
              <Lock className="w-3 h-3" /> Supabase Phone Auth Setup Note:
            </p>
            <p>
              To receive real SMS to phone numbers, configure SMS Gateway (Twilio) in your Supabase Project Dashboard under <code>Authentication → Providers → Phone</code>.
            </p>
            <p>
              Or add a zero-cost test number in Supabase Console (e.g., Phone: <code>+919876543210</code>, Code: <code>123456</code>) to test real verification immediately without SMS fees.
            </p>
          </div>

          {/* Quick Demo Instant Role Switcher */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-center">
              ⚡ Instant 1-Click Demo Profiles (Hackathon Presets)
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickDemoRole('farmer', 'Ramesh Patil (Farmer)', 'Nashik, MH')}
                className="p-2 rounded-xl bg-slate-950 border border-white/5 text-[10px] font-bold text-emerald-400 hover:border-emerald-500/40"
              >
                🌾 Farmer Demo
              </button>

              <button
                onClick={() => handleQuickDemoRole('trader', 'Vikram Sethi (Trader)', 'Vashi Mandi, MH')}
                className="p-2 rounded-xl bg-slate-950 border border-white/5 text-[10px] font-bold text-cyan-400 hover:border-cyan-500/40"
              >
                🏭 Trader Demo
              </button>

              <button
                onClick={() => handleQuickDemoRole('consumer', 'Ananya Sharma (Consumer)', 'Mumbai, MH')}
                className="p-2 rounded-xl bg-slate-950 border border-white/5 text-[10px] font-bold text-amber-400 hover:border-amber-500/40"
              >
                🛍️ Consumer Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
