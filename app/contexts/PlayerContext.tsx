'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

export interface Track {
  id: string;
  filename: string;
  path: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  format: string;
  size: number;
  cover?: string;
  genre?: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'one' | 'all';
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  addToQueue: (tracks: Track[]) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    if (newQueue) {
      const index = newQueue.findIndex(t => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
      setQueue(newQueue);
    } else {
      const index = queue.findIndex(t => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
    setIsPlaying(true);
  }, [queue]);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    
    let nextIndex: number;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    
    if (nextIndex === currentIndex && repeatMode === 'off') return;
    
    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [queue, currentIndex, isShuffled, repeatMode]);

  const previousTrack = useCallback(() => {
    if (queue.length === 0) return;
    
    let prevIndex: number;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    }
    
    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [queue, currentIndex, isShuffled]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    setCurrentTimeState(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const addToQueue = useCallback((tracks: Track[]) => {
    setQueue(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const newTracks = tracks.filter(t => !existingIds.has(t.id));
      return [...prev, ...newTracks];
    });
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setQueue(prev => {
      const newQueue = prev.filter(t => t.id !== trackId);
      if (currentTrack?.id === trackId && newQueue.length > 0) {
        const newIndex = Math.min(currentIndex, newQueue.length - 1);
        setCurrentIndex(newIndex);
        setCurrentTrack(newQueue[newIndex]);
      } else if (newQueue.length === 0) {
        setCurrentTrack(null);
        setIsPlaying(false);
      }
      return newQueue;
    });
  }, [currentTrack, currentIndex]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTimeState(audio.currentTime);
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all' || (repeatMode === 'off' && currentIndex < queue.length - 1)) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    const handleLoadedMetadata = () => {
      if (currentTrack?.duration) {
        audio.currentTime = 0;
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentTrack, repeatMode, currentIndex, queue.length, nextTrack, volume]);

  // Auto-play when track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.path;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Auto-play blocked by browser, user needs to interact first
        });
      }
    }
  }, [currentTrack, isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        currentTime,
        volume,
        isShuffled,
        repeatMode,
        playTrack,
        togglePlayPause,
        nextTrack,
        previousTrack,
        setVolume,
        setCurrentTime,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleShuffle,
        toggleRepeat,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

