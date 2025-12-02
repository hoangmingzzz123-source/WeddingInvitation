import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  autoPlay?: boolean;
  showVolumeControl?: boolean; // For 399k package
}

export function MusicPlayer({ autoPlay = true, showVolumeControl = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    // Wedding background music - using free music from various sources
    // In production, use user's uploaded wedding music
    audioRef.current.src = 'src/asset/Lễ Đường.mp3'; // Romantic Piano Wedding Music
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // Try to autoplay if allowed
    if (autoPlay) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay blocked, user needs to interact first
          console.log('Autoplay blocked');
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Fade out
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume -= 0.05;
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = volume;
          }
        }
      }, 30);
      setIsPlaying(false);
    } else {
      // Fade in
      audioRef.current.volume = 0;
      audioRef.current.play();
      const fadeIn = setInterval(() => {
        if (audioRef.current && audioRef.current.volume < volume - 0.05) {
          audioRef.current.volume += 0.05;
        } else {
          clearInterval(fadeIn);
          if (audioRef.current) {
            audioRef.current.volume = volume;
          }
        }
      }, 30);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="flex items-center gap-2">
        {/* Volume Control - Only for 399k */}
        {showVolumeControl && (
          <AnimatePresence>
            {showVolume && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg"
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                  className="w-24 accent-[#C29B43]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Music Button */}
        <motion.button
          onClick={togglePlay}
          onMouseEnter={() => showVolumeControl && setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          style={{
            border: '2px solid rgba(194, 155, 67, 0.3)',
          }}
        >
          <motion.div
            animate={{
              rotate: isPlaying ? 360 : 0,
            }}
            transition={{
              duration: 6,
              repeat: isPlaying ? Infinity : 0,
              ease: "linear",
            }}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-[#C29B43]" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#666]" />
            )}
          </motion.div>
        </motion.button>

        {/* Visualizer for 399k */}
        {showVolumeControl && isPlaying && (
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-[#C29B43] rounded-full"
                animate={{
                  height: [8, 16, 8],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}