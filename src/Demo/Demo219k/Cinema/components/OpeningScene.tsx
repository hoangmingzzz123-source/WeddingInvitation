import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OpeningSceneProps {
  onComplete: () => void;
}

export function OpeningScene({ onComplete }: OpeningSceneProps) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => setStep(2), 2200),
      setTimeout(() => setStep(3), 3400),
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 800);
      }, 4500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 bg-[#1C1C1C] flex items-center justify-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1631702825172-a9a848c473ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjB0aGVhdGVyJTIwcmVkJTIwY3VydGFpbnxlbnwxfHx8fDE3NjcyNDkxMzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cinema curtain"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1C]/80 via-[#1C1C1C]/60 to-[#1C1C1C]/80" />
      </div>

      {/* Spotlight effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: step >= 1 ? 2 : 0, opacity: step >= 1 ? 0.15 : 0 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#C9A24D] to-transparent"
        />
      </div>

      <div className="relative text-center px-8 z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-[#F6F1EB] text-4xl md:text-5xl tracking-[0.2em]" style={{ fontFamily: 'Playfair Display, serif' }}>
                A LOVE STORY
              </h1>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              key="director"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[#C9A24D] text-lg md:text-xl tracking-[0.15em]" style={{ fontFamily: 'Lora, serif' }}>
                Directed by Fate
              </p>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="starring"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[#F6F1EB] text-2xl md:text-3xl tracking-[0.15em]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Starring
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}