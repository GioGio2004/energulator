"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step1 from "./onboarding/Step1";
import Step2 from "./onboarding/Step2";
import Step3 from "./onboarding/Step3";
import Step4 from "./onboarding/Step4";
import GlassButton from "./GlassButton";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface OnboardingData {
  tariff: string;
  monthlyBill: number;
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 32 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
    transition: { duration: 0.15 },
  }),
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  const percentages = [20, 50, 75, 100];
  const pct = percentages[step] ?? 20;
  return (
    <div className="w-full mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-[#2d5a27] tracking-widest uppercase">
          Step {step + 1} of 4
        </span>
        <span className="text-xs font-bold text-[#2d5a27]">{pct}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-[#2d5a27]/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#2d5a27] to-[#4a8c42]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

// (Steps are now in separate files)

// ─── Main Onboarding Flow ─────────────────────────────────────────────────────
export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    tariff: "Standard Regional Rate",
    monthlyBill: 150,
  });

  // Lock body scroll on mount (for mobile full-screen)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const stepLabels = ["Tariff", "Bill", "Savings", "Account"];

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      {/* ── Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/energular-onboarding-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/52" />

      {/* ── Mobile layout: full-screen panel ── */}
      <div className="relative z-10 flex flex-col h-full md:items-center md:justify-center md:p-6">
        {/* Desktop: floating card wrapper */}
        <div className="flex flex-col h-full md:h-auto md:w-full md:max-w-lg md:rounded-[2rem] md:shadow-2xl md:shadow-[#2d5a27]/15 md:border md:border-white/60 bg-white/92 md:backdrop-blur-2xl overflow-hidden">
          {/* ── Header (fixed top) ── */}
          <div className="flex-shrink-0 px-5 pt-safe pt-5 sm:px-7 sm:pt-7 pb-0 bg-white/92 md:bg-transparent">
            {/* Branding */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-[#2d5a27] tracking-[0.2em] uppercase">
                ⚡ ENERGULATOR
              </span>
              {step > 0 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 text-sm font-bold text-[#2d5a27] hover:text-[#1e3d1b] active:scale-95 transition-all p-1"
                  aria-label="Go back"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M19 12H5M5 12l7 7M5 12l7-7" />
                  </svg>
                  Back
                </button>
              )}
            </div>

            {/* Step indicator bars */}
            <div className="flex items-center gap-1.5 mb-4">
              {stepLabels.map((label, i) => (
                <div
                  key={label}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                      i <= step ? "bg-[#2d5a27]" : "bg-[#2d5a27]/15"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${
                      i === step ? "text-[#2d5a27]" : "text-[#ccc]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <ProgressBar step={step} />
          </div>

          {/* ── Scrollable step content ── */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7 pb-4">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                {step === 0 && <Step1 data={data} setData={setData} />}
                {step === 1 && <Step2 data={data} setData={setData} />}
                {step === 2 && <Step3 data={data} />}
                {step === 3 && <Step4 data={data} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Footer CTA (fixed bottom, only steps 0–2) ── */}
          {step < 3 && (
            <div className="flex-shrink-0 px-5 sm:px-7 pb-safe pb-5 sm:pb-7 pt-3 bg-white/92 md:bg-transparent border-t border-[#2d5a27]/8">
              <GlassButton
                id={`next-btn-step-${step}`}
                onClick={goNext}
                className="w-full mb text-xl font-bold !text-[#2d5a27]"
              >
                {step === 2 ? "See My Savings Plan →" : "Continue →"}
              </GlassButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
