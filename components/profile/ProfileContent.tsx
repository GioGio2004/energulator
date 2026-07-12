"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ProfileContent() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const gameStatus = useQuery(api.game.getGameStatus);
  const t = useTranslations("profile");

  if (!isLoaded) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#58cc02]/30 border-t-[#58cc02] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-medium">{t('loginRequired')}</p>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut(() => router.push("/"));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Profile Header */}
      <div className="glass-panel-light rounded-3xl p-6 text-center shadow-sm">
        <div className="relative inline-block mb-4">
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>
        <h2 className="text-2xl font-black text-gray-900">{user.fullName || "Player"}</h2>
        <p className="text-sm font-medium text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
      </div>

      {/* Game Data (What we collect) */}
      <div className="glass-panel-light rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">{t('yourProgress')}</h3>
        
        {gameStatus === undefined ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : gameStatus === null ? (
          <p className="text-center text-gray-500 text-sm">{t('noProgress')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 rounded-2xl p-4 flex flex-col items-center border border-gray-100 shadow-sm">
              <span className="text-3xl drop-shadow-sm mb-1">⚡</span>
              <p className="text-2xl font-black text-[#1cb0f6]">{gameStatus.watts}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Watts</p>
            </div>
            
            <div className="bg-white/80 rounded-2xl p-4 flex flex-col items-center border border-gray-100 shadow-sm">
              <span className="text-3xl drop-shadow-sm mb-1">🔥</span>
              <p className="text-2xl font-black text-[#ff9600]">{gameStatus.streak}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t('dayStreak')}</p>
            </div>

            <div className="col-span-2 bg-white/80 rounded-2xl p-4 flex flex-col items-center border border-gray-100 shadow-sm">
              <span className="text-3xl drop-shadow-sm mb-1">⭐</span>
              <p className="text-2xl font-black text-[#58cc02]">{gameStatus.completedLessons.length}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t('missionsCompleted')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4">
        <button
          onClick={handleSignOut}
          className="w-full bg-white border-2 border-red-100 text-red-500 font-bold text-lg rounded-2xl py-4 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t('logout')}
        </button>
      </div>
    </div>
  );
}
