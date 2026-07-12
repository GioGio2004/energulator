"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// ─── constants ──────────────────────────────────────────────────────────────
const RATE = 0.18;        // $ per kWh
const START_HOUR = 7;     // 7 AM
const END_HOUR = 23;      // 11 PM
const TOTAL_HOURS = END_HOUR - START_HOUR;
const REAL_MS = 20000;    // 20 real seconds for the whole day
const DUSK_HOUR = 18;
const NIGHT_HOUR = 21;

// ─── appliance definitions ───────────────────────────────────────────────────
interface Appliance {
  id: string;
  name: string;
  icon: string;
  watts: number;
  room: string;
  // if alwaysOn, fridge-style: starts on, disabling is the lesson
  alwaysOn?: boolean;
  // hint shown when it's on past a threshold
  nightHint?: string;
}

const APPLIANCES: Appliance[] = [
  {
    id: "lamp",
    name: "Lamp",
    icon: "💡",
    watts: 40,
    room: "Living Room",
    nightHint: "Lamp still on — is anyone in the living room?",
  },
  {
    id: "tv",
    name: "TV",
    icon: "📺",
    watts: 150,
    room: "Living Room",
    nightHint: "TV's been running all day. Nobody's watching it now.",
  },
  {
    id: "fridge",
    name: "Fridge",
    icon: "🧊",
    watts: 100,
    room: "Kitchen",
    alwaysOn: true,
  },
  {
    id: "ac",
    name: "Air Con",
    icon: "❄️",
    watts: 1500,
    room: "Bedroom",
    nightHint: "AC still on overnight — that's your most expensive appliance!",
  },
];

type Phase = "intro" | "running" | "done";
type Toast = { id: number; text: string };

function formatClock(hour24: number) {
  const h = Math.floor(hour24) % 24;
  const m = Math.floor((hour24 % 1) * 60);
  const ampm = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function dollarColor(cost: number) {
  if (cost === 0) return "text-white/60";
  if (cost < 0.05) return "text-green-300";
  if (cost < 0.2) return "text-yellow-300";
  return "text-red-300";
}

// ─── component ───────────────────────────────────────────────────────────────
export default function HouseGame() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const completeLesson = useMutation(api.game.completeLesson);
  const updateActiveModule = useMutation(api.game.updateActiveModule);

  // appliance on/off state
  const [onStates, setOnStates] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      APPLIANCES.map((a) => [a.id, a.alwaysOn ? true : false])
    )
  );

  const [phase, setPhase] = useState<Phase>("intro");
  const [elapsedHours, setElapsedHours] = useState(0);
  const [kwhMap, setKwhMap] = useState<Record<string, number>>(() =>
    Object.fromEntries(APPLIANCES.map((a) => [a.id, 0]))
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // refs for rAF loop
  const lastTickRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const onStatesRef = useRef(onStates);
  const kwhRef = useRef<Record<string, number>>(
    Object.fromEntries(APPLIANCES.map((a) => [a.id, 0]))
  );
  const shownToastsRef = useRef<Set<string>>(new Set());
  const toastIdRef = useRef(0);

  // keep refs in sync
  useEffect(() => {
    onStatesRef.current = onStates;
  }, [onStates]);

  function pushToast(text: string, key: string) {
    if (shownToastsRef.current.has(key)) return;
    shownToastsRef.current.add(key);
    const id = ++toastIdRef.current;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }

  function tick(ts: number) {
    if (lastTickRef.current === null) lastTickRef.current = ts;
    const deltaMs = ts - lastTickRef.current;
    lastTickRef.current = ts;
    const deltaHours = (deltaMs / REAL_MS) * TOTAL_HOURS;

    setElapsedHours((prev) => {
      const next = Math.min(TOTAL_HOURS, prev + deltaHours);
      const clockHour = START_HOUR + next;

      // accumulate kWh per appliance
      APPLIANCES.forEach((a) => {
        if (onStatesRef.current[a.id]) {
          kwhRef.current[a.id] += (a.watts / 1000) * deltaHours;
        }
      });
      setKwhMap({ ...kwhRef.current });

      // toasts at dusk / night
      if (clockHour >= DUSK_HOUR) {
        APPLIANCES.forEach((a) => {
          if (!a.alwaysOn && a.nightHint && onStatesRef.current[a.id]) {
            pushToast(a.nightHint, `dusk-${a.id}`);
          }
        });
      }
      if (clockHour >= NIGHT_HOUR) {
        APPLIANCES.forEach((a) => {
          if (!a.alwaysOn && onStatesRef.current[a.id]) {
            pushToast(
              `It's 9 PM — ${a.name} is still running.`,
              `night-${a.id}`
            );
          }
        });
      }

      if (next >= TOTAL_HOURS) {
        setPhase("done");
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
      return next;
    });
  }

  function startDay() {
    setPhase("running");
    lastTickRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }

  function toggleAppliance(id: string) {
    const appliance = APPLIANCES.find((a) => a.id === id)!;
    if (appliance.alwaysOn) {
      // fridge special: one-time toast lesson
      pushToast(
        "The fridge has to stay on — food would spoil without it. Some things just need power 24/7.",
        "fridge-locked"
      );
      return;
    }
    setOnStates((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastTickRef.current = null;
    kwhRef.current = Object.fromEntries(APPLIANCES.map((a) => [a.id, 0]));
    shownToastsRef.current = new Set();
    setPhase("intro");
    setOnStates(
      Object.fromEntries(APPLIANCES.map((a) => [a.id, a.alwaysOn ? true : false]))
    );
    setElapsedHours(0);
    setKwhMap(Object.fromEntries(APPLIANCES.map((a) => [a.id, 0])));
    setToasts([]);
    setIsSaving(false);
  }

  async function handleContinue() {
    setIsSaving(true);
    try {
      await completeLesson({ lessonId: "module_meter_1", wattsEarned: 75 });
      await updateActiveModule({ moduleId: "module_breakers_1" });
    } catch (e) {
      console.error(e);
    }
    router.push(`/${locale}/dashboard`);
  }

  // derived values
  const clockHour = START_HOUR + elapsedHours;
  const nightOpacity = Math.max(
    0,
    Math.min(1, (clockHour - DUSK_HOUR) / (NIGHT_HOUR - DUSK_HOUR))
  );
  const totalKwh = Object.values(kwhMap).reduce((s, v) => s + v, 0);
  const totalCost = totalKwh * RATE;
  const monthlyCost = totalCost * 30;

  // ─── intro screen ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <main className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center px-6 bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
        <div className="absolute inset-0 opacity-30">
          <Image src="/day-firstplay.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />

        <div className="relative z-10 w-full max-w-sm text-center">
          <div className="text-7xl mb-6 drop-shadow-2xl">🏠</div>
          <h1 className="text-white text-4xl font-extrabold mb-3 drop-shadow-lg">
            The Watt House
          </h1>
          <p className="text-white/80 text-base font-medium mb-8 leading-relaxed">
            A whole day compressed into 20 seconds. Four appliances, one house.
            You decide what runs — and the meter never stops.
          </p>

          {/* appliance preview */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {APPLIANCES.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-3"
              >
                <span className="text-3xl">{a.icon}</span>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">{a.name}</p>
                  <p className="text-white/60 text-xs">{a.watts}W</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={startDay}
            className="w-full rounded-2xl bg-[#58cc02] border-b-[5px] border-[#46a302] hover:brightness-110 active:border-b-0 active:translate-y-1 text-white font-extrabold text-xl py-4 transition-all shadow-xl"
          >
            Start the Day →
          </button>
        </div>
      </main>
    );
  }

  // ─── done screen ──────────────────────────────────────────────────────────
  if (phase === "done") {
    // sort appliances by cost desc
    const sorted = [...APPLIANCES].sort(
      (a, b) => kwhMap[b.id] * RATE - kwhMap[a.id] * RATE
    );
    const biggest = sorted[0];

    return (
      <main className="relative h-screen w-full overflow-hidden flex items-center justify-center px-4 bg-[#0a0a1a]">
        <div className="absolute inset-0 opacity-40">
          <Image src="/first-gamenight.png" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl p-7">
          <div className="text-center mb-5">
            <p className="text-white text-2xl font-extrabold drop-shadow mb-1">
              The day is over 🌙
            </p>
            <p className="text-white/70 text-sm font-medium">
              Here&apos;s what the house actually cost today.
            </p>
          </div>

          {/* per-appliance breakdown */}
          <div className="space-y-2 mb-5">
            {sorted.map((a) => {
              const cost = kwhMap[a.id] * RATE;
              const pct = totalCost > 0 ? (cost / totalCost) * 100 : 0;
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/20 px-4 py-2.5"
                >
                  <span className="text-2xl">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-white font-bold text-sm">{a.name}</p>
                      <p className={`font-extrabold text-sm tabular-nums ${dollarColor(cost)}`}>
                        ${cost.toFixed(3)}
                      </p>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* totals */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-2xl bg-white/10 border border-white/20 py-3 text-center">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                Today
              </p>
              <p className="text-white text-xl font-extrabold tabular-nums">
                ${totalCost.toFixed(3)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 py-3 text-center">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                Per Month
              </p>
              <p className="text-white text-xl font-extrabold tabular-nums">
                ${monthlyCost.toFixed(2)}
              </p>
            </div>
          </div>

          {/* insight */}
          <div className="rounded-2xl bg-yellow-300/20 border border-yellow-200/30 px-4 py-3 mb-5">
            <p className="text-white text-sm font-bold leading-snug drop-shadow text-center">
              {biggest && kwhMap[biggest.id] > 0
                ? `Your ${biggest.name} used the most energy today — ${(kwhMap[biggest.id]).toFixed(3)} kWh.${biggest.id === "ac" ? " Air con is powerful. Use it wisely." : ""}`
                : "Great job — you kept everything off! $0 today, $0 every month."}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 rounded-2xl bg-white/20 border border-white/30 text-white font-bold py-3 transition-all hover:bg-white/30"
            >
              Try Again
            </button>
            <button
              onClick={handleContinue}
              disabled={isSaving}
              className="flex-1 rounded-2xl bg-[#58cc02] border-b-[5px] border-[#46a302] hover:brightness-110 active:border-b-0 active:translate-y-1 text-white font-extrabold py-3 transition-all disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "+75 Watts →"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── running screen ───────────────────────────────────────────────────────
  return (
    <main className="relative h-screen w-full overflow-hidden select-none flex flex-col">
      {/* day background */}
      <div className="absolute inset-0">
        <Image src="/day-firstplay.jpg" alt="" fill priority className="object-cover" />
      </div>
      {/* night crossfade */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: nightOpacity }}
      >
        <Image src="/first-gamenight.png" alt="" fill className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-black/25" />

      {/* clock bar */}
      <div className="relative z-20 flex-shrink-0 flex justify-center pt-5">
        <div className="flex items-center gap-4 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 px-6 py-2.5 shadow-lg">
          <span className="text-white font-extrabold text-lg tabular-nums drop-shadow">
            {formatClock(clockHour)}
          </span>
          {/* progress bar */}
          <div className="w-28 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${(elapsedHours / TOTAL_HOURS) * 100}%` }}
            />
          </div>
          <span className="text-white font-extrabold text-lg tabular-nums drop-shadow">
            {formatClock(END_HOUR)}
          </span>
        </div>
      </div>

      {/* toasts */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-[90%] max-w-md z-30">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-fade-in-up rounded-2xl bg-black/50 backdrop-blur-xl border border-white/20 px-5 py-3 text-center shadow-lg"
          >
            <p className="text-white font-semibold text-sm leading-snug drop-shadow">
              {t.text}
            </p>
          </div>
        ))}
      </div>

      {/* appliance grid */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4">
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
          {APPLIANCES.map((a) => {
            const isOn = onStates[a.id];
            const cost = kwhMap[a.id] * RATE;
            return (
              <button
                key={a.id}
                onClick={() => toggleAppliance(a.id)}
                className={`
                  relative flex flex-col items-center justify-center rounded-3xl border p-4 transition-all duration-200
                  ${isOn
                    ? "bg-white/25 border-white/50 shadow-lg shadow-white/10"
                    : "bg-black/20 border-white/15 opacity-70"
                  }
                  ${a.alwaysOn ? "cursor-default" : "hover:scale-[1.03] active:scale-[0.97]"}
                `}
              >
                {/* always-on badge */}
                {a.alwaysOn && (
                  <div className="absolute top-2 right-2 rounded-full bg-white/25 px-2 py-0.5">
                    <span className="text-white text-[9px] font-bold uppercase tracking-wider">Always On</span>
                  </div>
                )}

                <span
                  className={`text-4xl mb-2 transition-all duration-300 ${
                    isOn ? "drop-shadow-[0_0_12px_rgba(255,220,100,0.8)]" : "grayscale opacity-50"
                  }`}
                >
                  {a.icon}
                </span>
                <p className="text-white font-bold text-sm text-center leading-tight">
                  {a.name}
                </p>
                <p className="text-white/60 text-xs mt-0.5">{a.watts}W</p>
                <p className={`text-sm font-extrabold tabular-nums mt-1.5 ${dollarColor(cost)}`}>
                  ${cost.toFixed(3)}
                </p>

                {/* on/off pill */}
                {!a.alwaysOn && (
                  <div
                    className={`mt-2 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isOn ? "bg-green-400/30 text-green-200 border border-green-300/40" : "bg-white/10 text-white/50 border border-white/20"
                    }`}
                  >
                    {isOn ? "ON" : "OFF"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* live total */}
      <div className="relative z-20 flex-shrink-0 px-4 pb-8">
        <div className="max-w-sm mx-auto rounded-3xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-xl px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">
                Total used
              </p>
              <p className="text-white text-2xl font-extrabold tabular-nums drop-shadow">
                {totalKwh.toFixed(3)} kWh
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">
                Running cost
              </p>
              <p className="text-white text-2xl font-extrabold tabular-nums drop-shadow">
                ${totalCost.toFixed(3)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
