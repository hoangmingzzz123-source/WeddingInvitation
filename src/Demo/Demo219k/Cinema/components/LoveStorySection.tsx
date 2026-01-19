import React from 'react';
import { motion } from 'motion/react';

export function LoveStorySection() {
  return (
    <section className="min-h-screen bg-[#5A1E2A] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1519657502999-ab785d28a1f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwaG9sZGluZyUyMGhhbmRzfGVufDF8fHx8MTc2NzI1Njc2OHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Couple holding hands"
          className="w-full h-full object-cover opacity-12"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#5A1E2A]/93 via-[#5A1E2A]/88 to-[#5A1E2A]/93" />
      </div>

      {/* Floating dust particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400), 
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800
            }}
            animate={{ 
              y: -100,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400)
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-[#C9A24D] rounded-full opacity-30"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="max-w-2xl text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <div className="inline-block px-6 py-2 border border-[#C9A24D] rounded-full mb-8">
            <span className="text-[#C9A24D] text-sm tracking-[0.2em]" style={{ fontFamily: 'Lora, serif' }}>
              SYNOPSIS
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-[#F6F1EB] text-lg md:text-xl leading-relaxed mb-4"
          style={{ fontFamily: 'Lora, serif', lineHeight: '2' }}
        >
          "Like every great film,
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-[#F6F1EB] text-lg md:text-xl leading-relaxed mb-4"
          style={{ fontFamily: 'Lora, serif', lineHeight: '2' }}
        >
          our love began with a simple moment
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.1 }}
          className="text-[#F6F1EB] text-lg md:text-xl leading-relaxed"
          style={{ fontFamily: 'Lora, serif', lineHeight: '2' }}
        >
          and grew into a lifetime story."
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '50%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.4 }}
          className="h-[1px] bg-[#C9A24D] mx-auto mt-12"
        />
      </motion.div>
    </section>
  );
}
