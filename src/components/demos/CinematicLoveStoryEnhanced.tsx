import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Send, Home, QrCode, Copy, Check, Film, Play, Pause, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function CinematicLoveStoryEnhanced() {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  const loveStory = `Câu chuyện tình yêu của chúng tôi bắt đầu như một bộ phim điện ảnh - đầy cảm xúc, bất ngờ và lãng mạn. Từ ánh mắt đầu tiên gặp nhau đến những khoảnh khắc ngọt ngào bên nhau, mỗi giây phút đều là một khung hình đáng nhớ. Giờ đây, chúng tôi viết tiếp câu chuyện của mình với chương mới nhất - một đám cưới như mơ.`;

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
      }, 35);
      return () => clearInterval(interval);
    } else if (currentPage !== 1) {
      setDisplayedText('');
      setIsTyping(true);
    }
  }, [currentPage, isTyping]);

  // Film strip particles
  const filmStrips = Array(15).fill(0).map((_, i) => ({
    id: i,
    left: `${5 + (i * 6.5)}%`,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
  }));

  // Spotlight effects
  const spotlights = Array(6).fill(0).map((_, i) => ({
    id: i,
    left: `${i * 20}%`,
    delay: i * 2,
  }));

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} />

      {/* Film Grain Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-40 mix-blend-overlay"
       
      />

      {/* Animated Film Strips */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {filmStrips.map((strip) => (
          <motion.div
            key={strip.id}
            className="absolute top-0 w-1 h-screen opacity-10"
            style={{ left: strip.left }}
            animate={{
              scaleY: [0, 1, 1, 0],
              opacity: [0, 0.2, 0.2, 0],
            }}
            transition={{
              duration: strip.duration,
              delay: strip.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-transparent via-[#C29B43] to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Spotlight Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {spotlights.map((spot) => (
          <motion.div
            key={spot.id}
            className="absolute top-0 w-40 h-full opacity-5"
            style={{ left: spot.left }}
            animate={{
              opacity: [0, 0.15, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8,
              delay: spot.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-white via-[#C29B43]/50 to-transparent blur-3xl" />
          </motion.div>
        ))}
      </div>

      {/* Back Button */}
      <Button
        onClick={() => window.location.hash = '#/'}
        className="fixed top-8 left-8 z-50 bg-black/80 hover:bg-black/90 text-white border border-[#C29B43]/30 backdrop-blur-md shadow-2xl transition-all hover:border-[#C29B43]"
      >
        <Home className="w-4 h-4 mr-2" />
        Trang Chủ
      </Button>

      {/* Cinematic Page Indicator */}
      <div className="fixed top-8 right-8 z-50 flex gap-3 bg-black/80 backdrop-blur-md px-5 py-4 rounded-full border border-[#C29B43]/30 shadow-2xl">
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
                ? 'w-10 h-1.5 bg-gradient-to-r from-[#C29B43] to-[#FFD700] shadow-lg shadow-[#C29B43]/50' 
                : 'w-6 h-1.5 bg-white/20 hover:bg-white/40'
            }`}
            title={label}
          />
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen"
        >
          {currentPage === 0 && <CoverPage onNext={() => setCurrentPage(1)} scaleProgress={scaleProgress} opacityProgress={opacityProgress} />}
          {currentPage === 1 && <StoryPage displayedText={displayedText} onNext={() => setCurrentPage(2)} currentChapter={currentChapter} setCurrentChapter={setCurrentChapter} />}
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

// Cover Page - Cinematic Opening
function CoverPage({ onNext, scaleProgress, opacityProgress }: { onNext: () => void; scaleProgress: any; opacityProgress: any }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Cinematic Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ scale: scaleProgress }}
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920"
          alt="Cinematic Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
      </motion.div>

      {/* Cinematic Bars (Letterbox) */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black z-30" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black z-30" />

      {/* Content */}
      <div className="relative z-20 text-center px-8 space-y-12 max-w-5xl">
        {/* Film Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="relative">
            <Film className="w-20 h-20 text-[#C29B43]" />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-20 h-20 text-[#FFD700] opacity-50" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="space-y-6"
        >
          <motion.p 
            className="text-sm tracking-[0.5em] text-[#C29B43] uppercase"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            A Cinematic Love Story
          </motion.p>

          <h1 
            className="text-7xl md:text-9xl font-light text-white tracking-tight"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Minh <span className="text-[#C29B43]">&</span> Hương
          </h1>

          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#C29B43]" />
            <p className="text-2xl text-[#FFD700]" style={{ fontFamily: '"Crimson Text", serif' }}>
              15 • 03 • 2025
            </p>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#C29B43]" />
          </div>
        </motion.div>

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Button
            onClick={onNext}
            className="group px-12 py-7 bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#FFD700] hover:to-[#C29B43] text-black font-bold text-lg shadow-2xl shadow-[#C29B43]/50 border-0 transition-all hover:scale-110"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            <Play className="w-6 h-6 mr-3 group-hover:animate-pulse" />
            <span>Play Our Story</span>
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/50"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
              <motion.div 
                className="w-1.5 h-1.5 bg-white/50 rounded-full mx-auto"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Story Page - Timeline Chapters
function StoryPage({ displayedText, onNext, currentChapter, setCurrentChapter }: { 
  displayedText: string; 
  onNext: () => void;
  currentChapter: number;
  setCurrentChapter: (index: number) => void;
}) {
  const chapters = [
    {
      year: '2019',
      title: 'Chương I: Gặp Gỡ',
      scene: 'Quán Cà Phê Nhỏ',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    },
    {
      year: '2021',
      title: 'Chương II: Yêu Nhau',
      scene: 'Dưới Ánh Trăng',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
    },
    {
      year: '2023',
      title: 'Chương III: Đính Hôn',
      scene: 'Bên Gia Đình',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
    },
    {
      year: '2025',
      title: 'Chương IV: Kết Hôn',
      scene: 'Happily Ever After',
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800',
    },
  ];

  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <Film className="w-16 h-16 mx-auto text-[#C29B43]" />
          <h2 
            className="text-6xl md:text-7xl text-white font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Our Story
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C29B43]" />
            <Heart className="w-5 h-5 text-[#FFD700]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C29B43]" />
          </div>
        </motion.div>

        {/* Story Text with Typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative bg-black/60 backdrop-blur-md p-12 md:p-16 border border-[#C29B43]/30 shadow-2xl"
        >
          {/* Film Frame Corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C29B43]" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#C29B43]" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#C29B43]" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C29B43]" />

          <p 
            className="text-2xl md:text-3xl text-white/90 leading-relaxed text-center"
            style={{ fontFamily: '"Crimson Text", serif' }}
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-[#C29B43]"
            >
              |
            </motion.span>
          </p>
        </motion.div>

        {/* Timeline Chapters */}
        <div className="grid md:grid-cols-4 gap-6">
          {chapters.map((chapter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 + index * 0.15 }}
              className={`group cursor-pointer relative overflow-hidden border-2 transition-all duration-500 ${
                currentChapter === index 
                  ? 'border-[#C29B43] shadow-lg shadow-[#C29B43]/50' 
                  : 'border-white/10 hover:border-[#C29B43]/50'
              }`}
              onClick={() => setCurrentChapter(index)}
            >
              {/* Chapter Image */}
              <div className="aspect-[3/4] relative overflow-hidden">
                <ImageWithFallback
                  src={chapter.image}
                  alt={chapter.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Chapter Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <p 
                    className="text-4xl font-light text-[#FFD700]"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {chapter.year}
                  </p>
                  <h3 
                    className="text-lg text-white font-semibold"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                  >
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-white/70" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    {chapter.scene}
                  </p>
                </div>
              </div>

              {/* Film Perforations */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-2 right-2 h-2 flex justify-between">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="w-1 h-full bg-[#C29B43] opacity-20" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-center pt-8"
        >
          <Button
            onClick={onNext}
            className="px-12 py-6 bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#FFD700] hover:to-[#C29B43] text-black font-bold shadow-2xl transition-all hover:scale-105"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>View Gallery</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Gallery Page - Cinematic Grid
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
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <Film className="w-16 h-16 mx-auto text-[#C29B43]" />
          <h2 
            className="text-6xl md:text-7xl text-white font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Behind The Scenes
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C29B43]" />
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C29B43]" />
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-[4/5] overflow-hidden cursor-pointer border-2 border-white/10 hover:border-[#C29B43] transition-all duration-500"
              onClick={() => setSelectedImage(index)}
            >
              <ImageWithFallback
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Film Frame Number */}
              <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 border border-[#C29B43]/50">
                <p className="text-[#FFD700] text-sm font-mono">
                  {String(index + 1).padStart(2, '0')}
                </p>
              </div>

              {/* Play Icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                whileHover={{ scale: 1.2 }}
              >
                <div className="w-16 h-16 rounded-full bg-[#C29B43]/90 flex items-center justify-center">
                  <Play className="w-8 h-8 text-black ml-1" />
                </div>
              </motion.div>
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
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-6xl max-h-[90vh] border-4 border-[#C29B43]"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={`Gallery ${selectedImage + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-12 h-12 bg-[#C29B43] hover:bg-[#FFD700] text-black flex items-center justify-center text-2xl font-bold transition-all"
                >
                  ×
                </button>

                {/* Navigation */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((selectedImage - 1 + images.length) % images.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/80 hover:bg-[#C29B43] text-white flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((selectedImage + 1) % images.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/80 hover:bg-[#C29B43] text-white flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Frame Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-2 border border-[#C29B43]/50">
                  <p className="text-[#FFD700] font-mono">
                    Frame {String(selectedImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center pt-8"
        >
          <Button
            onClick={onNext}
            className="px-12 py-6 bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#FFD700] hover:to-[#C29B43] text-black font-bold shadow-2xl transition-all hover:scale-105"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>View Schedule</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Details Page - Event Schedule
function DetailsPage({ onNext }: { onNext: () => void }) {
  const events = [
    {
      icon: '🏠',
      title: 'Lễ Gia Tiên',
      time: '07:00 AM',
      date: 'Thứ 7, 15/03/2025',
      location: 'Tư Gia Nhà Gái',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      color: 'from-[#C29B43] to-[#FFD700]',
    },
    {
      icon: '💒',
      title: 'Lễ Thành Hôn',
      time: '11:00 AM',
      date: 'Thứ 7, 15/03/2025',
      location: 'Nhà Thờ Đức Bà',
      address: '01 Công xã Paris, Quận 1, TP.HCM',
      color: 'from-[#FFD700] to-[#C29B43]',
    },
    {
      icon: '🎉',
      title: 'Tiệc Cưới',
      time: '18:00 PM',
      date: 'Thứ 7, 15/03/2025',
      location: 'Grand Palace Hotel',
      address: '789 Lê Lợi, Quận 1, TP.HCM',
      color: 'from-[#C29B43] to-[#FFD700]',
    },
  ];

  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <Calendar className="w-16 h-16 mx-auto text-[#C29B43]" />
          <h2 
            className="text-6xl md:text-7xl text-white font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Schedule
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C29B43]" />
            <Clock className="w-5 h-5 text-[#FFD700]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C29B43]" />
          </div>
        </motion.div>

        {/* Events */}
        <div className="space-y-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative bg-black/60 backdrop-blur-md p-8 md:p-12 border-2 border-white/10 hover:border-[#C29B43] transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center text-5xl shadow-lg shadow-[#C29B43]/50`}
                >
                  {event.icon}
                </motion.div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h3 
                    className="text-3xl md:text-4xl text-white font-light"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-white/70" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#C29B43]" />
                      <span className="text-lg">{event.time}</span>
                      <span className="text-lg">•</span>
                      <span className="text-lg">{event.date}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#C29B43] mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-lg font-semibold text-white">{event.location}</p>
                        <p className="text-sm">{event.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Film Perforations */}
              <div className="absolute top-4 left-4 right-4 h-2 flex justify-between opacity-20">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="w-1 h-full bg-[#C29B43]" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center pt-8"
        >
          <Button
            onClick={onNext}
            className="px-12 py-6 bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#FFD700] hover:to-[#C29B43] text-black font-bold shadow-2xl transition-all hover:scale-105"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>View Location</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Map Page
function MapPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <MapPin className="w-16 h-16 mx-auto text-[#C29B43]" />
          <h2 
            className="text-6xl md:text-7xl text-white font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Location
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C29B43]" />
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C29B43]" />
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-black/60 backdrop-blur-md p-8 border-2 border-[#C29B43]/30"
        >
          <div className="aspect-video overflow-hidden border-2 border-[#C29B43]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193500236194!2d106.6918029!3d10.7870943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2e9cd7861%3A0xedce370ff1fd83c3!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="mt-8 text-center space-y-6">
            <h3 
              className="text-3xl text-white font-light"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Grand Palace Hotel
            </h3>
            <p className="text-lg text-white/70" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              789 Lê Lợi, Quận 1, TP. Hồ Chí Minh
            </p>
            <Button
              onClick={() => window.open('https://maps.google.com', '_blank')}
              className="px-10 py-4 bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#FFD700] hover:to-[#C29B43] text-black font-bold shadow-lg"
            >
              <MapPin className="w-4 h-4 mr-2" />
              <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Open in Google Maps</span>
            </Button>
          </div>
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center"
        >
          <Button
            onClick={onNext}
            className="px-12 py-6 bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#FFD700] hover:to-[#C29B43] text-black font-bold shadow-2xl transition-all hover:scale-105"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Confirm Attendance</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// RSVP Page
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
      <div className="max-w-3xl mx-auto space-y-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <Heart className="w-16 h-16 mx-auto text-[#C29B43]" />
          <h2 
            className="text-6xl md:text-7xl text-white font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            RSVP
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C29B43]" />
            <Send className="w-5 h-5 text-[#FFD700]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C29B43]" />
          </div>
        </motion.div>

        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-black/60 backdrop-blur-md p-12 md:p-16 border-2 border-[#C29B43]/30"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label 
                  className="text-sm text-white/70 uppercase tracking-wider"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Họ và Tên *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-4 text-lg bg-black/50 border-2 border-[#C29B43]/30 focus:border-[#C29B43] text-white"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              <div className="space-y-3">
                <label 
                  className="text-sm text-white/70 uppercase tracking-wider"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Số Lượng Khách *
                </label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="p-4 text-lg bg-black/50 border-2 border-[#C29B43]/30 focus:border-[#C29B43] text-white"
                />
              </div>

              <div className="space-y-3">
                <label 
                  className="text-sm text-white/70 uppercase tracking-wider"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Lời Nhắn
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="p-4 text-lg bg-black/50 border-2 border-[#C29B43]/30 focus:border-[#C29B43] text-white min-h-32"
                  placeholder="Gửi lời chúc đến cô dâu chú rể..."
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#FFD700] hover:to-[#C29B43] text-black font-bold shadow-2xl"
              >
                <Send className="w-5 h-5 mr-2" />
                <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Gửi Xác Nhận</span>
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-black/60 backdrop-blur-md p-16 text-center space-y-8 border-2 border-[#C29B43]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="w-32 h-32 mx-auto bg-gradient-to-br from-[#C29B43] to-[#FFD700] rounded-full flex items-center justify-center shadow-2xl shadow-[#C29B43]/50"
            >
              <Check className="w-16 h-16 text-black" strokeWidth={3} />
            </motion.div>

            <div className="space-y-4">
              <h3 
                className="text-4xl text-white font-light"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Thank You!
              </h3>
              <p className="text-xl text-white/70" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                Chúng tôi rất vui khi bạn xác nhận tham dự. <br />
                Hẹn gặp bạn trong ngày trọng đại!
              </p>
            </div>

            <Button
              onClick={onNext}
              className="px-12 py-6 bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#FFD700] hover:to-[#C29B43] text-black font-bold shadow-2xl"
            >
              <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Continue</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// QR Code Page - Final Scene
function QRCodePage({ copied, setCopied }: { copied: boolean; setCopied: (value: boolean) => void }) {
  const invitationUrl = 'https://wedding-invitation.example.com/minh-huong';

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-3xl mx-auto space-y-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <QrCode className="w-16 h-16 mx-auto text-[#C29B43]" />
          <h2 
            className="text-6xl md:text-7xl text-white font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Share
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C29B43]" />
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C29B43]" />
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-black/60 backdrop-blur-md p-16 text-center space-y-8 border-2 border-[#C29B43]/30"
        >
          {/* QR Code */}
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="inline-block p-8 bg-white border-4 border-[#C29B43]"
          >
            <div className="w-64 h-64 bg-gradient-to-br from-[#C29B43] to-[#FFD700] flex items-center justify-center">
              <QrCode className="w-48 h-48 text-black" strokeWidth={1} />
            </div>
          </motion.div>

          {/* Instructions */}
          <div className="space-y-6">
            <p 
              className="text-lg text-white/70"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              Quét mã QR để xem thiệp mời
            </p>

            {/* URL */}
            <div className="bg-black/50 p-6 border border-[#C29B43]/30">
              <p className="text-sm text-white/50 font-mono break-all">
                {invitationUrl}
              </p>
            </div>

            {/* Copy Button */}
            <Button
              onClick={handleCopy}
              className="px-10 py-4 bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#FFD700] hover:to-[#C29B43] text-black font-bold shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Copy Link</span>
                </>
              )}
            </Button>
          </div>

          {/* The End */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-8 border-t-2 border-[#C29B43]/30 space-y-4"
          >
            <p 
              className="text-5xl text-white font-light"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              The End
            </p>
            <p className="text-lg text-white/50" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              ... và bắt đầu của chúng tôi
            </p>
          </motion.div>

          {/* Back to Home */}
          <Button
            onClick={() => window.location.hash = '#/'}
            className="px-10 py-4 bg-black/80 hover:bg-black text-white border-2 border-[#C29B43] hover:border-[#FFD700] shadow-lg transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Back to Home</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
