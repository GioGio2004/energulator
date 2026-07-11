"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/energular-onboarding-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/55" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#2d5a27]/30 border-t-[#2d5a27] rounded-full animate-spin" />
        <p className="text-lg font-bold text-[#2d5a27]">Signing you in…</p>
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}
