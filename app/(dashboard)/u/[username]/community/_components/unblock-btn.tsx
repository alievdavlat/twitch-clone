"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import * as React from "react";
import { toast } from "sonner";

interface UnblockBtnProps {
  username: string;
}

const UnblockBtn = ({ username }: UnblockBtnProps) => {
  
  const user = useQuery(api.users.getUsersByUsername, { username});
  const [isBlockPending, startBlockTranstion] = React.useTransition();
  //@ts-ignore
  const isBlocked = useQuery(api.users.isBlockedUser, { id: user?.id });
  const blockUser = useMutation(api.users.blockUser)
  const unblockUser = useMutation(api.users.unblockUser)
  const HandleBlock = async () => { 
    if (user?.id) {
      startBlockTranstion( async() => {
       blockUser({
          blockedId: user?.id
        })
    
      })
    }
  
  }
  const HandleUnblock = async () => { 
    if (user?.id) {
      startBlockTranstion( async () => {
         unblockUser({
          blockedId: user?.id
        })
      })
    }
  
  }
  const handleBlockClick = () => {
    if (isBlocked) {
      HandleUnblock()
      toast.success(`Unblocked the User ${user?.username}`)
    } else {
      HandleBlock()
       toast.error(`Blocked the User ${user?.username}`)
    }
  }
  const label = isBlocked ? "Unblock" : "Block";
  return <Button variant={'secondary'}  onClick={handleBlockClick} disabled={isBlockPending}>{label}</Button>
};

export default UnblockBtn;
