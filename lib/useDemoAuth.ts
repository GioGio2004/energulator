"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function useDemoAuth() {
  const clerkAuth = useUser();
  const [isGuest, setIsGuest] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if guest mode is activated in session storage
    if (typeof window !== "undefined") {
      setIsGuest(sessionStorage.getItem("energulator_guest") === "true");
    }
    setIsReady(true);
  }, []);

  // If clerk is still loading and we haven't checked session storage yet, we are not loaded.
  const isLoaded = clerkAuth.isLoaded && isReady;

  // We are "signed in" if Clerk says we are OR if guest mode is active.
  const isSignedIn = clerkAuth.isSignedIn || isGuest;

  // If in guest mode and not actually signed into Clerk, mock the user object
  // just enough so components relying on user.fullName or user.imageUrl don't crash.
  const user = clerkAuth.user || (isGuest ? {
    id: "demo_guest",
    fullName: "Guest Player",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
    primaryEmailAddress: { emailAddress: "guest@demo.com" },
  } : null);

  return {
    isLoaded,
    isSignedIn,
    user,
    isGuest,
  };
}
