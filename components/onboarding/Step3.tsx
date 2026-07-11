import { motion } from "framer-motion";
import type { OnboardingData } from "../OnboardingFlow";

export default function Step3({ data }: { data: OnboardingData }) {
  const regional = Math.round(data.monthlyBill * 1.18);
  const optimized = Math.round(data.monthlyBill * 0.79);
  const savedMonthly = regional - optimized;
  const savedAnnual = savedMonthly * 12;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1 mb-3">
          <span className="text-base">⚠️</span>
          <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
            Hidden Cost Alert
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] leading-tight mb-2">
          Don't lose money to hidden rates.
        </h2>
        <p className="text-base text-[#555] leading-relaxed">
          Based on your tariff and bill, here's what you're likely overpaying.
        </p>
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex flex-col items-center text-center">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">
            Regional Cost
          </span>
          <span className="text-3xl sm:text-4xl font-black text-red-700 leading-none">
            ${regional}
          </span>
          <span className="text-xs text-red-500 mt-1 font-semibold">
            /month
          </span>
          <span className="text-xs text-red-400 mt-2 leading-tight">
            Standard rate average
          </span>
        </div>
        <div className="bg-[#f0f7ee] border-2 border-[#2d5a27]/40 rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2d5a27] to-[#4a8c42]" />
          <span className="text-xs font-bold text-[#2d5a27] uppercase tracking-wide mb-2">
            Your Cost
          </span>
          <span className="text-3xl sm:text-4xl font-black text-[#2d5a27] leading-none">
            ${optimized}
          </span>
          <span className="text-xs text-[#4a8c42] mt-1 font-semibold">
            /month
          </span>
          <span className="text-xs text-[#666] mt-2 leading-tight">
            With Energulator
          </span>
        </div>
      </div>

      {/* Loss aversion banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.18 }}
        className="bg-gradient-to-br from-[#1a1a1a] to-[#2d5a27] rounded-2xl p-5 text-white"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">💸</span>
          <div>
            <p className="text-base font-black leading-tight">
              You're losing ${savedMonthly}/month
            </p>
            <p className="text-xs text-white/70">to rates you didn't choose</p>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
          <p className="text-2xl font-black text-[#a8e89c]">
            ${savedAnnual.toLocaleString()}
          </p>
          <p className="text-xs text-white/75 mt-0.5">
            potential annual savings
          </p>
        </div>
        <p className="text-xs text-white/65 mt-3 text-center leading-relaxed">
          Every month you wait is money gone for good. Fix it now — it's free.
        </p>
      </motion.div>
    </div>
  );
}
