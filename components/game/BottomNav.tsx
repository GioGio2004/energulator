"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const TABS = [
  { id: "play",    label: "PLAY",    href: "/dashboard" },
  { id: "daily",   label: "DAILY",   href: "/daily" },
  { id: "courses", label: "COURSES", href: "/courses" },
  { id: "profile", label: "PROFILE", href: "/profile" },
];

export default function BottomNav() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || "en";

  // Determine active tab from current URL
  const activeTab = (() => {
    if (pathname.includes("/dashboard")) return "play";
    if (pathname.includes("/daily"))     return "daily";
    if (pathname.includes("/courses"))   return "courses";
    if (pathname.includes("/profile"))   return "profile";
    return "play";
  })();

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 px-4 flex justify-center pointer-events-none pb-safe">
      <nav className="pointer-events-auto relative flex items-center justify-between w-full max-w-md glass-panel rounded-[2rem] h-[68px] px-1.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(`/${locale}${tab.href}`)}
              className="relative flex-1 h-[56px] flex items-center justify-center z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 bg-white/10 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] rounded-[1.8rem] -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span 
                className={`text-[13px] tracking-widest font-medium transition-colors duration-200 ${
                  isActive ? 'text-white drop-shadow-md' : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
