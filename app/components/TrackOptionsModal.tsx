'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Track } from '../contexts/PlayerContext';
import { 
  X, 
  Heart, 
  Plus, 
  Share2, 
  Download, 
  Play,
  Music
} from 'lucide-react';
import { showToast } from './Toast';

interface TrackOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToQueue: () => void;
  onPlay: () => void;
  onShare: () => void;
  onDownload: () => void;
}

export function TrackOptionsModal({
  isOpen,
  onClose,
  track,
  isFavorite,
  onToggleFavorite,
  onAddToQueue,
  onPlay,
  onShare,
  onDownload,
}: TrackOptionsModalProps) {
  if (!track) return null;

  const options = [
    {
      icon: Play,
      label: 'Play now',
      action: () => {
        onPlay();
        onClose();
      },
      primary: true,
    },
    {
      icon: Heart,
      label: isFavorite ? 'Remove from favorites' : 'Add to favorites',
      action: () => {
        onToggleFavorite();
        showToast(
          isFavorite ? 'Removed from favorites' : 'Added to favorites',
          'success'
        );
        onClose();
      },
      color: isFavorite ? 'text-red-400' : 'text-gray-300',
    },
    {
      icon: Plus,
      label: 'Add to queue',
      action: () => {
        onAddToQueue();
        showToast('Added to queue', 'success');
        onClose();
      },
    },
    {
      icon: Share2,
      label: 'Share',
      action: () => {
        onShare();
        onClose();
      },
    },
    {
      icon: Download,
      label: 'Download',
      action: () => {
        onDownload();
        onClose();
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-4" />
            
            <div className="px-6 pb-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-lime-500/30 to-cyan-500/30 flex items-center justify-center">
                  {track.cover ? (
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-8 h-8 text-lime-400/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm truncate">
                    {track.title}
                  </h4>
                  <p className="text-gray-400 text-xs truncate">
                    {track.artist}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              <div className="space-y-2">
                {options.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      onClick={option.action}
                      className={`
                        w-full flex items-center gap-4 px-4 py-4 rounded-xl
                        ${option.primary 
                          ? 'bg-lime-500 text-black font-semibold' 
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${option.color || ''}`} fill={option.primary ? 'currentColor' : 'none'} />
                      <span className="flex-1 text-left">{option.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

