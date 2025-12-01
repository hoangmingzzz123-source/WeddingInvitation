import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface GoldenGlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export function GoldenGlowButton({ 
  children, 
  onClick, 
  icon: Icon,
  variant = 'primary',
  className = '' 
}: GoldenGlowButtonProps) {
  const variants = {
    primary: {
      base: 'bg-gradient-to-r from-[#C29B43] to-[#FFD700] text-white',
      hover: 'shadow-[0_0_20px_rgba(194,155,67,0.6)]',
    },
    secondary: {
      base: 'bg-white text-[#C29B43] border-2 border-[#C29B43]',
      hover: 'shadow-[0_0_20px_rgba(194,155,67,0.4)]',
    },
    outline: {
      base: 'bg-transparent text-[#C29B43] border-2 border-[#C29B43]',
      hover: 'bg-[#C29B43] text-white shadow-[0_0_20px_rgba(194,155,67,0.5)]',
    },
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative px-6 py-3 rounded-full overflow-hidden
        transition-all duration-300
        ${currentVariant.base}
        ${className}
      `}
      whileHover={{ 
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
      style={{ fontFamily: '"Poppins", sans-serif' }}
    >
      {/* Glowing Effect on Hover */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: currentVariant.hover,
        }}
      />

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </span>

      {/* Border Glow Animation */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, transparent, rgba(255,255,255,0.3), transparent)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.button>
  );
}
