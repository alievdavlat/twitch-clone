import * as React from 'react'
import { MinusCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn, stringToColor } from '@/lib/utils'
import Hint from './hint'
import { Button } from './ui/button'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
interface CommunityItemProps {  
  hostName:string
  viewerName:string
  participantName?:string
  participantIdentity:string
}


const CommunityItem = ({hostName, viewerName, participantName}:CommunityItemProps) => {  
      //** hooks
      const [isBlockPending, startBlockTranstion]  = React.useTransition()
      const color = stringToColor(participantName || '')

       //** convex
        //@ts-ignore
      const user = useQuery(api.users.getUsersByUsername, {username:participantName});
      //@ts-ignore
      const isBlocked =  useQuery(api.users.isBlockedUser,{id:user?.id})
      const blockUser = useMutation(api.users.blockUser)
      const unblockUser = useMutation(api.users.unblockUser)
      //** variables
      const isSelf = participantName === viewerName
      const isHost = viewerName === hostName
    
  const HandleBlock = async () => { 
    if (!participantName || isSelf || !isHost) {
        return
    }

    if (user?.id) {
      startBlockTranstion( async() => {
       blockUser({
          blockedId: user?.id
        })
    
      })
    }
  
  }
  const HandleUnblock = async () => { 
    if (user?.id) {
      startBlockTranstion( async () => {
         unblockUser({
          blockedId: user?.id
        })
      })
    }
  
  }
  const handleBlockClick = () => {
    if (isBlocked) {
      HandleUnblock()
      toast.success(`Unblocked the User ${user?.username}`)
    } else {
      HandleBlock()
       toast.error(`Blocked the User ${user?.username}`)
    }
  }

  return (
    <div className={cn(
      'group flex items-center justify-between w-full p-2 rounded-md hover:bg-white/5 text-sm',
    )}>
      <p style={{color}}>
      {participantName}
      </p>  
      {
        isHost && !isSelf && (
          <Hint label='Block'>
            <Button className='h-auto w-auto p-1 opacity-0 group-hover:opacity-100 transition'
            onClick={handleBlockClick}
            disabled={isBlockPending}
            >
              <MinusCircle
              
              />
            </Button>
          </Hint>
        )
      }

    </div>
  )
}

export default CommunityItem