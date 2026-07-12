"use client";

import { useParams } from "next/navigation";
import UtilitySortingGame from "@/components/game/UtilitySortingGame";
// import RoomExplorer from "@/components/game/RoomExplorer"; // ← re-enable when Spline is ready
import HouseGame from "@/components/game/steps/secondstep";

export default function PlayRoute() {
  const params = useParams();
  const moduleId = (params?.moduleId as string) || "module_electricity_1";
  const locale = (params?.locale as string) || "en";

  // Level 1 — Spline Room Explorer (temporarily disabled — swap comment below to re-enable)
  // if (moduleId === "module_electricity_1") {
  //   return (
  //     <div className="fixed inset-0 z-[100] overflow-hidden">
  //       <RoomExplorer />
  //     </div>
  //   );
  // }

  if (moduleId === "module_electricity_1") {
    return (
      <div className="fixed inset-0 z-[100] overflow-hidden bg-[#0d0d1a] flex items-center justify-center">
        {/* Animated background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#7c3aed]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#1cb0f6]/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        {/* Card */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm">
          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(124,58,237,0.3)]">
            <svg className="w-12 h-12 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>

          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-[#7c3aed]/20 border border-[#7c3aed]/40 text-[#a78bfa] text-[10px] font-black tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-ping" />
            Coming Soon
          </span>

          <h1 className="text-3xl font-black text-white mb-3 leading-tight">
            3D Room Explorer
          </h1>

          <p className="text-white/50 font-medium text-sm leading-relaxed mb-8">
            We&apos;re polishing the interactive 3D experience. Walk through a real home, flip the lights on and off, and watch your energy bill change in real time.
          </p>

          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20
                       text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Map
          </button>
        </div>
      </div>
    );
  }


  // Level 2 — The Whole House
  if (moduleId === "module_meter_1") {
    return (
      <div className="fixed inset-0 z-[100] overflow-hidden flex flex-col">
        <HouseGame />
      </div>
    );
  }

  // Fallback for all other modules
  return (
    <div className="fixed inset-0 z-[100] bg-[#edf3eb] overflow-hidden flex flex-col">
      <UtilitySortingGame moduleId={moduleId} locale={locale} />
    </div>
  );
}
