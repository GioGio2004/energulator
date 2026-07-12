"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const TABS = [
  { id: "play",    label: "PLAY",    href: "/dashboard" },
  { id: "daily",   label: "DAILY",   href: "/daily", locked: true },
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
      <nav className="pointer-events-auto relative flex items-center justify-between w-full max-w-md glass-panel-light rounded-[2rem] h-[68px] px-1.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isLocked = tab.locked;
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (!isLocked) {
                  router.push(`/${locale}${tab.href}`);
                }
              }}
              disabled={isLocked}
              className={`relative flex-1 h-[56px] flex items-center justify-center z-10 ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isActive && !isLocked && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 bg-white border border-gray-200 shadow-sm rounded-[1.8rem] -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span 
                className={`text-[13px] tracking-widest font-bold flex items-center gap-1 transition-colors duration-200 ${
                  isActive && !isLocked ? 'text-[#58cc02]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {isLocked && <span className="text-xs">🔒</span>}
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
