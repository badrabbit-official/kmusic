'use client';

import { motion } from 'framer-motion';
import { usePlayer, Track } from '../contexts/PlayerContext';
import { Play, MoreVertical, Clock, Heart } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useFavorites } from '../hooks/useFavorites';
import { TrackOptionsModal } from './TrackOptionsModal';
import { showToast } from './Toast';

interface TrackListProps {
  tracks: Track[];
  onTrackClick?: (track: Track) => void;
  mobile?: boolean;
}

export function TrackList({ tracks, onTrackClick, mobile = false }: TrackListProps) {
  const { currentTrack, playTrack, addToQueue } = usePlayer();
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [optionsTrack, setOptionsTrack] = useState<Track | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTrackClick = (track: Track) => {
    if (onTrackClick) {
      onTrackClick(track);
    } else {
      playTrack(track, tracks);
    }
  };

  const handleShare = async (track: Track) => {
    const shareData = {
      title: track.title,
      text: `${track.title} by ${track.artist}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Shared successfully', 'success');
      } else {
        await navigator.clipboard.writeText(`${track.title} by ${track.artist}`);
        showToast('Link copied to clipboard', 'success');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        showToast('Failed to share', 'error');
      }
    }
  };

  const handleDownload = (track: Track) => {
    try {
      window.open(track.path, '_blank');
      showToast('Download started', 'info');
    } catch (error) {
      showToast('Failed to download', 'error');
    }
  };

  if (mobile) {
    return (
      <>
        <div className="space-y-0">
          {tracks.map((track, index) => {
          const isActive = currentTrack?.id === track.id;
          const isHovered = hoveredTrack === track.id;

          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onHoverStart={() => setHoveredTrack(track.id)}
              onHoverEnd={() => setHoveredTrack(null)}
              onClick={() => handleTrackClick(track)}
              className={`
                flex items-center gap-3 px-4 py-3 cursor-pointer transition-all active:bg-gray-900/50
                ${isActive ? 'bg-lime-500/10' : ''}
              `}
            >
              {/* Cover Art */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                {track.cover ? (
                  <Image
                    src={track.cover}
                    alt={track.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${
                    isActive 
                      ? 'from-lime-500/40 to-cyan-500/40' 
                      : 'from-gray-700/40 to-gray-800/40'
                  } flex items-center justify-center`}>
                    <div className={`text-xs font-bold ${
                      isActive ? 'text-lime-400' : 'text-gray-400'
                    }`}>
                      {track.title.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h4 
                  className={`font-semibold text-sm truncate ${
                    isActive ? 'text-lime-400' : 'text-white'
                  }`}
                >
                  {track.title}
                </h4>
                <p className="text-gray-400 text-xs truncate">
                  {track.artist}
                </p>
              </div>

              {/* Duration & Menu */}
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs">
                  {formatDuration(track.duration)}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOptionsTrack(track);
                  }}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </motion.div>
          );
          })}
        </div>

        {/* Options Modal */}
        <TrackOptionsModal
          isOpen={!!optionsTrack}
          onClose={() => setOptionsTrack(null)}
          track={optionsTrack}
          isFavorite={optionsTrack ? isFavorite(optionsTrack.id) : false}
          onToggleFavorite={() => {
            if (optionsTrack) {
              toggleFavorite(optionsTrack.id);
              showToast(
                isFavorite(optionsTrack.id) 
                  ? 'Removed from favorites' 
                  : 'Added to favorites',
                'success'
              );
            }
          }}
          onAddToQueue={() => {
            if (optionsTrack) {
              addToQueue([optionsTrack]);
              showToast('Added to queue', 'success');
            }
          }}
          onPlay={() => optionsTrack && handleTrackClick(optionsTrack)}
          onShare={() => optionsTrack && handleShare(optionsTrack)}
          onDownload={() => optionsTrack && handleDownload(optionsTrack)}
        />
      </>
    );
  }

  // Desktop version
  return (
    <>
      <div className="space-y-1">
      {tracks.map((track, index) => {
        const isActive = currentTrack?.id === track.id;
        const isHovered = hoveredTrack === track.id;

        return (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onHoverStart={() => setHoveredTrack(track.id)}
            onHoverEnd={() => setHoveredTrack(null)}
            onClick={() => handleTrackClick(track)}
            className={`
              flex items-center gap-4 p-4 cursor-pointer transition-all
              ${isActive 
                ? 'bg-lime-500/20 border-l-4 border-lime-500' 
                : 'hover:bg-gray-900/50 border-l-4 border-transparent'
              }
            `}
            style={{
              boxShadow: isActive ? '0 0 20px rgba(0,255,100,0.2)' : 'none'
            }}
          >
            {/* Index/Play Button */}
            <div className="w-8 flex items-center justify-center">
              {isHovered || isActive ? (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-2 bg-lime-500 text-black rounded-full"
                  style={{
                    boxShadow: '0 0 15px rgba(0,255,100,0.6)'
                  }}
                >
                  <Play className="w-4 h-4" />
                </motion.button>
              ) : (
                <span className="text-gray-500 text-sm font-mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Cover Art */}
            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
              {track.cover ? (
                <Image
                  src={track.cover}
                  alt={track.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center border-2"
                  style={{ borderColor: isActive ? '#00ff64' : '#333' }}
                >
                  <div className={`text-xs font-mono ${
                    isActive ? 'text-lime-400' : 'text-gray-500'
                  }`}>
                    {track.title.substring(0, 2)}
                  </div>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h4 
                className={`font-bold text-sm truncate font-mono ${
                  isActive ? 'text-lime-400' : 'text-white'
                }`}
                style={{
                  textShadow: isActive ? '0 0 10px rgba(0,255,100,0.5)' : 'none'
                }}
              >
                {track.title}
              </h4>
              <p className="text-gray-400 text-xs truncate font-mono">
                {track.artist}
                {track.album && ` • ${track.album}`}
              </p>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(track.duration)}</span>
            </div>

            {/* Format Badge */}
            <div 
              className="px-2 py-1 text-xs font-mono border"
              style={{ 
                borderColor: isActive ? '#00ff64' : '#333',
                color: isActive ? '#00ff64' : '#666'
              }}
            >
              {track.format.toUpperCase()}
            </div>

            {/* Options Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setOptionsTrack(track);
              }}
              className="w-8 h-8 flex items-center justify-center"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </motion.button>
          </motion.div>
        );
        })}
        </div>

        {/* Options Modal */}
        <TrackOptionsModal
          isOpen={!!optionsTrack}
          onClose={() => setOptionsTrack(null)}
          track={optionsTrack}
          isFavorite={optionsTrack ? isFavorite(optionsTrack.id) : false}
          onToggleFavorite={() => {
            if (optionsTrack) {
              toggleFavorite(optionsTrack.id);
              showToast(
                isFavorite(optionsTrack.id) 
                  ? 'Removed from favorites' 
                  : 'Added to favorites',
                'success'
              );
            }
          }}
          onAddToQueue={() => {
            if (optionsTrack) {
              addToQueue([optionsTrack]);
              showToast('Added to queue', 'success');
            }
          }}
          onPlay={() => optionsTrack && handleTrackClick(optionsTrack)}
          onShare={() => optionsTrack && handleShare(optionsTrack)}
          onDownload={() => optionsTrack && handleDownload(optionsTrack)}
        />
      </>
    );
}

