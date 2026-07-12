"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRive } from "@rive-app/react-canvas";
import LightbulbGame from "@/components/game/steps/firststep";

// ─── Preloader ────────────────────────────────────────────────────────────────

function RivePreloader({ onDone }: { onDone: () => void }) {
  const { RiveComponent, rive } = useRive({
    src: "/revibg.riv",
    autoplay: true,
    onLoad: () => {
      // Animation loaded — start the minimum display timer
    },
  });

  const [dots, setDots] = useState(".");
  const [progress, setProgress] = useState(0);

  // Animated loading dots
  useEffect(() => {
    const t = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 450);
    return () => clearInterval(t);
  }, []);

  // Progress bar + done trigger
  useEffect(() => {
    const DURATION = 3500;
    const INTERVAL = 60;
    const step = (INTERVAL / DURATION) * 100;
    let current = 0;

    const t = setInterval(() => {
      current += step;
      if (current >= 100) {
        current = 100;
        clearInterval(t);
        setTimeout(onDone, 200); // slight hold at 100%
      }
      setProgress(Math.min(100, current));
    }, INTERVAL);

    return () => clearInterval(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060612] overflow-hidden">
      {/* Ambient grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.18) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.18) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#060612_85%)] pointer-events-none" />

      {/* Corner decorations */}
      {[
        "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
        "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
        "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
        "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-8 h-8 ${cls}`}
          style={{ borderColor: "rgba(34,211,238,0.35)" }}
        />
      ))}

      {/* Rive canvas */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ width: 280, height: 280 }}
      >
        {/* Glow behind canvas */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
          }}
        />
        <RiveComponent className="w-full h-full" />
      </div>

      {/* Title */}
      <div className="relative z-10 mt-6 text-center">
        <h1
          className="text-2xl font-extrabold tracking-widest uppercase mb-1"
          style={{
            background: "linear-gradient(90deg,#22d3ee,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Energulator
        </h1>
        <p className="text-white/30 text-xs font-semibold tracking-widest uppercase">
          Electricity Grid Module
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mt-8 w-52">
        <div
          className="w-full h-1 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: progress + "%",
              background: "linear-gradient(90deg,#22d3ee,#a855f7)",
              boxShadow: "0 0 12px rgba(34,211,238,0.6)",
              transition: "width 0.06s linear",
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color: "rgba(34,211,238,0.6)" }}
          >
            {Math.round(progress)}%
          </span>
          <span className="text-white/25 text-xs font-semibold tracking-widest">
            Loading{dots}
          </span>
        </div>
      </div>

      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 4px)",
        }}
      />
    </div>
  );
}

// ─── GameWrapper ──────────────────────────────────────────────────────────────

export default function GameWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const [showGame, setShowGame] = useState(false);

  function handleLoadDone() {
    setIsLoading(false);
    // Slight delay so exit animation plays before game mounts
    setTimeout(() => setShowGame(true), 400);
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="preloader"
            className="absolute inset-0 z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <RivePreloader onDone={handleLoadDone} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGame && (
          <motion.div
            key="game"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <LightbulbGame />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
