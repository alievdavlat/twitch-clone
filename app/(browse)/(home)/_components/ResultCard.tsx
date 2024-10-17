import React from 'react'
import Link from 'next/link'
import Thumbnail, { ThumnailSkeleton } from './Thumbnail'
import LiveBadge from '../../_components/live-badge'
import UserAvatar, { UserAvatarSkeleton } from '../../_components/UserAvatar'
import { Skeleton } from '../../../../components/ui/skeleton'

interface ResultCardProps {
  stream:any
}

const ResultCard = ({stream}: ResultCardProps) => {
  return (
   <Link 
   href={`/${stream?.user?.username}`}
   >
    <div className='h-full w-full space-y-4'>
      <Thumbnail
      src={stream?.thumbnailUrl}
      fallback={stream?.user?.imageUrl}
      isLive={stream?.isLive}
      username={stream?.user?.username}
      />
       {
      stream?.isLive && (
        <div className='absolute top-2  left-2 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform'>
          <LiveBadge/>
        </div>
      )
    }
    <div className='flex gap-x-3'>
      <UserAvatar
      username={stream?.user?.username}
      imageUrl={stream?.user?.imageUrl}
      isLive={stream?.isLive}
      />
      <div className='flex flex-col text-sm overflow-hidden'>
        <p className='truncate font-semibold hover:text-blue-500'>
          {stream?.name}
        </p>
        <p className=' text-neutral-400'>
        {stream?.user?.username}
        </p>
      </div>
    </div>
    </div>
   </Link>
  )
}

export default ResultCard


export const ResultCardSkeleton = () => {
  return (
    <div className='h-full w-full space-y-4'>
      <ThumnailSkeleton/>
      <div className='flex gap-x-3'>
      <UserAvatarSkeleton/>
      <div className='flex flex-col gap-y-1'>
          <Skeleton
          className='h-4 w-32'
          />
          <Skeleton
          className='h-3 w-24'
          />
        </div>  
      </div>
    </div>
  )
}