'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Music, 
  Shuffle,
  Play,
  Filter,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ArrowDown,
  Heart,
  Plus,
  MoreVertical,
  X
} from 'lucide-react';
import { TrackList } from './components/TrackList';
import { MusicPlayer } from './components/MusicPlayer';
import { MobilePlayer } from './components/MobilePlayer';
import { usePlayer, Track } from './contexts/PlayerContext';
import { useFavorites } from './hooks/useFavorites';
import Image from 'next/image';

export default function MusicStreamingApp() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'duration'>('title');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [showSearch, setShowSearch] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const { playTrack, currentTrack, addToQueue } = usePlayer();
  const { getFavoriteTracks } = useFavorites();

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/music');
      const data = await response.json();
      
      if (data.success) {
        setTracks(data.files);
      } else {
        setError('Не удалось загрузить музыку');
      }
    } catch (err) {
      setError('Ошибка при загрузке музыки');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedTracks = useMemo(() => {
    let filtered = tracks;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        (track.album && track.album.toLowerCase().includes(query))
      );
    }

    // Format filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(track => track.format === filterBy);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'duration':
          return (a.duration || 0) - (b.duration || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tracks, searchQuery, sortBy, filterBy]);

  const uniqueFormats = useMemo(() => {
    return Array.from(new Set(tracks.map(t => t.format)));
  }, [tracks]);

  const handlePlayAll = () => {
    if (filteredAndSortedTracks.length > 0) {
      playTrack(filteredAndSortedTracks[0], filteredAndSortedTracks);
    }
  };

  const handleShuffle = () => {
    if (filteredAndSortedTracks.length > 0) {
      const shuffled = [...filteredAndSortedTracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Effects - Mobile Optimized */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,100,0.03),transparent_70%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 pb-24 md:pb-32">
        {/* Mobile Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-30 backdrop-blur-xl bg-black/80 border-b md:hidden"
          style={{ borderColor: 'rgba(0,255,100,0.1)' }}
        >
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h1 
                className="text-xl font-bold font-mono"
                style={{
                  color: '#00ff64',
                  textShadow: '0 0 10px rgba(0,255,100,0.5)'
                }}
              >
                KMUSIC
              </h1>
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <Search className="w-5 h-5 text-gray-300" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSort(!showSort)}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <Filter className="w-5 h-5 text-gray-300" />
                </motion.button>
              </div>
            </div>

            {/* Search Bar - Mobile */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Find in Library"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Desktop Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="hidden md:block sticky top-0 z-30 backdrop-blur-md bg-black/60 border-b-2"
          style={{
            borderColor: '#00ff64',
            boxShadow: '0 0 20px rgba(0,255,100,0.1)'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <motion.h1
                className="text-2xl sm:text-3xl font-bold font-mono"
                style={{
                  color: '#00ff64',
                  textShadow: '0 0 10px rgba(0,255,100,0.5)'
                }}
              >
                [KMUSIC.EXE]
              </motion.h1>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShuffle}
                  className="px-4 py-2 border-2 border-lime-500 text-lime-400 font-mono text-sm hover:bg-lime-500/10 transition-all"
                >
                  <Shuffle className="w-4 h-4 inline mr-2" />
                  SHUFFLE
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayAll}
                  className="px-4 py-2 bg-lime-500 text-black font-bold font-mono text-sm"
                  style={{
                    boxShadow: '0 0 20px rgba(0,255,100,0.4)'
                  }}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  PLAY ALL
                </motion.button>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="[SEARCH_TRACKS]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/50 border-2 text-white placeholder-gray-500 focus:outline-none transition-all font-mono"
                style={{
                  borderColor: '#00ff64',
                  boxShadow: '0 0 10px rgba(0,255,100,0.2)'
                }}
              />
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8 py-6 md:py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <Loader2 className="w-12 h-12 text-lime-400 animate-spin" />
              <p className="text-gray-400 font-mono">[LOADING_TRACKS...]</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <AlertCircle className="w-12 h-12 text-red-400" />
              <p className="text-gray-400 font-mono">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadTracks}
                className="px-6 py-3 border-2 border-lime-500 text-lime-400 font-mono hover:bg-lime-500/10 transition-all rounded-xl"
              >
                RETRY
              </motion.button>
            </div>
          ) : filteredAndSortedTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <Music className="w-16 h-16 text-gray-600" />
              <p className="text-gray-400 font-mono text-xl">
                {searchQuery ? 'No tracks found' : 'No tracks available'}
              </p>
              {searchQuery && (
                <p className="text-gray-500 font-mono text-sm">
                  Try changing your search query
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Mobile: Playlist Header */}
              <div className="md:hidden mb-6">
                <div className="flex items-center gap-4 mb-4">
                  {/* Playlist Cover */}
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-lime-500/30 to-cyan-500/30 flex items-center justify-center">
                    {filteredAndSortedTracks[0]?.cover ? (
                      <Image
                        src={filteredAndSortedTracks[0].cover}
                        alt="Playlist"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <Music className="w-12 h-12 text-lime-400/50" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-1">Your Library</h2>
                    <p className="text-gray-400 text-sm">{filteredAndSortedTracks.length} songs</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mb-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlayAll}
                    className="flex-1 bg-lime-400 text-black font-bold py-3 rounded-full flex items-center justify-center gap-2"
                    style={{
                      boxShadow: '0 0 20px rgba(0,255,100,0.4)'
                    }}
                  >
                    <Play className="w-5 h-5 fill-black" />
                    <span>Play</span>
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShuffle}
                    className="w-12 h-12 border-2 border-gray-700 rounded-full flex items-center justify-center"
                  >
                    <Shuffle className="w-5 h-5 text-lime-400" />
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 border-2 border-gray-700 rounded-full flex items-center justify-center"
                  >
                    <ArrowDown className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                {/* Add Songs */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // This could open a file picker or modal to add songs
                    // For now, it's a placeholder
                  }}
                  className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center gap-2 text-gray-400 mb-6 hover:border-lime-500/50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add songs</span>
                </motion.button>
              </div>

              {/* Desktop: Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden md:block mb-6 p-4 border-2 bg-black/50 backdrop-blur-sm"
                style={{ borderColor: '#00d4ff' }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-gray-400 text-sm font-mono mb-1">TRACKS FOUND</p>
                    <p className="text-3xl font-bold text-cyan-400 font-mono">
                      {filteredAndSortedTracks.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-mono mb-1">TOTAL DURATION</p>
                    <p className="text-3xl font-bold text-cyan-400 font-mono">
                      {Math.floor(
                        filteredAndSortedTracks.reduce((acc, t) => acc + (t.duration || 0), 0) / 60
                      )}m
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Sort/Filter Modal - Mobile */}
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
                    onClick={() => setShowSort(false)}
                  >
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 25 }}
                      className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl p-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6" />
                      <h3 className="text-xl font-bold text-white mb-6">Sort & Filter</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-400 text-sm mb-3">Sort by</p>
                          <div className="space-y-2">
                            {['title', 'artist', 'duration'].map((option) => (
                              <button
                                key={option}
                                onClick={() => {
                                  setSortBy(option as any);
                                  setShowSort(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl ${
                                  sortBy === option
                                    ? 'bg-lime-500/20 text-lime-400 border-2 border-lime-500'
                                    : 'bg-gray-800 text-white'
                                }`}
                              >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-400 text-sm mb-3">Filter by format</p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setFilterBy('all');
                                setShowSort(false);
                              }}
                              className={`px-4 py-2 rounded-xl text-sm ${
                                filterBy === 'all'
                                  ? 'bg-lime-500 text-black font-bold'
                                  : 'bg-gray-800 text-gray-300'
                              }`}
                            >
                              All
                            </button>
                            {uniqueFormats.map(format => (
                              <button
                                key={format}
                                onClick={() => {
                                  setFilterBy(format);
                                  setShowSort(false);
                                }}
                                className={`px-4 py-2 rounded-xl text-sm ${
                                  filterBy === format
                                    ? 'bg-lime-500 text-black font-bold'
                                    : 'bg-gray-800 text-gray-300'
                                }`}
                              >
                                {format.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Track List */}
              <TrackList tracks={filteredAndSortedTracks} mobile={true} />
            </>
          )}
        </main>
      </div>

      {/* Players */}
      <div className="md:hidden">
        <MobilePlayer />
      </div>
      <div className="hidden md:block">
        <MusicPlayer />
      </div>
    </div>
  );
}
