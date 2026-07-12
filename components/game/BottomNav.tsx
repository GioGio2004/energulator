"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TABS = [
  { id: "play", label: "PLAY" },
  { id: "daily", label: "DAILY" },
  { id: "ranks", label: "RANKS" },
  { id: "profile", label: "PROFILE" },
];

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState("play");

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 px-4 flex justify-center pointer-events-none pb-safe">
      <nav className="pointer-events-auto relative flex items-center justify-between w-full max-w-md bg-[#3a7533]/70 backdrop-blur-xl border border-white/30 rounded-[2rem] h-[68px] px-1.5 shadow-lg">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 h-[56px] flex items-center justify-center z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 bg-white/20 border border-white/50 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3)] rounded-[1.8rem] -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span 
                className={`text-[13px] tracking-widest font-medium transition-colors duration-200 ${
                  isActive ? 'text-white drop-shadow-md' : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
