"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TopHeader() {
  const gameStatus = useQuery(api.game.getGameStatus);

  return (
    <div className="fixed top-4 inset-x-4 z-50 pt-safe pointer-events-none">
      <header className="pointer-events-auto h-14 rounded-[2rem] glass-pill flex items-center justify-between px-5 max-w-4xl mx-auto">
        <div className="flex items-center">
          <span className="text-xl font-black text-[#58cc02] tracking-widest uppercase">
            MyEnerge
          </span>
        </div>
        <div className="flex items-center gap-2">
          {gameStatus != null && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-gray-100 hover:bg-white transition-colors cursor-pointer shadow-sm">
                <span className="text-lg">🔥</span>
                <span className="text-[14px] font-bold text-[#ff9600]">{gameStatus.streak}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-gray-100 hover:bg-white transition-colors cursor-pointer shadow-sm">
                <span className="text-lg">💎</span>
                <span className="text-[14px] font-bold text-[#1cb0f6]">{gameStatus.watts}</span>
              </div>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
