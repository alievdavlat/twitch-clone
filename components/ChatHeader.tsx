"use client"
import * as React from 'react'
import { Skeleton } from './ui/skeleton'
import ChatToggle from './ChatToggle'
import VariantToggle from './VariantToggle'

const ChatHeader = () => {
  return (
    <div className='relative p-3 border-b-[0.5px] border-neutral-600 '>
      <div className='absolute left-2 top-2 hidden lg:block'>
      <ChatToggle
      />
      </div>
      <p className='font-semibold text-primary text-center'>
        Stream chat
      </p>

      <div className='absolute right-2 top-2'>
        <VariantToggle/>
      </div>
    </div>
  )
}

export default ChatHeader

export const ChatHeaderSkeleton = () => {
  return (
    <div className='relative p-3 border-b-[0.5px] border-neutral-600 hidden md::block'>
        <Skeleton
        className='absolute h-6 w-6 left-3 top-3'
        />
        <Skeleton
        className='w-28 h-6 mx-auto'
        />
    </div>
  ) 
  
}