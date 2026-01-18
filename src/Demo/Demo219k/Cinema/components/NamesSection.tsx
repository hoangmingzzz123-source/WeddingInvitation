import React from 'react';
import { motion } from 'motion/react';

export function NamesSection() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#1C1C1C] to-[#5A1E2A] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1719786624838-b5d9a9e3f378?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwd2VkZGluZ3xlbnwxfHx8fDE3NjcyNTY3Njl8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Vintage luxury wedding"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1C]/90 via-[#5A1E2A]/85 to-[#5A1E2A]/90" />
      </div>
      
      {/* Light leak effect */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C9A24D] opacity-10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#5A1E2A] opacity-20 blur-[120px] rounded-full" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-center relative z-10 max-w-4xl mx-auto w-full"
      >
        {/* Top line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent mb-12"
        />
        
        {/* Bride name */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-[#F6F1EB] text-5xl md:text-7xl mb-6"
          style={{ fontFamily: 'Allura, cursive' }}
        >
          Hoàng Oanh
        </motion.h2>
        
        {/* Ampersand */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-[#C9A24D] text-3xl md:text-4xl mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          &
        </motion.div>
        
        {/* Groom name */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-[#F6F1EB] text-5xl md:text-7xl mb-12"
          style={{ fontFamily: 'Allura, cursive' }}
        >
          Thanh Tùng
        </motion.h2>
        
        {/* Bottom line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.4 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent mb-8"
        />
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.6 }}
          className="text-[#F6F1EB] text-xl md:text-2xl tracking-[0.2em]"
          style={{ fontFamily: 'Lora, serif' }}
        >
          Are getting married
        </motion.p>
      </motion.div>
    </section>
  );
}