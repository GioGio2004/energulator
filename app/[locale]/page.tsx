"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { isSignedIn, isLoaded: clerkLoaded } = useUser();
  const convexUser = useQuery(api.users.current);

  // Determine where "Get Started" should point
  const getStartedHref = (() => {
    if (!clerkLoaded) return `/${locale}/sign-up`;
    if (isSignedIn && convexUser?.isOnboarded) return `/${locale}/dashboard`;
    if (isSignedIn) return `/${locale}/onboarding`;
    // Unauthenticated → sign up first, then onboarding
    return `/${locale}/sign-up`;
  })();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f7ee] p-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-black text-[#2d5a27] mb-4 tracking-tight">
        ⚡ ENERGULATOR
      </h1>
      <p className="text-lg text-[#555] mb-8 max-w-md">
        Discover the optimal energy tariff for your lifestyle and start saving immediately.
      </p>
      <div className="flex gap-4">
        <Link
          href={getStartedHref}
          className="bg-[#2d5a27] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#2d5a27]/25 md:hover:bg-[#1e3d1b] transition-all"
        >
          {isSignedIn && convexUser?.isOnboarded ? "Go to Dashboard" : "Get Started"}
        </Link>
        {!isSignedIn && (
          <Link
            href={`/${locale}/sign-in`}
            className="bg-white text-[#1a1a1a] border-2 border-[#1a1a1a]/10 px-8 py-3 rounded-full font-bold md:hover:border-[#2d5a27] transition-all"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
