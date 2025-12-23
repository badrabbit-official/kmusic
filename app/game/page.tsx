'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Play, Download, Gamepad2, Zap, Shield, Target } from 'lucide-react';

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0.5, 0]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Cursor Glow */}
      <div
        className="fixed w-96 h-96 pointer-events-none z-50 transition-opacity duration-500"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: 'radial-gradient(circle, rgba(0,255,100,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-30 backdrop-blur-md bg-black/40 border-b-2 border-lime-500/30"
        style={{ boxShadow: '0 0 20px rgba(0,255,100,0.1)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-lime-400 font-mono text-sm border-2 px-4 py-2"
                style={{
                  borderColor: '#00ff64',
                  boxShadow: '0 0 10px rgba(0,255,100,0.2)'
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                [BACK]
              </motion.button>
            </Link>
            <div className="text-lime-400 font-mono text-sm">
              [GAME_ANNOUNCEMENT]
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Scroll Container */}
      <div ref={containerRef} className="relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background Layers */}
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0 z-0"
          >
            {/* City Skyline Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black to-black">
              {/* Buildings */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bottom-0 bg-gradient-to-t from-lime-500/10 to-transparent"
                  style={{
                    left: `${i * 5}%`,
                    width: '4%',
                    height: `${30 + Math.random() * 40}%`,
                    boxShadow: '0 0 20px rgba(0,255,100,0.2)'
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Foreground Elements */}
          <motion.div
            style={{ y: foregroundY }}
            className="absolute inset-0 z-10"
          >
            {/* Floating Particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-lime-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: '0 0 6px rgba(0,255,100,0.8)'
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            style={{ y: textY, opacity }}
            className="relative z-20 text-center px-4 sm:px-6 lg:px-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 font-mono"
                style={{
                  fontFamily: 'var(--font-orbitron), monospace',
                  color: '#00ff64',
                  textShadow: '0 0 30px rgba(0,255,100,0.8), 0 0 60px rgba(0,255,100,0.5)'
                }}
                animate={{
                  textShadow: [
                    '0 0 30px rgba(0,255,100,0.8), 0 0 60px rgba(0,255,100,0.5)',
                    '0 0 40px rgba(0,255,100,1), 0 0 80px rgba(0,255,100,0.7), 0 0 120px rgba(0,255,100,0.3)',
                    '0 0 30px rgba(0,255,100,0.8), 0 0 60px rgba(0,255,100,0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                CYBERPUNK
                <br />
                SCROLLER
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl sm:text-2xl text-gray-300 mb-8 font-mono max-w-2xl mx-auto"
              >
                [2D_PLATFORMER_IN_CYBERPUNK_STYLE]
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-8 py-4 border-2 text-white font-bold font-mono relative overflow-hidden group"
                  style={{
                    borderColor: '#00ff64',
                    background: 'linear-gradient(135deg, rgba(0,255,100,0.1), rgba(0,212,255,0.1))',
                    boxShadow: '0 0 30px rgba(0,255,100,0.4)'
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isPlaying ? '[PAUSE]' : '[PLAY]'}
                    <Play className={`w-5 h-5 ${isPlaying ? 'hidden' : ''}`} />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-lime-500 to-cyan-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-orange-500 text-orange-400 font-bold font-mono relative overflow-hidden group"
                  style={{
                    boxShadow: '0 0 20px rgba(255,107,0,0.3)'
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    [DOWNLOAD]
                    <Download className="w-5 h-5" />
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-lime-400 font-mono text-sm flex flex-col items-center gap-2"
            >
              <span>[SCROLL_DOWN]</span>
              <div className="w-px h-8 bg-lime-400" style={{ boxShadow: '0 0 10px rgba(0,255,100,0.8)' }} />
            </motion.div>
          </motion.div>
        </section>

        {/* Game Features Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto w-full">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl sm:text-6xl font-bold mb-16 text-center font-mono"
              style={{
                fontFamily: 'var(--font-orbitron), monospace',
                color: '#00d4ff',
                textShadow: '0 0 20px rgba(0,212,255,0.5)'
              }}
            >
              [FEATURES]
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Gamepad2,
                  title: 'DYNAMIC GAMEPLAY',
                  description: 'Быстрый и отзывчивый геймплей с плавным управлением',
                  color: '#00ff64'
                },
                {
                  icon: Zap,
                  title: 'PIXEL ART GRAPHICS',
                  description: 'Стилизованная пиксельная графика в киберпанк эстетике',
                  color: '#00d4ff'
                },
                {
                  icon: Shield,
                  title: 'CYBERPUNK WORLD',
                  description: 'Погружение в атмосферный мир будущего',
                  color: '#ff6b00'
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="p-8 border-2 bg-black/80 backdrop-blur-sm relative"
                  style={{
                    borderColor: feature.color,
                    boxShadow: `0 0 20px ${feature.color}40`
                  }}
                >
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: feature.color }} />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: feature.color }} />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: feature.color }} />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: feature.color }} />
                  
                  <feature.icon className="w-12 h-12 mb-4" style={{ color: feature.color }} />
                  <h3 className="text-2xl font-bold text-white mb-4 font-mono">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gameplay Preview Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto w-full">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl sm:text-6xl font-bold mb-16 text-center font-mono"
              style={{
                fontFamily: 'var(--font-orbitron), monospace',
                color: '#ff6b00',
                textShadow: '0 0 20px rgba(255,107,0,0.5)'
              }}
            >
              [GAMEPLAY]
            </motion.h2>

            {/* Mock Game Screen */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative border-4 bg-black p-4"
              style={{
                borderColor: '#00ff64',
                boxShadow: '0 0 40px rgba(0,255,100,0.4)'
              }}
            >
              <div className="aspect-video bg-gradient-to-b from-purple-900/50 to-black relative overflow-hidden">
                {/* Mock Game Elements */}
                <div className="absolute inset-0">
                  {/* Platform */}
                  <div className="absolute bottom-10 left-0 right-0 h-4 bg-lime-500/50" style={{ boxShadow: '0 0 20px rgba(0,255,100,0.6)' }} />
                  
                  {/* Character */}
                  <motion.div
                    animate={{
                      x: ['10%', '90%', '10%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="absolute bottom-14 w-8 h-8 bg-lime-400"
                    style={{
                      boxShadow: '0 0 15px rgba(0,255,100,0.8)'
                    }}
                  />
                  
                  {/* Enemies */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -20, 0]
                      }}
                      transition={{
                        duration: 1 + i * 0.2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                      className="absolute bottom-14 w-6 h-6 bg-red-500/70"
                      style={{
                        left: `${20 + i * 15}%`,
                        boxShadow: '0 0 10px rgba(255,0,0,0.6)'
                      }}
                    />
                  ))}
                  
                  {/* Background Elements */}
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bottom-0 bg-gradient-to-t from-lime-500/20 to-transparent"
                      style={{
                        left: `${i * 10}%`,
                        width: '8%',
                        height: `${20 + Math.random() * 30}%`,
                      }}
                    />
                  ))}
                </div>
                
                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="font-mono text-lime-400 text-sm">
                    <div>HP: <span className="text-white">100/100</span></div>
                    <div>SCORE: <span className="text-white">0000</span></div>
                  </div>
                  <div className="font-mono text-lime-400 text-sm">
                    LEVEL: <span className="text-white">01</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Release Info Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2
              className="text-5xl sm:text-6xl font-bold mb-8 font-mono"
              style={{
                fontFamily: 'var(--font-orbitron), monospace',
                color: '#00ff64',
                textShadow: '0 0 20px rgba(0,255,100,0.5)'
              }}
            >
              [COMING_SOON]
            </motion.h2>
            <p className="text-xl text-gray-300 mb-12 font-mono">
              Скоро в разработке. Следите за обновлениями.
            </p>
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 border-2 text-lime-400 font-bold font-mono"
                style={{
                  borderColor: '#00ff64',
                  boxShadow: '0 0 20px rgba(0,255,100,0.3)'
                }}
              >
                [BACK_TO_PROJECTS]
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

