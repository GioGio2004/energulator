import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import type { OnboardingData } from "../OnboardingFlow";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { completeOnboarding } from "@/app/actions";
import { motion } from "framer-motion";

export default function Step4({ data }: { data: OnboardingData }) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const saveOnboardingData = useMutation(api.users.saveOnboardingData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAndLaunch = async () => {
    if (isSaving || !isAuthenticated) return;
    setIsSaving(true);
    setError(null);
    try {
      await saveOnboardingData({
        baseType: data.baseType || "apartment",
      });

      await completeOnboarding();
      await user?.reload();

      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error("Save Onboarding Error:", err);
      setError("Failed to sync data. Please try again.");
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Wait until Convex has received the authentication token from Clerk
    if (!isAuthenticated) return;

    // Auto-save after a short delay for dramatic effect
    const timer = setTimeout(() => {
      if (mounted) {
        saveAndLaunch();
      }
    }, 1500);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
    // We purposefully omit saveAndLaunch from dependencies to prevent infinite loops if it fails
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-48 h-48 bg-[#b4c5b0] rounded-full flex items-center justify-center mb-8 relative shadow-2xl shadow-[#b4c5b0]/40"
      >
        <motion.div
          animate={isSaving ? { y: [-10, 10, -10] } : { y: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl"
        >
          🚀
        </motion.div>
        
        {/* Launch Rings */}
        {isSaving && (
          <motion.div 
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 border-4 border-white rounded-full"
          />
        )}
      </motion.div>

      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-black text-[#2d5a27] mb-2"
      >
        Ready for Launch
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-[#8a9eb5] font-bold text-lg mb-8"
      >
        {isSaving ? "Entering orbit..." : error ? "Launch paused." : "Preparing thrusters..."}
      </motion.p>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <button 
            onClick={saveAndLaunch}
            className="bg-[#2d5a27] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#1e3d1b] transition-all"
          >
            Retry Launch
          </button>
        </motion.div>
      )}
    </div>
  );
}
