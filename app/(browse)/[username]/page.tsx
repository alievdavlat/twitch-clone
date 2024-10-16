"use client";
import * as React from 'react'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import Loader from '@/components/loader'
import StreamPlayer from '@/app/(dashboard)/u/[username]/(home)/_components/StreamPlayer'
import YouAreBlocked from '@/components/shared/you-are-blocked';

interface UserPageProps {
  params:{
    username:string
  }
}

const UserPage = ({params}:UserPageProps) => {
      const user = useQuery(api.users.getUsersByUsername, {username:params.username});
      //@ts-ignore
      const isFolowingUser = useQuery(api.followers.isFollwingUser,{id:user?.id})
      //@ts-ignore
      const isBlockedByUser = useQuery(api.users.hasBlockedCurrentUser,{streamerId:user?.id})

      if (isBlockedByUser) {
        return <YouAreBlocked username={params.username}/>
      }

      if (!user || !user?.id || !user?.stream ) {
        return  <Loader/>
      }
      

  return (
  <StreamPlayer
    user={user}
    stream={user?.stream}
    isFollowing={isFolowingUser}
    username={params.username}
  />
  )
}

export default UserPage