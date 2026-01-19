import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Volume2, VolumeX } from 'lucide-react';

export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Hide tooltip after 5 seconds
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    setShowTooltip(false);
    
    // In a real implementation, you would control audio playback here
    // if (audioRef.current) {
    //   if (isPlaying) {
    //     audioRef.current.pause();
    //   } else {
    //     audioRef.current.play();
    //   }
    // }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <button
          onClick={toggleMusic}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C9A24D]/80 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-[#C9A24D]/30 transition-all duration-300 group"
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Volume2 className="text-[#1C1C1C]" size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <VolumeX className="text-[#1C1C1C]" size={24} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse animation when playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#C9A24D]"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#F6F1EB] text-[#1C1C1C] px-4 py-2 rounded-lg whitespace-nowrap text-sm shadow-lg"
              style={{ fontFamily: 'Lora, serif' }}
            >
              Click để bật nhạc nền
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-[#F6F1EB]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hidden audio element - add your audio file URL here */}
      {/* <audio ref={audioRef} loop>
        <source src="/path-to-your-music.mp3" type="audio/mpeg" />
      </audio> */}
    </>
  );
}
