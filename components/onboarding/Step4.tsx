import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import type { OnboardingData } from "../OnboardingFlow";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { completeOnboarding } from "@/app/actions";
import GlassButton from "../GlassButton";

export default function Step4({ data }: { data: OnboardingData }) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";
  const { user } = useUser();
  const saveOnboardingData = useMutation(api.users.saveOnboardingData);
  const [isSaving, setIsSaving] = useState(false);

  const regional = Math.round(data.monthlyBill * 1.18);
  const optimized = Math.round(data.monthlyBill * 0.79);
  const savedMonthly = regional - optimized;
  const savedAnnual = savedMonthly * 12;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveOnboardingData({
        tariff: data.tariff,
        monthlyBill: data.monthlyBill,
      });

      // Update the user's public metadata in Clerk
      await completeOnboarding();

      // Refresh the local session token to pull down the new metadata
      await user?.reload();

      // Navigate to the dashboard
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="inline-flex items-center gap-2 bg-[#2d5a27]/10 rounded-full px-3 py-1 mb-3">
          <span className="text-lg">🎉</span>
          <span className="text-xs font-bold text-[#2d5a27] uppercase tracking-widest">
            Almost There
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] leading-tight mb-2">
          Secure your savings now
        </h2>
        <p className="text-base text-[#555] leading-relaxed">
          Confirm your plan and start saving up to{" "}
          <span className="font-black text-[#2d5a27]">
            ${savedAnnual.toLocaleString()}/year
          </span>
          .
        </p>
      </div>

      {/* Summary pill */}
      <div className="flex items-center gap-2 bg-[#f0f7ee] border border-[#2d5a27]/20 rounded-2xl p-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#888] uppercase tracking-widest font-bold mb-0.5">
            Your Plan
          </p>
          <p className="text-sm font-bold text-[#1a1a1a] truncate">
            {data.tariff}
          </p>
        </div>
        <div className="w-px h-8 bg-[#2d5a27]/15 shrink-0" />
        <div className="text-center shrink-0">
          <p className="text-[10px] text-[#888] uppercase tracking-widest font-bold mb-0.5">
            Bill
          </p>
          <p className="text-sm font-bold text-[#1a1a1a]">
            ${data.monthlyBill}
          </p>
        </div>
        <div className="w-px h-8 bg-[#2d5a27]/15 shrink-0" />
        <div className="text-center shrink-0">
          <p className="text-[10px] text-[#888] uppercase tracking-widest font-bold mb-0.5">
            You Save
          </p>
          <p className="text-sm font-black text-[#2d5a27]">
            ${savedMonthly}/mo
          </p>
        </div>
      </div>

      <GlassButton
        onClick={handleSave}
        disabled={isSaving}
        className="w-full text-lg font-bold !text-[#2d5a27] mt-4 disabled:opacity-60"
      >
        {isSaving ? (
          <div className="w-6 h-6 border-[3px] border-[#2d5a27]/30 border-t-[#2d5a27] rounded-full animate-spin" />
        ) : (
          "Complete Setup →"
        )}
      </GlassButton>

      <p className="text-xs text-center text-[#999] leading-relaxed">
        🔒 Free forever. No credit card required.{" "}
        <a href="#" className="underline text-[#2d5a27] font-semibold">
          Terms
        </a>{" "}
        &amp;{" "}
        <a href="#" className="underline text-[#2d5a27] font-semibold">
          Privacy
        </a>
        .
      </p>
    </div>
  );
}
