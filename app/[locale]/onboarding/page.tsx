"use client";

import OnboardingFlow from "@/components/OnboardingFlow";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useDemoAuth } from "@/lib/useDemoAuth";

export default function OnboardingPage() {
  const { isSignedIn, isLoaded: clerkLoaded } = useDemoAuth();
  const convexUser = useQuery(api.users.current);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    if (!clerkLoaded) return;

    // Not signed in → send to sign-up (onboarding requires an account)
    if (!isSignedIn) {
      router.replace(`/${locale}/sign-up`);
      return;
    }

    // Already fully onboarded → skip to dashboard
    if (convexUser !== undefined && convexUser !== null && convexUser.isOnboarded) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [clerkLoaded, isSignedIn, convexUser, locale, router]);

  // Spinner while Clerk resolves
  if (!clerkLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f7ee]">
        <div className="w-10 h-10 border-4 border-[#2d5a27]/25 border-t-[#2d5a27] rounded-full animate-spin" />
      </div>
    );
  }

  // Spinner while waiting for Convex user record (or redirect to sign-up pending)
  if (!isSignedIn || convexUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f7ee]">
        <div className="w-10 h-10 border-4 border-[#2d5a27]/25 border-t-[#2d5a27] rounded-full animate-spin" />
      </div>
    );
  }

  // Suppress rendering the form while redirect to dashboard is pending
  if (convexUser?.isOnboarded) {
    return null;
  }

  // Signed in and not yet onboarded → show the form
  return <OnboardingFlow />;
}
