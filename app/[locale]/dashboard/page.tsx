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
    <div className="fixed inset-0 bg-app-global flex flex-col overflow-hidden text-gray-900 overscroll-none">
      <TopHeader />
      
      <main className="flex-1 overflow-y-auto overscroll-none pb-20 scrollbar-hide">
        <LearningMap />
      </main>

      <BottomNav />
    </div>
  );
}
