import { motion } from "framer-motion";
import type { OnboardingData } from "../OnboardingFlow";

const BASES = [
  { id: "apartment", title: "Small Pod", subtitle: "Apartment", icon: "🏢" },
  { id: "house", title: "Family Cruiser", subtitle: "House", icon: "🏡" },
  { id: "mansion", title: "Mothership", subtitle: "Mansion", icon: "🏰" },
];

export default function Step2({ 
  data, 
  setData, 
  onNext 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-black text-[#2d5a27] mb-8 text-center"
      >
        Choose your disguise.
      </motion.h2>

      <div className="flex flex-col gap-4 w-full mb-12">
        {BASES.map((base, i) => {
          const isSelected = data.baseType === base.id;
          return (
            <motion.button
              key={base.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setData({ ...data, baseType: base.id })}
              className={`relative flex items-center p-5 rounded-3xl transition-all border-4 overflow-hidden bg-white ${
                isSelected 
                  ? "border-[#8a9eb5] shadow-lg shadow-[#8a9eb5]/20" 
                  : "border-transparent shadow-sm hover:border-[#8a9eb5]/30"
              }`}
            >
              {isSelected && (
                <motion.div 
                  layoutId="selected-bg"
                  className="absolute inset-0 bg-[#8a9eb5]/10"
                />
              )}
              
              <div className="w-16 h-16 bg-[#f9faf8] rounded-full flex items-center justify-center text-3xl shadow-inner shrink-0 relative z-10">
                {base.icon}
              </div>
              
              <div className="ml-5 text-left relative z-10">
                <h3 className="text-xl font-black text-[#1a1a1a] leading-none mb-1">{base.title}</h3>
                <p className="text-[#8a9eb5] font-bold text-sm uppercase tracking-wider">{base.subtitle}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: data.baseType ? 1 : 0.5 }}
        disabled={!data.baseType}
        whileHover={data.baseType ? { scale: 1.05 } : {}}
        whileTap={data.baseType ? { scale: 0.95 } : {}}
        onClick={onNext}
        className="w-full py-5 bg-[#8a9eb5] hover:bg-[#72859c] rounded-full text-white text-2xl font-black tracking-wide shadow-2xl shadow-[#8a9eb5]/50 transition-all"
      >
        Confirm Base
      </motion.button>
    </div>
  );
}
