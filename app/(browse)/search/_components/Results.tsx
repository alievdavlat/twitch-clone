"use client"
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'
import ResultCard, { ResultCardSkeleton } from './ResultCard'
import { Skeleton } from '@/components/ui/skeleton'

interface ResultsProps {  
  term?:string
}

const Results = ({term}: ResultsProps) => {
    const streams = useQuery(api.stream.searchStreams, {searchTerm:term})
      console.log(streams, 'stream');
      
    if (streams === undefined) {
      return <ResultsSkeleton/>
    }

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>
        Results for term&quot;{term}&quot;
      </h2>
      {
        streams?.length  === 0  && (
          <div className='text-neutral-400 text-sm'>
            No results found. Try searching for somthing else. 
          </div>
        )
      }

      <div className='flex flex-col gap-y-4'>
          {
            streams?.map((stream) => (
             <ResultCard key={stream._id} data={stream} />
            ))  
          }
      </div>
    </div>
  )
}

export default Results

export const ResultsSkeleton = () => {
  return (
    <div className='h-full p-8 max-w-screen-2xl mx-auto'>
      <Skeleton
      className='h-8 w-[290px] mb-4'
      />
      <div className='flex flex-col gap-y-4'>
        {
          [...Array(5)].map((_, i) => (
            <ResultCardSkeleton key={i} />
          ))
        }
      </div>
    </div>
  )
}