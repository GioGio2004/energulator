"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function completeOnboarding() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No user logged in");
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    return { message: "User metadata updated successfully" };
  } catch (error) {
    console.error("Error updating user metadata:", error);
    throw new Error("Error updating user metadata");
  }
}
