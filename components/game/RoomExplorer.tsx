"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Application } from "@splinetool/runtime";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

const SPLINE_SCENE_URL = "https://prod.spline.design/xsx77uikEbJ8D9PF/scene.splinecode";

// Distance threshold (in Spline world units) before a lamp button appears
const PROXIMITY_THRESHOLD = 800;

export default function RoomExplorer() {
  // Loading state
  const [isLoaded, setIsLoaded] = useState(false);

  // Proximity visibility — controlled by the GSAP ticker
  const [showTableBtn, setShowTableBtn] = useState(false);
  const [showFloorBtn, setShowFloorBtn] = useState(false);

  // Light on/off state
  const [tableOn, setTableOn] = useState(false);
  const [floorOn, setFloorOn] = useState(false);

  // Running cost accumulator
  const [usageCost, setUsageCost] = useState(0);

  // Refs for Spline objects — never stale inside the ticker
  const splineRef = useRef<Application | null>(null);
  const characterRef = useRef<any>(null);
  const tableLampRef = useRef<any>(null);
  const floorLampRef = useRef<any>(null);

  // Refs to track previous proximity booleans to avoid React re-render storms
  const prevTableNear = useRef(false);
  const prevFloorNear = useRef(false);

  // ── 1. Spline Load Handler ───────────────────────────────────────────────
  function onLoad(spline: Application) {
    splineRef.current = spline;

    // Cache scene objects immediately
    characterRef.current = spline.findObjectByName("Child");
    tableLampRef.current = spline.findObjectByName("Table_Lamp");
    floorLampRef.current = spline.findObjectByName("Floor_Lamp");

    // Debug connection report
    console.log("=== SPLINE LOAD REPORT ===");
    console.log("Character (Child):", characterRef.current ? "✅ FOUND" : "❌ MISSING");
    console.log("Table_Lamp:", tableLampRef.current ? "✅ FOUND" : "❌ MISSING");
    console.log("Floor_Lamp:", floorLampRef.current ? "✅ FOUND" : "❌ MISSING");

    setIsLoaded(true);
  }

  // ── 2. GSAP Ticker — Spatial Proximity Loop ───────────────────────────────
  useGSAP(() => {
    if (!isLoaded) return;

    function tick() {
      const char = characterRef.current;
      const tableLamp = tableLampRef.current;
      const floorLamp = floorLampRef.current;

      if (!char) return;

      // TABLE LAMP proximity check
      if (tableLamp) {
        const distTable = Math.hypot(
          tableLamp.position.x - char.position.x,
          tableLamp.position.z - char.position.z
        );
        const nearTable = distTable < PROXIMITY_THRESHOLD;
        if (nearTable !== prevTableNear.current) {
          prevTableNear.current = nearTable;
          setShowTableBtn(nearTable);
        }
      }

      // FLOOR LAMP proximity check
      if (floorLamp) {
        const distFloor = Math.hypot(
          floorLamp.position.x - char.position.x,
          floorLamp.position.z - char.position.z
        );
        const nearFloor = distFloor < PROXIMITY_THRESHOLD;
        if (nearFloor !== prevFloorNear.current) {
          prevFloorNear.current = nearFloor;
          setShowFloorBtn(nearFloor);
        }
      }
    }

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, { dependencies: [isLoaded] });

  // ── 3. GSAP Light Intensity Animations ─────────────────────────────────
  useGSAP(() => {
    if (!splineRef.current) return;

    // --- TABLE LAMP ---
    const tLamp = splineRef.current.findObjectByName('Table_Lamp') as any;
    if (tLamp) {
      const tLight = tLamp.children?.find((c: any) => c.name === 'Spot Light');
      if (tLight) {
        gsap.to(tLight, { intensity: tableOn ? 20 : 0, duration: 0.3 });
      }
    }

    // --- FLOOR LAMP ---
    const fLamp = splineRef.current.findObjectByName('Floor_Lamp') as any;
    if (fLamp) {
      const fLight = fLamp.children?.find((c: any) => c.name === 'Spot Light');
      if (fLight) {
        gsap.to(fLight, { intensity: floorOn ? 20 : 0, duration: 0.3 });
      }
    }
  }, { dependencies: [tableOn, floorOn] });

  // ── 4. Cost Accumulator ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(() => {
      const inc = (tableOn ? 0.05 : 0) + (floorOn ? 0.08 : 0);
      if (inc > 0) setUsageCost((prev) => prev + inc);
    }, 1000);
    return () => clearInterval(interval);
  }, [tableOn, floorOn, isLoaded]);

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-[#a695f9]">

      {/* ── 3D Canvas (bg layer) ─────────────────────────────────────────── */}
      <Spline
        scene={SPLINE_SCENE_URL}
        onLoad={onLoad}
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />

      {/* ── Loading Overlay ──────────────────────────────────────────────── */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[#a695f9]">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/70 font-bold tracking-widest text-xs uppercase">Loading Room…</p>
        </div>
      )}

      {/* ── Master UI Overlay (pointer-events-none so Spline stays draggable) */}
      <div className="z-10 absolute inset-0 pointer-events-none flex flex-col justify-between p-6
                      pt-[max(env(safe-area-inset-top),24px)] pb-[max(env(safe-area-inset-bottom),24px)]">

        {/* ── TOP ROW: Back + Usage Cost ─────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">

          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="pointer-events-auto flex items-center justify-center w-11 h-11 rounded-2xl
                       bg-black/25 backdrop-blur-xl border border-white/20 shadow-lg
                       hover:bg-black/40 transition-all active:scale-95"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Usage Cost — top‑center pill */}
          <div className="pointer-events-auto flex items-center gap-3 bg-black/30 backdrop-blur-2xl
                          border border-white/20 px-5 py-2.5 rounded-2xl shadow-xl">
            <svg className="w-4 h-4 text-[#58cc02]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase">Usage Cost</span>
            <span className="text-lg font-black text-[#58cc02] font-mono tracking-tight tabular-nums">
              ${usageCost.toFixed(2)}
            </span>
          </div>

          {/* Spacer to keep cost truly centred */}
          <div className="w-11" />
        </div>

        {/* ── BOTTOM: Proximity Lamp Buttons ─────────────────────────────── */}
        <div className="flex justify-center items-end gap-4">
          <AnimatePresence>

            {/* TABLE LAMP button — appears when character is near */}
            {showTableBtn && (
              <motion.button
                key="table-btn"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={() => setTableOn((v) => !v)}
                className={`pointer-events-auto relative flex flex-col items-center justify-center gap-3
                            px-8 py-5 rounded-[1.5rem] font-bold overflow-hidden
                            backdrop-blur-3xl border shadow-[0_16px_64px_rgba(0,0,0,0.4)]
                            transition-colors
                            ${tableOn
                              ? "bg-yellow-400/20 border-yellow-400/40"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                            }`}
              >
                {/* Glow stripe */}
                {tableOn && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-yellow-400 blur-sm rounded-full" />
                )}
                <svg
                  className={`w-8 h-8 transition-all duration-300
                    ${tableOn ? "text-yellow-400 drop-shadow-[0_0_14px_rgba(250,204,21,0.9)]" : "text-white/50"}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className={`text-[10px] font-black tracking-widest uppercase
                  ${tableOn ? "text-yellow-400" : "text-white/60"}`}>
                  Table Lamp
                </span>
              </motion.button>
            )}

            {/* FLOOR LAMP button — appears when character is near */}
            {showFloorBtn && (
              <motion.button
                key="floor-btn"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={() => setFloorOn((v) => !v)}
                className={`pointer-events-auto relative flex flex-col items-center justify-center gap-3
                            px-8 py-5 rounded-[1.5rem] font-bold overflow-hidden
                            backdrop-blur-3xl border shadow-[0_16px_64px_rgba(0,0,0,0.4)]
                            transition-colors
                            ${floorOn
                              ? "bg-cyan-400/20 border-cyan-400/40"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                            }`}
              >
                {floorOn && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-cyan-400 blur-sm rounded-full" />
                )}
                <svg
                  className={`w-8 h-8 transition-all duration-300
                    ${floorOn ? "text-cyan-400 drop-shadow-[0_0_14px_rgba(34,211,238,0.9)]" : "text-white/50"}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 19V5m0 14a2 2 0 100-4 2 2 0 000 4zm-4-14h8M8 5v2m8-2v2" />
                </svg>
                <span className={`text-[10px] font-black tracking-widest uppercase
                  ${floorOn ? "text-cyan-400" : "text-white/60"}`}>
                  Floor Lamp
                </span>
              </motion.button>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
