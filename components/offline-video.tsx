import React from 'react'
import { WifiOff } from 'lucide-react'
interface OfflineVideoProps {
username: string
}


const OfflineVideo = ({username}:OfflineVideoProps) => {
  return (
    <div className='h-full flex flex-col space-y-4 justify-center items-center'>
      <WifiOff
      className='h-12 w-12 text-neutral-400'
      />
      <p className='text-neutral-400'>
        <span>{username} is offline</span>
      </p>
    </div>
  )
}

export default OfflineVideo