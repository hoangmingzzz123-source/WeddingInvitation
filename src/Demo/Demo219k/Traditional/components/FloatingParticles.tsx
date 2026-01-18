import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles - petals floating like incense smoke
    const newParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
      size: 3 + Math.random() * 4,
      opacity: 0.03 + Math.random() * 0.03
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: `${particle.x}vw`, 
            y: '100vh',
            opacity: 0,
            rotate: 0
          }}
          animate={{ 
            x: [`${particle.x}vw`, `${particle.x + 5}vw`, `${particle.x}vw`],
            y: '-10vh',
            opacity: [0, particle.opacity, particle.opacity, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 1]
          }}
          className="absolute"
        >
          {/* Lotus petal shape */}
          <svg 
            width={particle.size * 4} 
            height={particle.size * 4} 
            viewBox="0 0 20 20"
          >
            <ellipse
              cx="10"
              cy="10"
              rx="4"
              ry="8"
              fill="#D4AF37"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}

      {/* Gentle incense smoke effect */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`smoke-${i}`}
          initial={{ 
            x: `${20 + i * 30}%`, 
            y: '100%',
            opacity: 0,
            scale: 0.5
          }}
          animate={{ 
            x: [`${20 + i * 30}%`, `${25 + i * 30}%`, `${20 + i * 30}%`],
            y: '-20%',
            opacity: [0, 0.02, 0.02, 0],
            scale: [0.5, 1.5, 2]
          }}
          transition={{
            duration: 20 + i * 3,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 47, 47, 0.1) 0%, transparent 70%)',
            filter: 'blur(20px)'
          }}
        />
      ))}
    </div>
  );
}
