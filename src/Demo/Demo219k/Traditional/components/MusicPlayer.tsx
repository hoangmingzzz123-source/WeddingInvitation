import { motion, AnimatePresence } from 'motion/react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-14 h-14 bg-[#8B1E1E] rounded-full shadow-xl flex items-center justify-center border-2 border-[#D4AF37] hover:bg-[#A73333] transition-colors group relative"
      >
        {/* Animated rings when playing */}
        <AnimatePresence>
          {isPlaying && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-[#8B1E1E] rounded-full"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 bg-[#8B1E1E] rounded-full"
              />
            </>
          )}
        </AnimatePresence>

        {/* Icon */}
        <div className="relative z-10">
          {isPlaying ? (
            <Volume2 className="text-[#D4AF37]" size={24} />
          ) : (
            <VolumeX className="text-[#D4AF37]" size={24} />
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 bg-[#3A2F2F] text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#3A2F2F] rotate-45"></div>
        </div>
      </motion.button>

      {/* Now playing indicator */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-16 right-0 bg-white rounded-lg shadow-lg px-4 py-2 border-2 border-[#D4AF37]"
          >
            <div className="flex items-center gap-2">
              <Music className="text-[#8B1E1E]" size={16} />
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-[#8B1E1E] rounded-full"
                    animate={{
                      height: [8, 16, 8]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#3A2F2F]">Nhạc nền</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
