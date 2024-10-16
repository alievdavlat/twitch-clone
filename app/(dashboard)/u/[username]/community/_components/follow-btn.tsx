"use client"
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import * as React from 'react'
import { toast } from 'sonner'

interface FollowBtnProps {
  username:string
}

const FollowBtn = ({username}:FollowBtnProps) => {
  const [isPending, startTranstion]  = React.useTransition()
  const user = useQuery(api.users.getUsersByUsername, { username});
  const followUser = useMutation(api.followers.followUser)
  const unfollowUser = useMutation(api.followers.unfollowUser)

  //@ts-ignore
  const isFolowingUser = useQuery(api.followers.isFollwingUser,{id:user?.id})

  const handleMesage = async (message:string) => {
    if (user?.id) {
      toast.success(message)
    }
  }

  const HandleFollow = async () => { 
    if (user?.id) {
      startTranstion( async () => {
      followUser({
          id:user?.id
        })
      })
    }
  
  }

  const HandleUnfollow = async () => { 
    if (user?.id) {
      startTranstion( async () => {
      unfollowUser({
          id:user?.id
        })
        
      })
    }
  
  }

  const handleClick = () => {
    if (isFolowingUser) {
      HandleUnfollow()
      handleMesage(`Unfollowed the User ${user?.username}`)
    } else {
      HandleFollow()
      handleMesage(`Followed the User ${user?.username}`)
    }
  }
  const label = isFolowingUser ? 'Unfollow' : 'Follow'
  
  return <Button variant={'primary'} disabled={isPending} onClick={handleClick}>{label}</Button>
}

export default FollowBtn