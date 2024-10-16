"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { HeartIcon, LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StreamActionsProps {
  isFollowing?: boolean;
  hostIdentity: string;
  isHost: boolean;
}

const StreamActions = ({
  hostIdentity,
  isHost,
  isFollowing,
}: StreamActionsProps) => {
  const router = useRouter();
  const [isPending, startTranstion] = React.useTransition();
  const user = useQuery(api.users.getUsersById, { id: hostIdentity });

  //* convex hooks
  const followUser = useMutation(api.followers.followUser);
  const unfollowUser = useMutation(api.followers.unfollowUser);
  const blockUser = useMutation(api.users.blockUser);
  const unblockUser = useMutation(api.users.unblockUser);

  const isBlocked = useQuery(api.users.isBlockedUser, { id: hostIdentity });

  const HandleFollow = async () => {
    if (user) {
      startTranstion(async () => {
        followUser({
          id: hostIdentity,
        });
      });
    }
  };

  const HandleUnfollow = async () => {
    if (user) {
      startTranstion(async () => {
        unfollowUser({
          id: hostIdentity,
        });
      });
    }
  };

  const handleToggleFollow = () => {
    if (!user) {
      return router.push("/sign-in");
    }
    if (isHost) {
      return;
    }

    if (isFollowing) {
      HandleUnfollow();
      toast.success(`Unfollowed the User ${user?.username}`);
    } else {
      HandleFollow();
      toast.error(`Followed the User ${user?.username}`);
    }
  };

  const HandleBlock = async () => {
    if (user?.id) {
      startTranstion(async () => {
        blockUser({
          blockedId: user?.id,
        });
      });
    }
  };
  const HandleUnblock = async () => {
    if (user?.id) {
      startTranstion(async () => {
        unblockUser({
          blockedId: user?.id,
        });
      });
    }
  };
  const handleBlockClick = () => {
    if (isBlocked) {
      HandleUnblock();
      toast.success(`Unblocked the User ${user?.username}`);
    } else {
      HandleBlock();
      toast.error(`Blocked the User ${user?.username}`);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={handleToggleFollow}
        disabled={isPending || isHost}
        variant={"primary"}
        size={"sm"}
        className="w-full lg:w-auto">
        <HeartIcon
          className={cn(
            "h-4 w-4 mr-2",
            isFollowing ? "fill-white" : "fill-none"
          )}
        />
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>

      {!isHost && (
        <Button
          onClick={handleBlockClick}
          disabled={isPending || isHost}
          variant={"outline"}
          size={"sm"}
          className="w-full lg:w-auto">
          <LockIcon
            className={cn(
              "h-4 w-4 mr-2",
              isBlocked ? "fill-white" : "fill-none"
            )}
          />
          {isBlocked ? "Unblock" : "Block"}
        </Button>
      )}
    </div>
  );
};

export default StreamActions;
