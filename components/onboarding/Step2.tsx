import { motion } from "framer-motion";
import type { OnboardingData } from "../OnboardingFlow";

export default function Step2({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (d: OnboardingData) => void;
}) {
  const pct = ((data.monthlyBill - 50) / 750) * 100;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="inline-flex items-center gap-2 bg-[#2d5a27]/10 rounded-full px-3 py-1 mb-3">
          <span className="text-lg">💰</span>
          <span className="text-xs font-bold text-[#2d5a27] uppercase tracking-widest">
            Your Bill
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] leading-tight mb-2">
          Average monthly energy bill?
        </h2>
        <p className="text-base sm:text-lg text-[#555] leading-relaxed">
          Drag the slider — your answer is private.
        </p>
      </div>

      {/* Big bill display */}
      <div className="flex flex-col items-center py-5 bg-white/80 rounded-3xl border-2 border-[#2d5a27]/20 shadow-sm">
        <motion.span
          key={data.monthlyBill}
          initial={{ scale: 0.88, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="text-6xl sm:text-7xl font-black text-[#2d5a27] tabular-nums leading-none"
        >
          ${data.monthlyBill}
        </motion.span>
        <span className="text-base text-[#666] mt-2 font-semibold">
          per month
        </span>
      </div>

      {/* Slider */}
      <div className="flex flex-col gap-3 px-1">
        <style>{`
          .bill-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 22px;
            border-radius: 999px;
            background: linear-gradient(to right,
              #2d5a27 0%,
              #2d5a27 ${pct}%,
              #d1e8cc ${pct}%,
              #d1e8cc 100%
            );
            outline: none;
            cursor: pointer;
          }
          .bill-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: #2d5a27;
            border: 5px solid white;
            box-shadow: 0 3px 14px rgba(45,90,39,0.4);
            cursor: pointer;
          }
          .bill-slider::-moz-range-thumb {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: #2d5a27;
            border: 5px solid white;
            box-shadow: 0 3px 14px rgba(45,90,39,0.4);
            cursor: pointer;
          }
        `}</style>
        <div className="flex justify-between text-sm font-bold text-[#666]">
          <span>$50</span>
          <span>$800</span>
        </div>
        <input
          type="range"
          id="bill-slider"
          className="bill-slider"
          min={50}
          max={800}
          step={5}
          value={data.monthlyBill}
          onChange={(e) =>
            setData({ ...data, monthlyBill: Number(e.target.value) })
          }
        />
      </div>

      <div className="bg-[#f0f7ee] border border-[#2d5a27]/20 rounded-2xl p-4 flex gap-3 items-start">
        <span className="text-xl mt-0.5">📊</span>
        <p className="text-sm text-[#444] leading-relaxed">
          The average household pays{" "}
          <span className="font-bold text-[#1a1a1a]">$182/month</span>. You
          could be overpaying without knowing it.
        </p>
      </div>
    </div>
  );
}
