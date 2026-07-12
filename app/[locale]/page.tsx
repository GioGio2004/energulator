"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useDemoAuth } from "@/lib/useDemoAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { isSignedIn, isLoaded: clerkLoaded } = useDemoAuth();
  const convexUser = useQuery(api.users.current);

  // Determine where "Get Started" should point
  const getStartedHref = (() => {
    if (!clerkLoaded) return `/${locale}/sign-up`;
    if (isSignedIn && convexUser?.isOnboarded) return `/${locale}/dashboard`;
    if (isSignedIn) return `/${locale}/onboarding`;
    return `/${locale}/sign-up`;
  })();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#edf3eb] overflow-hidden">
      {/* Animated Hanging Lightbulb */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.2 }}
        className="absolute left-[-20px] md:left-[5%] top-0 flex flex-col items-center pointer-events-none"
      >
        <Image
          src="/lightbulb.png"
          alt="Hanging Lightbulb"
          width={250}
          height={600}
          priority
          className="object-contain opacity-95 drop-shadow-xl"
        />
      </motion.div>

      {/* Main Content Center */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center mt-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-6xl sm:text-7xl md:text-8xl font-bold text-[#3a7533] mb-8 tracking-tight"
        >
          MyEnerge
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-row items-center gap-4"
        >
          <Link
            href={getStartedHref}
            className="bg-[#2d5a27] text-white px-8 py-3 rounded-[1.25rem] font-bold shadow-[0_4px_14px_rgba(45,90,39,0.3)] hover:bg-[#1e3d1b] hover:-translate-y-0.5 transition-all"
          >
            {isSignedIn && convexUser?.isOnboarded
              ? "Go to Dashboard"
              : "Get Started"}
          </Link>

          {!isSignedIn && (
            <Link
              href={`/${locale}/sign-in`}
              className="bg-white text-[#1a1a1a] border border-gray-200 px-8 py-3 rounded-[1.25rem] font-bold shadow-sm hover:border-gray-300 hover:-translate-y-0.5 transition-all"
            >
              Sign In
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
