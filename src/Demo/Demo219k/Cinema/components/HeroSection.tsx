import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X } from 'lucide-react';

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <section className="min-h-screen bg-[#1C1C1C] flex items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Spotlight effect */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0.08 }}
            transition={{ duration: 2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-[#C9A24D] to-transparent"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center relative z-10 max-w-3xl mx-auto w-full"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-[#C9A24D] text-lg md:text-xl tracking-[0.3em] mb-6"
            style={{ fontFamily: 'Lora, serif' }}
          >
            SAVE THE DATE
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-[#F6F1EB] text-5xl md:text-7xl tracking-[0.15em] mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            29 • 03 • 2026
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '200px' }}
            transition={{ duration: 1, delay: 1.1 }}
            className="h-[1px] bg-[#C9A24D] mx-auto mb-12"
          />

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVideo(true)}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-[#C9A24D] text-[#F6F1EB] hover:bg-[#C9A24D] hover:text-[#1C1C1C] transition-all duration-300 group"
            style={{ fontFamily: 'Lora, serif' }}
          >
            <Play className="group-hover:scale-110 transition-transform" size={20} fill="currentColor" />
            <span className="tracking-[0.1em]">Watch Our Story</span>
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.7 }}
            className="text-[#F6F1EB]/40 text-sm mt-16 tracking-[0.2em]"
            style={{ fontFamily: 'Lora, serif' }}
          >
            Scroll to explore ↓
          </motion.p>
        </motion.div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
            onClick={() => setShowVideo(false)}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-6 right-6 text-[#F6F1EB] hover:text-[#C9A24D] transition-colors"
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md aspect-[9/16] bg-[#1C1C1C] rounded-lg overflow-hidden border-2 border-[#C9A24D]"
            >
              {/* Placeholder for video - replace with actual video embed */}
              <div className="w-full h-full flex items-center justify-center text-[#F6F1EB]">
                <div className="text-center p-8">
                  <Play className="mx-auto mb-4 text-[#C9A24D]" size={48} />
                  <p style={{ fontFamily: 'Lora, serif' }}>Video trailer will be embedded here</p>
                  <p className="text-sm text-[#F6F1EB]/60 mt-2" style={{ fontFamily: 'Lora, serif' }}>
                    (30-45s cinematic wedding trailer)
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}