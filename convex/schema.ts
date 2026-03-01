import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  highScores: defineTable({
    userId: v.id("users"),
    playerName: v.string(),
    score: v.number(),
    wave: v.number(),
    createdAt: v.number(),
  })
    .index("by_score", ["score"])
    .index("by_user", ["userId"]),
  gameSessions: defineTable({
    userId: v.id("users"),
    isActive: v.boolean(),
    currentScore: v.number(),
    currentWave: v.number(),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),
});
