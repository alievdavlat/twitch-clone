import Link from 'next/link'
import React from 'react'
import Thumbnail, { ThumnailSkeleton } from '../../(home)/_components/Thumbnail'
import Verified from '@/components/verified'
import { formatDistanceToNow } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

interface ResultCardProps {
  data:any
} 

const ResultCard = ({data}: ResultCardProps) => {
  return (
    <Link href={`/${data?.user?.username}`}>
      <div className='flex w-full gap-x-4'>
          <div className='relative h-[9rem] w-[16rem]'>
            <Thumbnail
            fallback={data?.user?.imageUrl}
            src={data?.thumbnailUrl}
            isLive={data?.isLive}
            username={data?.user?.username}
            />
          </div>

          <div className='space-y-1'>
            <div className='flex items-center gap-x-2'>
            <p className='hover:text-blue-500 font-bold text-lg cursor-pointer'>
                {data?.user?.username}
            </p>
            <Verified/>
            </div>
            <p className='text-neutral-400 text-sm'>
              {data?.name}
            </p>
            <p className='text-neutral-400 text-sm'>
              {
                formatDistanceToNow(new Date(data.updatedAt), {
                  addSuffix: true,
                })
              }
            </p>
          </div>
      </div>
    </Link>
  )
}

export default ResultCard

export const ResultCardSkeleton = () => {
  return (
    <div className=' w-full flex gap-y-4'>   
      <div className='relative h-[9rem] w-[16rem]'>
        <ThumnailSkeleton />
      </div>

      <div className='space-y-2'>
        <Skeleton
          className={'h-4 w-32'}
        />
         <Skeleton
          className={'h-3 w-24'}
        />
         <Skeleton
          className={'h-3 w-12'}
        />
      </div>
    </div>
  )
}