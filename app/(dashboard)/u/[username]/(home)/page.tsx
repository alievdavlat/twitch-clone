"use client";
import Loader from '@/components/loader';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React from 'react'
import StreamPlayer from './_components/StreamPlayer';


interface CreatorPageProps {
  params: {
    username: string;
  };
}
const CreatorPage =  ({params}:CreatorPageProps) => {
  const user = useQuery(api.users.getUsersByUsername, { username: params.username });
 
  
  // @ts-ignore
  const isFollwing = useQuery(api.followers.isFollwingUser,{id:user?.id})
  
  if (!user || !user?.id && !user?.stream ) {
    return  <Loader/>
  }

  return (
    <div className='h-full'>
      <StreamPlayer
      user={user}
      stream={user?.stream}
      isFollowing={isFollwing}
      username={params.username}
      /> 

    </div>
  )
}

export default CreatorPage