import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

/**
 * Called by the Clerk webhook on user.created and user.updated events.
 * Creates a new user record or updates the existing one.
 */
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(), // Clerk UserJSON object
  },

  handler: async (ctx, { data }) => {
    const clerkUserId: string = data.id;
    const firstName: string = data.first_name ?? "";
    const lastName: string = data.last_name ?? "";
    const name = [firstName, lastName].filter(Boolean).join(" ") || "Unknown";

    const existing = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", clerkUserId))
      .unique();

    if (existing === null) {
      await ctx.db.insert("users", { name, externalId: clerkUserId });
    } else {
      await ctx.db.patch(existing._id, { name });
    }
  },
});

/**
 * Called by the Clerk webhook on user.deleted events.
 * Removes the user record from the database.
 */
export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", clerkUserId))
      .unique();

    if (user !== null) {
      await ctx.db.delete(user._id);
    }
  },
});

/**
 * Saves onboarding data for the currently authenticated user.
 */
export const saveOnboardingData = mutation({
  args: {
    tariff: v.string(),
    monthlyBill: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to saveOnboardingData");
    }

    let user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    // If the Clerk webhook hasn't caught up yet, create the user on the fly
    if (!user) {
      const name = identity.name ?? "Unknown";
      const newUserId = await ctx.db.insert("users", {
        name,
        externalId: identity.subject,
      });
      user = await ctx.db.get(newUserId);
    }

    if (!user) {
      throw new Error("Failed to create user record");
    }

    await ctx.db.patch(user._id, {
      onboarding: {
        tariff: args.tariff,
        monthlyBill: args.monthlyBill,
      },
      isOnboarded: true,
    });
  },
});

/**
 * Fetches the currently authenticated user's record from the database.
 */
export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    return user;
  },
});
