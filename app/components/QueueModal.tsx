'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer, Track } from '../contexts/PlayerContext';
import { X, Play, Trash2, Music, MoreVertical } from 'lucide-react';
import Image from 'next/image';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QueueModal({ isOpen, onClose }: QueueModalProps) {
  const { queue, currentTrack, playTrack, clearQueue, removeFromQueue } = usePlayer();

  const handlePlayTrack = (track: Track) => {
    playTrack(track, queue);
    onClose();
  };

  const handleRemoveTrack = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromQueue(trackId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-4" />
            
            <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Queue</h3>
              <div className="flex items-center gap-4">
                {queue.length > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={clearQueue}
                    className="text-red-400 text-sm"
                  >
                    Clear
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Music className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-center">Queue is empty</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {queue.map((track, index) => {
                    const isCurrent = currentTrack?.id === track.id;
                    return (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handlePlayTrack(track)}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl cursor-pointer
                          ${isCurrent ? 'bg-lime-500/20' : 'bg-gray-800/50 hover:bg-gray-800'}
                        `}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          {track.cover ? (
                            <Image
                              src={track.cover}
                              alt={track.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-lime-500/30 to-cyan-500/30 flex items-center justify-center">
                              <Music className="w-6 h-6 text-lime-400/50" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-semibold truncate ${
                            isCurrent ? 'text-lime-400' : 'text-white'
                          }`}>
                            {track.title}
                          </h4>
                          <p className="text-gray-400 text-xs truncate">
                            {track.artist}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCurrent && (
                            <div className="w-2 h-2 bg-lime-400 rounded-full" />
                          )}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleRemoveTrack(track.id, e)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

