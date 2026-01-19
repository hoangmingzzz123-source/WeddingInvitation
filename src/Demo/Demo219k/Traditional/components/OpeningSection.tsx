import { motion } from 'motion/react';

export function OpeningSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#8B1E1E] text-[#FBF6EE] relative overflow-hidden px-4 silk-texture vignette"
    >
      {/* Ink spread effect background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(40px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-br from-[#8B1E1E] via-[#A73333] to-[#8B1E1E]"
      />

      {/* Silk wave pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path 
                d="M 0 100 Q 50 80 100 100 T 200 100" 
                stroke="rgba(212, 175, 55, 0.3)" 
                strokeWidth="2" 
                fill="none"
              />
              <path 
                d="M 0 150 Q 50 130 100 150 T 200 150" 
                stroke="rgba(212, 175, 55, 0.2)" 
                strokeWidth="1.5" 
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave)" />
        </svg>
      </div>

      {/* Decorative border pattern */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        className="absolute inset-4 md:inset-8 border-2 border-[#D4AF37] rounded-lg z-10"
      />

      {/* Double happiness symbol */}
      <motion.div
        initial={{ scale: 0, opacity: 0, filter: 'blur(10px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.8, delay: 1, ease: "easeOut" }}
        className="mb-8 md:mb-12 relative z-10"
      >
        <motion.svg 
          width="80" 
          height="80" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          animate={{ 
            filter: ['drop-shadow(0 0 0px rgba(212, 175, 55, 0))', 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))', 'drop-shadow(0 0 0px rgba(212, 175, 55, 0))']
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <text x="50" y="75" fontSize="70" fill="#D4AF37" textAnchor="middle" fontFamily="serif">囍</text>
        </motion.svg>
      </motion.div>

      {/* Invitation text */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
        className="text-center mb-8 md:mb-12 relative z-10"
      >
        <p className="tracking-[0.35em] text-[#D4AF37] mb-2 uppercase text-xs" style={{ fontFamily: 'var(--font-family-display)' }}>Thiệp Mời Lễ Thành Hôn</p>
      </motion.div>

      {/* Bride & Groom names */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
        className="text-center mb-8 md:mb-12 relative z-10"
      >
        <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          <motion.h1 
            className="text-[#D4AF37] text-6xl md:text-8xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 2.3, ease: "easeOut" }}
            style={{ fontFamily: 'var(--font-family-script)', fontWeight: 400, letterSpacing: '0.01em' }}
          >
            Hoàng Oanh
          </motion.h1>
          <motion.span 
            className="text-3xl md:text-4xl text-[#D4AF37] opacity-50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.8, ease: "easeOut" }}
            style={{ fontFamily: 'var(--font-family-script)' }}
          >
            &
          </motion.span>
          <motion.h1 
            className="text-[#D4AF37] text-6xl md:text-8xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 2.5, ease: "easeOut" }}
            style={{ fontFamily: 'var(--font-family-script)', fontWeight: 400, letterSpacing: '0.01em' }}
          >
            Thanh Tùng
          </motion.h1>
        </div>
      </motion.div>

      {/* Wedding date */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 3, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        <div className="flex items-center gap-3 md:gap-4 justify-center" style={{ fontFamily: 'var(--font-family-display)' }}>
          <span className="text-3xl md:text-4xl text-[#D4AF37]" style={{ fontWeight: 300, letterSpacing: '0.1em' }}>29</span>
          <span className="text-xl md:text-2xl text-[#FBF6EE] opacity-40">·</span>
          <span className="text-3xl md:text-4xl text-[#D4AF37]" style={{ fontWeight: 300, letterSpacing: '0.1em' }}>03</span>
          <span className="text-xl md:text-2xl text-[#FBF6EE] opacity-40">·</span>
          <span className="text-3xl md:text-4xl text-[#D4AF37]" style={{ fontWeight: 300, letterSpacing: '0.1em' }}>2026</span>
        </div>
      </motion.div>

      {/* Lotus decorations - floating gently */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.2, y: 0 }}
        transition={{ duration: 2, delay: 3.5 }}
        className="absolute bottom-8 left-8 z-10"
      >
        <motion.svg 
          width="60" 
          height="60" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M50 20 Q30 40 30 60 Q30 80 50 90 Q70 80 70 60 Q70 40 50 20Z" fill="#D4AF37" opacity="0.5"/>
          <path d="M50 30 Q40 45 40 60 Q40 75 50 82 Q60 75 60 60 Q60 45 50 30Z" fill="#FBF6EE" opacity="0.7"/>
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.2, y: 0 }}
        transition={{ duration: 2, delay: 3.7 }}
        className="absolute bottom-8 right-8 z-10"
      >
        <motion.svg 
          width="60" 
          height="60" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M50 20 Q30 40 30 60 Q30 80 50 90 Q70 80 70 60 Q70 40 50 20Z" fill="#D4AF37" opacity="0.5"/>
          <path d="M50 30 Q40 45 40 60 Q40 75 50 82 Q60 75 60 60 Q60 45 50 30Z" fill="#FBF6EE" opacity="0.7"/>
        </motion.svg>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-[#D4AF37] tracking-widest" style={{ fontFamily: 'var(--font-family-display)' }}>Vuốt xuống</p>
          <motion.div 
            className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex items-start justify-center p-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-[#D4AF37] rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}