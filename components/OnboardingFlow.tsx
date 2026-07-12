"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Step1 from "./onboarding/Step1";
import Step2 from "./onboarding/Step2";
import Step3 from "./onboarding/Step3";
import Step4 from "./onboarding/Step4";

export interface OnboardingData {
  baseType: string;
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 25 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? -100 : 100,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
};

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    baseType: "",
  });

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

  return (
    <div className="fixed inset-0 bg-[#f9faf8] flex flex-col overflow-hidden font-sans">
      {/* Soft organic decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#b4c5b0] opacity-20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#8a9eb5] opacity-20 rounded-full blur-[80px]" />

      {/* Header / Back Button */}
      <div className="relative z-20 flex-shrink-0 pt-safe px-6 h-20 flex items-center justify-between">
        {step > 0 && step < 3 && (
          <button 
            onClick={goBack}
            className="w-12 h-12 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-full shadow-sm text-[#8a9eb5] hover:text-[#5c6e80] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-safe">
        <div className="w-full max-w-md h-full flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex-1 flex flex-col justify-center"
            >
              {step === 0 && <Step1 onNext={goNext} />}
              {step === 1 && <Step2 data={data} setData={setData} onNext={goNext} />}
              {step === 2 && <Step3 onNext={goNext} />}
              {step === 3 && <Step4 data={data} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
