  "use client"
  import React from "react";
  import { Button } from "../../../../components/ui/button"
  import { api } from "../../../../convex/_generated/api"
  import { useMutation, useQuery } from "convex/react"
  import { useTransition } from "react"
  import { toast } from "sonner"

  interface ActionsUserProps {
    id?:string
    isFollowing?:boolean
    isblocked?:boolean
    isHost:boolean
  }

  const ActionsUser = ({id, isFollowing, isblocked}: ActionsUserProps) => {
    const [isPending, startTranstion]  = useTransition()
    const [isBlockPending, startBlockTranstion]  = useTransition()
    const followUser = useMutation(api.followers.followUser)
    const unfollowUser = useMutation(api.followers.unfollowUser)
    const blockUser = useMutation(api.users.blockUser)
    const unblockUser = useMutation(api.users.unblockUser)
    //@ts-ignore
    const user  = useQuery(api.users.getUsersById, {id})
    
    const handleMesage = async (message:string) => {
      if (id) {
        toast.success(message)
      }
    }

    const HandleFollow = async () => { 
      if (id) {
        startTranstion(  () => {
        followUser({
            id
          })

        })
      }
    
    }

    const HandleUnfollow = async () => { 
      if (id) {
        startTranstion( () => {
        unfollowUser({
            id
          })
          
        })
      }
    
    }

    const handleClick = () => {
      if (isFollowing) {
        HandleUnfollow()
        handleMesage(`Unfollowed the User ${user?.username}`)
      } else {
        HandleFollow()
        handleMesage(`Followed the User ${user?.username}`)
      }
    }

    const HandleBlock = async () => { 
      if (id) {
        startBlockTranstion(() => {
        blockUser({
            blockedId: id
          })
      
        })
      }
    
    }
    const HandleUnblock = async () => { 
      if (id) {
        startBlockTranstion(  () => {
          unblockUser({
            blockedId: id
          })
          
        })
      }
    
    }
    const handleBlockClick = () => {
      if (isblocked) {
        HandleUnblock()
        handleMesage(`Unblocked the User ${user?.username}`)
      } else {
        HandleBlock()
        handleMesage(`Blocked the User ${user?.username}`)
      }
    }

    return (
      <div className="">
        <Button variant={'primary'} disabled={isPending} onClick={handleClick}>
          {
            isFollowing ? 'Unfollow' : 'Follow'
          }
        </Button>
        <Button variant={'secondary'} disabled={isBlockPending} onClick={handleBlockClick}>
          {
            isblocked ? 'Unblock' : 'Block'
          }
        </Button>
      </div>
    )
  }

  export default ActionsUser