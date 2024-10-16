"use client";
import UserAvatar from "@/app/(browse)/_components/UserAvatar";
import * as React from "react";
import Verified from "./verified";
import {
  useParticipants,
  useRemoteParticipant,
} from "@livekit/components-react";
import { UserIcon } from "lucide-react";
import StreamActions from "./StreamActions";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
interface HeaderProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  imageUrl: string;
  isFollowing?: boolean;
  name: string;
  user: any;
}

const Header = ({
  hostIdentity,
  hostName,
  imageUrl,
  isFollowing,
  name,
  user,
}: HeaderProps) => {
  const { user: clerkUser } = useUser();
  const participants = useParticipants();
  const participant = useRemoteParticipant(hostIdentity);
  const updateStream = useMutation(api.stream.createOrUpdateStream);
  const isLive = !!participant;

  if (isLive && user?.id === clerkUser?.id) {
    updateStream({
      isLive: true,
      userId: user?.id,
      name: `${user?.username}'s stream`,
      isChatEnabled: true,
      isChatFollowersOnly: false,
    });
  } else if (!isLive && user?.id === clerkUser?.id) {
    updateStream({
      isLive: false,
      userId: user?.id,
      name: `${user?.username}'s stream`,
      isChatEnabled: true,
      isChatFollowersOnly: false,
    });
  }
  const participantCount = participants.length - 1;
  const isHost = hostIdentity === clerkUser?.id;

  return (
    <div className="flex flex-col-1 lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4">
      <div className="flex items-center gap-x-3">
        <UserAvatar
          username={hostName}
          imageUrl={imageUrl}
          size={"lg"}
          isLive={isLive}
          showBadge
        />
        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <h2 className="text-lg font-semibold">{hostName}</h2>
            <Verified />
          </div>
          <p className="text-sm font-semibold">{name}</p>
          {isLive ? (
            <div className="font-semibold flex gap-x-1 items-center text-xs text-rose-500">
              <UserIcon className="h-4 w-4" />
              <p>
                {participantCount}
                {participantCount > 1 ? " viewers" : " viewer"}
              </p>
            </div>
          ) : (
            <p className="font-semibold text-xs text-muted-foreground">
              Offline
            </p>
          )}
        </div>
      </div>
      <StreamActions
        isFollowing={isFollowing}
        hostIdentity={hostIdentity}
        isHost={isHost}
      />
    </div>
  );
};

export default Header;
