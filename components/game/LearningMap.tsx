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
        <div className="w-10 h-10 border-4 border-[#58cc02]/30 border-t-[#58cc02] rounded-full animate-spin" />
      </div>
    );
  }

  const { completedLessons, currentModuleId } = gameStatus;

  return (
    <div className="relative min-h-[120vh] w-full flex flex-col items-center pt-24 pb-32 bg-white">
      {/* Background Track */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center mt-24">
        <svg
          className="w-full max-w-md h-[1000px] text-[#e5e5e5]"
          preserveAspectRatio="none"
          viewBox="0 0 100 1000"
        >
          <path
            d="M 50,0 C -20,100 120,200 50,300 C -20,400 120,500 50,600 C -20,700 120,800 50,900 C -20,1000 50,1000 50,1000"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
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

          // Alternate left/right offset for organic feel
          const xOffset = index % 2 === 0 ? -40 : 40;

          // Node styles based on state
          let buttonClass = "";
          let icon = "";
          if (isLocked) {
            buttonClass = "bg-[#e5e5e5] border-[#cccccc] cursor-not-allowed";
            icon = "🔒";
          } else if (isCompleted) {
            buttonClass = "bg-[#ffc800] border-[#cc9e00] hover:brightness-110 active:border-b-0 active:mt-[6px]";
            icon = "⭐";
          } else if (isActive) {
            buttonClass = "bg-[#58cc02] border-[#46a302] hover:brightness-110 active:border-b-0 active:mt-[6px]";
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
                className={`relative w-[80px] h-[80px] rounded-full flex items-center justify-center transition-all border-b-[6px] ${buttonClass}`}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-[#58cc02] -z-10"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                
                <span className={`text-4xl drop-shadow-md ${isLocked ? 'grayscale opacity-50' : ''}`}>
                  {icon}
                </span>
              </button>

              <div className="mt-4 bg-white px-3 py-1.5 rounded-xl border-2 border-gray-200 text-center">
                <p className={`text-[13px] font-bold tracking-wide ${isLocked ? "text-gray-400" : "text-gray-800"}`}>
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
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setSelectedModule(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl p-6 pb-safe z-[70]"
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
              
              {MODULES.map(m => m.id === selectedModule && (
                <div key={m.id} className="flex flex-col">
                  <h3 className="text-2xl font-black text-gray-800 mb-2">{m.title}</h3>
                  <p className="text-gray-500 font-medium mb-6">{m.desc}</p>
                  
                  <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 mb-6">
                    <span className="text-3xl drop-shadow-sm">💎</span>
                    <div>
                      <p className="text-[11px] font-bold text-[#1cb0f6] uppercase tracking-wider">Reward</p>
                      <p className="text-lg font-black text-blue-900">+50 Watts</p>
                    </div>
                  </div>

                  <button
                    className="w-full bg-[#58cc02] border-b-[6px] border-[#46a302] hover:bg-[#61e002] active:border-b-0 active:translate-y-[6px] text-white font-black text-xl rounded-2xl py-4 transition-all"
                    onClick={() => {
                      router.push(`/${locale}/play/${selectedModule}`);
                    }}
                  >
                    START MISSION
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

