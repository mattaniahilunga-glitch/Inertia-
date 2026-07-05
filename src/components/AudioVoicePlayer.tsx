import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, FastForward } from 'lucide-react';

interface AudioVoicePlayerProps {
  voiceUrl: string;
  durationStr?: string;
  messageId: string;
  playingVoiceId: string | null;
  setPlayingVoiceId: (id: string | null) => void;
  isMe: boolean;
}

export function AudioVoicePlayer({
  voiceUrl,
  durationStr = '0:05',
  messageId,
  playingVoiceId,
  setPlayingVoiceId,
  isMe
}: AudioVoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.5 | 2>(1);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Helper to convert base64 to Blob and Object URL
  useEffect(() => {
    if (!voiceUrl) return;

    let url = '';
    try {
      if (voiceUrl.startsWith('data:') || !voiceUrl.includes('://')) {
        // Base64 string decoding
        const parts = voiceUrl.split(';base64,');
        const contentType = parts.length > 1 ? parts[0].split(':')[1] : 'audio/webm';
        const base64Data = parts.length > 1 ? parts[1] : parts[0];
        
        const raw = window.atob(base64Data);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        
        const blob = new Blob([uInt8Array], { type: contentType });
        url = URL.createObjectURL(blob);
      } else {
        url = voiceUrl;
      }
      setObjectUrl(url);
    } catch (err) {
      console.error('Failed to parse voice audio data:', err);
      setError('Invalid audio source');
    }

    return () => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [voiceUrl]);

  // Synchronize playing states with the global active player ID
  const isCurrentlyActive = playingVoiceId === messageId;

  useEffect(() => {
    if (!audioRef.current) return;

    if (isCurrentlyActive) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Audio play failed:', err);
        setIsPlaying(false);
        setPlayingVoiceId(null);
      });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isCurrentlyActive]);

  // Track time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setPlayingVoiceId(null);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyActive) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(messageId);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextRate: 1 | 1.5 | 2 = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  // Handle clicking progress bar to seek
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!progressBarRef.current || !audioRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    
    audioRef.current.currentTime = percentage * duration;
    setCurrentTime(percentage * duration);
  };

  // Human-readable time helper (e.g., 0:04)
  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const displayDuration = duration > 0 ? formatTime(duration) : durationStr;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className="text-[10px] text-rose-500 font-mono flex items-center gap-1 p-1 bg-rose-500/10 rounded">
        ⚠️ Audio unavailable
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 p-2 rounded-xl transition-all w-64 ${
      isMe 
        ? 'bg-indigo-950/40 text-slate-100 border border-indigo-500/20 shadow-inner' 
        : 'bg-slate-200/60 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 border border-slate-300/40 dark:border-white/5'
    }`}>
      {/* Hidden audio element */}
      {objectUrl && (
        <audio
          ref={audioRef}
          src={objectUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
          preload="metadata"
        />
      )}

      {/* Primary Row Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={togglePlay}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md active:scale-95 flex-shrink-0 ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-teal-500 hover:bg-teal-600 text-white'
          }`}
          title={isPlaying ? 'Pause Playback' : 'Play Voice Note'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-white text-white" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          )}
        </button>

        {/* Waves or Seek bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div 
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            className="h-2 w-full bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden relative cursor-pointer group"
          >
            {/* Played timeline */}
            <div 
              className="h-full bg-teal-500 rounded-full transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Interactive play head handle */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border border-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${progressPercent}% - 5px)` }}
            />
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 dark:text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{displayDuration}</span>
          </div>
        </div>
      </div>

      {/* Secondary control line: Speed & Mute */}
      <div className="flex justify-between items-center border-t border-slate-300/30 dark:border-white/5 pt-1.5 mt-0.5 px-0.5 text-[9px]">
        <div className="flex items-center gap-2">
          {/* Speed badge */}
          <button
            onClick={cycleSpeed}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-300/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-800 cursor-pointer transition-colors font-mono font-bold"
            title="Adjust Voice Playback Speed"
          >
            <FastForward className="w-2.5 h-2.5" />
            <span>{playbackRate}x</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <button
            onClick={toggleMute}
            className="hover:text-teal-500 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3 text-rose-400" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
          </button>
          <span className="font-mono text-[8px] text-slate-400">Secure Playback</span>
        </div>
      </div>
    </div>
  );
}
