"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  DollarSign, 
  Clock, 
  RefreshCw,
  ShieldCheck,
  Eye
} from 'lucide-react';

export default function ProduceGraderModal({ isOpen, onClose, onLockEscrow }) {
  const [selectedCrop, setSelectedCrop] = useState('Nashik Seedless Grapes');
  const [previewImage, setPreviewImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Sample produce images for quick demo selection
  const sampleCrops = [
    { name: 'Nashik Seedless Grapes', icon: '🍇', img: 'https://images.unsplash.com/photo-1596368708386-5a046f3f00d7?auto=format&fit=crop&w=400&q=80' },
    { name: 'Ratnagiri Alphonso Mangoes', icon: '🥭', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80' },
    { name: 'Lasalgaon Red Onions', icon: '🧅', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8ce?auto=format&fit=crop&w=400&q=80' },
    { name: 'Organic Vine Tomatoes', icon: '🍅', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80' },
  ];

  const handleSelectSample = (sample) => {
    setSelectedCrop(sample.name);
    setPreviewImage(sample.img);
    setAnalysisResult(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Clean base64 if available
      const imageBase64 = previewImage ? previewImage.split(',')[1] || null : null;

      const res = await fetch('/api/grade-produce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropType: selectedCrop,
          imageBase64: imageBase64,
          mimeType: 'image/jpeg',
        }),
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
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
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  Gemini 2.5 Vision Produce Grader
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Multimodal AI
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Instant Computer Vision Quality & Blemish Audit powered by @google/genai
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
            {/* Quick Sample Selector */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2 block">
                Select Crop Sample or Upload Photo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sampleCrops.map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2.5 rounded-2xl border text-left text-xs transition-all flex items-center gap-2 ${
                      selectedCrop === sample.name
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-bold'
                        : 'bg-slate-850/60 border-white/5 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <span className="text-lg">{sample.icon}</span>
                    <span className="truncate">{sample.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload Box */}
            <div className="relative border-2 border-dashed border-white/15 rounded-3xl p-6 text-center bg-slate-950/60 hover:border-emerald-500/40 transition-colors">
              {previewImage ? (
                <div className="relative max-h-56 overflow-hidden rounded-2xl mx-auto flex items-center justify-center">
                  <img src={previewImage} alt="Produce Preview" className="max-h-56 object-cover rounded-2xl" />
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer space-y-3 block">
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Click to upload harvest photo</p>
                    <p className="text-[11px] text-slate-400">JPG, PNG or WEBP up to 10MB</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini 2.5 Flash Inspecting Cell Surfaces...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Multimodal Gemini Vision Inspection</span>
                </>
              )}
            </button>

            {/* Structured JSON Inspection Result */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-slate-950/90 border border-emerald-500/30 space-y-4 font-mono"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white">{analysisResult.cropIdentified}</span>
                      <p className="text-[10px] text-slate-400">Gemini Certified Grade</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    analysisResult.grade === 'A_PREMIUM'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {analysisResult.grade}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px]">Freshness Score</span>
                    <p className="text-lg font-bold text-emerald-400">{analysisResult.freshnessScoreOutOf100}/100</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px]">Est. Shelf-Life</span>
                    <p className="text-lg font-bold text-cyan-400">{analysisResult.estimatedShelfLifeDays} Days</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px]">Fair Price Benchmark</span>
                    <p className="text-lg font-bold text-amber-300">₹{analysisResult.recommendedFairPricePerKgInr}/kg</p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-slate-900 p-3 rounded-2xl border border-white/5">
                  <span className="text-slate-400 block mb-1 font-bold">AI Audit Summary:</span>
                  <p>{analysisResult.verificationSummary}</p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    if (onLockEscrow) onLockEscrow();
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lock Grade & Price into Smart Escrow</span>
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
