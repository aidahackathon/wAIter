"use client";

import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, Droplet } from "lucide-react";

import IncidentReporter from "@/components/IncidentReporter";

const STAGGER_DELAY = 0.1;

// Apple-style spring animation config
const springConfig = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: springConfig 
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: 0.2,
    },
  },
};

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center p-6 md:p-12 lg:p-24 overflow-hidden relative">
      {/* Subtle Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="max-w-5xl w-full flex flex-col items-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-12 max-w-2xl">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass shadow-sm mb-6 text-sm font-medium text-primary"
            whileHover={{ scale: 1.05 }}
            transition={springConfig}
          >
            <Sparkles size={16} />
            <span>AI Leak Detection</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 text-foreground">
            Report incidents.<br />
            <span className="text-primary">Instantly.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed font-medium">
            Upload a photo of suspected water leaks. Our advanced AI will instantly analyze the probability and scale of the incident.
          </p>
        </motion.div>

        {/* AI Upload Component */}
        <motion.div variants={itemVariants} className="w-full z-20">
          <IncidentReporter />
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-12 max-w-3xl mx-auto">
          
          {/* Square Card 1 */}
          <motion.div 
            variants={itemVariants}
            className="glass rounded-3xl p-8 shadow-apple flex flex-col justify-between min-h-[240px]"
            whileHover={{ y: -4, scale: 1.01 }}
            transition={springConfig}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Secure</h2>
              <p className="text-foreground/70 font-medium">Your data stays yours. Privacy is built-in from the ground up.</p>
            </div>
          </motion.div>

          {/* Square Card 2 */}
          <motion.div 
            variants={itemVariants}
            className="glass rounded-3xl p-8 shadow-apple flex flex-col justify-between min-h-[240px]"
            whileHover={{ y: -4, scale: 1.01 }}
            transition={springConfig}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-6">
                <Droplet size={24} />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Fluid Design</h2>
              <p className="text-foreground/70 font-medium">Smooth spring physics and soft transitions. Pure HIG aesthetic.</p>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}
