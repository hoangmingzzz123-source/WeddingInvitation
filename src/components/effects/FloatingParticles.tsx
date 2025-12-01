import React from 'react';
import { motion } from 'motion/react';

type ParticleTheme = 'artdeco' | 'romantic' | 'green' | 'vintage' | 'modern';

interface FloatingParticlesProps {
  theme: ParticleTheme;
  density?: 'low' | 'medium' | 'high';
}

export function FloatingParticles({ theme, density = 'medium' }: FloatingParticlesProps) {
  const particleCount = {
    low: 15,
    medium: 30,
    high: 50,
  }[density];

  const getParticleConfig = (theme: ParticleTheme, index: number) => {
    const configs = {
      artdeco: {
        // Hạt vàng li ti
        size: Math.random() * 3 + 1,
        color: ['#C29B43', '#FFD700', '#FFA500'][index % 3],
        opacity: Math.random() * 0.4 + 0.2,
        duration: Math.random() * 15 + 10,
        blur: 'blur-[1px]',
      },
      romantic: {
        // Bụi film grain + sparkle
        size: Math.random() * 4 + 2,
        color: ['#FFB6C1', '#FFC0CB', '#FFD1DC'][index % 3],
        opacity: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 12 + 8,
        blur: 'blur-[2px]',
      },
      green: {
        // Lá non rơi nhẹ
        size: Math.random() * 8 + 4,
        color: ['#90EE90', '#98FB98', '#8FBC8F'][index % 3],
        opacity: Math.random() * 0.25 + 0.15,
        duration: Math.random() * 20 + 15,
        blur: 'blur-[1px]',
      },
      vintage: {
        // Glitter xung quanh
        size: Math.random() * 3 + 1,
        color: ['#D4AF37', '#F4E4C1', '#E6D7A3'][index % 3],
        opacity: Math.random() * 0.5 + 0.2,
        duration: Math.random() * 10 + 8,
        blur: 'blur-[0.5px]',
      },
      modern: {
        // Geometric shapes
        size: Math.random() * 5 + 3,
        color: ['#1B2A41', '#3B5A91', '#5B7AA1'][index % 3],
        opacity: Math.random() * 0.2 + 0.1,
        duration: Math.random() * 18 + 12,
        blur: 'blur-[1px]',
      },
    };

    return configs[theme];
  };

  const getParticleShape = (theme: ParticleTheme, index: number) => {
    switch (theme) {
      case 'green':
        // Leaf shape
        return index % 3 === 0 ? 'rounded-tl-full rounded-br-full' : 'rounded-full';
      case 'romantic':
        // Heart or circle
        return index % 4 === 0 ? 'rounded-sm rotate-45' : 'rounded-full';
      case 'modern':
        // Square/Rectangle
        return index % 3 === 0 ? 'rounded-sm' : index % 3 === 1 ? 'rounded-full' : 'rounded-md';
      default:
        return 'rounded-full';
    }
  };

  const particles = Array.from({ length: particleCount }, (_, i) => {
    const config = getParticleConfig(theme, i);
    return {
      ...config,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      shape: getParticleShape(theme, i),
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className={`absolute ${particle.blur} ${particle.shape}`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            rotate: theme === 'green' ? [0, 360] : undefined,
            scale: [1, Math.random() * 0.5 + 0.8, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Special sparkle effect for vintage and artdeco */}
      {(theme === 'vintage' || theme === 'artdeco') && (
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 4,
                repeat: Infinity,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 0L11 9L10 20L9 9L10 0Z"
                  fill="#FFD700"
                  opacity="0.6"
                />
                <path
                  d="M0 10L9 11L20 10L9 9L0 10Z"
                  fill="#FFD700"
                  opacity="0.6"
                />
              </svg>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}
