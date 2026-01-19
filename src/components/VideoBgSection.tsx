import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface VideoBgSectionProps {
  title: string;
  subtitle?: string;
  bgGradient: string;
  titleColor: string;
  subtitleColor?: string;
  bokehColors?: [string, string];
  playButtonColor: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  borderColor?: string;
  accentColor?: string;
}

export function VideoBgSection({
  title,
  subtitle,
  bgGradient,
  titleColor,
  subtitleColor = 'text-[#666]',
  bokehColors = ['rgba(194, 155, 67, 0.1)', 'rgba(247, 218, 218, 0.1)'],
  playButtonColor,
  videoUrl = 'https://www.youtube.com/embed/VvkYROIh5qc?si=NzBVHEmRQ-pFrKQ5',
  thumbnailUrl = 'src/asset/videoCover.png',
  borderColor = 'border-[#C29B43]/30',
  accentColor = '[#C29B43]',
}: VideoBgSectionProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className={`relative py-24 px-4 md:px-16 bg-gradient-to-b ${bgGradient} overflow-hidden`}>
      {/* Bokeh Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? bokehColors[0] : bokehColors[1]
              } 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 space-y-4"
        >
          <h2 
            className={`text-5xl md:text-6xl ${titleColor}`}
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className={`text-xl ${subtitleColor} max-w-2xl mx-auto`}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`relative aspect-video rounded-3xl overflow-hidden shadow-2xl cursor-pointer group border-4 ${borderColor}`}
          onClick={() => setIsVideoOpen(true)}
        >
          {/* Thumbnail */}
          <ImageWithFallback
            src={thumbnailUrl}
            alt="Video Preview"
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />

          {/* Play Button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`w-24 h-24 bg-${accentColor} rounded-full flex items-center justify-center shadow-2xl`}
              animate={{
                boxShadow: [
                  `0 0 0 0 rgba(194, 155, 67, 0.4)`,
                  `0 0 0 20px rgba(194, 155, 67, 0)`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Video Modal */}
        <AnimatePresence>
          {isVideoOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsVideoOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsVideoOpen(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                {/* YouTube Embed */}
                <iframe 
                  className="w-full h-full"
                  src={videoUrl}
                  title="Wedding Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
