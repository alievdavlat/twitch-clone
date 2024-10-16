import {  v } from 'convex/values';
import { mutation } from "./_generated/server";

export const saveUser = mutation({
  args:{
    id:v.string(),
    username:v.string(),
    imageUrl:v.string(),
    externalUserId:v.string(),
    bio:v.string(),
    stream:v.optional(v.any()),
  },
  handler: async (ctx, {externalUserId,username,imageUrl,bio, id, stream}) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("id"), id))
      .first();

    if (existingUser) {
      // Foydalanuvchi mavjud bo'lsa, yangilash
      await ctx.db.patch(existingUser._id, {
        username,
        imageUrl,
        bio,
        stream,
        updatedAt: new Date().toISOString(),
      });
      return existingUser;
    } else {
      // Foydalanuvchi mavjud bo'lmasa, yangi yozuv qo'shish
      const newUser = await ctx.db.insert("users", {
        id,
        externalUserId,
        username,
        imageUrl,
        bio,
        stream,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return newUser;
    }
  },
});
