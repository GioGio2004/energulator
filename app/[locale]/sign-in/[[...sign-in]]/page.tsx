"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const handleGuestMode = () => {
    // Set guest flag in session storage
    sessionStorage.setItem("energulator_guest", "true");
    // Redirect straight to the dashboard
    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-12">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/energular-onboarding-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/55" />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md px-4">
        <p className="text-sm font-black text-[#2d5a27] tracking-[0.25em] uppercase">
          ⚡ ENERGULATOR
        </p>

        {/* Guest Demo Button */}
        <div className="w-full glass-panel-light p-6 rounded-3xl text-center shadow-lg border border-white/60">
          <h2 className="text-xl font-black text-gray-900 mb-2">Want to explore?</h2>
          <p className="text-sm font-medium text-gray-600 mb-4">
            Bypass authentication and try the full demo experience instantly.
          </p>
          <button
            onClick={handleGuestMode}
            className="w-full bg-[#1cb0f6] border-b-[6px] border-[#1899d6] hover:brightness-110 active:border-b-0 active:translate-y-[6px] text-white font-black text-lg rounded-2xl py-4 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span className="text-2xl drop-shadow-sm">🚀</span>
            ENTER GUEST MODE
          </button>
        </div>

        <div className="flex items-center w-full gap-4 opacity-50 my-2">
          <div className="flex-1 h-px bg-gray-500"></div>
          <span className="text-sm font-bold uppercase tracking-widest text-gray-700">OR LOG IN</span>
          <div className="flex-1 h-px bg-gray-500"></div>
        </div>

        <SignIn />
      </div>
    </div>
  );
}
