"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import TopHeader from "@/components/game/TopHeader";
import BottomNav from "@/components/game/BottomNav";
import LearningMap from "@/components/game/LearningMap";

export default function DashboardPage() {
  const { isSignedIn, isLoaded: clerkLoaded } = useUser();
  const user = useQuery(api.users.current);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    // Wait until Clerk has resolved before making redirect decisions
    if (!clerkLoaded) return;

    // Not authenticated → send to sign-in
    if (!isSignedIn) {
      router.replace(`/${locale}/sign-in`);
      return;
    }

    // Authenticated but Convex hasn't resolved yet — wait
    if (user === undefined) return;

    // Authenticated but user record is null (race condition, e.g. webhook delay)
    // or user hasn't completed onboarding
    if (user === null || !user.isOnboarded) {
      router.replace(`/${locale}/onboarding`);
    }
  }, [clerkLoaded, isSignedIn, user, locale, router]);

  // Show spinner while resolving auth/onboarding
  const isReady =
    clerkLoaded &&
    isSignedIn &&
    user !== undefined &&
    user !== null &&
    user.isOnboarded;

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9faf8]">
        <div className="w-10 h-10 border-4 border-[#2d5a27]/25 border-t-[#2d5a27] rounded-full animate-spin" />
      </div>
    );
  }

  // The Learning Map layout prevents body scroll and manages its own internal overflow
  return (
    <div className="fixed top-0 inset-x-0 h-[100dvh] bg-app-global flex flex-col overflow-hidden text-gray-900 overscroll-none">
      <TopHeader />

      <main className="flex-1 overflow-y-auto overscroll-none pb-32 scrollbar-hide relative pt-20">
        <div className="mb-10">
          <LearningMap />
        </div>
        {/* Ultimate Game Button Banner */}
        <div className="px-4 mb-4 relative z-10 w-full max-w-md mx-auto">
          <a
            href="https://myenergy-three.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-[#1cb0f6] text-white p-4 rounded-[2rem] shadow-lg border-b-[4px] border-blue-700 active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl drop-shadow-md">🎮</span>
              <div>
                <h3 className="font-black text-lg tracking-wide uppercase drop-shadow-sm">
                  The Ultimate Game
                </h3>
                <p className="font-medium text-blue-100 text-sm">
                  Play the new experience
                </p>
              </div>
            </div>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
