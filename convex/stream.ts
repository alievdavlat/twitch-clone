import { v } from 'convex/values';
import { mutation, query } from "./_generated/server";

// Stream creation mutation
export const createOrUpdateStream = mutation({
  args: {
    name: v.string(), // Stream name
    thumbnailUrl: v.optional(v.string()), // Thumbnail (optional)
    ingressId: v.optional(v.string()), // Ingress ID (optional)
    serverUrl: v.optional(v.string()), // Server URL (optional)
    streamKey: v.optional(v.string()), // Stream Key (optional)
    isLive: v.boolean(), // Is stream live?
    isChatEnabled: v.boolean(), // Is chat enabled?
    isChatFollowersOnly: v.boolean(), // Is chat followers-only?
    isChatDelayed: v.optional(v.boolean()),
    userId: v.string(), // User ID
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userAuthId = identity?.subject; // Get the authenticated user's ID

    // Check if a stream already exists for the user
    const existingStream = await ctx.db
      .query("stream")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    // Fetch the existing user without including `_id` or `_creationTime`
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("id"), args.userId))
      .first();

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Pick only safe fields to store
    const userForStream = {
      id: existingUser.id,
      username: existingUser.username,
      imageUrl: existingUser.imageUrl,
      bio: existingUser.bio,
      externalUserId: existingUser.externalUserId,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt
    };

    const now = new Date().toISOString();

    if (existingStream) {
      // If a stream already exists for the user, update the existing stream
      await ctx.db.patch(existingStream._id, {
        ...args,
        user: userForStream, // Use only allowed fields
        updatedAt: now,
      });
      return existingStream;
    } else {
      // If no stream exists, create a new one
      const newStream = await ctx.db.insert("stream", {
        ...args,
        user: userForStream, // Use only allowed fields
        createdAt: now,
        updatedAt: now,
      });
      return newStream;
    }
  },
});

export const getStreamByUserId = query({
  args: {
    userId: v.string(), // User ID as an argument
  },
  handler: async (ctx, { userId }) => {
    // Query to find the stream associated with the userId
    const stream = await ctx.db
      .query("stream")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!stream) {
      throw new Error("Stream not found for the given user ID");
    }

    return stream; // Return the stream details
  },
});


export const deleteStreamByUserId = mutation({
  args: {
    userId: v.string(), // User ID for which the stream is to be deleted
  },
  handler: async (ctx, { userId }) => {
    // Query to find the stream associated with the userId
    const existingStream = await ctx.db
      .query("stream")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!existingStream) {
      throw new Error("Stream not found for the given user ID");
    }

    // Delete the stream by its _id
    await ctx.db.delete(existingStream._id);

    return { success: true, message: "Stream deleted successfully" };
  },
});


export const updateStreamByUserId = mutation({
  args: {
    userId: v.string(),  // User ID to identify the stream
    name: v.optional(v.string()), // Optional fields for updating the stream
    thumbnailUrl: v.optional(v.string()),
    ingressId: v.optional(v.string()),
    serverUrl: v.optional(v.string()),
    streamKey: v.optional(v.string()),
    isChatDelayed: v.optional(v.boolean()),
    isLive: v.optional(v.boolean()),
    isChatEnabled: v.optional(v.boolean()),
    isChatFollowersOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Query to find the stream associated with the userId
    const existingStream = await ctx.db
      .query("stream")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!existingStream) {
      throw new Error("Stream not found for the given user ID");
    }

    const updatedFields = {
      ...args,
      updatedAt: new Date().toISOString(), // Update the updatedAt field
    };

    await ctx.db.patch(existingStream._id, updatedFields);

    return { success: true, message: "Stream updated successfully" };
  },
});



export const getLiveStreamsWithoutOwn = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const currentUserId = identity?.subject; // Hozirgi foydalanuvchi IDsi



    // Foydalanuvchi bloklaganlarni olish
    const blockedUsers = await ctx.db
      .query("block")
      .withIndex("by_blocker", (q) => q.eq("blockerId", currentUserId))
      .collect();
    const blockedIds = blockedUsers.map((block) => block.blockedId);

    // Barcha jonli streamlarni olish (isLive: true)
    const liveStreams = await ctx.db
      .query("stream")
      // .filter((q) => q.eq(q.field("isLive"), true)) // faqat jonli streamlar
      .collect();

    // Hozirgi foydalanuvchi o'zining streamini va bloklangan userlarni chiqarib tashlash
    const filteredLiveStreams = liveStreams.filter((stream) => 
      stream.userId !== currentUserId && // O'z streamini olib tashlash
      !blockedIds.includes(stream.userId) // Bloklanganlarni olib tashlash
    );

    const streamsWithUsers = [];

    for (const stream of filteredLiveStreams) {
      // Stream egasining user ma'lumotlarini olib kelish
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("id"), stream.userId))
        .first();

      if (!user) {
        throw new Error(`User not found for stream: ${stream.name}`);
      }

      // Stream va user ma'lumotlarini birlashtirish
      streamsWithUsers.push({
        ...stream,
        user: {
          id: user.id,
          username: user.username,
          imageUrl: user.imageUrl,
          bio: user.bio,
          externalUserId: user.externalUserId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }

    return streamsWithUsers; // Foydalanuvchi ma'lumotlari bilan streamlarni qaytarish
  },
});


export const searchStreams = query({
  args: {
    searchTerm: v.optional(v.string()), // Search term entered by the user
  },
  handler: async (ctx, { searchTerm }) => {
    const identity = await ctx.auth.getUserIdentity();
    const currentUserId = identity?.subject; // Get the current user's ID

    // Get the list of users that the current user has blocked
    const blockedUsers = await ctx.db
      .query("block")
      .withIndex("by_blocker", (q) => q.eq("blockerId", currentUserId))
      .collect();
    const blockedIds = blockedUsers.map((block) => block.blockedId);

    // Perform the search using the `search_streams` index
    const searchResults = await ctx.db
      .query("stream")
      .withSearchIndex("search_streams", (q) =>
        q.search("name", searchTerm!) // Search in the stream's name field
      )
      .take(100);

    // Filter out blocked users and the current user's own streams
    const filteredResults = searchResults.filter(
      (stream) =>
        stream.userId !== currentUserId && !blockedIds.includes(stream.userId)
    );

    // Retrieve user details for each stream
    const streamsWithUsers = [];
    for (const stream of filteredResults) {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("id"), stream.userId))
        .first();

      if (!user) {
        throw new Error(`User not found for stream: ${stream.name}`);
      }

      // Combine stream and user information
      streamsWithUsers.push({
        ...stream,
        user: {
          id: user.id,
          username: user.username,
          imageUrl: user.imageUrl,
          bio: user.bio,
          externalUserId: user.externalUserId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }

    return streamsWithUsers; // Return the streams along with the associated user info
  },
});


