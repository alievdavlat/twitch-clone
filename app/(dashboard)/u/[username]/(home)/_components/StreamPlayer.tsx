//@ts-nocheck
import * as React from 'react'
import Loader from '@/components/loader'
import { useViewerTokens } from '@/hooks/use-viewer-tokens'
import { LiveKitRoom } from '@livekit/components-react'
import Video from '@/components/Video'
import { cn } from '@/lib/utils'
import { useChatSidebar } from '@/store/use-chat-sidebar'
import CHat from '@/components/CHat'
import ChatToggle from '@/components/ChatToggle'
import Header from '@/components/Header'
import InfoCard from '@/components/InfoCard'
import AboutCard from '@/components/AboutCard'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'


interface StreamPlayerProps {
user:any
  stream:any
  isFollowing:boolean | undefined
  username:string
} 


const StreamPlayer = ({stream, user, isFollowing, username}:StreamPlayerProps) => {
 
  const {identity,name, token,loading} = useViewerTokens(user.id)

  const followers = useQuery(api.followers.getFollowerCount, {id:user.id})
  const following = useQuery(api.followers.getFollowingCount, {id:user.id})

  const {collapsed}  = useChatSidebar((state) => state)
  if (loading && user) {
    return <Loader/>
  }
  if (!token || !name || identity) {
      return (
        <div className='flex flex-1 items-center justify-center h-screen w-full text-lg text-neutral-400 uppercase font-semibold'>
            Cannot watch the stream
        </div>
      )
  } 
  
  
  return (
    <>
    {
      collapsed && 
      (
        <div className='hidden lg:block fixed top-[100px] right-2 z-50'>
            <ChatToggle/>
        </div>
      )
    }
        <LiveKitRoom
        token={token}
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        className={cn('grid grid-cols-1 lg:gap-y-0  lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full',collapsed && 'lg:grid-cols-2  xl:grid-cols-2 2xl:grid-cols-2')}
        >
          <div className='space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10 pt-2'>
          <Video
          hostName={user?.username}
          hostIdentity={user?.id}
          />
          <Header
            hostName={user?.username}
            hostIdentity={user?.id}
            viewerIdentity={identity}
            imageUrl={user?.imageUrl}
            isFollowing={isFollowing}
            name={stream?.name}
            user={user}
          />
          <InfoCard
            hostIdentity={user?.id}
            viewerIdentity={identity}
            thumbnailUrl={stream?.thumbnailUrl}
            name={stream?.name}
            />
            <AboutCard
            hostName={user?.username}
            hostIdentity={user?.id}
            viewerIdentity={identity}
            bio={user?.bio}
            FollowedByCount={followers}
            FollowingdByCount={following}
            username={username}
            />
          </div>

          <div 
          className={cn('col-span-1', collapsed && 'hidden')}
          >
            <CHat
            viewerName={name}
            hostName={user?.username}
            hostIdentity={user?.id}
            isFollwingUser={isFollowing}
            isChatEnabled={stream?.isChatEnabled}
            isChatDelayed={stream?.isChatDelayed}
            isChatFollowersOnly={stream?.isChatFollowersOnly}
            />
          </div>
        </LiveKitRoom>
    </>
  )
}

export default StreamPlayer