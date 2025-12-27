import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Heart, Calendar, MapPin, Clock, Send, Home, QrCode, Mail, Phone, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function BlushFloralEnhanced() {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const coupleNames = "Minh & Hương";
  const loveStory = `Chúng tôi gặp nhau vào một buổi chiều thu lãng mạn, khi những chiếc lá vàng rơi nhẹ nhàng như lời yêu thương đầu tiên. Từ ánh mắt đầu tiên, chúng tôi biết rằng đây là định mệnh. Năm tháng trôi qua, tình yêu của chúng tôi ngày càng bền chặt như những bông hoa đua nở. Giờ đây, chúng tôi vui mừng mời bạn đến chứng kiến hành trình tình yêu của chúng tôi nở rộ thành hiện thực.`;

  // Typewriter effect for love story
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

  // Enhanced floating petals with physics
  const petals = Array(25).fill(0).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 8,
    duration: 12 + Math.random() * 8,
    size: 8 + Math.random() * 12,
    color: i % 3 === 0 ? '#FFB6C1' : i % 3 === 1 ? '#FF69B4' : '#FFC0CB',
  }));

  // Butterfly animations
  const butterflies = Array(12).fill(0).map((_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE4E1 50%, #FFF0F5 100%)' }}>
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} />

      {/* Watercolor Gradient Overlay */}
      <motion.div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{ 
          y: backgroundY,
          background: 'radial-gradient(circle at 30% 40%, rgba(255, 182, 193, 0.4), transparent 60%), radial-gradient(circle at 70% 60%, rgba(255, 192, 203, 0.3), transparent 60%)'
        }}
      />

      {/* Enhanced Floating Rose Petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute -top-10"
            style={{ left: petal.left }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.sin(petal.id * 0.5) * 80, Math.cos(petal.id * 0.3) * 60, 0],
              rotate: [0, 180, 360, 540],
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.5, 1, 0.8, 0.5],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div 
              className="rounded-full blur-sm shadow-lg"
              style={{
                width: petal.size + 'px',
                height: petal.size + 'px',
                background: `radial-gradient(circle, ${petal.color}, transparent)`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Animated Butterflies */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {butterflies.map((butterfly) => (
          <motion.div
            key={butterfly.id}
            className="absolute"
            initial={{ x: `${butterfly.startX}vw`, y: `${butterfly.startY}vh` }}
            animate={{
              x: [
                `${butterfly.startX}vw`,
                `${(butterfly.startX + 30) % 100}vw`,
                `${(butterfly.startX + 60) % 100}vw`,
                `${butterfly.startX}vw`,
              ],
              y: [
                `${butterfly.startY}vh`,
                `${(butterfly.startY + 20) % 100}vh`,
                `${(butterfly.startY + 40) % 100}vh`,
                `${butterfly.startY}vh`,
              ],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: butterfly.duration,
              delay: butterfly.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" className="opacity-40">
              <path
                d="M16 8 C12 8, 8 12, 8 16 C8 12, 4 8, 0 8 C4 8, 8 4, 8 0 C8 4, 12 8, 16 8 Z"
                fill="#FF69B4"
                transform="translate(0, 8)"
              />
              <path
                d="M16 8 C20 8, 24 12, 24 16 C24 12, 28 8, 32 8 C28 8, 24 4, 24 0 C24 4, 20 8, 16 8 Z"
                fill="#FFB6C1"
                transform="translate(0, 8)"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Back Button */}
      <Button
        onClick={() => window.location.hash = '#/'}
        className="fixed top-6 left-6 z-50 bg-white/90 hover:bg-white text-[#FF69B4] border-2 border-[#FFB6C1] backdrop-blur-md shadow-lg transition-all hover:scale-105"
      >
        <Home className="w-4 h-4 mr-2" />
        Về Trang Chủ
      </Button>

      {/* Enhanced Page Indicator */}
      <div className="fixed top-6 right-6 z-50 flex gap-2 bg-white/80 backdrop-blur-md px-4 py-3 rounded-full shadow-lg">
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
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentPage === index 
                ? 'bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] w-8 shadow-md' 
                : 'bg-[#FFB6C1]/40 hover:bg-[#FFB6C1]/60'
            }`}
            title={label}
          />
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
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

// Enhanced Cover Page
function CoverPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Watercolor Floral Top Left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 0.5, scale: 1, rotate: -10 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-0 left-0 w-80 h-80"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <radialGradient id="floral1">
              <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF69B4" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="40" fill="url(#floral1)" />
          <circle cx="90" cy="80" r="35" fill="url(#floral1)" />
          <circle cx="70" cy="100" r="30" fill="url(#floral1)" />
        </svg>
      </motion.div>

      {/* Watercolor Floral Bottom Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
        animate={{ opacity: 0.5, scale: 1, rotate: 10 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
        className="absolute bottom-0 right-0 w-80 h-80"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <radialGradient id="floral2">
              <stop offset="0%" stopColor="#FFC0CB" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <circle cx="140" cy="140" r="45" fill="url(#floral2)" />
          <circle cx="110" cy="120" r="38" fill="url(#floral2)" />
          <circle cx="130" cy="100" r="32" fill="url(#floral2)" />
        </svg>
      </motion.div>

      {/* Center Content */}
      <div className="text-center space-y-10 max-w-3xl z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="space-y-6"
        >
          {/* Save The Date Label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="inline-block"
          >
            <div className="px-8 py-3 bg-white/60 backdrop-blur-sm rounded-full border-2 border-[#FFB6C1] shadow-lg">
              <p 
                className="text-sm tracking-[0.4em] text-[#FF69B4] uppercase font-bold"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
              >
                Save The Date
              </p>
            </div>
          </motion.div>

          {/* Couple Names */}
          <motion.h1 
            className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-[#FF69B4] via-[#FFB6C1] to-[#FF69B4] bg-clip-text text-transparent"
            style={{ fontFamily: '"Great Vibes", cursive' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            Minh & Hương
          </motion.h1>

          {/* Heart Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-16 h-16 mx-auto text-[#FF69B4] fill-[#FF69B4]" />
          </motion.div>
        </motion.div>

        {/* Wedding Date */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Calendar className="w-6 h-6 text-[#FF69B4]" />
            <p 
              className="text-2xl md:text-3xl text-[#C75B7A] font-medium"
              style={{ fontFamily: '"Libre Baskerville", serif' }}
            >
              15 • 02 • 2025
            </p>
          </div>

          <p 
            className="text-lg text-[#8B5A6B]/80"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Chúng tôi trân trọng mời bạn đến dự tiệc cưới
          </p>
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <Button
            onClick={onNext}
            className="group px-10 py-6 text-lg bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:from-[#FF1493] hover:to-[#FF69B4] text-white border-0 shadow-2xl transition-all hover:scale-110 hover:shadow-[#FF69B4]/50"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            <span>Xem Câu Chuyện Tình Yêu</span>
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Story Page with Typewriter Effect
function StoryPage({ displayedText, onNext }: { displayedText: string; onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl space-y-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 
            className="text-5xl md:text-6xl text-[#FF69B4] font-bold mb-4"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Câu Chuyện Tình Yêu
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#FFB6C1]" />
            <Sparkles className="w-6 h-6 text-[#FF69B4]" />
            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#FFB6C1]" />
          </div>
        </motion.div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-white/70 backdrop-blur-md p-10 md:p-16 rounded-3xl shadow-2xl border border-[#FFB6C1]/30"
        >
          <p 
            className="text-xl md:text-2xl text-[#8B5A6B] leading-relaxed text-center"
            style={{ fontFamily: '"Libre Baskerville", serif' }}
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-[#FF69B4]"
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
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { year: '2020', event: 'Gặp Gỡ Đầu Tiên', icon: '💕' },
            { year: '2022', event: 'Yêu Nhau Chính Thức', icon: '💑' },
            { year: '2025', event: 'Kết Hôn', icon: '💍' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.5 + index * 0.2 }}
              className="bg-gradient-to-br from-white/80 to-[#FFF0F5]/80 backdrop-blur-sm p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-[#FFB6C1]/20"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <p className="text-3xl font-bold text-[#FF69B4] mb-2" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                {item.year}
              </p>
              <p className="text-lg text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
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
          className="text-center"
        >
          <Button
            onClick={onNext}
            className="px-10 py-6 text-lg bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:from-[#FF1493] hover:to-[#FF69B4] text-white shadow-xl hover:scale-105 transition-all"
          >
            Xem Thư Viện Ảnh →
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Gallery Page with Lightbox
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
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 
            className="text-5xl md:text-6xl text-[#FF69B4] font-bold mb-4"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Khoảnh Khắc Hạnh Phúc
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#FFB6C1]" />
            <Heart className="w-6 h-6 text-[#FF69B4] fill-[#FF69B4]" />
            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#FFB6C1]" />
          </div>
        </motion.div>

        {/* Masonry Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`cursor-pointer group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all ${
                index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <ImageWithFallback
                src={src}
                alt={`Wedding photo ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FF69B4]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-semibold text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Xem Chi Tiết
                </p>
              </div>
              {/* Border Frame */}
              <div className="absolute inset-0 border-4 border-[#FFB6C1]/0 group-hover:border-[#FFB6C1]/60 transition-all duration-300 rounded-2xl" />
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
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-5xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={`Wedding photo ${selectedImage + 1}`}
                  className="w-full h-full object-contain rounded-lg shadow-2xl"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-2xl text-[#FF69B4] font-bold shadow-lg transition-all hover:scale-110"
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
          className="text-center pt-8"
        >
          <Button
            onClick={onNext}
            className="px-10 py-6 text-lg bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:from-[#FF1493] hover:to-[#FF69B4] text-white shadow-xl hover:scale-105 transition-all"
          >
            Xem Thông Tin Sự Kiện →
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Details Page
function DetailsPage({ onNext }: { onNext: () => void }) {
  const events = [
    {
      title: 'Lễ Vu Quy',
      time: '08:00 AM',
      date: '15/02/2025',
      location: 'Nhà Gái - 123 Đường Hoa Mai, Quận 5, TP.HCM',
      icon: '🏡',
      color: 'from-[#FFB6C1] to-[#FFC0CB]',
    },
    {
      title: 'Lễ Thành Hôn',
      time: '11:00 AM',
      date: '15/02/2025',
      location: 'Nhà Trai - 456 Đường Phú Lộc, Quận 7, TP.HCM',
      icon: '💒',
      color: 'from-[#FF69B4] to-[#FFB6C1]',
    },
    {
      title: 'Tiệc Cưới',
      time: '06:00 PM',
      date: '15/02/2025',
      location: 'Trung Tâm Tiệc Cưới Hoa Phượng, Quận 1, TP.HCM',
      icon: '🎊',
      color: 'from-[#FF1493] to-[#FF69B4]',
    },
  ];

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 
            className="text-5xl md:text-6xl text-[#FF69B4] font-bold mb-4"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Thông Tin Sự Kiện
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#FFB6C1]" />
            <Calendar className="w-6 h-6 text-[#FF69B4]" />
            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#FFB6C1]" />
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="space-y-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-[#FFB6C1]/30"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center text-5xl shadow-lg`}
                >
                  {event.icon}
                </motion.div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <h3 
                    className="text-3xl md:text-4xl font-bold text-[#FF69B4]"
                    style={{ fontFamily: '"Libre Baskerville", serif' }}
                  >
                    {event.title}
                  </h3>

                  <div className="space-y-3 text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <Clock className="w-5 h-5 text-[#FF69B4]" />
                      <span className="text-lg font-semibold">{event.time}</span>
                      <span className="text-lg">•</span>
                      <Calendar className="w-5 h-5 text-[#FF69B4]" />
                      <span className="text-lg font-semibold">{event.date}</span>
                    </div>

                    <div className="flex items-start justify-center md:justify-start gap-3">
                      <MapPin className="w-5 h-5 text-[#FF69B4] mt-1 flex-shrink-0" />
                      <span className="text-lg">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="bg-gradient-to-br from-white/70 to-[#FFF0F5]/70 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-[#FFB6C1]/30"
        >
          <h3 
            className="text-3xl font-bold text-[#FF69B4] mb-8 text-center"
            style={{ fontFamily: '"Libre Baskerville", serif' }}
          >
            Thông Tin Liên Hệ
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-xl font-semibold text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Nhà Trai
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#8B5A6B]">
                  <Phone className="w-5 h-5 text-[#FF69B4]" />
                  <span>0123 456 789</span>
                </div>
                <div className="flex items-center gap-3 text-[#8B5A6B]">
                  <Mail className="w-5 h-5 text-[#FF69B4]" />
                  <span>minh@example.com</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xl font-semibold text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Nhà Gái
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#8B5A6B]">
                  <Phone className="w-5 h-5 text-[#FF69B4]" />
                  <span>0987 654 321</span>
                </div>
                <div className="flex items-center gap-3 text-[#8B5A6B]">
                  <Mail className="w-5 h-5 text-[#FF69B4]" />
                  <span>huong@example.com</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center"
        >
          <Button
            onClick={onNext}
            className="px-10 py-6 text-lg bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:from-[#FF1493] hover:to-[#FF69B4] text-white shadow-xl hover:scale-105 transition-all"
          >
            Xem Bản Đồ →
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Map Page
function MapPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 
            className="text-5xl md:text-6xl text-[#FF69B4] font-bold mb-4"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Địa Điểm Tổ Chức
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#FFB6C1]" />
            <MapPin className="w-6 h-6 text-[#FF69B4]" />
            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#FFB6C1]" />
          </div>
        </motion.div>

        {/* Map Embed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-[#FFB6C1]/30"
        >
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193500236194!2d106.6918029!3d10.7870943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2e9cd7861%3A0xedce370ff1fd83c3!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="mt-8 space-y-6">
            <div className="text-center space-y-4">
              <h3 
                className="text-2xl font-bold text-[#FF69B4]"
                style={{ fontFamily: '"Libre Baskerville", serif' }}
              >
                Trung Tâm Tiệc Cưới Hoa Phượng
              </h3>
              <p className="text-lg text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh
              </p>
              <Button
                onClick={() => window.open('https://maps.google.com', '_blank')}
                className="bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:from-[#FF1493] hover:to-[#FF69B4] text-white px-8 py-4 shadow-lg hover:scale-105 transition-all"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Mở Trong Google Maps
              </Button>
            </div>
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
            className="px-10 py-6 text-lg bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:from-[#FF1493] hover:to-[#FF69B4] text-white shadow-xl hover:scale-105 transition-all"
          >
            Xác Nhận Tham Dự →
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
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 
            className="text-5xl md:text-6xl text-[#FF69B4] font-bold mb-4"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Xác Nhận Tham Dự
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#FFB6C1]" />
            <Heart className="w-6 h-6 text-[#FF69B4] fill-[#FF69B4]" />
            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#FFB6C1]" />
          </div>
        </motion.div>

        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-2xl border border-[#FFB6C1]/30"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-lg font-semibold text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Họ và Tên *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-4 text-lg border-2 border-[#FFB6C1] focus:border-[#FF69B4] rounded-xl"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              <div className="space-y-3">
                <label className="text-lg font-semibold text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Số Lượng Khách *
                </label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="p-4 text-lg border-2 border-[#FFB6C1] focus:border-[#FF69B4] rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <label className="text-lg font-semibold text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Lời Nhắn
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="p-4 text-lg border-2 border-[#FFB6C1] focus:border-[#FF69B4] rounded-xl min-h-32"
                  placeholder="Gửi lời chúc mừng đến cô dâu chú rể..."
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:from-[#FF1493] hover:to-[#FF69B4] text-white shadow-xl hover:scale-105 transition-all"
              >
                <Send className="w-5 h-5 mr-2" />
                Gửi Xác Nhận
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-white/90 to-[#FFF0F5]/90 backdrop-blur-md p-14 rounded-3xl shadow-2xl text-center space-y-8 border border-[#FFB6C1]/30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="w-32 h-32 mx-auto bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] rounded-full flex items-center justify-center shadow-xl"
            >
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </motion.div>

            <div className="space-y-4">
              <h3 
                className="text-4xl font-bold text-[#FF69B4]"
                style={{ fontFamily: '"Libre Baskerville", serif' }}
              >
                Cảm Ơn Bạn!
              </h3>
              <p className="text-xl text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Chúng tôi rất vui khi bạn xác nhận tham dự. <br />
                Hẹn gặp bạn tại tiệc cưới!
              </p>
            </div>

            <Button
              onClick={onNext}
              className="px-10 py-6 text-lg bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:from-[#FF1493] hover:to-[#FF69B4] text-white shadow-xl hover:scale-105 transition-all"
            >
              Xem Mã QR →
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// QR Code Page
function QRCodePage({ copied, setCopied }: { copied: boolean; setCopied: (value: boolean) => void }) {
  const invitationUrl = 'https://wedding-invitation.example.com/minh-huong';

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 
            className="text-5xl md:text-6xl text-[#FF69B4] font-bold mb-4"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Chia Sẻ Thiệp Mời
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#FFB6C1]" />
            <QrCode className="w-6 h-6 text-[#FF69B4]" />
            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#FFB6C1]" />
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl text-center space-y-8 border border-[#FFB6C1]/30"
        >
          {/* QR Code */}
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="inline-block p-8 bg-white rounded-3xl shadow-xl border-4 border-[#FFB6C1]"
          >
            <div className="w-64 h-64 bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] rounded-2xl flex items-center justify-center">
              <QrCode className="w-48 h-48 text-white" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Instructions */}
          <div className="space-y-4">
            <p 
              className="text-xl text-[#8B5A6B]"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Quét mã QR để xem thiệp mời
            </p>

            {/* URL */}
            <div className="bg-[#FFF0F5] p-6 rounded-2xl border-2 border-[#FFB6C1]/30">
              <p className="text-lg text-[#8B5A6B] font-mono break-all">
                {invitationUrl}
              </p>
            </div>

            {/* Copy Button */}
            <Button
              onClick={handleCopy}
              className="px-8 py-4 text-lg bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:from-[#FF1493] hover:to-[#FF69B4] text-white shadow-lg hover:scale-105 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Đã Sao Chép!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Sao Chép Link
                </>
              )}
            </Button>
          </div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-8 border-t-2 border-[#FFB6C1]/30 space-y-4"
          >
            <Heart className="w-12 h-12 mx-auto text-[#FF69B4] fill-[#FF69B4]" />
            <p 
              className="text-2xl font-bold text-[#FF69B4]"
              style={{ fontFamily: '"Libre Baskerville", serif' }}
            >
              Cảm Ơn Bạn Đã Đến!
            </p>
            <p className="text-lg text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Sự hiện diện của bạn là món quà ý nghĩa nhất với chúng tôi
            </p>
          </motion.div>

          {/* Back to Home */}
          <Button
            onClick={() => window.location.hash = '#/'}
            className="px-10 py-4 bg-white text-[#FF69B4] border-2 border-[#FF69B4] hover:bg-[#FFF0F5] shadow-lg hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5 mr-2" />
            Về Trang Chủ
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
