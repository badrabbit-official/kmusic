'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Music,
  Maximize2
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    isShuffled,
    repeatMode,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    setCurrentTime,
    toggleShuffle,
    toggleRepeat,
    audioRef,
  } = usePlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.path;
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Auto-play blocked by browser
        });
      }
    }
  }, [currentTrack, isPlaying, audioRef]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !currentTrack) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * (currentTrack.duration || 0);
    setCurrentTime(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(percent);
  };

  if (!currentTrack) {
    return null;
  }

  const progress = currentTrack.duration 
    ? (currentTime / currentTrack.duration) * 100 
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`fixed bottom-0 left-0 right-0 z-50 ${
          isExpanded ? 'h-screen' : 'h-24'
        } transition-all duration-300`}
      >
        <div 
          className="w-full h-full border-t-2 bg-black/95 backdrop-blur-xl"
          style={{
            borderColor: '#00ff64',
            boxShadow: '0 -10px 40px rgba(0,255,100,0.3)'
          }}
        >
          {!isExpanded ? (
            // Compact Player
            <div className="flex items-center h-full px-4 gap-4">
              {/* Track Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div 
                  className="w-16 h-16 flex items-center justify-center border-2 flex-shrink-0"
                  style={{ borderColor: '#00ff64' }}
                >
                  <Music className="w-8 h-8 text-lime-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-sm truncate font-mono">
                    {currentTrack.title}
                  </h4>
                  <p className="text-gray-400 text-xs truncate font-mono">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleShuffle}
                  className={`p-2 ${isShuffled ? 'text-lime-400' : 'text-gray-400'}`}
                  style={{
                    boxShadow: isShuffled ? '0 0 10px rgba(0,255,100,0.5)' : 'none'
                  }}
                >
                  <Shuffle className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={previousTrack}
                  className="p-2 text-lime-400"
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlayPause}
                  className="p-3 bg-lime-500 text-black rounded-full"
                  style={{
                    boxShadow: '0 0 20px rgba(0,255,100,0.6)'
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextTrack}
                  className="p-2 text-lime-400"
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleRepeat}
                  className={`p-2 ${repeatMode !== 'off' ? 'text-lime-400' : 'text-gray-400'}`}
                  style={{
                    boxShadow: repeatMode !== 'off' ? '0 0 10px rgba(0,255,100,0.5)' : 'none'
                  }}
                >
                  {repeatMode === 'one' ? (
                    <Repeat1 className="w-5 h-5" />
                  ) : (
                    <Repeat className="w-5 h-5" />
                  )}
                </motion.button>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 max-w-xs">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <div 
                    ref={progressRef}
                    onClick={handleProgressClick}
                    className="flex-1 h-1 bg-gray-700 cursor-pointer relative group"
                  >
                    <div 
                      className="h-full bg-lime-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-lime-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ 
                        left: `calc(${progress}% - 6px)`,
                        boxShadow: '0 0 10px rgba(0,255,100,0.8)'
                      }}
                    />
                  </div>
                  <span>{formatTime(currentTrack.duration || 0)}</span>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 w-32">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (isMuted) {
                      setVolume(volume);
                    } else {
                      setVolume(0);
                    }
                    setIsMuted(!isMuted);
                  }}
                  className="p-2 text-gray-400"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </motion.button>
                <div 
                  onClick={handleVolumeClick}
                  className="flex-1 h-1 bg-gray-700 cursor-pointer relative group"
                >
                  <div 
                    className="h-full bg-lime-500 transition-all"
                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-lime-400"
              >
                <Maximize2 className="w-5 h-5" />
              </motion.button>
            </div>
          ) : (
            // Expanded Player
            <div className="h-full flex flex-col p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-lime-400 font-mono mb-2">
                    NOW PLAYING
                  </h2>
                  <p className="text-gray-400 font-mono">[MUSIC_PLAYER.EXE]</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsExpanded(false)}
                  className="p-2 text-lime-400 border-2 border-lime-500"
                >
                  <Maximize2 className="w-6 h-6 rotate-45" />
                </motion.button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                {/* Album Art */}
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-80 h-80 border-4 rounded-full overflow-hidden"
                  style={{ borderColor: '#00ff64' }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-lime-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Music className="w-40 h-40 text-lime-400/50" />
                  </div>
                </motion.div>

                {/* Track Info */}
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-white mb-2 font-mono">
                    {currentTrack.title}
                  </h3>
                  <p className="text-xl text-gray-400 font-mono">
                    {currentTrack.artist}
                  </p>
                  {currentTrack.album && (
                    <p className="text-sm text-gray-500 font-mono mt-1">
                      {currentTrack.album}
                    </p>
                  )}
                </div>

                {/* Progress */}
                <div className="w-full max-w-2xl">
                  <div 
                    ref={progressRef}
                    onClick={handleProgressClick}
                    className="w-full h-2 bg-gray-700 cursor-pointer relative group mb-2"
                  >
                    <div 
                      className="h-full bg-lime-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-lime-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ 
                        left: `calc(${progress}% - 8px)`,
                        boxShadow: '0 0 15px rgba(0,255,100,0.8)'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentTrack.duration || 0)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleShuffle}
                    className={`p-4 ${isShuffled ? 'text-lime-400' : 'text-gray-400'}`}
                    style={{
                      boxShadow: isShuffled ? '0 0 20px rgba(0,255,100,0.5)' : 'none'
                    }}
                  >
                    <Shuffle className="w-8 h-8" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={previousTrack}
                    className="p-4 text-lime-400 border-2 border-lime-500"
                  >
                    <SkipBack className="w-8 h-8" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlayPause}
                    className="p-6 bg-lime-500 text-black rounded-full"
                    style={{
                      boxShadow: '0 0 40px rgba(0,255,100,0.8)'
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="w-12 h-12" />
                    ) : (
                      <Play className="w-12 h-12 ml-1" />
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextTrack}
                    className="p-4 text-lime-400 border-2 border-lime-500"
                  >
                    <SkipForward className="w-8 h-8" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleRepeat}
                    className={`p-4 ${repeatMode !== 'off' ? 'text-lime-400' : 'text-gray-400'}`}
                    style={{
                      boxShadow: repeatMode !== 'off' ? '0 0 20px rgba(0,255,100,0.5)' : 'none'
                    }}
                  >
                    {repeatMode === 'one' ? (
                      <Repeat1 className="w-8 h-8" />
                    ) : (
                      <Repeat className="w-8 h-8" />
                    )}
                  </motion.button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-4 w-full max-w-md">
                  <Volume2 className="w-6 h-6 text-gray-400" />
                  <div 
                    onClick={handleVolumeClick}
                    className="flex-1 h-2 bg-gray-700 cursor-pointer relative group"
                  >
                    <div 
                      className="h-full bg-lime-500 transition-all"
                      style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 font-mono w-12 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

