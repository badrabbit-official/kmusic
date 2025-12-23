'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { motion } from 'framer-motion';

// Extend Window interface for webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export function AudioVisualizer() {
  const { audioRef, isPlaying, currentTrack } = usePlayer();
  const animationFrameRef = useRef<number>();
  const [bars, setBars] = useState<number[]>(Array(32).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    let cancelled = false;

    const setupAudioContext = async () => {
      try {
        // Create or resume audio context
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        if (!analyserRef.current) {
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 64;
          analyserRef.current.smoothingTimeConstant = 0.8;
        }

        // Connect audio element to analyser
        if (audioRef.current) {
          try {
            const source = audioContextRef.current.createMediaElementSource(audioRef.current);
            source.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
          } catch (e) {
            // Already connected, ignore
          }
        }
      } catch (e) {
        // Audio context not available, skip visualization
      }
    };

    setupAudioContext();

    const bufferLength = analyserRef.current?.frequencyBinCount || 32;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (cancelled) return;

      if (!isPlaying || !analyserRef.current) {
        // Fade out when not playing
        setBars(prev => prev.map(val => Math.max(0, val * 0.9)));
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArray);
      
      const newBars: number[] = [];
      const step = Math.floor(bufferLength / 32);
      
      for (let i = 0; i < 32; i++) {
        const index = i * step;
        const value = dataArray[index] / 255;
        newBars.push(value);
      }
      
      setBars(newBars);
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioRef, isPlaying, currentTrack]);

  return (
    <div className="flex items-end justify-center gap-1 h-32">
      {bars.map((height, index) => (
        <motion.div
          key={index}
          animate={{
            height: `${height * 100}%`,
            opacity: height > 0.1 ? 1 : 0.3,
          }}
          transition={{ duration: 0.1 }}
          className="w-2 bg-gradient-to-t from-lime-500 to-cyan-500"
          style={{
            minHeight: '4px',
            boxShadow: height > 0.5 ? '0 0 10px rgba(0,255,100,0.6)' : 'none'
          }}
        />
      ))}
    </div>
  );
}

