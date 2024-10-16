import { cn } from '@/lib/utils'
import React from 'react'

interface LiveBadgeProps {
 classname?: string 
}

const LiveBadge = ({classname}:LiveBadgeProps) => {
  
  
  return (
    <div className={cn('bg-rose-500 text-center p-0.5 px-1.5 rounded-md uppercase text-[10px] bordeer border-background font-semibold trancking-wide', classname)}>
      Live
    </div>
  )
}

export default LiveBadge