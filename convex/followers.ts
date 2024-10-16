

import {  v } from 'convex/values';
import { mutation, query } from "./_generated/server";

export const isFollwingUser = query({
  args:{
    id:v.string(),
  },

  handler: async (ctx, {id}) => {
    const identity = await ctx.auth.getUserIdentity();

    
    const userId = identity?.subject;
    
    const otherUser = await ctx.db
      .query("users")
      .withIndex("user_id", (q) => q.eq("id", id ))
      .first();

      if (!otherUser) {
        throw new Error("User not found");
      }
  
      const existingFollow = await ctx.db
        .query("follow")
        .filter((q) => q.and(
          q.eq(q.field("followerId"),userId ),
          q.eq(q.field("followingId"), otherUser.id)
        ))
        .first();

        return !!existingFollow;


  },
});

export const followUser = mutation({
  args:{
    id:v.string(),
  },

  handler: async (ctx, {id}) => {
    const identity = await ctx.auth.getUserIdentity();

    const userId = identity?.subject;

  
    const otherUser = await ctx.db
    .query("users")
    .withIndex("user_id", (q) => q.eq("id", id ))
    .first();

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === userId) {
      return true;
    }

    const existingFollow = await ctx.db
    .query("follow")
    .filter((q) => q.and(
      q.eq(q.field("followerId"),userId ),
      q.eq(q.field("followingId"), otherUser.id)
    ))
    .first();

    if (existingFollow) {
      return  new Error("You are already following this user");
    }
      
    const follow = await ctx.db.insert("follow", {
      followerId: userId,
      followingId: otherUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return follow
    
  },
});


export const unfollowUser = mutation({
  args:{
    id:v.string(),
  },

  handler: async (ctx, {id}) => {
    const identity = await ctx.auth.getUserIdentity();

    const userId = identity?.subject;

  
    const otherUser = await ctx.db
    .query("users")
    .withIndex("user_id", (q) => q.eq("id", id ))
    .first();

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === userId) {
      throw new Error("You can't unfollow yourself");
    }

    const existingFollow = await ctx.db
    .query("follow")
    .filter((q) => q.and(
      q.eq(q.field("followerId"),userId ),
      q.eq(q.field("followingId"), otherUser.id)
    ))
    .first();

    if (!existingFollow) {
      return  new Error("You are not following this user");
    }
      
    const unfollow = await ctx.db.delete(existingFollow._id);
    return unfollow;
    
  },
});

export const getFollowedUsers = query({
  
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject; // Auth foydalanuvchi ID'si

    if (userId) {
      // Foydalanuvchi kimlarni kuzatayotganini follow jadvalidan olish
      const following = await ctx.db
        .query("follow")
        .withIndex("by_follower", (q) => q.eq("followerId", userId))
        .collect();

      if (following.length === 0) {
        return [];
      }

      const followingIds = following.map((f) => f.followingId);

      // Foydalanuvchi bloklaganlarni olish
      const blockedUsers = await ctx.db
        .query("block")
        .withIndex("by_blocker", (q) => q.eq("blockerId", userId))
        .collect();

      const blockedIds = blockedUsers.map((block) => block.blockedId);

      // Kuzatilayotgan userlar haqida ma'lumotlarni users jadvalidan olish va bloklanganlarni chiqarib tashlash
      const followedUsers = await ctx.db
        .query("users")
        .filter((q) =>
          q.or(
            ...followingIds.map((followingId) =>
              q.eq(q.field("id"), followingId)
            )
          )
        )
        .collect();

      // Bloklangan foydalanuvchilarni chiqarib tashlash
      const filteredFollowedUsers = followedUsers.filter(
        (user) => !blockedIds.includes(user.id)
      );

      // Kuzatilayotgan userlar uchun stream ma'lumotlarini qo'shish
      const usersWithStreamData = [];

      for (const user of filteredFollowedUsers) {
        const streamData = await ctx.db
          .query("stream")
          .withIndex("by_userId", (q) => q.eq("userId", user.id))
          .first();

        usersWithStreamData.push({
          ...user,
          streamKey: streamData?.streamKey || null, // Stream kaliti mavjud bo'lsa qo'shish
          stream: streamData || null, // Stream ma'lumotlari mavjud bo'lsa qo'shish
        });
      }

      return usersWithStreamData; // Kuzatilayotgan foydalanuvchilar va stream ma'lumotlari qaytariladi
    } else {
      return [];
    }
  },
});
 
export const getFollowerCount = query({
  args: {
    id: v.string(), // Foydalanuvchi ID
  },
  handler: async (ctx, { id }) => {
    const userId = id;

    // Foydalanuvchining kuzatuvchilarini olish
    const followers = await ctx.db
      .query("follow")
      .withIndex("by_following", (q) => q.eq("followingId", userId))
      .collect();

    // Kuzatuvchilar sonini qaytarish
    return followers.length;
  },
});


export const getFollowingCount = query({
  args: {
    id: v.string(), // Foydalanuvchi ID
  },
  handler: async (ctx, { id }) => {
    const userId = id;

    // Foydalanuvchining kimlarni kuzatayotganini olish
    const following = await ctx.db
      .query("follow")
      .withIndex("by_follower", (q) => q.eq("followerId", userId))
      .collect();

    // Kuzatayotgan userlar sonini qaytarish
    return following.length;
  },
});


