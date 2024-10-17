"use client"
import { api } from '../../../../convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'
import ResultCard, { ResultCardSkeleton } from './ResultCard'
import { Skeleton } from '../../../../components/ui/skeleton'

const Results = () => {
  const streams = useQuery(api.stream.getLiveStreamsWithoutOwn)

  if (streams === undefined) {
    return <ResultSkeleton/>
  }
  

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>
        Stream we think you&apos;ll like
      </h2>
      {
        streams?.length  === 0 && (
          <div className='text-neutral-400 text-sm'>
            No Live streams found.
          </div>
        )
      }

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
        {
          streams?.map((stream) => (
            <ResultCard key={stream?.userId} stream={stream} />
          ))
        }
      </div>
    </div>
  )
}

export default Results

export const ResultSkeleton = () => {
  return (
    <div className='h-full p-8 max-w-screen-2xl mx-auto'>
        <Skeleton
          className='h-8 w-[290px] mb-4'
        />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
        {
          [...Array(15)].map((_, i) => (
            <ResultCardSkeleton key={i} />
          ))
        }
        </div>
    </div>
  )
}