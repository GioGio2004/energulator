"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const WATTAGE = 60;
const RATE = 0.18;
const START_HOUR = 7;
const END_HOUR = 23;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const REAL_MS = 5500;
const DUSK_HOUR = 18;
const NIGHT_HOUR = 21;

type Phase = "idle" | "running" | "done";

function formatClock(h24: number) {
  const h = Math.floor(h24) % 24;
  const m = Math.floor((h24 % 1) * 60);
  const ampm = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return h12 + ":" + String(m).padStart(2, "0") + " " + ampm;
}

export default function LightbulbGame() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const completeLesson = useMutation(api.game.completeLesson);
  const updateActiveModule = useMutation(api.game.updateActiveModule);

  const [phase, setPhase] = useState<Phase>("idle");
  const [lightOn, setLightOn] = useState(false);
  const [elapsedHours, setElapsedHours] = useState(0);
  const [kwh, setKwh] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [bulbScale, setBulbScale] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [nudgeKey, setNudgeKey] = useState(0);

  const lastTickRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lightOnRef = useRef(false);
  const kwhRef = useRef(0);
  const duskNudgeRef = useRef(false);

  useEffect(() => {
    lightOnRef.current = lightOn;
  }, [lightOn]);

  useEffect(() => {
    if (phase !== "idle") return;
    const t = setTimeout(() => setShowHint(true), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  function tick(ts: number) {
    if (lastTickRef.current === null) lastTickRef.current = ts;
    const deltaMs = ts - lastTickRef.current;
    lastTickRef.current = ts;
    const deltaHours = (deltaMs / REAL_MS) * TOTAL_HOURS;

    setElapsedHours((prev) => {
      const next = Math.min(TOTAL_HOURS, prev + deltaHours);
      if (lightOnRef.current) {
        kwhRef.current += (WATTAGE / 1000) * deltaHours;
        setKwh(kwhRef.current);
      }
      const clockHour = START_HOUR + next;
      if (clockHour >= DUSK_HOUR && !duskNudgeRef.current) {
        duskNudgeRef.current = true;
        setNudgeKey((k) => k + 1);
      }
      if (next >= TOTAL_HOURS) {
        setPhase("done");
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
      return next;
    });
  }

  function handleBulbClick() {
    if (phase === "done") return;
    const newState = !lightOn;
    setLightOn(newState);
    lightOnRef.current = newState;
    setBulbScale(0.86);
    setTimeout(() => setBulbScale(1), 180);
    if (phase === "idle") {
      setPhase("running");
      setShowHint(false);
      lastTickRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    }
  }

  function reset() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastTickRef.current = null;
    kwhRef.current = 0;
    duskNudgeRef.current = false;
    setPhase("idle");
    setLightOn(false);
    lightOnRef.current = false;
    setElapsedHours(0);
    setKwh(0);
    setIsSaving(false);
    setBulbScale(1);
    setShowHint(false);
    setNudgeKey(0);
  }

  async function handleContinue() {
    setIsSaving(true);
    try {
      await completeLesson({ lessonId: "module_electricity_1", wattsEarned: 50 });
      await updateActiveModule({ moduleId: "module_meter_1" });
    } catch (e) {
      console.error(e);
    }
    router.push("/" + locale + "/dashboard");
  }

  const clockHour = START_HOUR + elapsedHours;
  const progress = elapsedHours / TOTAL_HOURS;
  const nightOpacity = Math.max(0, Math.min(1, (clockHour - DUSK_HOUR) / (NIGHT_HOUR - DUSK_HOUR)));
  const duskOverlay = Math.max(0, Math.min(0.6, (clockHour - (DUSK_HOUR - 1)) / 2));
  const cost = kwh * RATE;
  const hoursOn = kwh / (WATTAGE / 1000);
  const monthlyCost = cost * 30;
  const isDusk = clockHour >= DUSK_HOUR;
  const isNight = clockHour >= NIGHT_HOUR;

  return (
    <main className="relative h-screen w-full overflow-hidden select-none">
      {/* Day background */}
      <div className="absolute inset-0">
        <Image src="/day-firstplay.jpg" alt="" fill priority className="object-cover" />
      </div>

      {/* Night crossfade */}
      <div
        className="absolute inset-0"
        style={{ opacity: nightOpacity, transition: "opacity 0.8s ease" }}
      >
        <Image src="/first-gamenight.png" alt="" fill className="object-cover" />
      </div>

      {/* Dusk warm gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-amber-700/0 via-orange-600/20 to-orange-900/50"
        style={{ opacity: duskOverlay, transition: "opacity 1s ease" }}
      />

      {/* Night dark veil */}
      <div
        className="absolute inset-0 bg-black/25"
        style={{ opacity: nightOpacity * 0.6, transition: "opacity 1s ease" }}
      />

      {/* Clock + progress */}
      {phase !== "idle" && (
        <div
          className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-5 py-2.5 rounded-full"
          style={{
            background: "rgba(0,0,0,0.38)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            animation: "fadeIn 0.4s ease",
          }}
        >
          <span className="text-white font-bold text-base tabular-nums drop-shadow">
            {formatClock(clockHour)}
          </span>
          <div
            className="relative w-24 h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: (progress * 100) + "%",
                background: isDusk ? "linear-gradient(90deg,#f97316,#fbbf24)" : "rgba(255,255,255,0.9)",
                transition: "width 0.1s linear, background 1s ease",
              }}
            />
          </div>
          <span className="text-white/60 font-semibold text-sm tabular-nums">
            {formatClock(END_HOUR)}
          </span>
        </div>
      )}

      {/* Live cost ticker */}
      {phase === "running" && kwh > 0.001 && (
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-2xl"
          style={{
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,200,60,0.3)",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <span className="text-yellow-200 font-bold text-sm tabular-nums">
            {kwh.toFixed(3)} kWh &nbsp;·&nbsp; ${cost.toFixed(3)}
          </span>
        </div>
      )}

      {/* Dusk nudge bubble */}
      {phase === "running" && nudgeKey > 0 && (
        <div
          key={nudgeKey}
          className="absolute top-32 left-1/2 -translate-x-1/2 z-20 w-[88%] max-w-xs px-4 py-3 rounded-2xl text-center"
          style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,150,50,0.35)",
            animation: "slideDown 0.4s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <p className="text-orange-200 font-semibold text-xs leading-snug">
            {isNight
              ? "It is getting late. Is that light really needed?"
              : "The sun is setting. You can turn the light on now if you need it."}
          </p>
        </div>
      )}

      {/* Bulb area */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-10">
        {/* Glow halo */}
        <div
          className="absolute"
          style={{
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,210,60,0.5) 0%, rgba(255,170,0,0.18) 45%, transparent 72%)",
            opacity: lightOn ? 1 : 0,
            transition: "opacity 0.4s ease",
            animation: lightOn ? "haloBreath 2.4s ease-in-out infinite" : "none",
          }}
        />

        {/* Bulb */}
        <button
          onClick={handleBulbClick}
          disabled={phase === "done"}
          aria-label={lightOn ? "Turn light off" : "Turn light on"}
          style={{
            width: 148,
            height: 148,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: phase === "done" ? "default" : "pointer",
            transform: "scale(" + bulbScale + ")",
            transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.4s ease, background 0.4s ease, border-color 0.4s ease",
            background: lightOn
              ? "radial-gradient(circle at 38% 32%, rgba(255,245,180,0.98), rgba(255,200,40,0.92))"
              : "rgba(255,255,255,0.16)",
            backdropFilter: "blur(18px)",
            border: lightOn
              ? "2.5px solid rgba(255,230,80,0.85)"
              : "2px solid rgba(255,255,255,0.32)",
            boxShadow: lightOn
              ? "0 0 48px rgba(255,200,40,0.75), 0 0 100px rgba(255,200,40,0.28), inset 0 2px 0 rgba(255,255,255,0.5)"
              : "0 8px 32px rgba(0,0,0,0.22), inset 0 2px 0 rgba(255,255,255,0.18)",
          }}
        >
          <svg width="68" height="68" viewBox="0 0 24 24" fill="none">
            {/* Bulb body */}
            <path
              d="M9 21h6M10 18h4M12 3a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.7V16h5.6v-.5c0-.7.3-1.3.8-1.7A6 6 0 0 0 12 3Z"
              fill={lightOn ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)"}
              stroke={lightOn ? "rgba(255,200,40,0.7)" : "rgba(255,255,255,0.55)"}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {/* Shine */}
            {lightOn && (
              <circle cx="9.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.6)" />
            )}
          </svg>
        </button>

        {/* Caption pill */}
        <div
          style={{
            borderRadius: 999,
            padding: "8px 20px",
            background: "rgba(0,0,0,0.34)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.18)",
            opacity: (showHint || phase === "running") ? 1 : 0,
            transform: (showHint || phase === "running") ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <p className="text-white font-semibold text-sm drop-shadow text-center">
            {phase === "idle"
              ? "Tap the bulb to start your day"
              : lightOn
              ? "Light is ON — tap to turn off"
              : "Light is OFF — tap to turn on"}
          </p>
        </div>
      </div>

      {/* Result card */}
      {phase === "done" && (
        <div
          className="absolute inset-0 z-30 flex items-end justify-center pb-6 px-4"
          style={{ background: "rgba(0,0,0,0.52)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: "rgba(8,8,18,0.94)",
              backdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 -4px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
              animation: "slideUp 0.48s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {/* Top accent */}
            <div style={{ height: 3, background: "linear-gradient(90deg,#f59e0b,#ef4444,#a855f7)" }} />

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-5">
                <p className="text-white text-2xl font-extrabold mb-1">The day is over</p>
                <p className="text-white/45 text-sm">
                  {kwh < 0.001
                    ? "You kept the light off all day. Great habit!"
                    : "Here is what today's light actually cost."}
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div
                  className="rounded-2xl py-3 text-center"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <p className="text-white/45 text-xs font-bold uppercase tracking-wide mb-1">Hours on</p>
                  <p className="text-white text-lg font-extrabold tabular-nums">{hoursOn.toFixed(1)}<span className="text-xs font-semibold text-white/50">h</span></p>
                </div>
                <div
                  className="rounded-2xl py-3 text-center"
                  style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.22)" }}
                >
                  <p className="text-yellow-200/55 text-xs font-bold uppercase tracking-wide mb-1">Energy</p>
                  <p className="text-yellow-200 text-lg font-extrabold tabular-nums">{kwh.toFixed(2)}</p>
                  <p className="text-yellow-200/45 text-xs">kWh</p>
                </div>
                <div
                  className="rounded-2xl py-3 text-center"
                  style={{ background: "rgba(239,68,68,0.09)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <p className="text-red-300/55 text-xs font-bold uppercase tracking-wide mb-1">Cost</p>
                  <p className="text-red-300 text-lg font-extrabold tabular-nums">${cost.toFixed(2)}</p>
                </div>
              </div>

              {/* Monthly projection */}
              {kwh > 0.001 && (
                <div
                  className="rounded-2xl px-4 py-3 mb-4 text-center"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.22)" }}
                >
                  <p className="text-amber-200 text-sm font-bold">
                    Every day like this = ${monthlyCost.toFixed(2)} / month
                  </p>
                  <p className="text-amber-200/60 text-xs mt-0.5">just for one light</p>
                </div>
              )}

              {/* Education box */}
              <div
                className="rounded-2xl px-4 py-3 mb-5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <p className="text-white/80 text-xs font-bold mb-1.5">How electricity cost works</p>
                <p className="text-white/50 text-xs leading-relaxed">
                  Your meter measures energy in <span className="text-white/80 font-semibold">kilowatt-hours (kWh)</span>.
                  A 60W bulb on for 1 hour uses 0.06 kWh. Multiply by your rate
                  ($0.18/kWh) and you get the cost. Small habits — like turning off lights when
                  leaving a room — add up to real savings every month.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 rounded-2xl py-3.5 font-bold text-white/60 text-sm hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Try Again
                </button>
                <button
                  onClick={handleContinue}
                  disabled={isSaving}
                  className="flex-1 rounded-2xl py-3.5 font-extrabold text-white text-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg,#58cc02,#46a302)",
                    boxShadow: "0 4px 0 #2d6b00, 0 0 20px rgba(88,204,2,0.3)",
                  }}
                >
                  {isSaving ? "Saving..." : "+50 Watts"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes haloBreath {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes slideUp {
          from { transform: translateY(70px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
