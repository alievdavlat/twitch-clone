import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users:defineTable({
    id:v.string(),
    username:v.string(),
    imageUrl:v.string(),
    externalUserId:v.string(),
    bio:v.string(),
    stream:v.optional(v.any()),
    createdAt:v.string(), 
    updatedAt :v.string()
  }).index("user_id", ['id'])
  .index("by_username", ['username']),

  follow: defineTable({
    followerId: v.optional(v.string()),  // Foydalanuvchi kuzatuvchi
    followingId: v.optional(v.string()), // Foydalanuvchi kuzkuzatilayotgan
    createdAt:v.string(), 
    updatedAt :v.string()
  })
  .index("by_follower", ["followerId"])  // Foydalanuvchi kuzatuvchilarini ko'rish uchun
  .index("by_following", ["followingId"]),

  block: defineTable({
    blockerId: v.optional(v.string()),  
    blockedId: v.optional(v.string()),
    createdAt:v.string(), 
    updatedAt :v.string()
  })
  .index("by_blocker", ["blockerId"])  
  .index("by_blocked", ["blockedId"]),
  stream: defineTable({
    name: v.string(),
    thumbnailUrl:v.optional(v.string()),
    
    ingressId:v.optional(v.string()),
    serverUrl:v.optional(v.string()),
    streamKey:v.optional(v.string()),

    isLive:v.boolean(),
    isChatEnabled:v.boolean(),
    isChatDelayed:v.optional(v.boolean()),
    isChatFollowersOnly:v.boolean(),

    userId:v.string(),
    user:v.any(),
    createdAt:v.string(), 
    updatedAt :v.string()
  })
  .index("by_userId", ["userId"])
  .index("by_ingressId", ["ingressId"])
  .searchIndex("search_streams", {
    searchField:'name',
    filterFields:['createdAt', 'updatedAt']
  })
  .searchIndex("username_search", {
    searchField:'user.username',
    filterFields:['createdAt', 'updatedAt']
  })

});