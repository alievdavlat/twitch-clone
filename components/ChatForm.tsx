"use client"
import * as React from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import ChatInfo from "./ChatInfo";

interface ChatFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isHidden: boolean;
  isFollowersOnly: boolean;
  isDelayed: boolean;
  isFollowing?: boolean;
}

const ChatForm = ({
  isDelayed,
  isFollowersOnly,
  isFollowing,
  isHidden,
  onChange,
  onSubmit,
  value,
}: ChatFormProps) => {

  const [isDelayedBlocked, setIsDleayBlocked] = React.useState(false);
  const isFollowersOnlyAndNotFollowing = isFollowersOnly && !isFollowing;
  const isDisabled = isHidden || isDelayedBlocked || isFollowersOnlyAndNotFollowing;

  
  

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(!value || isDisabled) return;

    if (isDelayed && isDelayedBlocked) {
        setIsDleayBlocked(true)
        setTimeout(() => {
            setIsDleayBlocked(false)
        }, 3000);
    } else {
      onSubmit()
    }
  }

  if (isHidden) {
      return null
  }

    

  return (
    <form
      className="flex flex-col items-center gap-y-4 p-3"
      onSubmit={handleSubmit}>
      <div className="w-full">
        <ChatInfo
          isDelayed={isDelayed}
          isFollowersOnly={isFollowersOnly}
        />
        <Input
          onChange={(e) => onChange(e.target.value)}
          value={value}
          disabled={isDisabled}
          placeholder="Send a message"
          className={cn("border-white/10", isFollowersOnly && 'rounded-t-none border-t-0')}
        />
      </div>

      <div className="ml-auto">
        <Button type="submit" variant={'primary'}  size={'sm'} disabled={isDisabled}>
          Chat
        </Button>
      </div>
    </form>
  );
};

export default ChatForm;


export const ChatFormSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 p-3">         
      <Skeleton
        className="w-full h-10"
      />

      <div className="flex items-center gap-x-2 ml-auto">
        <Skeleton
          className="w-7 h-7"
        />
        <Skeleton
          className="w-12 h-7"
        />
      </div>
    </div>
    
  )
}