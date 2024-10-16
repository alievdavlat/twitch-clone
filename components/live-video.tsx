"use client";
import * as React from "react";
import { Participant, Track } from "livekit-client";
import {
  TrackReferenceOrPlaceholder,
  useTracks,
} from "@livekit/components-react";
import FullscreenControl from "./fullscreen-control";
import { useEventListener } from "usehooks-ts";
import VolumeControl from "./volume-control";

interface LiveVideoProps {
  participant: Participant;
  tracks: TrackReferenceOrPlaceholder[];
}

const LiveVideo = ({ participant }: LiveVideoProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [volume, setVolume] = React.useState(0);

  const onVolumeChange = (value: number) => {
    setVolume(+value);
    if (videoRef.current) {
      videoRef.current.muted = value === 0;
      videoRef.current.volume = +value * 0.01;
    }
  };

  const toggleMute = () => {
    const isMuted = volume === 0;

    setVolume(isMuted ? 50 : 0);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      videoRef.current.volume = isMuted ? 0.5 : 0;
    }
  };

  React.useEffect(() => {
    onVolumeChange(0);
  }, []);

  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else if (wrapperRef?.current) {
      wrapperRef?.current?.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  const handleFullScreen = () => {
    const isCurrenlyFullScreen = document.fullscreenElement !== null;
    setIsFullScreen(isCurrenlyFullScreen);
  };

  useEventListener("fullscreenchange", handleFullScreen, wrapperRef);

  //** twicth clone videodeginaqa qlish uchun
  useTracks([Track.Source.Camera, Track.Source.Microphone])
  .filter((track) => track.participant.identity ===  participant.identity)
  .forEach((track) => {
    if (videoRef.current) {
        track.publication.track?.attach(videoRef.current)
    }
  })

 

  return (
    <div className="relative h-full flex" ref={wrapperRef}>
      <video width={"100%"} ref={videoRef} />
      <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 hover:transition-all">
        <div className="absolute bottom-0 flex h-14 w-full justify-between bg-gradient-to-r from-neutral-900 px-4">
          
          <VolumeControl
            onChange={onVolumeChange}
            value={volume}
            onToggle={toggleMute}
          />
          <FullscreenControl
            isFullScreen={isFullScreen}
            onToggle={toggleFullScreen}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveVideo;
