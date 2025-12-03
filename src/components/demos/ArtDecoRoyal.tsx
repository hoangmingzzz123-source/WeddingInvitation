import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { MapPin, Calendar, Clock, Home, Gift } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function ArtDecoRoyal() {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = ['Cover', 'Details', 'Gallery', 'Map', 'RSVP'];

  // Handle swipe gestures
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    } else if (info.offset.x < -swipeThreshold && currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white overflow-hidden relative">
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={true} />

      {/* Art Deco Pattern Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="deco-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <motion.path
                d="M100,0 L120,40 L100,80 L80,40 Z"
                fill="none"
                stroke="#C29B43"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.circle
                cx="100"
                cy="100"
                r="30"
                fill="none"
                stroke="#FFD700"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
              />
              <motion.rect
                x="70"
                y="150"
                width="60"
                height="40"
                fill="none"
                stroke="#C29B43"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#deco-pattern)" />
        </svg>
      </div>

      {/* Gold Ripple Pulse */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-[#C29B43]"
            style={{
              width: 300,
              height: 300,
              marginLeft: -150,
              marginTop: -150,
            }}
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-white/10 hover:bg-[#C29B43] text-white border border-[#C29B43]/50 rounded-none px-6 py-2 shadow-lg backdrop-blur-sm transition-all"
        >
          <Home className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Corner Decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z"
            fill="#C29B43"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>
      <div className="fixed bottom-0 right-0 w-32 h-32 pointer-events-none z-10 rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z"
            fill="#C29B43"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Content with 3D Flip Transition */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="relative z-20"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeInOut",
              type: "spring",
              stiffness: 100
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {currentPage === 0 && <CoverPage />}
            {currentPage === 1 && <DetailsPage />}
            {currentPage === 2 && <GalleryPage />}
            {currentPage === 3 && <MapPage />}
            {currentPage === 4 && <RSVPPage />}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Page Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {pages.map((page, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentPage(i)}
            whileHover={{ scale: 1.2 }}
            className={`relative transition-all duration-300`}
          >
            <div className={`w-12 h-12 border-2 ${
              currentPage === i ? 'border-[#FFD700] bg-[#C29B43]' : 'border-[#C29B43] bg-transparent'
            } flex items-center justify-center`}>
              <span className="text-xs">{i + 1}</span>
            </div>
            {currentPage === i && (
              <motion.div
                layoutId="active-page"
                className="absolute inset-0 border-2 border-[#FFD700]"
                style={{ margin: -4 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function CoverPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-12 max-w-4xl mx-auto">
        {/* Art Deco Frame */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative inline-block"
        >
          <div className="absolute -inset-8 border-4 border-[#C29B43]" />
          <div className="absolute -inset-6 border border-[#FFD700]" />
          
          <div className="relative p-12 bg-[#1A1A2E]">
            <motion.h1 
              className="text-7xl md:text-8xl mb-6"
              style={{ 
                fontFamily: '"Playfair Display", serif',
                background: 'linear-gradient(135deg, #C29B43, #FFD700, #C29B43)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            >
              DAVID
            </motion.h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 bg-[#C29B43] my-6"
            />
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-3xl tracking-widest text-[#FFD700]"
            >
              & SOPHIA
            </motion.h2>
          </div>
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-2xl tracking-wider text-[#C29B43]"
        >
          25 • 12 • 2025
        </motion.div>
      </div>
    </section>
  );
}

function DetailsPage() {
  const details = [
    { icon: Calendar, label: 'Date', value: 'Saturday, December 25th, 2025' },
    { icon: Clock, label: 'Time', value: '6:00 PM - 10:00 PM' },
    { icon: MapPin, label: 'Venue', value: 'The Grand Ballroom, Royal Hotel' },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center mb-16 text-[#FFD700]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          EVENT DETAILS
        </motion.h2>

        <div className="space-y-8">
          {details.map((detail, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative"
            >
              {/* Deco line animation */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.2 + 0.3, duration: 0.6 }}
                className="absolute left-0 top-0 h-px bg-[#C29B43] w-full origin-left"
              />
              
              <div className="flex items-center gap-6 pt-6">
                <div className="w-16 h-16 border-2 border-[#C29B43] flex items-center justify-center">
                  <detail.icon className="w-8 h-8 text-[#FFD700]" />
                </div>
                <div>
                  <p className="text-[#C29B43] uppercase text-sm tracking-widest mb-1">{detail.label}</p>
                  <p className="text-white text-xl">{detail.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <Button className="bg-transparent border-2 border-[#C29B43] hover:bg-[#C29B43] text-[#FFD700] hover:text-white px-12 py-6 rounded-none transition-all">
            VIEW MAP
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function GalleryPage() {
  const images = [
    'https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp',
    'https://tuarts.net/wp-content/uploads/2015/12/117937145_4255715104503639_2707126124250519806_o.jpg'  ,
    'https://tuarts.net/wp-content/uploads/2020/05/60770796_2734489913292840_6737769278910496768_o-1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwtVDQB3iSQHP8hKhCyVCD1ictAV_LqN0YA&s',
    'https://demxanh.com/media/news/2810_studio-thai-binh-1.jpg' ,
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBiu-e-SK8GBBxhEhYa1XLBqDTlM91kAqe4Y5bL0VU_xoJSfbswLSloKC9NM8JbKhdCY&usqp=CAU',
    'https://tuarts.net/wp-content/uploads/2018/08/39900495_2187804601294710_8118125377903132672_o-801x1200.jpg'
  ];

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center mb-16 text-[#FFD700]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          OUR GALLERY
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 30px rgba(194, 155, 67, 0.5)'
              }}
              className="relative aspect-square group"
            >
              {/* Deco corners */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#C29B43] transition-all group-hover:w-12 group-hover:h-12" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#C29B43] transition-all group-hover:w-12 group-hover:h-12" />
              
              <div className="w-full h-full border border-[#FFD700]/30 overflow-hidden">
                <ImageWithFallback
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full"
      >
        <div className="relative p-12 bg-white/5 backdrop-blur-sm">
          {/* Deco frame */}
          <div className="absolute inset-0 border-4 border-[#C29B43]" />
          <div className="absolute inset-2 border border-[#FFD700]/50" />
          
          <div className="relative space-y-8">
            <h2 
              className="text-4xl text-center text-[#FFD700]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              MAP
            </h2>

            <p className="text-center text-white/70">
              Find us at The Grand Ballroom, Royal Hotel
            </p>

            <MapSection className="w-full h-96" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function RSVPPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full"
      >
        <div className="relative p-12 bg-white/5 backdrop-blur-sm">
          {/* Deco frame */}
          <div className="absolute inset-0 border-4 border-[#C29B43]" />
          <div className="absolute inset-2 border border-[#FFD700]/50" />
          
          <div className="relative space-y-8">
            <h2 
              className="text-4xl text-center text-[#FFD700]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              RSVP
            </h2>

            <p className="text-center text-white/70">
              Kindly respond by December 1st, 2025
            </p>

            <Button className="w-full bg-transparent border-2 border-[#C29B43] hover:bg-[#C29B43] text-[#FFD700] hover:text-white py-6 rounded-none transition-all">
              CONFIRM ATTENDANCE
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}