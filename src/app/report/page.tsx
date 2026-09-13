"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Droplet } from "lucide-react";
import IncidentReporter from "@/components/IncidentReporter";

const STAGGER_DELAY = 0.05;

const springConfig = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: springConfig 
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER_DELAY },
  },
};

export default function ReportPage() {
  return (
    <main className="flex-1 flex flex-col items-center p-6 md:p-12 lg:p-24 relative bg-dots min-h-screen">
      {/* Очень мягкий градиент сверху */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

      <motion.div 
        className="max-w-4xl w-full flex flex-col items-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Заголовок */}
        <motion.div variants={itemVariants} className="text-center mb-10 max-w-2xl flex flex-col items-center">
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 text-slate-900 leading-[1.1]">
            wAIter
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-normal max-w-lg">
            Сфотографируйте подозрительную лужу или трубу. Наш искусственный интеллект мгновенно проанализирует вероятность утечки.
          </p>
        </motion.div>

        {/* Компонент загрузки */}
        <motion.div variants={itemVariants} className="w-full z-20">
          <IncidentReporter />
        </motion.div>

      </motion.div>
    </main>
  );
}
