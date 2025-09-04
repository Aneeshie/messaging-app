import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";


export const createUser = internalMutation({
  args: {
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async function(ctx, args) {
    await ctx.db.insert('users', args);
  }
})

export const getUser = internalQuery({
  args: {
    clerkId: v.string(),
  },
  handler: async function(ctx, args) {
    return await ctx.db.query("users").withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId)).first();
  }
})
