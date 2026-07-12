import { motion } from "framer-motion";

export default function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {/* Speech Bubble */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative bg-white rounded-3xl p-6 shadow-xl border border-[#b4c5b0]/30 mb-8 max-w-xs"
      >
        <p className="text-xl font-black text-[#2d5a27] leading-snug">
          "Our ship needs power! Help me decode Earth's energy grid."
        </p>
        {/* Tail */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-t-[20px] border-t-white border-r-[16px] border-r-transparent filter drop-shadow-sm" />
      </motion.div>

      {/* Mascot Placeholder */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="w-64 h-64 bg-[#b4c5b0]/20 rounded-full flex items-center justify-center mb-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#8a9eb5]/20 to-[#b4c5b0]/20 animate-pulse" />
        <span className="text-6xl z-10">👽</span>
      </motion.div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="w-full py-5 bg-[#b4c5b0] hover:bg-[#9cb098] rounded-full text-white text-2xl font-black tracking-wide shadow-2xl shadow-[#b4c5b0]/50 transition-colors"
      >
        Accept Mission
      </motion.button>
    </div>
  );
}
