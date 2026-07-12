"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const MODULES_MAP = [
  { id: "module_electricity_1", tPrefix: "module1" },
  { id: "module_meter_1", tPrefix: "module2" },
  { id: "module_breakers_1", tPrefix: "module3" },
  { id: "module_solar_1", tPrefix: "module4" },
  { id: "module_wind_1", tPrefix: "module5" },
];

export default function LearningMap() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const gameStatus = useQuery(api.game.getGameStatus);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const t = useTranslations("learningMap");

  if (gameStatus === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#58cc02]/30 border-t-[#58cc02] rounded-full animate-spin" />
      </div>
    );
  }

  if (gameStatus === null) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500 font-medium tracking-wide">No game data found. Start a lesson to begin!</p>
      </div>
    );
  }

  const { completedLessons, currentModuleId } = gameStatus;

  return (
    <div className="relative min-h-[120vh] w-full flex flex-col items-center pt-24 pb-32">
      {/* Background Track */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center mt-24">
        <svg
          className="w-full max-w-md h-[1000px] text-gray-300"
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
        {MODULES_MAP.map((mod, index) => {
          const isCompleted = completedLessons.includes(mod.id);
          const isActive = currentModuleId === mod.id;
          
          // DEMO MODE: Force lock all stages except the first one
          const isLocked = mod.id !== "module_electricity_1";
          const title = t(`${mod.tPrefix}_title` as const);

          const xOffset = index % 2 === 0 ? -40 : 40;

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

              <div className="mt-4 glass-pill px-4 py-1.5 rounded-xl text-center max-w-[140px]">
                <p className={`text-[13px] font-bold tracking-wide leading-tight ${isLocked ? "text-gray-400" : "text-gray-800"}`}>
                  {title}
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
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
              onClick={() => setSelectedModule(null)}
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
            >
              {/* ── COMING SOON popup for the 3D stage ── */}
              {selectedModule === "module_electricity_1" ? (
                <div className="relative w-full max-w-sm pointer-events-auto overflow-hidden rounded-3xl shadow-2xl bg-[#0d0d1a] border border-white/10">
                  {/* Ambient glows */}
                  <div className="absolute -top-20 -left-20 w-56 h-56 bg-[#7c3aed]/25 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-[#1cb0f6]/15 rounded-full blur-[80px] pointer-events-none" />

                  <div className="relative z-10 p-6 flex flex-col items-center text-center">
                    {/* Close */}
                    <button
                      onClick={() => setSelectedModule(null)}
                      className="absolute top-4 right-4 text-white/40 hover:text-white/80 bg-white/5 hover:bg-white/10 rounded-full p-1.5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Icon */}
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 mt-2 shadow-[0_0_40px_rgba(124,58,237,0.35)]">
                      <svg className="w-10 h-10 text-[#a78bfa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>

                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 bg-[#7c3aed]/20 border border-[#7c3aed]/40 text-[#c4b5fd] text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-ping" />
                      Coming Soon
                    </span>

                    <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                      3D Room Explorer
                    </h3>
                    <p className="text-white/50 text-sm font-medium leading-relaxed mb-6">
                      We&apos;re putting the finishing touches on an interactive 3D home experience — walk through a real room, flip the lights, and watch your bill change live.
                    </p>

                    {/* Divider with "stay tuned" */}
                    <div className="w-full flex items-center gap-3 mb-6">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-[10px] text-white/30 font-bold tracking-widest uppercase">Stay tuned</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <button
                      onClick={() => setSelectedModule(null)}
                      className="w-full flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/15 text-white font-bold text-sm py-3.5 rounded-2xl transition-all active:scale-95"
                    >
                      Got it, I&apos;ll wait!
                    </button>
                  </div>
                </div>

              ) : (
                /* ── Normal Start Mission popup for all other stages ── */
                <div className="glass-panel-light rounded-3xl p-6 w-full max-w-sm pointer-events-auto shadow-2xl">
                  {MODULES_MAP.map(m => {
                    if (m.id !== selectedModule) return null;
                    const title = t(`${m.tPrefix}_title` as const);
                    const desc = t(`${m.tPrefix}_desc` as const);
                    return (
                      <div key={m.id} className="flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-2xl font-black text-gray-900 leading-tight">{title}</h3>
                          <button
                            onClick={() => setSelectedModule(null)}
                            className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors flex-shrink-0"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-gray-600 font-medium mb-6">{desc}</p>

                        <div className="flex items-center gap-3 bg-blue-50/80 p-4 rounded-2xl border-2 border-blue-100 mb-6 shadow-sm">
                          <span className="text-3xl drop-shadow-sm">💎</span>
                          <div>
                            <p className="text-[11px] font-bold text-[#1cb0f6] uppercase tracking-wider">{t('reward')}</p>
                            <p className="text-lg font-black text-blue-900">+50 {t('watts')}</p>
                          </div>
                        </div>

                        <button
                          className="w-full bg-[#58cc02] border-b-[6px] border-[#46a302] hover:bg-[#61e002] active:border-b-0 active:translate-y-[6px] text-white font-black text-xl rounded-2xl py-4 transition-all"
                          onClick={() => router.push(`/${locale}/play/${selectedModule}`)}
                        >
                          {t('startMission')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
