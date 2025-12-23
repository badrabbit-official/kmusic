"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaSearch, FaArrowLeft, FaRocket, FaGhost, FaExclamationTriangle } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setFloatingElements(elements);


    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth) * 100,
        y: (clientY / innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSearch = () => {
    router.push('/catalog');
  };

  const handleSecretClick = () => {
    setShowSecret(true);
    setTimeout(() => setShowSecret(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden select-none">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          filter: 'brightness(0.2)',
          objectPosition: 'center center',
        }}
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute w-2 h-2 bg-green-400/30 rounded-full"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-white min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="backdrop-blur-md w-full z-50 transition-colors duration-300 bg-black/90">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="cursor-pointer"
                onClick={handleGoHome}
              >
                <Image
                  src="/logo.png"
                  alt="LuxDope Logo"
                  width={180}
                  height={50}
                  className="h-10 w-auto"
                />
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoHome}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-full text-white font-medium transition-all duration-300"
              >
                Home
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* 404 Number with Parallax Effect */}
            <motion.div
              className="relative mb-8"
              style={{
                transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`
              }}
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-8xl sm:text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-green-500 leading-none"
              >
                404
              </motion.h1>
              
              {/* Glitch Effect */}
              <motion.div
                className="absolute inset-0 text-8xl sm:text-9xl md:text-[12rem] font-black text-red-500/50 leading-none"
                animate={{
                  x: [0, -2, 2, -1, 1, 0],
                  y: [0, 1, -1, 2, -2, 0],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                404
              </motion.div>
            </motion.div>

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Looks like this page decided to take a vacation without leaving a forwarding address. 
                Don&apos;t worry, we&apos;ll help you get back on track!
              </p>
            </motion.div>

            {/* Interactive Ghost */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-8"
            >
              <motion.div
                className="inline-block text-6xl text-green-400 cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSecretClick}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FaGhost />
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoHome}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-full text-white font-medium transition-all duration-300 flex items-center gap-3 text-lg shadow-lg"
              >
                <FaHome />
                Go Home
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoBack}
                className="px-8 py-4 border-2 border-white/30 hover:border-white/50 hover:bg-white/10 rounded-full text-white font-medium transition-all duration-300 flex items-center gap-3 text-lg backdrop-blur-sm"
              >
                <FaArrowLeft />
                Go Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="px-8 py-4 border-2 border-green-500/50 hover:border-green-500 hover:bg-green-500/10 rounded-full text-white font-medium transition-all duration-300 flex items-center gap-3 text-lg backdrop-blur-sm"
              >
                <FaSearch />
                Browse Products
              </motion.button>
            </motion.div>

            {/* Fun Facts Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                <FaExclamationTriangle className="text-yellow-400" />
                Fun Fact
              </h3>
              <p className="text-gray-300 text-center">
                The &quot;404&quot; error was named after room 404 at CERN, where the original web servers were located. 
                When a page wasn&apos;t found, it was like trying to find a room that didn&apos;t exist!
              </p>
            </motion.div>

            {/* Secret Message */}
            <AnimatePresence>
              {showSecret && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-2xl">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaRocket className="inline-block mr-2" />
                      You found the secret!
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8">
          <div className="container mx-auto px-4 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer inline-block"
              onClick={handleGoHome}
            >
              <Image
                src="/logo.png"
                alt="LuxDope Logo"
                width={180}
                height={50}
                className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
            <p className="text-gray-500 mt-4 text-sm">
              © 2024 LuxDope. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
