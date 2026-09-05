"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Globe, 
  FileText, 
  X, 
  CheckCircle2, 
  RefreshCw,
  Volume2,
  DollarSign
} from 'lucide-react';

export default function VoiceNegotiatorModal({ isOpen, onClose, onContractGenerated }) {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Marathi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const samplePrompts = [
    { lang: 'Marathi', text: 'माझ्याकडे १० क्विंटल नाशिक द्राक्ष आहेत, मला रु. ८५ प्रति किलो भाव हवा आहे.' },
    { lang: 'Hindi', text: 'मेरे पास 1500 किलो प्याज है, 35 रुपये प्रति किलो की दर से बेचना चाहता हूँ।' },
    { lang: 'Punjabi', text: 'ਸਾਡੇ ਕੋਲ 2000 ਕਿਲੋ ਕਿੰਨੂ ਹੈ, 45 ਰੁਪਏ ਪ੍ਰਤੀ ਕਿਲੋ ਦਾ ਭਾਅ ਚਾਹੀਦਾ ਹੈ।' },
  ];

  const handleSimulateRecord = async (promptText) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/voice-negotiation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textPrompt: promptText,
          audioMimeType: 'audio/mp3',
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl bg-slate-900/95 text-slate-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  Multilingual Voice Trade Negotiator
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Audio AI
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Speak in your native dialect (Hindi, Marathi, Punjabi) to generate verified trade contracts
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

          <div className="space-y-6">
            {/* Dialect Selection & Mic Visualizer */}
            <div className="text-center space-y-4 py-4 p-6 rounded-3xl bg-slate-950/60 border border-white/5">
              <div className="flex justify-center gap-2 mb-2">
                {['Marathi', 'Hindi', 'Punjabi', 'Bengali'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      selectedLanguage === lang
                        ? 'bg-teal-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Big Mic Button */}
              <button
                onClick={() => handleSimulateRecord(samplePrompts.find(p => p.lang === selectedLanguage)?.text)}
                disabled={isProcessing}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/30 hover:scale-105 transition-transform"
              >
                {isProcessing ? (
                  <RefreshCw className="w-8 h-8 animate-spin" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>

              <p className="text-xs text-slate-300 font-mono">
                {isProcessing ? 'Listening & Translating Dialect via Gemini 2.5 Flash...' : 'Tap Mic to Speak Trade Terms in Native Language'}
              </p>
            </div>

            {/* Quick Dialect Sample Prompts */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Or Select Preset Farmer Voice Sample
              </label>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulateRecord(p.text)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-850/60 border border-white/5 hover:border-teal-500/30 hover:bg-slate-800 transition-all text-xs font-mono text-slate-300 flex items-center justify-between"
                >
                  <span className="truncate mr-2">"{p.text}"</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 flex-shrink-0 font-bold">
                    {p.lang}
                  </span>
                </button>
              ))}
            </div>

            {/* Contract Output */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-slate-950/90 border border-teal-500/30 space-y-4 font-mono"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <span className="text-xs font-bold text-white">Generated Digital Trade Contract</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                    Language: {result.spokenLanguage}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Spoken Transcription:</span>
                    <p className="text-slate-200 font-serif italic">"{result.transcription}"</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400 block text-[10px]">English Translation:</span>
                    <p className="text-teal-300">"{result.translatedText}"</p>
                  </div>
                </div>

                {/* Contract Specs Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400 text-[10px]">Commodity</span>
                    <p className="font-bold text-white truncate">{result.contractDraft?.commodity}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400 text-[10px]">Quantity</span>
                    <p className="font-bold text-teal-400">{result.contractDraft?.quantityKg} Kg</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400 text-[10px]">Price Demand</span>
                    <p className="font-bold text-amber-300">₹{result.contractDraft?.demandedPricePerKg}/kg</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    if (onContractGenerated) onContractGenerated();
                  }}
                  className="w-full py-3 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Lock Digital Trade Contract</span>
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
