import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Sun, MapPin, Heart, Camera, ChevronLeft, ChevronRight, Palmtree } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function TropicalSunset() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const pages = ['Cover', 'Story', 'Gallery', 'Details', 'RSVP'];

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Sunset colors palette
  const sunsetColors = [
    'rgba(255, 94, 77, 0.3)',    // Coral
    'rgba(255, 159, 64, 0.3)',   // Orange
    'rgba(255, 205, 86, 0.3)',   // Yellow
    'rgba(255, 140, 157, 0.25)', // Pink
    'rgba(156, 39, 176, 0.2)',   // Purple
  ];

  // Floating particles (palm leaves, flowers)
  const tropicalElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FFA07A] to-[#FFD93D] overflow-hidden relative">
      <MusicPlayer autoPlay={true} showVolumeControl={true} allowCustomMusic={true} />

      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gradient-to-br from-[#FF6B6B] to-[#FFD93D] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 1.5, type: "spring" }}
              className="relative"
            >
              <Sun className="w-32 h-32 text-white" />
              <motion.div
                className="absolute inset-0 blur-3xl opacity-60"
                style={{ background: 'radial-gradient(circle, #FFD93D, transparent)' }}
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tropical Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 217, 61, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255, 160, 122, 0.2) 0%, transparent 70%)
            `,
          }}
        />
      </div>

      {/* Floating Tropical Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {tropicalElements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute"
            style={{
              left: `${el.x}%`,
            }}
            initial={{
              y: -50,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              y: ['0vh', '110vh'],
              rotate: [0, 360],
              opacity: [0, 0.6, 0.6, 0],
              x: [0, Math.sin(el.id) * 50, 0],
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              delay: el.delay,
              ease: "linear",
            }}
          >
            {el.id % 3 === 0 ? (
              <Palmtree className="w-6 h-6 text-[#FF6B6B]/40" />
            ) : el.id % 3 === 1 ? (
              <div className="w-4 h-4 rounded-full bg-[#FFD93D]/40" />
            ) : (
              <Heart className="w-5 h-5 text-[#FFA07A]/40" fill="currentColor" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Sun Rays Effect */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 pointer-events-none opacity-30">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 right-0 w-2 h-full origin-top-right"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 217, 61, 0.4), transparent)',
              transform: `rotate(${i * 30}deg)`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="bg-white/90 hover:bg-[#FF6B6B] text-[#FF6B6B] hover:text-white border border-[#FF6B6B]/50 rounded-full px-4 py-2 shadow-lg transition-all backdrop-blur-sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Page Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-2 bg-white/90 backdrop-blur-md px-4 py-3 rounded-full shadow-xl border border-[#FF6B6B]/20">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentPage === i
                  ? 'bg-[#FF6B6B] w-8'
                  : 'bg-[#FFA07A]/40 hover:bg-[#FFA07A]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Arrow Navigation */}
      {currentPage > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1, x: -5 }}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF6B6B] hover:text-white transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      )}

      {currentPage < pages.length - 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1, x: 5 }}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF6B6B] hover:text-white transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      )}

      {/* Page Content with Sunset Theme */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          {currentPage === 0 && <CoverPage />}
          {currentPage === 1 && <StoryPage />}
          {currentPage === 2 && <GalleryPage />}
          {currentPage === 3 && <DetailsPage />}
          {currentPage === 4 && <RSVPPage />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Cover Page
function CoverPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
            <ImageWithFallback
              src="https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp"
              alt="Couple"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Sunset Glow Effect */}
          <div className="absolute -inset-8 bg-gradient-to-br from-[#FF6B6B]/30 via-[#FFA07A]/20 to-[#FFD93D]/30 rounded-full blur-3xl -z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8 text-center md:text-left"
        >
          <div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="w-24 h-1 bg-gradient-to-r from-[#FF6B6B] to-[#FFD93D] mb-6 mx-auto md:mx-0"
            />
            
            <h1 
              className="text-6xl md:text-7xl mb-4"
              style={{ 
                fontFamily: '"Playfair Display", serif',
                background: 'linear-gradient(135deg, #FF6B6B, #FFA07A, #FFD93D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Văn Minh
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-4 my-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#FF6B6B] to-transparent" />
              <Sun className="w-6 h-6 text-[#FFD93D]" />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#FF6B6B] to-transparent" />
            </div>

            <h1 
              className="text-6xl md:text-7xl"
              style={{ 
                fontFamily: '"Playfair Display", serif',
                background: 'linear-gradient(135deg, #FF6B6B, #FFA07A, #FFD93D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Thu Hương
            </h1>
          </div>

          <p className="text-xl text-[#8B4513] leading-relaxed">
            Như hoàng hôn nhiệt đới rực rỡ, tình yêu chúng tôi bừng cháy và đầy màu sắc. 
            Hãy cùng chúng tôi chứng kiến khoảnh khắc đặc biệt này.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 text-[#8B4513]">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF6B6B]">15</div>
              <div className="text-sm">Tháng 3</div>
            </div>
            <div className="text-5xl text-[#FFA07A]">•</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFD93D]">2025</div>
              <div className="text-sm">Năm</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Placeholder pages
function StoryPage() {
  return <div className="min-h-screen flex items-center justify-center"><h2 className="text-4xl text-white">Story Page</h2></div>;
}

function GalleryPage() {
  return <div className="min-h-screen flex items-center justify-center"><h2 className="text-4xl text-white">Gallery Page</h2></div>;
}

function DetailsPage() {
  return <div className="min-h-screen flex items-center justify-center"><h2 className="text-4xl text-white">Details Page</h2></div>;
}

function RSVPPage() {
  return <div className="min-h-screen flex items-center justify-center"><h2 className="text-4xl text-white">RSVP Page</h2></div>;
}
