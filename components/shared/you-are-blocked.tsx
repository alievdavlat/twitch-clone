"use client"
import { FolderLock } from 'lucide-react'
import * as React from 'react'

const YouAreBlocked = ({username}:{username:string}) => {
  return (
    <div className='h-full flex flex-col space-y-4 justify-center items-center'>
    <FolderLock 
    className='h-12 w-12 text-neutral-400'
    />
    <p className='text-neutral-400'>
      <span>Youe ate blocked by user {username}</span>
    </p>
  </div>
  )
}

export default YouAreBlocked