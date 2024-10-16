import * as React from 'react'
import Hint from './hint';
import { Info } from 'lucide-react';

interface ChatInfoProps {
  isDelayed: boolean;
  isFollowersOnly: boolean;
}


const ChatInfo = ({isDelayed, isFollowersOnly}: ChatInfoProps) => {
  
  const label = React.useMemo(() => {
    if (isFollowersOnly && !isDelayed) {
      return 'Followers only'
    }
    if (!isFollowersOnly && isDelayed) {
      return 'Slow mode'
    }

    if(isDelayed && isFollowersOnly) {
      return 'Followes only and Slow mode'
    }
    return ''
  }, [isDelayed, isFollowersOnly])

 


  return (
    <div className='p-2 text-muted-foreground bg-white/10 border border-white/10 w-full rounded-t-md flex items-center gap-x-2'>
      <Hint label={label}>
        <Info
          className='h-4 w-4'
        />
      </Hint>
      <p className='text-xs font-semibold'>
        {label}
      </p>
    </div>
  )
}

export default ChatInfo