import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Track } from '../types';
import { DEMO_TRACKS } from '../data/demoData';
import { globalAudioEngine } from '../services/audioEngine';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // 0 to 100
  currentTime: number; // seconds
  duration: number; // seconds
  volume: number; // 0 to 1
  isMuted: boolean;
  isShuffle: boolean;
  isLoop: boolean;
  isExpanded: boolean;
  playlist: Track[];
  playTrack: (track: Track) => Promise<void>;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  seek: (percent: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  setIsExpanded: (expanded: boolean) => void;
  setPlaylist: (tracks: Track[]) => void;
  analyserNode: AnalyserNode | null;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<Track[]>(DEMO_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(DEMO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(DEMO_TRACKS[0]?.duration || 180);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const prevVolumeRef = useRef<number>(0.8);
  const timerRef = useRef<number | null>(null);

  const playTrack = useCallback(async (track: Track) => {
    setCurrentTrack(track);
    setDuration(track.duration || 180);
    setCurrentTime(0);
    setProgress(0);

    try {
      await globalAudioEngine.playTrack(track.src, track.synthPreset);
      setIsPlaying(true);
    } catch (err) {
      console.warn('Audio play request interrupted:', err);
    }
  }, []);

  const togglePlay = useCallback(async () => {
    if (!currentTrack) {
      if (playlist.length > 0) {
        await playTrack(playlist[0]);
      }
      return;
    }

    if (isPlaying) {
      globalAudioEngine.pause();
      setIsPlaying(false);
    } else {
      globalAudioEngine.resume(currentTrack.src, currentTrack.synthPreset);
      setIsPlaying(true);
    }
  }, [currentTrack, isPlaying, playlist, playTrack]);

  const nextTrack = useCallback(async () => {
    if (playlist.length === 0) return;
    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      const currentIndex = playlist.findIndex((t) => t.id === currentTrack?.id);
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    await playTrack(playlist[nextIndex]);
  }, [playlist, isShuffle, currentTrack, playTrack]);

  const prevTrack = useCallback(async () => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    await playTrack(playlist[prevIndex]);
  }, [playlist, currentTrack, playTrack]);

  const seek = useCallback((percent: number) => {
    const targetTime = (percent / 100) * duration;
    setCurrentTime(targetTime);
    setProgress(percent);
    globalAudioEngine.seek(targetTime);
  }, [duration]);

  const setVolume = useCallback((val: number) => {
    setVolumeState(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
    globalAudioEngine.setVolume(val);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolumeRef.current || 0.8);
    } else {
      prevVolumeRef.current = volume;
      setIsMuted(true);
      setVolume(0);
    }
  }, [isMuted, volume, setVolume]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLoop((prev) => !prev);
  }, []);

  // Synthetic track progress counter for ambient generator
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        const audioCurrentTime = globalAudioEngine.getCurrentTime();
        if (audioCurrentTime > 0) {
          const d = globalAudioEngine.getDuration() || duration;
          setCurrentTime(audioCurrentTime);
          setDuration(d);
          setProgress((audioCurrentTime / d) * 100);
        } else {
          setCurrentTime((prev) => {
            const next = prev + 1;
            if (next >= duration) {
              if (isLoop) {
                return 0;
              } else {
                nextTrack();
                return 0;
              }
            }
            setProgress((next / duration) * 100);
            return next;
          });
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration, isLoop, nextTrack]);

  // Hook HTML5 audio onended
  useEffect(() => {
    globalAudioEngine.onEnded(() => {
      if (isLoop && currentTrack) {
        playTrack(currentTrack);
      } else {
        nextTrack();
      }
    });
  }, [isLoop, currentTrack, playTrack, nextTrack]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        isLoop,
        isExpanded,
        playlist,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleLoop,
        setIsExpanded,
        setPlaylist,
        analyserNode: globalAudioEngine.getAnalyser()
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
