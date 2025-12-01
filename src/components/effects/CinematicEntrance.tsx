import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CinematicEntranceProps {
  children: React.ReactNode;
  logoText?: string;
  duration?: number;
  onComplete?: () => void;
}

export function CinematicEntrance({ 
  children, 
  logoText = 'A & N',
  duration = 3000,
  onComplete 
}: CinematicEntranceProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after intro
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, duration - 500);

    // Hide intro
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(introTimer);
    };
  }, [duration, onComplete]);

  return (
    <>
      {/* Cinematic Intro */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            {/* Camera Zoom & Blur Effect */}
            <motion.div
              initial={{ scale: 2, filter: 'blur(20px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                duration: 1.2,
                ease: [0.43, 0.13, 0.23, 0.96] // Custom easing
              }}
              className="relative"
            >
              {/* Lens Flare Effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ 
                  x: '200%',
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3,
                  ease: "easeOut",
                }}
              >
                <div 
                  className="w-full h-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,215,120,0.8), transparent)',
                    filter: 'blur(10px)',
                  }}
                />
              </motion.div>

              {/* Logo Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.4,
                }}
                className="relative z-10"
              >
                <h1 
                  className="text-7xl md:text-9xl relative"
                  style={{ 
                    fontFamily: '"Great Vibes", cursive',
                    background: 'linear-gradient(135deg, #C29B43, #FFD700, #FFA500, #C29B43)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '300% 300%',
                  }}
                >
                  <motion.span
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #C29B43, #FFD700, #FFA500, #C29B43)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundSize: '300% 300%',
                    }}
                  >
                    {logoText}
                  </motion.span>
                </h1>

                {/* Golden Glow Around Text */}
                <motion.div
                  className="absolute inset-0 blur-2xl -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background: 'radial-gradient(circle, #FFD700, transparent)',
                  }}
                />
              </motion.div>

              {/* Art Deco Border Animation */}
              <motion.div
                className="absolute -inset-8 border-2 border-[#C29B43] rounded-lg pointer-events-none"
                initial={{ 
                  clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)',
                }}
                animate={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.6,
                  ease: "easeOut",
                }}
              >
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FFD700]" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FFD700]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FFD700]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FFD700]" />
              </motion.div>
            </motion.div>

            {/* Particle Sparkles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Entrance */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
