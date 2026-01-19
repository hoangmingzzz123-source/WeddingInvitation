import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function DressCodeSection() {
  const colors = [
    { name: 'Burgundy', hex: '#5A1E2A' },
    { name: 'Black', hex: '#1C1C1C' },
    { name: 'Champagne', hex: '#F6F1EB' },
    { name: 'Gold', hex: '#C9A24D' },
  ];

  return (
    <section className="min-h-screen bg-[#1C1C1C] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Animated Spotlight sweep */}
      <motion.div
        initial={{ x: '-100%' }}
        whileInView={{ x: '200%' }}
        viewport={{ once: true }}
        transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[300px] h-full bg-gradient-to-r from-transparent via-[#C9A24D]/10 to-transparent blur-3xl"
      />

      {/* Central spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A24D] opacity-5 blur-[150px] rounded-full" />

      <div className="w-full flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl w-full text-center relative z-10"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-block mb-6"
          >
            <Sparkles className="text-[#C9A24D]" size={48} />
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#F6F1EB] text-3xl md:text-4xl tracking-[0.2em] mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            DRESS CODE
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-[#C9A24D] text-xl md:text-2xl mb-12 tracking-[0.1em]"
            style={{ fontFamily: 'Lora, serif' }}
          >
            Red Carpet Elegance
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="h-[1px] bg-[#C9A24D] mx-auto mb-12"
          />

          {/* Color palette */}
          <div className="grid grid-cols-4 gap-4 md:gap-6 mb-12 max-w-lg mx-auto">
            {colors.map((color, index) => (
              <motion.div
                key={color.name}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 + index * 0.15 }}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-3 mx-auto border-2 border-[#C9A24D] shadow-xl transition-transform"
                  style={{ 
                    backgroundColor: color.hex,
                    boxShadow: `0 0 20px ${color.hex}40`
                  }}
                />
                <p className="text-[#F6F1EB] text-xs md:text-sm" style={{ fontFamily: 'Lora, serif' }}>
                  {color.name}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="bg-[#F6F1EB]/5 border border-[#C9A24D]/20 rounded-2xl p-6 md:p-8"
          >
            <p className="text-[#F6F1EB] text-base md:text-lg leading-relaxed italic" style={{ fontFamily: 'Lora, serif', lineHeight: '1.8' }}>
              Please dress in formal or elegant attire
              <br />
              to match our cinematic night ✨
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}