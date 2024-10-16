"use client";
import * as React from "react";
import { Maximize, Minimize } from "lucide-react";
import Hint from "./hint";
interface FullscreenControlProps {
  isFullScreen: boolean;
  onToggle: () => void;
}

const FullscreenControl = ({isFullScreen, onToggle}: FullscreenControlProps) => {
  const Icon = isFullScreen ? Maximize  : Minimize ;
  const label = isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen';

  return (
    <div className="flex items-center justify-center gap-4">
      <Hint label={label} asChild>
        <button 
        onClick={onToggle} 
        className="text-white p-1.5 hover:bg-white/10 rounded-lg"
        >
          <Icon
          className="w-5 h-5"
          />
        </button>
      </Hint>
    </div>
  );
};

export default FullscreenControl;
