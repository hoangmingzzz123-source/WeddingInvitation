import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Film } from 'lucide-react';

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#5A1E2A] to-[#1C1C1C] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMG91dGRvb3IlMjBzdW5zZXR8ZW58MXx8fHwxNzY3MjU2NzY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Romantic couple"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#5A1E2A]/92 via-[#1C1C1C]/88 to-[#1C1C1C]/92" />
      </div>

      <div className="w-full flex justify-center items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-3xl w-full"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-6"
          >
            <Film className="inline-block text-[#C9A24D] mb-4" size={48} />
            <p className="text-[#C9A24D] text-sm tracking-[0.3em] mb-2" style={{ fontFamily: 'Lora, serif' }}>
              COMING SOON
            </p>
            <h3 className="text-[#F6F1EB] text-3xl md:text-4xl tracking-[0.2em]" style={{ fontFamily: 'Playfair Display, serif' }}>
              OFFICIAL TRAILER
            </h3>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[1px] bg-[#C9A24D] mx-auto mb-12"
          />

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative group"
          >
            {/* Gold glow effect */}
            <div className="absolute inset-0 bg-[#C9A24D] blur-2xl opacity-20 rounded-2xl group-hover:opacity-30 transition-opacity" />
            
            {/* Video frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#C9A24D] bg-gradient-to-br from-[#1C1C1C] to-[#5A1E2A] cursor-pointer shadow-2xl"
                 onClick={() => setIsPlaying(true)}>
              
              {!isPlaying ? (
                <>
                  {/* Cinematic thumbnail overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5A1E2A]/80 via-[#1C1C1C]/60 to-[#1C1C1C]/80 flex items-center justify-center">
                    {/* Play button */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      {/* Pulsing ring */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 rounded-full border-4 border-[#C9A24D]"
                      />
                      
                      {/* Play button circle */}
                      <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C9A24D]/70 flex items-center justify-center shadow-2xl shadow-[#C9A24D]/50 group-hover:shadow-[#C9A24D]/70 transition-all">
                        <Play className="text-[#1C1C1C] ml-2" size={48} fill="#1C1C1C" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Film grain overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Corner film strips */}
                  <div className="absolute top-0 left-0 right-0 h-4 flex justify-around px-2">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-2 h-full bg-[#C9A24D]/20" />
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-4 flex justify-around px-2">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-2 h-full bg-[#C9A24D]/20" />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#F6F1EB]">
                  <div className="text-center p-8">
                    <Play className="mx-auto mb-4 text-[#C9A24D]" size={64} />
                    <p className="text-xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Wedding Highlight Video
                    </p>
                    <p className="text-sm text-[#F6F1EB]/60" style={{ fontFamily: 'Lora, serif' }}>
                      Video will be embedded here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-[#F6F1EB]/70 text-center text-sm mt-8 italic" style={{ fontFamily: 'Lora, serif' }}>
            A cinematic journey of our love story
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}