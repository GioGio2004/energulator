"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export default function TopHeader() {
  const gameStatus = useQuery(api.game.getGameStatus);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ka" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="fixed top-4 inset-x-4 z-50 pt-safe pointer-events-none">
      <header className="pointer-events-auto h-14 rounded-[2rem] glass-pill flex items-center justify-between px-5 max-w-4xl mx-auto">
        <div className="flex items-center">
          <span className="text-xl font-black text-[#58cc02] tracking-widest uppercase">
            MyEnerge
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleLanguage}
            disabled={isPending}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200 shadow-sm text-xs font-bold text-gray-700 uppercase"
          >
            {locale === "en" ? "EN" : "GE"}
          </button>
          
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
