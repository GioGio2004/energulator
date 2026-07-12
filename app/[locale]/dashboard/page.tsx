"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import TopHeader from "@/components/game/TopHeader";
import BottomNav from "@/components/game/BottomNav";
import LearningMap from "@/components/game/LearningMap";

export default function DashboardPage() {
  const { isSignedIn, isLoaded: clerkLoaded } = useUser();
  const user = useQuery(api.users.current);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = useTranslations("dashboard");

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
        <div className="px-4 pb-12 relative z-10 w-full max-w-md mx-auto">
          <div className="glass-panel-light rounded-3xl p-6 text-center shadow-sm border border-white/60">
            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-[#1cb0f6] to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-inner border-4 border-white">
              <span className="text-4xl">🏆</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {t('ultimateGameTitle')}
            </h2>
            <p className="text-gray-600 font-medium mb-6 text-sm">
              {t('ultimateGameDesc')}
            </p>
            <a
              href="https://myenergy-three.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#ffc800] border-b-[6px] border-[#cc9e00] hover:brightness-110 active:border-b-0 active:translate-y-[6px] text-white font-black text-xl rounded-2xl py-4 transition-all shadow-sm"
            >
              {t('playNow')}
            </a>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
