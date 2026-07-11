import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    // Clerk user ID, stored in the subject JWT field
    externalId: v.string(),
    onboarding: v.optional(
      v.object({
        tariff: v.string(),
        monthlyBill: v.number(),
      })
    ),
    isOnboarded: v.optional(v.boolean()),
  }).index("byExternalId", ["externalId"]),
});
