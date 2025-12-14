import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CinematicPreloaderProps {
  onComplete: () => void;
  duration?: number;
}

export function CinematicPreloader({ onComplete, duration = 2000 }: CinematicPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            onComplete();
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [onComplete, duration]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          {/* Film Grain Background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            }}
          />

          <div className="relative z-10 text-center space-y-8 px-6">
            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-gray-400 text-sm tracking-[0.3em] uppercase"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Our Story Is Loading...
            </motion.p>

            {/* Film Strip Progress Bar */}
            <div className="relative w-80 max-w-full mx-auto">
              {/* Film strip holes */}
              <div className="flex justify-between absolute -top-2 left-0 right-0 z-10">
                {Array(9).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-2 bg-gray-700 rounded-full"
                  />
                ))}
              </div>
              <div className="flex justify-between absolute -bottom-2 left-0 right-0 z-10">
                {Array(9).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-2 bg-gray-700 rounded-full"
                  />
                ))}
              </div>

              {/* Progress bar container */}
              <div className="relative h-2 bg-gray-800 border-t border-b border-gray-700 overflow-hidden">
                {/* Progress fill with shimmer */}
                <motion.div
                  className="h-full bg-gradient-to-r from-[#C29B43] via-[#FFD700] to-[#C29B43]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{
                      backgroundPosition: ['200% 0%', '-200% 0%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Percentage */}
            <motion.p
              key={progress}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[#C29B43] text-xl tabular-nums"
            >
              {progress}%
            </motion.p>

            {/* Film reel animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto border-4 border-[#C29B43] rounded-full relative"
            >
              <div className="absolute inset-2 border-2 border-[#C29B43] rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-full bg-[#C29B43]" />
                <div className="h-1 w-full bg-[#C29B43] absolute" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
