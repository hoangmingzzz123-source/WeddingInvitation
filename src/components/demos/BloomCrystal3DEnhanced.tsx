import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MapPin, Calendar, Clock, Send, Home, QrCode, Copy, Check, Heart, Sparkles, ArrowRight, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { PREMIUM_GALLERY_IMAGES } from '../../utils/imageConstants';

export function BloomCrystal3DEnhanced() {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Get guest name from URL parameter
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guest') || 'Bạn và người thân';
  };

  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const loveStory = `Tình yêu của chúng tôi như một đóa hoa nở rộ từng cánh, từ những ngày đầu gặp gỡ đến khi hiểu nhau sâu sắc hơn. Mỗi khoảnh khắc bên nhau đều rực rỡ như những viên pha lê lấp lánh dưới ánh mặt trời. Giờ đây, chúng tôi cùng nhau bước vào hành trình mới - nơi tình yêu nở rộ trọn vẹn nhất.`;

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

  // 3D Crystal Particles
  const crystals = Array(30).fill(0).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 7,
    size: 20 + Math.random() * 40,
    rotation: Math.random() * 360,
  }));

  // Bloom Petals
  const petals = Array(20).fill(0).map((_, i) => ({
    id: i,
    angle: (i * 360) / 20,
    delay: i * 0.1,
    scale: 0.6 + Math.random() * 0.4,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 100%)' }}>
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} />

      {/* 3D Crystal Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {crystals.map((crystal) => (
          <motion.div
            key={crystal.id}
            className="absolute"
            style={{ 
              left: crystal.left, 
              top: crystal.top,
            }}
            animate={{
              y: ['0vh', '120vh'],
              rotate: [0, crystal.rotation, crystal.rotation * 2],
              scale: [0.5, 1, 0.5],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: crystal.duration,
              delay: crystal.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg width={crystal.size} height={crystal.size} viewBox="0 0 50 50">
              <defs>
                <linearGradient id={`crystal-gradient-${crystal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C29B43" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#FFD700" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FFF" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <polygon 
                points="25,5 45,20 35,45 15,45 5,20" 
                fill={`url(#crystal-gradient-${crystal.id})`}
                stroke="white"
                strokeWidth="0.5"
                opacity="0.8"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Bloom Flower Effect */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-10">
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50% 0 50% 0',
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.6), rgba(194, 155, 67, 0.3))',
              transform: `rotate(${petal.angle}deg) translateY(-200px) scale(${petal.scale})`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: petal.scale, 
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <Button
        onClick={() => window.location.hash = '#/'}
        className="fixed top-8 left-8 z-50 bg-white/90 hover:bg-white text-purple-600 border-2 border-purple-300 backdrop-blur-md shadow-xl transition-all hover:scale-105"
      >
        <Home className="w-4 h-4 mr-2" />
        Trang Chủ
      </Button>

      {/* 3D Page Indicator */}
      <div className="fixed top-8 right-8 z-50 flex gap-3 bg-white/20 backdrop-blur-md px-6 py-4 rounded-full border border-white/30 shadow-xl">
        {['Trang Bìa', 'Câu Chuyện', 'Album', 'Chi Tiết', 'Bản Đồ', 'Xác Nhận', 'QR'].map((label, index) => (
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
                ? 'w-10 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg shadow-purple-500/50' 
                : 'w-6 h-3 bg-white/40 rounded-full hover:bg-white/60'
            }`}
            title={label}
          />
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen"
        >
          {currentPage === 0 && <CoverPage onNext={() => setCurrentPage(1)} />}
          {currentPage === 1 && <StoryPage displayedText={displayedText} onNext={() => setCurrentPage(2)} />}
          {currentPage === 2 && <GalleryPage onNext={() => setCurrentPage(3)} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
          {currentPage === 3 && <DetailsPage onNext={() => setCurrentPage(4)} />}
          {currentPage === 4 && <MapPage onNext={() => setCurrentPage(5)} />}
          {currentPage === 5 && <RSVPPage submitted={rsvpSubmitted} setSubmitted={setRsvpSubmitted} onNext={() => setCurrentPage(6)} />}
          {currentPage === 6 && <QRCodePage copied={copied} setCopied={setCopied} guestName={getGuestName()} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Cover Page - 3D Crystal Bloom
function CoverPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-8 relative">
      {/* 3D Rotating Crystal */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg width="600" height="600" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="crystal-main" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="50%" stopColor="#764ba2" />
              <stop offset="100%" stopColor="#f093fb" />
            </linearGradient>
          </defs>
          <polygon points="100,20 150,70 130,130 70,130 50,70" fill="url(#crystal-main)" opacity="0.6" />
          <polygon points="100,20 150,70 100,50" fill="white" opacity="0.3" />
          <polygon points="50,70 70,130 100,100" fill="white" opacity="0.2" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-12 max-w-4xl">
        {/* Crystal Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, type: "spring" }}
          className="flex justify-center"
        >
          <div className="relative">
            <Sparkles className="w-24 h-24 text-white" />
            <motion.div
              className="absolute inset-0"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-24 h-24 text-yellow-300" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="space-y-8"
        >
          <motion.p 
            className="text-sm tracking-[0.5em] text-white/80 uppercase"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Crystal Love Story
          </motion.p>

          <h1 
            className="text-7xl md:text-9xl font-bold text-white tracking-tight"
            style={{ 
              fontFamily: '"Playfair Display", serif',
              textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(194, 155, 67, 0.3)',
            }}
          >
            Minh & Hương
          </h1>

          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-white/60" />
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-white fill-white" />
            </motion.div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-white/60" />
          </div>

          <p className="text-3xl text-white/90" style={{ fontFamily: '"Crimson Text", serif' }}>
            15 • 03 • 2025
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
            className="group px-14 py-7 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-md text-lg font-bold shadow-2xl transition-all hover:scale-110"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            <span>Khám Phá Câu Chuyện</span>
            <motion.span
              className="inline-block ml-3"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5" />
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
      <div className="max-w-4xl space-y-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <Sparkles className="w-16 h-16 mx-auto text-white" />
          <h2 
            className="text-6xl md:text-7xl text-white font-light"
            style={{ 
              fontFamily: '"Playfair Display", serif',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            Câu Chuyện Của Chúng Tôi
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-white/50" />
            <Heart className="w-5 h-5 text-white" />
            <div className="w-12 h-px bg-white/50" />
          </div>
        </motion.div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative bg-white/10 backdrop-blur-lg p-12 md:p-20 border border-white/20 rounded-3xl shadow-2xl"
        >
          {/* Crystal Corners */}
          <div className="absolute top-4 left-4">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <polygon points="20,0 40,15 30,40 10,40 0,15" fill="white" opacity="0.2" />
            </svg>
          </div>
          <div className="absolute top-4 right-4 rotate-90">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <polygon points="20,0 40,15 30,40 10,40 0,15" fill="white" opacity="0.2" />
            </svg>
          </div>

          <p 
            className="text-2xl md:text-3xl text-white leading-relaxed text-center"
            style={{ fontFamily: '"Crimson Text", serif' }}
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-yellow-300"
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
          className="grid md:grid-cols-4 gap-8"
        >
          {[
            { year: '2020', event: 'Gặp Gỡ', icon: '💫' },
            { year: '2021', event: 'Yêu Nhau', icon: '💝' },
            { year: '2024', event: 'Đính Hôn', icon: '💍' },
            { year: '2025', event: 'Kết Hôn', icon: '💒' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.5 + index * 0.15 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-center border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <p className="text-4xl font-light text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                {item.year}
              </p>
              <p className="text-lg text-white/80" style={{ fontFamily: '"Montserrat", sans-serif' }}>
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
          className="text-center pt-8"
        >
          <Button
            onClick={onNext}
            className="px-12 py-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-md shadow-xl hover:scale-105 transition-all"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Xem Thư Viện Ảnh</span>
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
    PREMIUM_GALLERY_IMAGES.pinimg_5,
    PREMIUM_GALLERY_IMAGES.pinimg_6,
    PREMIUM_GALLERY_IMAGES.pinimg_7,
    PREMIUM_GALLERY_IMAGES.afamilycdn_1,
    PREMIUM_GALLERY_IMAGES.calibridal_wedding,
    PREMIUM_GALLERY_IMAGES.pinimg_11,
    PREMIUM_GALLERY_IMAGES.pinimg_2,
    PREMIUM_GALLERY_IMAGES.pinimg_4,
    PREMIUM_GALLERY_IMAGES.pinimg_13,
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
          <Sparkles className="w-16 h-16 mx-auto text-white" />
          <h2 
            className="text-6xl md:text-7xl text-white font-light"
            style={{ 
              fontFamily: '"Playfair Display", serif',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            Khoảnh Khắc Rực Rỡ
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-white/50" />
            <Heart className="w-5 h-5 text-white fill-white" />
            <div className="w-12 h-px bg-white/50" />
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer border-4 border-white/20 hover:border-white/60 transition-all shadow-2xl"
              onClick={() => setSelectedImage(index)}
            >
              <ImageWithFallback
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Crystal Overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.2 }}
              >
                <Sparkles className="w-16 h-16 text-white" />
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
                initial={{ scale: 0.8, rotateY: -90 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ scale: 0.8, rotateY: 90 }}
                className="relative max-w-5xl max-h-[90vh] border-8 border-white/30 rounded-3xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={`Gallery ${selectedImage + 1}`}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-14 h-14 bg-white hover:bg-purple-400 text-purple-600 hover:text-white rounded-full flex items-center justify-center text-3xl font-bold transition-all shadow-2xl"
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
            className="px-12 py-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-md shadow-xl hover:scale-105 transition-all"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Xem Thông Tin Sự Kiện</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Details, Map, RSVP, QR Code pages tương tự pattern đã thiết lập...
// (Code tiếp tục với cấu trúc tương tự các trang khác)

function DetailsPage({ onNext }: { onNext: () => void }) {
  const events = [
    {
      icon: '🏠',
      title: 'Lễ Gia Tiên',
      time: '07:00 AM',
      date: '15/03/2025',
      location: 'Tư Gia Nhà Gái',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    },
    {
      icon: '💒',
      title: 'Lễ Thành Hôn',
      time: '11:00 AM',
      date: '15/03/2025',
      location: 'Nhà Thờ Đức Bà',
      address: '01 Công xã Paris, Quận 1, TP.HCM',
    },
    {
      icon: '🎉',
      title: 'Tiệc Cưới',
      time: '18:00 PM',
      date: '15/03/2025',
      location: 'Crystal Palace Hotel',
      address: '789 Lê Lợi, Quận 1, TP.HCM',
    },
  ];

  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <Calendar className="w-16 h-16 mx-auto text-white" />
          <h2 
            className="text-6xl md:text-7xl text-white font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Thông Tin Sự Kiện
          </h2>
        </motion.div>

        <div className="space-y-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg p-10 md:p-12 border-2 border-white/20 rounded-3xl hover:bg-white/20 transition-all"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="text-6xl">{event.icon}</div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-3xl text-white font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-white/80" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5" />
                      <span>{event.time} • {event.date}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-1" />
                      <div>
                        <p className="font-semibold">{event.location}</p>
                        <p className="text-sm">{event.address}</p>
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
          className="text-center pt-8"
        >
          <Button
            onClick={onNext}
            className="px-12 py-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-md shadow-xl hover:scale-105 transition-all"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Xem Bản Đồ</span>
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
      <div className="max-w-6xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <MapPin className="w-16 h-16 mx-auto text-white" />
          <h2 className="text-6xl md:text-7xl text-white font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
            Địa Điểm
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg p-8 border-2 border-white/20 rounded-3xl"
        >
          <div className="aspect-video overflow-hidden rounded-2xl border-4 border-white/30">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193500236194!2d106.6918029!3d10.7870943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2e9cd7861%3A0xedce370ff1fd83c3!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="mt-8 text-center space-y-4">
            <h3 className="text-3xl text-white font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
              Crystal Palace Hotel
            </h3>
            <p className="text-lg text-white/80" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              789 Lê Lợi, Quận 1, TP. Hồ Chí Minh
            </p>
            <Button
              onClick={() => window.open('https://maps.google.com', '_blank')}
              className="mt-6 px-10 py-4 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-md shadow-lg"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Mở Google Maps
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
            className="px-12 py-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-md shadow-xl hover:scale-105 transition-all"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Xác Nhận Tham Dự</span>
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
  const [formData, setFormData] = useState({ name: '', email: '', guests: '1', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitRSVPWithFallback({
        name: formData.name,
        email: formData.email || undefined,
        attending: 'yes',
        guestCount: parseInt(formData.guests) || 1,
        message: formData.message || undefined,
        template: 'Bloom Crystal 3D Enhanced',
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-3xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <Heart className="w-16 h-16 mx-auto text-white" />
          <h2 className="text-6xl md:text-7xl text-white font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
            RSVP
          </h2>
        </motion.div>

        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg p-12 md:p-16 border-2 border-white/20 rounded-3xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm text-white/80 uppercase tracking-wider" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  Họ và Tên *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-4 text-lg bg-white/10 border-2 border-white/30 focus:border-white/60 text-white rounded-xl"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              <div className="space-y-3">                <label className="text-sm text-white/70 uppercase tracking-wider">
                  Email (Không bắt buộc)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF69B4]" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="p-4 pl-12 text-lg bg-white/10 border-2 border-[#FF69B4]/30 focus:border-[#FF69B4] text-white placeholder:text-white/50"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="space-y-3">                <label className="text-sm text-white/80 uppercase tracking-wider" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  Số Lượng Khách *
                </label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="p-4 text-lg bg-white/10 border-2 border-white/30 focus:border-white/60 text-white rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm text-white/80 uppercase tracking-wider" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  Lời Nhắn
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="p-4 text-lg bg-white/10 border-2 border-white/30 focus:border-white/60 text-white rounded-xl min-h-32"
                  placeholder="Gửi lời chúc đến cô dâu chú rể..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-lg bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-md shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                    />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Gửi Xác Nhận
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-lg p-16 text-center space-y-8 border-2 border-white/20 rounded-3xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center"
            >
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </motion.div>

            <div className="space-y-4">
              <h3 className="text-4xl text-white font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
                Cảm Ơn Bạn!
              </h3>
              <p className="text-xl text-white/80" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                Chúng tôi rất vui khi bạn xác nhận tham dự. <br />
                Hẹn gặp bạn trong ngày trọng đại!
              </p>
            </div>

            <Button
              onClick={onNext}
              className="px-12 py-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-md shadow-xl"
            >
              Tiếp Theo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function QRCodePage({ copied, setCopied, guestName }: { copied: boolean; setCopied: (value: boolean) => void; guestName: string }) {
  const invitationUrl = 'https://wedding-invitation.example.com/minh-huong';

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen px-8 py-24">
      <div className="max-w-3xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <QrCode className="w-16 h-16 mx-auto text-white" />
          <h2 className="text-6xl md:text-7xl text-white font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
            Chia Sẻ
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg p-16 text-center space-y-8 border-2 border-white/20 rounded-3xl"
        >
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="inline-block p-8 bg-white rounded-3xl"
          >
            <div className="w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
              <QrCode className="w-48 h-48 text-white" strokeWidth={1.5} />
            </div>
          </motion.div>

          <div className="space-y-6">
            <p className="text-lg text-white/80" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              Quét mã QR để xem thiệp mời
            </p>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
              <p className="text-sm text-white/70 font-mono break-all">
                {invitationUrl}
              </p>
            </div>

            <Button
              onClick={handleCopy}
              className="px-10 py-4 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-md shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Đã Sao Chép!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Sao Chép Link
                </>
              )}
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-8 border-t-2 border-white/20 space-y-4"
          >
            <Sparkles className="w-12 h-12 mx-auto text-white" />
            <p className="text-2xl text-white font-light" style={{ fontFamily: '"Playfair Display", serif' }}>
              Thank You
            </p>
            <p className="text-base text-white/70" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              Sự hiện diện của <span className="font-semibold text-[#E8B4F8]">{guestName}</span> là món quà ý nghĩa nhất
            </p>
          </motion.div>

          <Button
            onClick={() => window.location.hash = '#/'}
            className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 shadow-lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Về Trang Chủ
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
