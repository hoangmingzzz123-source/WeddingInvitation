import React from 'react';
import { motion } from 'motion/react';

export function FloatingPetals() {
  const petals = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal}
          className="absolute w-3 h-3 rounded-full bg-[#F7DADA] opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 20,
            x: Math.random() * window.innerWidth,
            rotate: 360,
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
          style={{
            left: Math.random() * 100 + '%',
          }}
        />
      ))}
    </div>
  );
}
