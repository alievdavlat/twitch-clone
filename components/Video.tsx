"use client"
import * as React from 'react'
import {ConnectionState, Track} from 'livekit-client'
import { useConnectionState, useRemoteParticipant, useTracks} from '@livekit/components-react'
import OfflineVideo from './offline-video'
import LoadingVideo from './loading-video'
import LiveVideo from './live-video'
interface VideoProps {
  hostName:string
  hostIdentity:string
}

const Video = ({hostName,hostIdentity}:VideoProps) => {
  const connectionState = useConnectionState()
  const participant = useRemoteParticipant(hostIdentity)
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]).filter((track) => track.participant.identity === hostIdentity)
  
  let content;

  if(!participant && connectionState === ConnectionState.Connected) {
    content = <OfflineVideo username={hostName}/>
  } else if(!participant || tracks.length === 0) {
    content = <LoadingVideo label={connectionState}/>
  } else {
    content = <LiveVideo participant={participant} tracks={tracks}/>
  }

  return (
    <div className='aspect-video border-b-[0.5px] border-neutral-600  group relative'>
      {content}
    </div>
  )
}

export default Video