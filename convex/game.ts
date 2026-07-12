import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Retrieves the current game status for the authenticated user.
 */
export const getGameStatus = query({
  args: {},

  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to getGameStatus");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return {
      streak: user.streak ?? 0,
      watts: user.watts ?? 0,
      currentModuleId: user.currentModuleId ?? "module_electricity_1",
      completedLessons: user.completedLessons ?? [],
      lastActiveTimestamp: user.lastActiveTimestamp,
    };
  },
});

/**
 * Completes a lesson, adding it to the user's completed list,
 * incrementing their watts, and updating their daily streak.
 */
export const completeLesson = mutation({
  args: {
    lessonId: v.string(),
    wattsEarned: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to completeLesson");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();
    let streak = user.streak ?? 0;
    const lastActive = user.lastActiveTimestamp;

    // Simple streak logic:
    // If last active was more than 24 hours ago but less than 48 hours ago, increment.
    // If last active was more than 48 hours ago, reset to 1.
    // Otherwise, keep the current streak.
    if (lastActive) {
      const msPerDay = 24 * 60 * 60 * 1000;
      const daysSince = (now - lastActive) / msPerDay;

      if (daysSince >= 1 && daysSince < 2) {
        streak += 1;
      } else if (daysSince >= 2) {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    const completedLessons = user.completedLessons ?? [];
    if (!completedLessons.includes(args.lessonId)) {
      completedLessons.push(args.lessonId);
    }

    const newWatts = (user.watts ?? 0) + args.wattsEarned;

    await ctx.db.patch(user._id, {
      completedLessons,
      watts: newWatts,
      streak,
      lastActiveTimestamp: now,
    });

    return {
      success: true,
      watts: newWatts,
      streak,
    };
  },
});

/**
 * Updates the user's current module ID as they progress through the map.
 */
export const updateActiveModule = mutation({
  args: {
    moduleId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to updateActiveModule");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      currentModuleId: args.moduleId,
    });

    return {
      success: true,
      moduleId: args.moduleId,
    };
  },
});
