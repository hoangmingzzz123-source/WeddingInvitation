import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MapPin, Calendar, Clock, Send, Home, QrCode, Copy, Check, Heart, Crown, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function ArtDecoRoyalEnhanced() {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const loveStory = `Trong ánh vàng rực rỡ của Art Deco, chúng tôi tìm thấy nhau. Tình yêu của chúng tôi là sự kết hợp hoàn hảo giữa sự thanh lịch cổ điển và đam mê hiện đại. Như những đường nét geometric sang trọng, tình yêu của chúng tôi được xây dựng với sự chính xác và vẻ đẹp vượt thời gian. Hôm nay, chúng tôi viết nên chương mới trong câu chuyện hoàng gia của riêng mình.`;

  // Typewriter effect
  useEffect(() => {
    if (currentPage === 1 && isTyping) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= loveStory.length) {
          setDisplayedText(loveStory.slice(0, index));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    } else if (currentPage !== 1) {
      setDisplayedText('');
      setIsTyping(true);
    }
  }, [currentPage, isTyping]);

  // Art Deco Geometric Particles
  const geometricShapes = Array(25).fill(0).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: 30 + Math.random() * 60,
    shape: ['diamond', 'circle', 'triangle', 'hexagon'][Math.floor(Math.random() * 4)],
  }));

  // Gold Ripple Effect
  const ripples = Array(5).fill(0).map((_, i) => ({
    id: i,
    delay: i * 0.8,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#1A1A2E]">
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} />

      {/* Art Deco Pattern Background */}
      <div className="fixed inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="art-deco-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Diamond */}
              <polygon points="50,10 70,30 50,50 30,30" fill="#C29B43" opacity="0.5" />
              {/* Circle */}
              <circle cx="15" cy="15" r="8" fill="#FFD700" opacity="0.3" />
              {/* Rectangle */}
              <rect x="70" y="70" width="20" height="20" fill="#C29B43" opacity="0.4" />
              {/* Lines */}
              <line x1="0" y1="50" x2="100" y2="50" stroke="#FFD700" strokeWidth="0.5" opacity="0.3" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#FFD700" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#art-deco-pattern)" />
        </svg>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {geometricShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{ left: shape.left, top: shape.top }}
            animate={{
              y: ['0vh', '120vh'],
              rotate: [0, 360],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {shape.shape === 'diamond' && (
              <svg width={shape.size} height={shape.size} viewBox="0 0 50 50">
                <polygon points="25,5 45,25 25,45 5,25" fill="#C29B43" opacity="0.6" />
              </svg>
            )}
            {shape.shape === 'circle' && (
              <svg width={shape.size} height={shape.size} viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="#FFD700" opacity="0.5" />
              </svg>
            )}
            {shape.shape === 'triangle' && (
              <svg width={shape.size} height={shape.size} viewBox="0 0 50 50">
                <polygon points="25,5 45,45 5,45" fill="#C29B43" opacity="0.6" />
              </svg>
            )}
            {shape.shape === 'hexagon' && (
              <svg width={shape.size} height={shape.size} viewBox="0 0 50 50">
                <polygon points="25,2 45,15 45,35 25,48 5,35 5,15" fill="#FFD700" opacity="0.5" />
              </svg>
            )}
          </motion.div>
        ))}
      </div>

      {/* Gold Ripple Pulse */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute w-32 h-32 border-2 border-[#C29B43] rounded-full"
            animate={{
              scale: [1, 3],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 4,
              delay: ripple.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <Button
        onClick={() => window.location.hash = '#/'}
        className="fixed top-8 left-8 z-50 bg-[#C29B43] hover:bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700] shadow-2xl transition-all hover:scale-105"
      >
        <Home className="w-4 h-4 mr-2" />
        Trang Chủ
      </Button>

      {/* Page Indicator */}
      <div className="fixed top-8 right-8 z-50 flex gap-3 bg-[#0A0A0A]/80 backdrop-blur-md px-6 py-4 rounded-full border-2 border-[#C29B43] shadow-2xl">
        {['Cover', 'Story', 'Gallery', 'Details', 'Map', 'RSVP', 'QR'].map((label, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentPage(index);
              if (index === 1) {
                setDisplayedText('');
                setIsTyping(true);
              }
            }}
            className={`transition-all duration-500 ${
              currentPage === index 
                ? 'w-10 h-3 bg-gradient-to-r from-[#C29B43] to-[#FFD700] rounded-full shadow-lg shadow-[#FFD700]/50' 
                : 'w-6 h-3 bg-[#C29B43]/40 rounded-full hover:bg-[#C29B43]/60'
            }`}
            title={label}
          />
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen"
        >
          {currentPage === 0 && <CoverPage onNext={() => setCurrentPage(1)} />}
          {currentPage === 1 && <StoryPage displayedText={displayedText} onNext={() => setCurrentPage(2)} />}
          {currentPage === 2 && <GalleryPage onNext={() => setCurrentPage(3)} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
          {currentPage === 3 && <DetailsPage onNext={() => setCurrentPage(4)} />}
          {currentPage === 4 && <MapPage onNext={() => setCurrentPage(5)} />}
          {currentPage === 5 && <RSVPPage submitted={rsvpSubmitted} setSubmitted={setRsvpSubmitted} onNext={() => setCurrentPage(6)} />}
          {currentPage === 6 && <QRCodePage copied={copied} setCopied={setCopied} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Cover Page
function CoverPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-8 relative">
      {/* Art Deco Corner Decorations */}
      <div className="absolute top-12 left-12">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <polygon points="0,0 120,0 0,120" fill="none" stroke="#C29B43" strokeWidth="2" />
          <polygon points="10,10 100,10 10,100" fill="none" stroke="#FFD700" strokeWidth="1" />
          <circle cx="30" cy="30" r="5" fill="#C29B43" />
          <circle cx="50" cy="50" r="5" fill="#FFD700" />
        </svg>
      </div>
      <div className="absolute top-12 right-12 rotate-90">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <polygon points="0,0 120,0 0,120" fill="none" stroke="#C29B43" strokeWidth="2" />
          <polygon points="10,10 100,10 10,100" fill="none" stroke="#FFD700" strokeWidth="1" />
          <circle cx="30" cy="30" r="5" fill="#C29B43" />
          <circle cx="50" cy="50" r="5" fill="#FFD700" />
        </svg>
      </div>
      <div className="absolute bottom-12 left-12 -rotate-90">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <polygon points="0,0 120,0 0,120" fill="none" stroke="#C29B43" strokeWidth="2" />
          <polygon points="10,10 100,10 10,100" fill="none" stroke="#FFD700" strokeWidth="1" />
          <circle cx="30" cy="30" r="5" fill="#C29B43" />
          <circle cx="50" cy="50" r="5" fill="#FFD700" />
        </svg>
      </div>
      <div className="absolute bottom-12 right-12 rotate-180">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <polygon points="0,0 120,0 0,120" fill="none" stroke="#C29B43" strokeWidth="2" />
          <polygon points="10,10 100,10 10,100" fill="none" stroke="#FFD700" strokeWidth="1" />
          <circle cx="30" cy="30" r="5" fill="#C29B43" />
          <circle cx="50" cy="50" r="5" fill="#FFD700" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-16 max-w-5xl">
        {/* Crown Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, type: "spring" }}
          className="flex justify-center"
        >
          <div className="relative">
            <Crown className="w-28 h-28 text-[#FFD700]" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Crown className="w-28 h-28 text-[#C29B43]" strokeWidth={1} />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="space-y-10"
        >
          <p 
            className="text-sm tracking-[0.8em] text-[#C29B43] uppercase font-light"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            Royal Wedding Invitation
          </p>

          <div className="relative">
            {/* Art Deco Frame */}
            <div className="absolute -inset-8 border-2 border-[#C29B43]/30 rounded-lg" />
            <div className="absolute -inset-12 border border-[#FFD700]/20 rounded-lg" />
            
            <h1 
              className="text-8xl md:text-9xl font-light text-[#FFD700] tracking-tight"
              style={{ 
                fontFamily: '"Playfair Display", serif',
                textShadow: '0 0 40px rgba(194, 155, 67, 0.5)',
              }}
            >
              Trung & Linh
            </h1>
          </div>

          <div className="flex items-center justify-center gap-8">
            <svg width="80" height="2">
              <line x1="0" y1="1" x2="80" y2="1" stroke="#C29B43" strokeWidth="2" />
            </svg>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <svg width="40" height="40" viewBox="0 0 50 50">
                <polygon points="25,5 45,25 25,45 5,25" fill="#FFD700" />
              </svg>
            </motion.div>
            <svg width="80" height="2">
              <line x1="0" y1="1" x2="80" y2="1" stroke="#C29B43" strokeWidth="2" />
            </svg>
          </div>

          <p className="text-4xl text-[#C29B43] font-light" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            20 • 04 • 2025
          </p>
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Button
            onClick={onNext}
            className="group px-16 py-8 bg-[#C29B43] hover:bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700] text-lg font-bold shadow-2xl transition-all hover:scale-110"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            <span>Enter Royal Story</span>
            <motion.span
              className="inline-block ml-3"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Crown className="w-5 h-5" />
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Story Page
function StoryPage({ displayedText, onNext }: { displayedText: string; onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-24">
      <div className="max-w-5xl space-y-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8"
        >
          <Crown className="w-20 h-20 mx-auto text-[#FFD700]" />
          <h2 
            className="text-7xl md:text-8xl text-[#FFD700] font-light"
            style={{ 
              fontFamily: '"Playfair Display", serif',
              textShadow: '0 0 20px rgba(194, 155, 67, 0.3)',
            }}
          >
            Our Royal Journey
          </h2>
          <div className="flex items-center justify-center gap-6">
            <svg width="60" height="2">
              <line x1="0" y1="1" x2="60" y2="1" stroke="#C29B43" strokeWidth="2" />
            </svg>
            <Heart className="w-6 h-6 text-[#C29B43]" />
            <svg width="60" height="2">
              <line x1="0" y1="1" x2="60" y2="1" stroke="#C29B43" strokeWidth="2" />
            </svg>
          </div>
        </motion.div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative bg-[#0A0A0A]/60 backdrop-blur-lg p-16 md:p-24 border-2 border-[#C29B43] rounded-none shadow-2xl"
        >
          {/* Art Deco Corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#FFD700]" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#FFD700]" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#FFD700]" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#FFD700]" />

          <p 
            className="text-3xl md:text-4xl text-[#C29B43] leading-relaxed text-center"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-[#FFD700]"
            >
              |
            </motion.span>
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid md:grid-cols-4 gap-10"
        >
          {[
            { year: '2019', event: 'First Meet', icon: '✨' },
            { year: '2021', event: 'In Love', icon: '💛' },
            { year: '2024', event: 'Engaged', icon: '💍' },
            { year: '2025', event: 'Wedding', icon: '👑' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.5 + index * 0.15 }}
              className="relative bg-[#0A0A0A]/60 backdrop-blur-md p-10 border-2 border-[#C29B43] hover:border-[#FFD700] transition-all text-center group"
            >
              {/* Diamond corner decoration */}
              <div className="absolute -top-3 -left-3">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <polygon points="10,0 20,10 10,20 0,10" fill="#FFD700" />
                </svg>
              </div>
              
              <div className="text-6xl mb-6">{item.icon}</div>
              <p className="text-5xl font-light text-[#FFD700] mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                {item.year}
              </p>
              <p className="text-xl text-[#C29B43] uppercase tracking-wider" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                {item.event}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-center pt-10"
        >
          <Button
            onClick={onNext}
            className="px-14 py-7 bg-[#C29B43] hover:bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700] shadow-2xl hover:scale-105 transition-all"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>View Gallery</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Gallery Page
function GalleryPage({ onNext, selectedImage, setSelectedImage }: { 
  onNext: () => void; 
  selectedImage: number | null; 
  setSelectedImage: (index: number | null) => void;
}) {
  const images = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
    'https://images.unsplash.com/photo-1525258441167-d6ced3f01c95?w=800',
  ];

  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8"
        >
          <Crown className="w-20 h-20 mx-auto text-[#FFD700]" />
          <h2 
            className="text-7xl md:text-8xl text-[#FFD700] font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Royal Gallery
          </h2>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden cursor-pointer border-4 border-[#C29B43] hover:border-[#FFD700] transition-all shadow-2xl"
              onClick={() => setSelectedImage(index)}
            >
              <ImageWithFallback
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Art Deco Frame Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                >
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <polygon points="40,10 70,40 40,70 10,40" fill="none" stroke="#FFD700" strokeWidth="3" />
                    <polygon points="40,20 60,40 40,60 20,40" fill="none" stroke="#C29B43" strokeWidth="2" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-8"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, rotateY: -90 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ scale: 0.8, rotateY: 90 }}
                className="relative max-w-5xl max-h-[90vh] border-8 border-[#C29B43] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={`Gallery ${selectedImage + 1}`}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-16 h-16 bg-[#FFD700] hover:bg-[#C29B43] text-[#1A1A2E] flex items-center justify-center text-4xl font-bold transition-all shadow-2xl"
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center pt-10"
        >
          <Button
            onClick={onNext}
            className="px-14 py-7 bg-[#C29B43] hover:bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700] shadow-2xl hover:scale-105 transition-all"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Event Details</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Details, Map, RSVP, QR Code pages...
// (Tiếp tục với pattern tương tự)

function DetailsPage({ onNext }: { onNext: () => void }) {
  const events = [
    {
      icon: '🏛️',
      title: 'Royal Ceremony',
      time: '10:00 AM',
      date: '20/04/2025',
      location: 'Grand Cathedral',
      address: '456 Art Deco Boulevard, District 1, HCMC',
    },
    {
      icon: '👑',
      title: 'Wedding Reception',
      time: '18:00 PM',
      date: '20/04/2025',
      location: 'Royal Palace Hotel',
      address: '789 Golden Street, District 1, HCMC',
    },
  ];

  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-5xl mx-auto space-y-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8"
        >
          <Calendar className="w-20 h-20 mx-auto text-[#FFD700]" />
          <h2 className="text-7xl md:text-8xl text-[#FFD700] font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
            Event Schedule
          </h2>
        </motion.div>

        <div className="space-y-10">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-[#0A0A0A]/60 backdrop-blur-lg p-14 md:p-16 border-4 border-[#C29B43] hover:border-[#FFD700] transition-all relative"
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#FFD700]" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#FFD700]" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#FFD700]" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#FFD700]" />

              <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
                <div className="text-7xl">{event.icon}</div>
                <div className="flex-1 space-y-5">
                  <h3 className="text-4xl text-[#FFD700] font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {event.title}
                  </h3>
                  <div className="space-y-3 text-[#C29B43]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    <div className="flex items-center gap-4 text-lg">
                      <Clock className="w-6 h-6" />
                      <span>{event.time} • {event.date}</span>
                    </div>
                    <div className="flex items-start gap-4 text-lg">
                      <MapPin className="w-6 h-6 mt-1" />
                      <div>
                        <p className="font-semibold">{event.location}</p>
                        <p className="text-base">{event.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center pt-10"
        >
          <Button
            onClick={onNext}
            className="px-14 py-7 bg-[#C29B43] hover:bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700] shadow-2xl hover:scale-105 transition-all"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>View Map</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function MapPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-6xl mx-auto space-y-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8"
        >
          <MapPin className="w-20 h-20 mx-auto text-[#FFD700]" />
          <h2 className="text-7xl md:text-8xl text-[#FFD700] font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
            Location
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-[#0A0A0A]/60 backdrop-blur-lg p-10 border-4 border-[#C29B43]"
        >
          <div className="aspect-video overflow-hidden border-4 border-[#FFD700]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193500236194!2d106.6918029!3d10.7870943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2e9cd7861%3A0xedce370ff1fd83c3!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="mt-10 text-center space-y-5">
            <h3 className="text-4xl text-[#FFD700] font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
              Royal Palace Hotel
            </h3>
            <p className="text-xl text-[#C29B43]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              789 Golden Street, District 1, Ho Chi Minh City
            </p>
            <Button
              onClick={() => window.open('https://maps.google.com', '_blank')}
              className="mt-8 px-12 py-5 bg-[#C29B43] hover:bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700] shadow-xl"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Open in Google Maps
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center"
        >
          <Button
            onClick={onNext}
            className="px-14 py-7 bg-[#C29B43] hover:bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700] shadow-2xl hover:scale-105 transition-all"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>RSVP Now</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function RSVPPage({ submitted, setSubmitted, onNext }: { 
  submitted: boolean; 
  setSubmitted: (value: boolean) => void;
  onNext: () => void;
}) {
  const [formData, setFormData] = useState({ name: '', guests: '1', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-3xl mx-auto space-y-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8"
        >
          <Heart className="w-20 h-20 mx-auto text-[#FFD700]" />
          <h2 className="text-7xl md:text-8xl text-[#FFD700] font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
            RSVP
          </h2>
        </motion.div>

        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative bg-[#0A0A0A]/60 backdrop-blur-lg p-16 md:p-20 border-4 border-[#C29B43]"
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#FFD700]" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#FFD700]" />

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-4">
                <label className="text-sm text-[#C29B43] uppercase tracking-[0.3em]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  Full Name *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-5 text-xl bg-[#1A1A2E] border-2 border-[#C29B43] focus:border-[#FFD700] text-[#C29B43]"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm text-[#C29B43] uppercase tracking-[0.3em]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  Number of Guests *
                </label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="p-5 text-xl bg-[#1A1A2E] border-2 border-[#C29B43] focus:border-[#FFD700] text-[#C29B43]"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm text-[#C29B43] uppercase tracking-[0.3em]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  Message
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="p-5 text-xl bg-[#1A1A2E] border-2 border-[#C29B43] focus:border-[#FFD700] text-[#C29B43] min-h-40"
                  placeholder="Send your wishes to the couple..."
                />
              </div>

              <Button
                type="submit"
                className="w-full py-7 text-xl bg-[#C29B43] hover:bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700] shadow-2xl"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit RSVP
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-[#0A0A0A]/60 backdrop-blur-lg p-20 text-center space-y-10 border-4 border-[#C29B43]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="w-36 h-36 mx-auto bg-[#C29B43] flex items-center justify-center"
            >
              <Check className="w-20 h-20 text-[#1A1A2E]" strokeWidth={3} />
            </motion.div>

            <div className="space-y-6">
              <h3 className="text-5xl text-[#FFD700] font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
                Thank You!
              </h3>
              <p className="text-2xl text-[#C29B43]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                We're honored by your confirmation. <br />
                See you at the royal celebration!
              </p>
            </div>

            <Button
              onClick={onNext}
              className="px-14 py-7 bg-[#C29B43] hover:bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700] shadow-2xl"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function QRCodePage({ copied, setCopied }: { copied: boolean; setCopied: (value: boolean) => void }) {
  const invitationUrl = 'https://wedding-invitation.example.com/trung-linh';

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-3xl mx-auto space-y-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8"
        >
          <QrCode className="w-20 h-20 mx-auto text-[#FFD700]" />
          <h2 className="text-7xl md:text-8xl text-[#FFD700] font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
            Share
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-[#0A0A0A]/60 backdrop-blur-lg p-20 text-center space-y-10 border-4 border-[#C29B43]"
        >
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="inline-block p-10 bg-white"
          >
            <div className="w-72 h-72 bg-gradient-to-br from-[#C29B43] to-[#FFD700] flex items-center justify-center">
              <QrCode className="w-56 h-56 text-[#1A1A2E]" strokeWidth={1} />
            </div>
          </motion.div>

          <div className="space-y-8">
            <p className="text-2xl text-[#C29B43]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              Scan QR Code to View Invitation
            </p>

            <div className="bg-[#1A1A2E] p-8 border-2 border-[#C29B43]">
              <p className="text-sm text-[#C29B43] font-mono break-all">
                {invitationUrl}
              </p>
            </div>

            <Button
              onClick={handleCopy}
              className="px-12 py-5 bg-[#C29B43] hover:bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700] shadow-xl"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-10 border-t-2 border-[#C29B43] space-y-6"
          >
            <Crown className="w-16 h-16 mx-auto text-[#FFD700]" />
            <p className="text-3xl text-[#FFD700] font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
              With Royal Regards
            </p>
            <p className="text-lg text-[#C29B43]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              Your presence is the greatest gift
            </p>
          </motion.div>

          <Button
            onClick={() => window.location.hash = '#/'}
            className="px-12 py-5 bg-[#1A1A2E] hover:bg-[#C29B43] text-[#FFD700] border-2 border-[#C29B43] shadow-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
