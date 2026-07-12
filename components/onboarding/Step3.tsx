import { motion, useAnimation } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function Step3({ onNext }: { onNext: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (progress >= 100 && !isSuccess) {
      setIsSuccess(true);
      controls.start({
        scale: [1, 1.2, 1],
        filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
        transition: { duration: 0.5 }
      });
      setTimeout(() => {
        onNext();
      }, 1500);
    }
  }, [progress, isSuccess, controls, onNext]);

  const startCharging = () => {
    if (isSuccess) return;
    intervalRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 4, 100)); // Fills up in about 1-2 seconds
    }, 50);
  };

  const stopCharging = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isSuccess) {
      // Degrade quickly if they let go
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p <= 0) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return Math.max(p - 6, 0);
        });
      }, 50);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-black text-[#2d5a27] mb-12 text-center"
      >
        Power up the core!
      </motion.h2>

      {/* Core SVG */}
      <motion.div 
        animate={controls}
        className="relative w-48 h-48 mb-16"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e5df" strokeWidth="8" />
          {/* Progress Ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke={isSuccess ? "#b4c5b0" : "#8a9eb5"} 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            className="transition-all duration-75 ease-out origin-center -rotate-90"
          />
          {/* Inner Core */}
          <circle 
            cx="50" 
            cy="50" 
            r="30" 
            fill={isSuccess ? "#b4c5b0" : "#f0f4ef"} 
            className="transition-colors duration-300"
          />
          {isSuccess && (
            <text x="50" y="60" fontSize="30" textAnchor="middle" fill="white">⚡</text>
          )}
        </svg>
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 bg-[#b4c5b0] rounded-full blur-2xl -z-10 transition-opacity duration-300"
          style={{ opacity: progress / 100 }}
        />
      </motion.div>

      {/* Interaction Button */}
      <div className="relative w-full max-w-xs h-24">
        <motion.button
          onPointerDown={startCharging}
          onPointerUp={stopCharging}
          onPointerLeave={stopCharging}
          className="absolute inset-0 w-full h-full bg-[#f0f4ef] rounded-3xl border-4 border-[#8a9eb5]/20 flex items-center justify-center overflow-hidden touch-none"
          whileTap={{ scale: 0.95 }}
        >
          {/* Fluid Fill inside button */}
          <div 
            className="absolute bottom-0 inset-x-0 bg-[#8a9eb5]/30 transition-all duration-75 ease-out"
            style={{ height: `${progress}%` }}
          />
          <span className="relative z-10 text-xl font-black text-[#5c6e80] select-none">
            {isSuccess ? "FULLY CHARGED!" : "HOLD TO POWER UP"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
