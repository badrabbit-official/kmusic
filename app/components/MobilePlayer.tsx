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
  ChevronDown,
  Heart,
  Plus,
  Share2,
  List,
  MoreVertical
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useFavorites } from '../hooks/useFavorites';
import { QueueModal } from './QueueModal';
import { TrackOptionsModal } from './TrackOptionsModal';
import { showToast } from './Toast';

export function MobilePlayer() {
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
    toggleShuffle,
    toggleRepeat,
    audioRef,
  } = usePlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToQueue } = usePlayer();

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
    if (!currentTrack || !audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * (currentTrack.duration || 0);
    audioRef.current.currentTime = newTime;
  };

  const handleShare = async () => {
    if (!currentTrack) return;
    
    const shareData = {
      title: currentTrack.title,
      text: `${currentTrack.title} by ${currentTrack.artist}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Shared successfully', 'success');
      } else {
        await navigator.clipboard.writeText(`${currentTrack.title} by ${currentTrack.artist}`);
        showToast('Link copied to clipboard', 'success');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        showToast('Failed to share', 'error');
      }
    }
  };

  const handleDownload = () => {
    if (!currentTrack) return;
    try {
      window.open(currentTrack.path, '_blank');
      showToast('Download started', 'info');
    } catch (error) {
      showToast('Failed to download', 'error');
    }
  };

  if (!currentTrack) {
    return null;
  }

  const progress = currentTrack.duration 
    ? (currentTime / currentTrack.duration) * 100 
    : 0;

  return (
    <AnimatePresence>
      {!isExpanded ? (
        // Compact Mini Player
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.98) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Progress Bar */}
          <div 
            onClick={handleProgressClick}
            className="w-full h-1 bg-gray-800 cursor-pointer relative"
          >
            <div 
              className="h-full bg-lime-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Player Content */}
          <div 
            className="px-4 py-3 flex items-center gap-3 border-t"
            style={{ borderColor: 'rgba(0,255,100,0.2)' }}
            onClick={() => setIsExpanded(true)}
          >
            {/* Cover Art */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              {currentTrack.cover ? (
                <Image
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-lime-500/30 to-cyan-500/30 flex items-center justify-center">
                  <div className="text-lime-400 text-xs font-mono text-center px-2">
                    {currentTrack.title.substring(0, 2)}
                  </div>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm truncate">
                {currentTrack.title}
              </h4>
              <p className="text-gray-400 text-xs truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '0 0 20px rgba(0,255,100,0.5)'
                }}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-black" />
                ) : (
                  <Play className="w-5 h-5 text-black ml-0.5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        // Expanded Full Screen Player
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          className="fixed inset-0 z-50 md:hidden"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-12 pb-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(false)}
              className="w-10 h-10 flex items-center justify-center"
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </motion.button>
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-10 h-10 flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 text-gray-400" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOptions(true)}
                className="w-10 h-10 flex items-center justify-center"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </div>

          {/* Album Art */}
          <div className="px-8 py-8 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: isPlaying ? 1 : 0.95,
                rotate: isPlaying ? [0, 360] : 0
              }}
              transition={{ 
                scale: { duration: 0.3 },
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
              }}
              className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: '0 0 60px rgba(0,255,100,0.3), 0 0 120px rgba(0,255,100,0.1)'
              }}
            >
              {currentTrack.cover ? (
                <Image
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-lime-500/40 via-cyan-500/40 to-purple-500/40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lime-400 text-6xl font-bold font-mono mb-2">
                      {currentTrack.title.substring(0, 1)}
                    </div>
                    <div className="text-cyan-400 text-sm font-mono">
                      {currentTrack.artist}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Track Info */}
          <div className="px-8 pb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentTrack.title}
            </h2>
            <p className="text-gray-400 text-lg">
              {currentTrack.artist}
            </p>
            {currentTrack.album && (
              <p className="text-gray-500 text-sm mt-1">
                {currentTrack.album}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="px-8 pb-4">
            <div 
              onClick={handleProgressClick}
              className="w-full h-1 bg-gray-800 rounded-full cursor-pointer relative group"
            >
              <div 
                className="h-full bg-lime-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-lime-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ 
                  left: `calc(${progress}% - 8px)`,
                  boxShadow: '0 0 15px rgba(0,255,100,0.8)'
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime((currentTrack.duration || 0) - currentTime)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="px-8 pb-8">
            <div className="flex items-center justify-center gap-6 mb-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleShuffle}
                className={`w-12 h-12 flex items-center justify-center ${
                  isShuffled ? 'text-lime-400' : 'text-gray-400'
                }`}
              >
                <Shuffle className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={previousTrack}
                className="w-14 h-14 flex items-center justify-center text-white"
              >
                <SkipBack className="w-7 h-7" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={togglePlayPause}
                className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  boxShadow: '0 0 40px rgba(0,255,100,0.6)'
                }}
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-black" />
                ) : (
                  <Play className="w-10 h-10 text-black ml-1" />
                )}
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={nextTrack}
                className="w-14 h-14 flex items-center justify-center text-white"
              >
                <SkipForward className="w-7 h-7" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleRepeat}
                className={`w-12 h-12 flex items-center justify-center ${
                  repeatMode !== 'off' ? 'text-lime-400' : 'text-gray-400'
                }`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-6 h-6" />
                ) : (
                  <Repeat className="w-6 h-6" />
                )}
              </motion.button>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center justify-center gap-8">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (currentTrack) {
                    toggleFavorite(currentTrack.id);
                    showToast(
                      isFavorite(currentTrack.id) 
                        ? 'Removed from favorites' 
                        : 'Added to favorites',
                      'success'
                    );
                  }
                }}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center ${
                  currentTrack && isFavorite(currentTrack.id) ? 'bg-red-500/20' : ''
                }`}>
                  <Heart 
                    className={`w-5 h-5 ${
                      currentTrack && isFavorite(currentTrack.id) 
                        ? 'text-red-400 fill-red-400' 
                        : 'text-gray-400'
                    }`}
                    fill={currentTrack && isFavorite(currentTrack.id) ? 'currentColor' : 'none'}
                  />
                </div>
                <span className="text-xs text-gray-500">Like</span>
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (currentTrack) {
                    addToQueue([currentTrack]);
                    showToast('Added to queue', 'success');
                  }
                }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-xs text-gray-500">Add</span>
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowQueue(true)}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <List className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-xs text-gray-500">Queue</span>
              </motion.button>
            </div>
          </div>

          {/* Modals */}
          <QueueModal isOpen={showQueue} onClose={() => setShowQueue(false)} />
          
          <TrackOptionsModal
            isOpen={showOptions}
            onClose={() => setShowOptions(false)}
            track={currentTrack}
            isFavorite={currentTrack ? isFavorite(currentTrack.id) : false}
            onToggleFavorite={() => currentTrack && toggleFavorite(currentTrack.id)}
            onAddToQueue={() => currentTrack && addToQueue([currentTrack])}
            onPlay={togglePlayPause}
            onShare={handleShare}
            onDownload={handleDownload}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

