"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TopHeader() {
  const gameStatus = useQuery(api.game.getGameStatus);

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-white border-b-2 border-gray-200 h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        {/* We can use a stylized icon or logo here later */}
        <span className="text-2xl font-black text-[#58cc02] tracking-widest uppercase ml-2">Intern</span>
      </div>
      <div className="flex items-center gap-3">
        {gameStatus !== undefined && (
          <>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="text-xl">🔥</span>
              <span className="text-[15px] font-bold text-[#ff9600]">{gameStatus.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="text-xl">💎</span>
              <span className="text-[15px] font-bold text-[#1cb0f6]">{gameStatus.watts}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
