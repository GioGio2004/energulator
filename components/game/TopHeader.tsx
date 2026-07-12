"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TopHeader() {
  const gameStatus = useQuery(api.game.getGameStatus);

  return (
    <div className="fixed top-4 inset-x-4 z-50 pt-safe pointer-events-none">
      <header className="pointer-events-auto h-14 rounded-[2rem] glass-panel flex items-center justify-between px-5 max-w-4xl mx-auto">
        <div className="flex items-center">
          <span className="text-xl font-black text-white tracking-widest uppercase text-glow">
            MyEnerge
          </span>
        </div>
        <div className="flex items-center gap-2">
          {gameStatus != null && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer shadow-inner">
                <span className="text-lg drop-shadow-[0_0_8px_rgba(255,150,0,0.8)]">🔥</span>
                <span className="text-[14px] font-bold text-orange-400 drop-shadow">{gameStatus.streak}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer shadow-inner">
                <span className="text-lg drop-shadow-[0_0_8px_rgba(28,176,246,0.8)]">⚡</span>
                <span className="text-[14px] font-bold text-cyan-400 drop-shadow">{gameStatus.watts}</span>
              </div>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
