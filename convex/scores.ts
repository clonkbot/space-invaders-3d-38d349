import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getTopScores = query({
  args: {},
  handler: async (ctx) => {
    const scores = await ctx.db
      .query("highScores")
      .withIndex("by_score")
      .order("desc")
      .take(10);
    return scores;
  },
});

export const getUserScores = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const scores = await ctx.db
      .query("highScores")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(5);
    return scores;
  },
});

export const submitScore = mutation({
  args: {
    playerName: v.string(),
    score: v.number(),
    wave: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("highScores", {
      userId,
      playerName: args.playerName,
      score: args.score,
      wave: args.wave,
      createdAt: Date.now(),
    });
  },
});

export const startSession = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("gameSessions", {
      userId,
      isActive: true,
      currentScore: 0,
      currentWave: 1,
      startedAt: Date.now(),
    });
  },
});

export const endSession = mutation({
  args: {
    sessionId: v.id("gameSessions"),
    finalScore: v.number(),
    finalWave: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.sessionId, {
      isActive: false,
      currentScore: args.finalScore,
      currentWave: args.finalWave,
      endedAt: Date.now(),
    });
  },
});
