"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

const MODULES = [
  { id: "module_electricity_1", title: "Electricity Grid", desc: "Understand the flow." },
  { id: "module_meter_1", title: "Reading the Meter", desc: "Decode the numbers." },
  { id: "module_breakers_1", title: "Circuit Breakers", desc: "Safety first." },
  { id: "module_solar_1", title: "Solar Basics", desc: "Harness the sun." },
  { id: "module_wind_1", title: "Wind Power", desc: "Catch the breeze." },
];

export default function LearningMap() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const gameStatus = useQuery(api.game.getGameStatus);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  if (gameStatus === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (gameStatus === null) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <p className="text-white/40 font-medium tracking-wide">No game data found. Start a lesson to begin!</p>
      </div>
    );
  }

  const { completedLessons, currentModuleId } = gameStatus;

  return (
    <div className="relative min-h-[120vh] w-full flex flex-col items-center pt-24 pb-32">
      {/* Background Track - glowing line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center mt-24">
        <svg
          className="w-full max-w-md h-[1000px] text-cyan-500/20"
          preserveAspectRatio="none"
          viewBox="0 0 100 1000"
          style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.3))" }}
        >
          <path
            d="M 50,0 C -20,100 120,200 50,300 C -20,400 120,500 50,600 C -20,700 120,800 50,900 C -20,1000 50,1000 50,1000"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Nodes */}
      <div className="relative w-full max-w-md flex flex-col items-center gap-24 py-12 z-10">
        {MODULES.map((mod, index) => {
          const isCompleted = completedLessons.includes(mod.id);
          const isActive = currentModuleId === mod.id;
          const isLocked = !isCompleted && !isActive;

          const xOffset = index % 2 === 0 ? -40 : 40;

          let buttonClass = "";
          let icon = "";
          if (isLocked) {
            buttonClass = "bg-white/5 border-white/10 text-white/30 cursor-not-allowed";
            icon = "🔒";
          } else if (isCompleted) {
            buttonClass = "bg-amber-400/20 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:bg-amber-400/30";
            icon = "⭐";
          } else if (isActive) {
            buttonClass = "bg-cyan-400/20 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:bg-cyan-400/30";
            icon = "🚀";
          }

          return (
            <div
              key={mod.id}
              className="relative flex flex-col items-center"
              style={{ transform: `translateX(${xOffset}px)` }}
            >
              <button
                onClick={() => {
                  if (!isLocked) setSelectedModule(mod.id);
                }}
                disabled={isLocked}
                className={`relative w-[76px] h-[76px] rounded-full flex items-center justify-center transition-all backdrop-blur-md border-2 ${buttonClass}`}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-cyan-400 -z-10"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                
                <span className={`text-3xl drop-shadow-md ${isLocked ? 'grayscale opacity-40' : ''}`}>
                  {icon}
                </span>
              </button>

              <div className="mt-4 glass-panel px-4 py-1.5 rounded-full">
                <p className={`text-[13px] font-bold tracking-wide ${isLocked ? "text-white/40" : "text-white text-glow"}`}>
                  {mod.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start Mission Modal */}
      <AnimatePresence>
        {selectedModule && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setSelectedModule(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 glass-panel border-t border-white/20 rounded-t-3xl p-6 pb-safe z-[70] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
              
              {MODULES.map(m => m.id === selectedModule && (
                <div key={m.id} className="flex flex-col">
                  <h3 className="text-2xl font-black text-white text-glow mb-2">{m.title}</h3>
                  <p className="text-white/60 font-medium mb-6">{m.desc}</p>
                  
                  <div className="flex items-center gap-4 bg-cyan-950/40 p-4 rounded-2xl border border-cyan-500/30 mb-8 shadow-inner">
                    <span className="text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">💎</span>
                    <div>
                      <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-0.5">Reward</p>
                      <p className="text-lg font-black text-white">+50 Watts</p>
                    </div>
                  </div>

                  <button
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-black text-lg tracking-wider uppercase rounded-2xl py-4 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-[0.98]"
                    onClick={() => {
                      router.push(`/${locale}/play/${selectedModule}`);
                    }}
                  >
                    Start Mission
                  </button>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
