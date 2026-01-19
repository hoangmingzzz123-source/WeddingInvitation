import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export function EndingScene() {
  return (
    <section className="min-h-screen bg-[#1C1C1C] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1758810410699-2dc1daec82dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMHN1bnNldCUyMGNvdXBsZSUyMHNpbGhvdWV0dGV8ZW58MXx8fHwxNzY3MjQ5MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Romantic sunset"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1C]/90 via-[#1C1C1C]/70 to-[#1C1C1C]/90" />
      </div>

      {/* Multiple light leaks */}
      <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#C9A24D] opacity-10 blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[#5A1E2A] opacity-15 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="inline-block mb-8"
        >
          <Heart className="text-[#C9A24D]" size={48} fill="#C9A24D" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-[#F6F1EB] text-xl md:text-2xl mb-4"
          style={{ fontFamily: 'Lora, serif' }}
        >
          With love,
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-[#F6F1EB] text-3xl md:text-4xl mb-12"
          style={{ fontFamily: 'Allura, cursive' }}
        >
          Hoàng Oanh & Thanh Tùng
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent mb-8 max-w-md mx-auto"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-[#F6F1EB]/80 text-lg mb-16"
          style={{ fontFamily: 'Lora, serif', lineHeight: '1.8' }}
        >
          Thank you for being part of our story
        </motion.p>

        {/* Credits roll effect */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.8 }}
          className="text-[#C9A24D]/40 text-xs tracking-[0.3em]"
          style={{ fontFamily: 'Lora, serif' }}
        >
          — THE END —
        </motion.div>

        {/* Film reel decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-12 flex justify-center gap-3"
        >
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 2.2 + i * 0.1 }}
              className="w-2 h-6 border border-[#C9A24D] opacity-20"
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}