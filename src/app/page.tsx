"use client";

import { motion } from "framer-motion";
import { User, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

const springConfig = { type: "spring" as const, stiffness: 400, damping: 30 };

export default function RoleSelection() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen relative bg-dots">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springConfig}
        className="max-w-2xl w-full flex flex-col items-center z-10 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-blue-600 mb-8 border border-slate-200 shadow-sm">
          <DropletIcon />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 text-slate-900 leading-[1.1]">
          wAIter
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-md font-normal">
          Платформа для мониторинга утечек и экономии водных ресурсов.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-xl">
          {/* Роль: Житель */}
          <Link href="/report">
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center border border-slate-100 group-hover:bg-slate-100 transition-colors">
                <User size={32} />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Я — Житель</h2>
                <p className="text-sm text-slate-500">Сообщить об утечке воды</p>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-blue-600 transition-colors mt-2" />
            </motion.div>
          </Link>

          {/* Роль: Ремонтник */}
          <Link href="/admin">
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
                <Wrench size={32} />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Я — Ремонтник</h2>
                <p className="text-sm text-slate-500">Панель управления заявками</p>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-blue-600 transition-colors mt-2" />
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

function DropletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
    </svg>
  );
}
