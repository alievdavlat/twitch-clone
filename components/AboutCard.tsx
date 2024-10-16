"use clienr";
import { useAuth } from "@clerk/clerk-react";
import * as React from "react";
import Verified from "./verified";
import BioModal from "./bio-modal";

interface AboutCardProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  bio: string | undefined;
  FollowedByCount: number;
  FollowingdByCount:number;
  username:string
}

const AboutCard = ({
  FollowedByCount,
  bio,
  hostIdentity,
  hostName,
  username,
  FollowingdByCount, 
}: AboutCardProps) => {
  const { userId } = useAuth();
  const isHost = hostIdentity === userId;

  const followedByLabel = FollowedByCount === 1 ? "follower" : "followers";
  const followingByLabel = FollowedByCount === 1 ? "following" : "followings";

  return (
    <div className="px-4">
      <div className="gruop rounded-xl bg-background p-6 lg:p-10 flex flex-col gap-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 font-semibold lg:text-2xl text-xl">
            About {hostName}
            <Verified />
          </div>
          {isHost && (
            <BioModal
            initialValue={bio}
            username={username}
            />
          )}
        </div>

        <div className="flex items-center  gap-x-4">
          {/* followers */}
          <div className="text-sm text-neutral-400">
            <span>{FollowedByCount}</span> {followedByLabel}
          </div>

          {/* following */}
          <div className="text-sm text-neutral-400">
            <span>{FollowingdByCount}</span> {followingByLabel}
          </div>
        </div>

        <p>
          {bio || "This is user prefers to keep an air of mystery abot them."}
        </p>
      </div>
    </div>
  );
};

export default AboutCard;
