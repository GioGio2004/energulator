import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    // Clerk user ID, stored in the subject JWT field
    externalId: v.string(),
    onboarding: v.optional(
      v.object({
        baseType: v.optional(v.string()),
        monthlyBill: v.optional(v.number()),
        tariff: v.optional(v.string()),
      })
    ),
    isOnboarded: v.optional(v.boolean()),
    // Game fields
    watts: v.optional(v.number()),
    streak: v.optional(v.number()),
    lastActiveTimestamp: v.optional(v.number()),
    currentModuleId: v.optional(v.string()),
    completedLessons: v.optional(v.array(v.string())),
  }).index("byExternalId", ["externalId"]),
});
