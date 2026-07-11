"use client";

import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

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

  // Show spinner while:
  // 1. Clerk hasn't resolved yet
  // 2. User is not signed in (redirect is pending)
  // 3. Convex hasn't resolved the user record yet
  // 4. User is not onboarded (redirect to onboarding is pending)
  const isReady =
    clerkLoaded &&
    isSignedIn &&
    user !== undefined &&
    user !== null &&
    user.isOnboarded;

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f7ee]">
        <div className="w-10 h-10 border-4 border-[#2d5a27]/25 border-t-[#2d5a27] rounded-full animate-spin" />
      </div>
    );
  }

  return <AnalyticsDashboard />;
}
