import { Id } from "@/convex/_generated/dataModel";
import { ReactNode } from "react";
export interface childProps {
  children: ReactNode;
}

interface stream {
  createdAt: string;
  ingressId: string;
  isChatDelayed: boolean;
  isChatEnabled: boolean;
  isChatFollowersOnly: boolean;
  isLive: boolean;
  name: string;
  serverUrl: string | null;
  streamKey: string;
  updatedAt: string;
  user: {
    bio: string;
    createdAt: string;
    externalUserId: string;
    id: string;
    imageUrl: string;
    updatedAt: string;
    username: string;
  };
  userId: string;
  _creationTime: number;
  _id: string;
}

export interface UserProp {
  _id: Id<"users">;
  _creationTime: number;
  id: string;
  username: string;
  imageUrl: string;
  externalUserId: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  stream: stream;
  streamKey: string | null;
}

export interface Follower {
  id: Id<"follow">;
  _creationTime: number;
  followerId?: string | undefined;
  followingId?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

import { LocalAudioTrack, LocalVideoTrack, videoCodecs } from "livekit-client";
import { VideoCodec } from "livekit-client";

export interface SessionProps {
  roomName: string;
  identity: string;
  audioTrack?: LocalAudioTrack;
  videoTrack?: LocalVideoTrack;
  region?: string;
  turnServer?: RTCIceServer;
  forceRelay?: boolean;
}

export interface TokenResult {
  identity: string;
  accessToken: string;
}

export function isVideoCodec(codec: string): codec is VideoCodec {
  return videoCodecs.includes(codec as VideoCodec);
}

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};
