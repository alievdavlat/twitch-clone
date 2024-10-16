import React from 'react'
import { Loader } from 'lucide-react'
interface LoadingVideoProps {
label: string
}


const LoadingVideo = ({label}:LoadingVideoProps) => {
  return (
    <div className='h-full flex flex-col space-y-4 justify-center items-center'>
      <Loader
      className='h-12 w-12 text-neutral-400 animate-spin'
      />
      <p className='text-neutral-400 capitalize'>
        <span>{label}</span>
      </p>
    </div>
  )
}

export default LoadingVideo