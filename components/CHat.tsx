"use client"
import * as React from 'react'
import { ChatVariant, useChatSidebar } from '@/store/use-chat-sidebar'
import { useChat, useConnectionState, useRemoteParticipant } from '@livekit/components-react'
import { ConnectionState } from 'livekit-client'
import { useMediaQuery } from 'usehooks-ts'
import ChatHeader, { ChatHeaderSkeleton } from './ChatHeader'
import ChatForm from './ChatForm'
import ChatList from './ChatList'
import ChatCommunity from './ChatCommunity'

interface ChatProps { 
  viewerName:string
  hostName:string
  hostIdentity:string
  isFollwingUser?:boolean
  isChatEnabled:boolean
  isChatDelayed:boolean
  isChatFollowersOnly:boolean
} 

const CHat = ({hostIdentity, hostName, isChatDelayed, isChatEnabled, isChatFollowersOnly, isFollwingUser, viewerName}: ChatProps) => {
  const matches = useMediaQuery('(max-width: 1024px)')
  const {variant, onExpand} = useChatSidebar((state) => state)
  const connectionState = useConnectionState()
  const participant = useRemoteParticipant(hostIdentity)

  const isOnline =  participant && connectionState === ConnectionState.Connected
  
  const isHidden = !isChatEnabled || !isOnline ;
  
  const [value , setValue] = React.useState('')
  const {chatMessages:messages, send} = useChat()


  React.useEffect(() => {
    if (matches) {
        onExpand();
    }
  }, [matches, onExpand])

  const reversedMessages = React.useMemo(() => {
    return messages.sort((a , b) => b.timestamp - a.timestamp)
  }, [messages])
  const onSubmit = () => {
    if (!send) {
      return
    } else {
      send(value)
    }
    setValue('')
  };

  const onChange = (value:string) => {
    setValue(value)
  }



  return (
    <div className='flex flex-col bg-background border-l-[0.5px] border-b-[0.5px] border-neutral-600  h-[calc(100vh-80px)] pt-5'>
      {
        reversedMessages ? 
        <ChatHeader/>
        : <ChatHeaderSkeleton/>

      }

      {
        variant  ===  ChatVariant.CHAT && (
          <>
          <ChatList
          messages={reversedMessages}
          isHidden={isHidden}
          />
          <ChatForm
          onSubmit={onSubmit}
          value={value}
          onChange={onChange}
          isHidden={isHidden}
          isFollowersOnly={isChatFollowersOnly}
          isDelayed={isChatDelayed}
          isFollowing={isFollwingUser}
          />
          </>
        )
      }

      {
        variant  ===  ChatVariant.COMMUNITY && (
          <ChatCommunity
          hostName={hostName}
          isHidden={isHidden}
          viewerName={viewerName}
          />
        )
      }

    </div>
  )
}

export default CHat