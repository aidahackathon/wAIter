"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { analyzeIncident, type AnalyzeResult } from "@/app/actions/analyze";

const springConfig = { type: "spring", stiffness: 300, damping: 25 };

export default function IncidentReporter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewURL(URL.createObjectURL(selected));
      setResult(null); // Сбрасываем прошлый результат
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const aiResult = await analyzeIncident(formData);
      setResult(aiResult);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-6">
      
      {/* Upload Zone */}
      <motion.div 
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={springConfig}
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
      >
        <div className={`
          absolute inset-0 rounded-3xl transition-opacity duration-300 pointer-events-none
          ${isAnalyzing ? 'opacity-100 bg-primary/20 blur-xl animate-pulse' : 'opacity-0'}
        `} />
        
        <div className="glass rounded-3xl p-8 shadow-apple border border-white/20 dark:border-white/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[240px] text-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
          
          <AnimatePresence mode="wait">
            {previewURL ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 w-full h-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewURL} alt="Preview" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  {!isAnalyzing ? (
                    <motion.button 
                      onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                      className="px-6 py-3 bg-primary text-white rounded-full font-medium shadow-lg hover:bg-primary-hover flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Upload size={18} />
                      Analyze with AI
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full font-medium shadow-lg">
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 text-foreground/60"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Upload size={28} />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">Upload photo of a leak</p>
                  <p className="text-sm">Tap or drag an image here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* AI Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={springConfig}
            className="glass rounded-3xl p-6 shadow-apple overflow-hidden"
          >
            {result.error ? (
              <div className="flex items-start gap-3 text-red-500">
                <AlertCircle className="shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Analysis Failed</h3>
                  <p className="text-sm opacity-80">{result.error}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">AI Analysis Complete</h3>
                      <p className="text-sm text-foreground/60">Powered by Gemini 1.5</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold tracking-tight text-primary">
                      {result.probability}%
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wider text-foreground/50">
                      Probability
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/40 dark:bg-black/20 rounded-2xl p-4">
                    <div className="text-xs font-medium uppercase tracking-wider text-foreground/50 mb-1">Scale</div>
                    <div className="font-semibold text-foreground">{result.scale}</div>
                  </div>
                  <div className="bg-white/40 dark:bg-black/20 rounded-2xl p-4 col-span-2">
                    <div className="flex items-start gap-2">
                      <Info size={16} className="text-primary shrink-0 mt-1" />
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider text-foreground/50 mb-1">AI Report</div>
                        <p className="text-sm text-foreground leading-relaxed">{result.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
