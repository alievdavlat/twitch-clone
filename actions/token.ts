"use server";

import { v4 as uuidv4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const createViverToken = async (identity: string) => {
  let self: any;

  try {
    // Fetch user from Convex using Convex client
    self = await convex.query(api.users.getUsersById, { id: identity });
  } catch (err) {
    // If user is not found, generate a guest user
    const id = uuidv4();
    const username = `guest#${Math.floor(Math.random() * 1000)}`;
    self = { id, username };
  }

  // Fetch the host user from Convex
  const host = await convex.query(api.users.getUsersById, { id: self.id });

  if (!host) {
    throw new Error("User not found");
  }

  // Check if the user is blocked
  const isBlocked = await convex.query(api.users.isBlockedUser, { id: self.id });

  if (isBlocked) {
    throw new Error("User is blocked");
  }

  // Check if the user is the host
  const isHost = self.id === host.id;

  // Generate LiveKit access token
  const token = new AccessToken(
    process.env.NEXT_PUBLIC_LIVEKIT_API_KEY!,
    process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET!,
    {
      identity: isHost ? `host-${self.id}` : self.id,
      name: self.username,
    }
  );

  token.addGrant({
    room: host.id,
    roomJoin: true,
    canPublish: false,
    canPublishData:true
  });

  // Return the generated JWT token
  return token.toJwt();
};
