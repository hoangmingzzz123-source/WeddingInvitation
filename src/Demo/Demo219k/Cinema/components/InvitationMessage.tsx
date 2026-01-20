import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export function InvitationMessage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#1C1C1C] via-[#5A1E2A] to-[#5A1E2A] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1761499101631-92cde2434bc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VyZW1vbnklMjBlbGVnYW50JTIwdmVudWV8ZW58MXx8fHwxNzY3MjU2NzY5fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Elegant wedding venue"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1C]/95 via-[#5A1E2A]/90 to-[#5A1E2A]/95" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-[#C9A24D] rounded-full opacity-30"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-3xl text-center relative z-10 mx-auto w-full px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-block mb-8"
        >
          <Heart className="text-[#C9A24D]" size={40} fill="#C9A24D" />
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '750px' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-[1px] bg-[#C9A24D] mx-auto mb-8"
        />
<br/>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-[#F6F1EB] text-lg md:text-xl leading-relaxed px-4"
          style={{ fontFamily: 'Lora, serif', lineHeight: '2' }}
        >
          Hạnh phúc của chúng tôi sẽ trọn vẹn hơn
          <br />
          khi có bạn cùng chung vui
          <br />
          trong ngày trọng đại.
        </motion.p>
<br />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '750px' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="h-[1px] bg-[#C9A24D] mx-auto mt-8"
        />
      </motion.div>
    </section>
  );
}