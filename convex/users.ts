import { v } from "convex/values";
import { query , mutation} from "./_generated/server";

export const checkUserExists = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }
    const id = identity?.subject;
    const user = await ctx.db.query("users")
    //@ts-ignore
      .withIndex("user_id", (q) => q.eq("id", id))
      .first();
      if (user) {
        return true
      }
    return false;
  }
});

export const getAccount = query({
 
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    const id = identity?.subject;

    const user = await ctx.db
      .query("users")
      //@ts-ignore
      .withIndex("user_id", (q) => q.eq("id", id ))
      .first();

    return user;
  },
});


export const getUsers = query({
  args: {
    id: v.optional(v.string()), // Ixtiyoriy foydalanuvchi ID'si
  },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    if (userId) {
      // Foydalanuvchini bloklagan userlar ro'yxatini olish
      const blockedUsers = await ctx.db
        .query("block")
        .withIndex("by_blocker", (q) => q.eq("blockerId", userId))
        .collect();

      const blockedIds = blockedUsers.map((block) => block.blockedId); // Bloklangan userlar IDlari

      // Foydalanuvchining allaqachon kuzatgan userlari ro'yxatini olish
      const following = await ctx.db
        .query("follow")
        .withIndex("by_follower", (q) => q.eq("followerId", userId))
        .collect();

      const followingIds = following.map((f) => f.followingId); // Kuzatilgan userlar IDlari

      // Barcha userlarni olish
      const users = await ctx.db
        .query("users")
        .order("desc")
        .collect();

      // Faqat kerakli foydalanuvchilarni filtrlash
      const filteredUsers = users.filter(
        (user) =>
          user.id !== id && // Hozirgi foydalanuvchini chiqarib tashlash
          !blockedIds.includes(user.id) && // Bloklangan userlarni chiqarib tashlash
          !followingIds.includes(user.id) // Kuzatilgan userlarni chiqarib tashlash
      );

      // Stream ma'lumotlarini olish
      const usersWithStreamData = [];

      for (const user of filteredUsers) {
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

      return usersWithStreamData; // Bloklanmagan va kuzatilmagan foydalanuvchilar va stream ma'lumotlarini qaytarish
    } else {
      // Agar foydalanuvchi autentifikatsiyadan o'tmagan bo'lsa, barcha userlarni qaytarish
      const users = await ctx.db
        .query("users")
        .order("desc")
        .collect();

      const usersWithStreamData = [];

      for (const user of users) {
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

      return usersWithStreamData; // Barcha foydalanuvchilar va stream ma'lumotlari qaytariladi
    }
  },
});


export const getUsersById = query({
  args:{
    id:v.string()
  },
  handler: async (ctx, {id}) => {

    const user = await ctx.db
      .query("users")
      .withIndex("user_id", (q) => q.eq("id", id ))
      .first();

      if (!user) {
        throw new Error("User not found");
      }

      const streamData = await ctx.db
      .query("stream")
      .withIndex("by_userId", (q) => q.eq("userId", id))
      .first();
    
      return {
        ...user,
        streamKey: streamData?.streamKey || null, // Include streamKey if available
        stream: streamData || null, // Include stream data if available
      };
      
  },
})

export const getUsersByUsername = query({
  args:{
    username:v.string()
  },
  handler: async (ctx, {username}) => {

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), username ))
      .first();

      if (!user) {
        throw new Error("User not found");
      }

      const streamData = await ctx.db
      .query("stream")
      .withIndex("by_userId", (q) => q.eq("userId", user.id))
      .first();

      return {
        ...user,
        streamKey: streamData?.streamKey || null, // Include streamKey if available
        stream: streamData || null, 
      };
  },

})


export const blockUser = mutation({
  args: {
    blockedId: v.string(), // Bloklanayotgan foydalanuvchi ID'si
  },
  handler: async (ctx, { blockedId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const blockerId = identity?.subject; // Blok qilayotgan foydalanuvchi ID'si

   

    // Agar foydalanuvchi allaqachon blok qilgan bo'lsa
    const existingBlock = await ctx.db
      .query("block")
      .withIndex("by_blocker", (q) => q.eq("blockerId", blockerId))
      .filter((q) => q.eq(q.field("blockedId"), blockedId))
      .first();

    if (existingBlock) {
      throw new Error("User already blocked");
    }

    // Foydalanuvchini bloklash
    const now = new Date().toISOString();
   const blockedUser =  await ctx.db.insert("block", {
      blockerId,
      blockedId,
      createdAt: now,
      updatedAt: now,
    });

    return blockedUser;
  },
});

export const unblockUser = mutation({
  args: {
    blockedId: v.string(), // Blokdan chiqarilayotgan foydalanuvchi ID'si
  },
  handler: async (ctx, { blockedId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const blockerId = identity?.subject; // Blok qilgan foydalanuvchi ID'si

   

    // Bloklangan foydalanuvchini topish
    const blockRecord = await ctx.db
      .query("block")
      .withIndex("by_blocker", (q) => q.eq("blockerId", blockerId))
      .filter((q) => q.eq(q.field("blockedId"), blockedId))
      .first();

    if (!blockRecord) {
      throw new Error("User is not blocked");
    }

    // Foydalanuvchini blokdan chiqarish
   const unBlockedUser =  await ctx.db.delete(blockRecord._id);

    return unBlockedUser;
  },
});

export const getBlockedUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const blockerId = identity?.subject;

   
    // 1. Block jadvalidan blocker foydalanuvchining blok qilgan userlarini olish
    const blockedUsers = await ctx.db
      .query("block")
      .withIndex("by_blocker", (q) => q.eq("blockerId", blockerId))
      .collect();

    // 2. Agar bloklangan foydalanuvchilar bo'lsa
    if (blockedUsers.length > 0) {
      // Bloklangan foydalanuvchilarni to'plash uchun massiv
      const blockedUsersData = [];

      for (const block of blockedUsers) {
        // 3. Har bir blockedId bo'yicha users jadvalidan ma'lumotlarni olish
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("id"), block.blockedId))
          .first();

        if (user) {
          blockedUsersData.push(user);
        }
      }

      return blockedUsersData; // Bloklangan foydalanuvchilar ma'lumotlarini qaytarish
    }

    return []; // Agar bloklangan foydalanuvchilar bo'lmasa, bo'sh massiv qaytariladi
  },
});

export const isBlockedUser = query({
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
  
      const existingBlock = await ctx.db
        .query("block")
        .filter((q) => q.and(
          q.eq(q.field("blockerId"),userId ),
          q.eq(q.field("blockedId"), otherUser.id)
        ))
        .first();

        return !!existingBlock;


  },
});


export const updateUser = mutation({
  args: {
    username: v.string(), // Foydalanuvchi nomi
    bio: v.optional(v.string()), // Ixtiyoriy foydalanuvchi bio
    avatarUrl: v.optional(v.string()), // Ixtiyoriy avatar rasm URL'si
    email: v.optional(v.string()), // Ixtiyoriy email
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    
    const userId = identity?.subject;

    // Foydalanuvchini olish
    const user = await ctx.db
      .query("users")
      .withIndex("user_id", (q) => q.eq("id", userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Foydalanuvchini yangilash
    const updatedUser = await ctx.db.patch(user._id, {
      ...args,
      updatedAt: new Date().toISOString(), // Yangilangan vaqt
    });

    return updatedUser;
  },
});


export const hasBlockedCurrentUser = query({
  args: {
    streamerId: v.string(), // Stream egasining ID'si
  },
  handler: async (ctx, { streamerId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const currentUserId = identity?.subject; // Hozirgi foydalanuvchi ID'si

    if (!currentUserId) {
      throw new Error("User is not authenticated");
    }

    // Stream egasi hozirgi foydalanuvchini bloklaganligini tekshirish
    const blockRecord = await ctx.db
      .query("block")
      .filter((q) =>
        q.and(
          q.eq(q.field("blockerId"), streamerId), // Stream egasi (blok qilishi mumkin bo'lgan user)
          q.eq(q.field("blockedId"), currentUserId) // Hozirgi foydalanuvchi
        )
      )
      .first();

    // Agar bloklangan bo'lsa, `true` qaytaradi, aks holda `false`
    return !!blockRecord;
  },
});

