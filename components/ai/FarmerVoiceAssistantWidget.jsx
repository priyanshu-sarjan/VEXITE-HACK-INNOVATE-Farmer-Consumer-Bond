"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, 
  Mic, 
  Send, 
  X, 
  Volume2, 
  Sparkles, 
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Globe,
  ArrowRight
} from 'lucide-react';

export default function FarmerVoiceAssistantWidget({ onOpenGrader, onOpenNegotiator }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('Hindi / English');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const presetQueries = [
    { text: 'Which crop should I grow this season?', icon: '🌾' },
    { text: 'Recommended strategy for organic farming', icon: '💡' },
    { text: 'Pest & disease control for grapes', icon: '🍇' },
    { text: 'How to avoid harvest season distress sale?', icon: '📈' },
  ];

  const handleAskAI = async (textToAsk) => {
    const q = textToAsk || query;
    if (!q) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/farmer-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          language: selectedLang,
        }),
      });

      const data = await res.json();
      setResponse(data);
      setQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Browser Text-to-Speech Readout for Voice Accessibility
  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      // Remove markdown asterisks for clean speech synthesis
      const cleanText = text.replace(/[*#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Small Icon Widget (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative group flex items-center gap-3 p-3.5 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 shadow-2xl shadow-emerald-500/40 border border-emerald-300"
        >
          <span className="relative flex h-3 w-3 absolute top-1 right-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200"></span>
          </span>

          <div className="w-8 h-8 rounded-full bg-slate-950/20 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-slate-950 font-bold" />
          </div>

          <div className="hidden md:flex flex-col text-left pr-2">
            <span className="font-extrabold text-xs tracking-wide">Farmer AI Assistant</span>
            <span className="text-[10px] font-mono opacity-80">Ask Crop & Farming Advice</span>
          </div>
        </motion.button>
      </div>

      {/* Expandable Glass Pop-Up Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-24 left-6 z-50 w-80 md:w-96 rounded-3xl glass-panel p-5 border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/95 text-slate-100 max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">AgriFresh Farmer Advisor</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Gemini 2.5 Multi-Lingual Intelligence</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-4">
              {/* Dialect Switcher */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Language:
                </span>
                <div className="flex gap-1">
                  {['Hindi', 'Marathi', 'English'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setSelectedLang(l)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedLang === l ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Box with Voice Mic & Send */}
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder="Ask: Which crop to grow this season?"
                  className="w-full pl-3 pr-10 py-2.5 rounded-2xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
                <button
                  onClick={() => handleAskAI()}
                  disabled={isLoading}
                  className="absolute right-2 p-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Preset Quick Question Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Suggested Questions</span>
                <div className="space-y-1">
                  {presetQueries.map((pq, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskAI(pq.text)}
                      className="w-full text-left p-2 rounded-xl bg-slate-850/60 border border-white/5 hover:border-emerald-500/30 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-2 transition-all"
                    >
                      <span>{pq.icon}</span>
                      <span className="truncate">{pq.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Quick Access Buttons */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenGrader) onOpenGrader();
                  }}
                  className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 text-center font-semibold"
                >
                  📷 Scan Harvest Photo
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenNegotiator) onOpenNegotiator();
                  }}
                  className="p-2 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:bg-teal-500/20 text-center font-semibold"
                >
                  🎙️ Voice Trade Negotiate
                </button>
              </div>

              {/* AI Answer Card */}
              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 text-xs space-y-2 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Gemini Advisory Output
                    </span>

                    <button
                      onClick={() => handleSpeak(response.recommendation)}
                      className="p-1 rounded-full text-slate-400 hover:text-emerald-400"
                    >
                      <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-emerald-400 animate-pulse' : ''}`} />
                    </button>
                  </div>

                  <div className="text-slate-200 whitespace-pre-line text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                    {response.recommendation}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
