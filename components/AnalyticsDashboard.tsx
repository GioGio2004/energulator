"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser, UserButton } from "@clerk/nextjs";

export default function AnalyticsDashboard() {
  const { user } = useUser();
  const convexUser = useQuery(api.users.current);

  return (
    <div className="min-h-screen bg-[#f0f7ee] flex flex-col p-6 sm:p-12 font-sans">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-black text-[#2d5a27] tracking-tight">
          ⚡ ENERGULATOR
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-[#1a1a1a]">
            {user?.firstName || "Welcome"}
          </span>
          <UserButton />
        </div>
      </header>

      <main className="flex-1 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#2d5a27]/10 flex flex-col">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">Estimated Savings</h2>
          {convexUser?.onboarding ? (
            <>
              <p className="text-4xl font-black text-[#2d5a27] mt-auto">
                ${Math.round((convexUser.onboarding.monthlyBill || 0) * 0.21 * 12).toLocaleString()}/yr
              </p>
              <p className="text-xs text-[#2d5a27] font-semibold mt-4">
                ✅ Based on your {convexUser.onboarding.tariff || "current"} plan
              </p>
            </>
          ) : (
            <p className="text-4xl font-black text-[#2d5a27] mt-auto">Calculating…</p>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#2d5a27]/10 flex flex-col">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">Current Tariff</h2>
          <p className="text-xl font-bold text-[#555] mt-auto">
            {convexUser?.onboarding?.tariff ?? "Analyzing plan…"}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#2d5a27]/10 flex flex-col md:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">Monthly Bill</h2>
          <p className="text-4xl font-black text-[#2d5a27] mt-auto">
            {convexUser?.onboarding?.monthlyBill !== undefined
              ? `$${convexUser.onboarding.monthlyBill}/mo`
              : "Loading…"}
          </p>
          <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mt-4 min-h-[80px]">
            <span className="text-sm font-medium text-gray-400">Usage trends coming soon</span>
          </div>
        </div>
      </main>
    </div>
  );
}
