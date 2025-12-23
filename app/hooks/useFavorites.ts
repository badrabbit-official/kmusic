'use client';

import { useState, useEffect } from 'react';
import { Track } from '../contexts/PlayerContext';

const FAVORITES_KEY = 'kmusic_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load favorites from localStorage
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      // Use empty set if localStorage fails
    }
  }, []);

  const isFavorite = (trackId: string) => {
    return favorites.has(trackId);
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      
      // Save to localStorage
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newSet)));
      } catch (error) {
        // Silently fail if localStorage is unavailable
      }
      
      return newSet;
    });
  };

  const getFavoriteTracks = (allTracks: Track[]): Track[] => {
    return allTracks.filter(track => favorites.has(track.id));
  };

  return {
    favorites: Array.from(favorites),
    isFavorite,
    toggleFavorite,
    getFavoriteTracks,
  };
}

