import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import LiveBadge from "./live-badge";

interface UserAvatarProps extends VariantProps<typeof avatarSize> {
  imageUrl: string;
  username: string;
  isLive?: boolean;
  showBadge?: boolean;
}

const avatarSize = cva("", {
  variants: {
    size: {
      default: "w-8 h-8",
      lg: "w-14 h-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const UserAvatar = ({
  imageUrl,
  username,
  isLive,
  size,
  showBadge,
}: UserAvatarProps) => {
  const canShowBadge = isLive && showBadge;

  return (
        <div className="relative">
          <Avatar
            className={cn(
              "",
              isLive && "ring-2 ring-rose-500 border border-background",
              avatarSize({ size })
            )}>
            <AvatarImage src={imageUrl} className="object-cover" />
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>
          {canShowBadge && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <LiveBadge />
            </div>
          )}
        </div>
  );
};

export default UserAvatar;

interface userAvatarSkeletonProps extends VariantProps<typeof avatarSize> {}

export const UserAvatarSkeleton = ({ size }: userAvatarSkeletonProps) => {
  return <Skeleton className={cn("rounded-full", size)} />;
};
