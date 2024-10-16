import * as React from 'react'
import { useParticipants } from '@livekit/components-react'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import CommunityItem from './CommunityItem'
import { LocalParticipant, RemoteParticipant } from 'livekit-client'
import { useDebounce } from 'use-debounce';

interface ChatCommunityProps {   
  hostName:string
  viewerName:string
  isHidden:boolean

 }


const ChatCommunity = ({hostName, isHidden, viewerName}:ChatCommunityProps) => {
  const participants =  useParticipants()
  const [value,  setValue] = React.useState('')
  const [debouncedValue] = useDebounce<string>(value, 500)

  const onChange = (newValue:string) => {
    setValue(newValue)
  }
  const filteredParticipants = React.useMemo(() => {
    const deduped = participants.reduce((acc, participant) => {
      const hostAsViewer = `host-${participant.identity}`;
      
      // Agar ushbu participant hali acc arrayda mavjud bo'lmasa, qo'shamiz
      if (!acc.some((p: any) => p.identity === hostAsViewer)) {
        acc.push(participant); // participant'ni qo'shamiz
      }
      
      return acc;
    }, [] as (RemoteParticipant | LocalParticipant)[]);
    
    // Participant'larning nomini debouncedValue bilan filtrlaymiz
    return deduped.filter((participant: any) => {
      return participant?.name?.toLowerCase().includes(debouncedValue.toLowerCase());
    });
  }, [participants, debouncedValue]);
  

  if(isHidden) {  
      return (
        <div className='flex fle-1 items-center justify-center'>
            <p className='text-sm text-muted-foreground'>
              Comminity is disabled
            </p>
        </div>
      )
  }


  return (
    <div className='p-4'>
      <Input
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search community'
        className='border-white/10'
      />
      <ScrollArea className='gap-y-2 mt-4'>
        <p className='text-center text-sm text-muted-foreground hidden last:block p-2'>
          No results
        </p>
        {
          filteredParticipants.map((participant) => (
            <CommunityItem
            key={participant.identity}
            hostName={hostName}
            viewerName={viewerName}
            participantName={participant.name}
            participantIdentity={participant.identity}
            />
          ))
        }
      </ScrollArea>
    </div>
  )
}

export default ChatCommunity