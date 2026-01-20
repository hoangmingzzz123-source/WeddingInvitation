import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MapPin, Calendar, Clock, Phone, Mail, Send, Home, QrCode, Copy, Check, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { PREMIUM_GALLERY_IMAGES } from '../../utils/imageConstants';

export function MinimalElegantEnhanced() {
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
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const loveStory = `Tình yêu của chúng tôi bắt đầu như một câu chuyện cổ tích. Từ những buổi gặp gỡ đầu tiên, chúng tôi biết rằng đây là người mà mình đã tìm kiếm suốt cuộc đời. Qua bao thăng trầm, niềm tin và sự thấu hiểu đã giúp chúng tôi trở nên mạnh mẽ hơn. Hôm nay, chúng tôi sẵn sàng bước vào chương mới của cuộc đời - một hành trình trọn vẹn bên nhau.`;

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

  // Minimal floating particles
  const particles = Array(8).fill(0).map((_, i) => ({
    id: i,
    left: `${15 + Math.random() * 70}%`,
    delay: Math.random() * 10,
    duration: 20 + Math.random() * 10,
  }));

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} />

      {/* Subtle Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #1B2A41 0px, #1B2A41 1px, transparent 1px, transparent 60px),
                           repeating-linear-gradient(90deg, #1B2A41 0px, #1B2A41 1px, transparent 1px, transparent 60px)`,
        }}
      />

      {/* Minimal Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{ left: particle.left, top: '-20px' }}
            animate={{
              y: ['0vh', '120vh'],
              opacity: [0, 0.2, 0.2, 0],
              x: ['0px', '50px', '-30px', '20px', '0px'],
              rotate: [0, 360],
              scale: [0.5, 1, 0.8, 1, 0.5],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#C29B43] shadow-lg shadow-[#C29B43]/50" />
          </motion.div>
        ))}
      </div>

      {/* Back Button */}
      <Button
        onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
        className="fixed top-8 left-8 z-50 bg-white/95 hover:bg-[#FAF7F2] text-[#1B2A41] border-2 border-[#E5E5E5] hover:border-[#C29B43] shadow-lg hover:shadow-xl transition-all font-semibold"
      >
        <Home className="w-4 h-4 mr-2" />
        Trang Chủ
      </Button>

      {/* Minimal Page Indicator */}
      <div className="fixed top-8 right-8 z-50 flex gap-3">
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
            className={`transition-all duration-300 border-2 ${
              currentPage === index 
                ? 'w-10 h-1.5 bg-[#1B2A41] border-[#1B2A41] shadow-lg' 
                : 'w-8 h-1.5 bg-white border-[#E5E5E5] hover:bg-[#C29B43] hover:border-[#C29B43]'
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
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="min-h-screen"
        >
          {currentPage === 0 && <CoverPage onNext={() => setCurrentPage(1)} opacity={opacity} guestName={getGuestName()} />}
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

// Cover Page - Minimal & Elegant
function CoverPage({ onNext, opacity, guestName }: { onNext: () => void; opacity: any; guestName: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-8 relative">
      {/* Subtle Background Image */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{ opacity }}
      >
        <ImageWithFallback
          src={PREMIUM_GALLERY_IMAGES.calibridal_wedding}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-16 max-w-5xl">
        {/* Animated Corner Decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-0 left-0 w-40 h-40 border-t-2 border-l-2 border-[#C29B43]/20"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.7 }}
          className="absolute top-0 right-0 w-40 h-40 border-t-2 border-r-2 border-[#C29B43]/20"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.9 }}
          className="absolute bottom-0 left-0 w-40 h-40 border-b-2 border-l-2 border-[#C29B43]/20"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.1 }}
          className="absolute bottom-0 right-0 w-40 h-40 border-b-2 border-r-2 border-[#C29B43]/20"
        />
        
        {/* Date Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-4"
        >
          <p 
            className="text-xs tracking-[0.5em] text-[#999] uppercase"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            Ghi Nhớ Ngày
          </p>
          
          <div className="flex items-center justify-center gap-8">
            <motion.div 
              className="w-20 h-px bg-gradient-to-r from-transparent to-[#C29B43]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <p 
              className="text-8xl md:text-9xl text-[#1B2A41] font-light tracking-tight"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              15
            </p>
            <motion.div 
              className="w-20 h-px bg-gradient-to-l from-transparent to-[#C29B43]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          <p 
            className="text-sm tracking-[0.3em] text-[#666]"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            03 • 2025
          </p>
        </motion.div>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="space-y-8"
        >
          <h1 
            className="text-5xl md:text-7xl text-[#1B2A41] font-light tracking-wide"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Nguyễn Văn Minh
          </h1>
          
          <div className="flex items-center justify-center gap-8">
            <div className="w-16 h-px bg-[#C29B43]" />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                filter: ['drop-shadow(0 0 0px rgba(194, 155, 67, 0))', 'drop-shadow(0 0 20px rgba(194, 155, 67, 0.8))', 'drop-shadow(0 0 0px rgba(194, 155, 67, 0))'],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-6 h-6 text-[#C29B43]" fill="#C29B43" />
            </motion.div>
            <div className="w-16 h-px bg-[#C29B43]" />
          </div>

          <h1 
            className="text-5xl md:text-7xl text-[#1B2A41] font-light tracking-wide"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Trần Thị Hương
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-base text-[#666] max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: '"Montserrat", sans-serif' }}
        >
          Trân trọng kính mời <span className="font-semibold text-[#C29B43]">{guestName}</span> đến dự Lễ Cưới của chúng tôi
        </motion.p>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Button
            onClick={onNext}
            className="group px-14 py-7 bg-[#1B2A41] hover:bg-[#0F1A2E] text-white border-0 shadow-2xl shadow-[#1B2A41]/30 transition-all hover:shadow-3xl hover:scale-105 font-semibold text-lg"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Khám Phá Câu Chuyện</span>
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Story Page - Typewriter
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
          <h2 
            className="text-6xl md:text-7xl text-[#1B2A41] font-light"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Câu Chuyện Của Chúng Tôi
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#C29B43]" />
            <Sparkles className="w-5 h-5 text-[#C29B43]" />
            <div className="w-12 h-px bg-[#C29B43]" />
          </div>
        </motion.div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-[#FAF7F2] p-12 md:p-20 border-2 border-[#E5E5E5] shadow-xl relative"
        >
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#C29B43]" />
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#C29B43]" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#C29B43]" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#C29B43]" />

          <p 
            className="text-xl md:text-2xl text-[#1B2A41] leading-loose text-justify font-medium"
            style={{ fontFamily: '"Crimson Text", serif' }}
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-[#C29B43] font-bold"
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
            { year: '2019', event: 'Gặp Gỡ' },
            { year: '2020', event: 'Hẹn Hò' },
            { year: '2024', event: 'Đính Hôn' },
            { year: '2025', event: 'Kết Hôn' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 1.5 + index * 0.15,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                rotateY: 5,
                boxShadow: '0 20px 40px rgba(194, 155, 67, 0.3)',
              }}
              className="text-center space-y-4 border-l-4 border-[#C29B43] pl-6 bg-white/50 py-6 rounded-r-lg shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
            >
              {/* Animated background on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#C29B43]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <p 
                className="text-5xl text-[#1B2A41] font-light relative z-10"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {item.year}
              </p>
              <p 
                className="text-sm text-[#666] uppercase tracking-wider font-semibold relative z-10"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
              >
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
            className="px-12 py-6 bg-[#1B2A41] hover:bg-[#0F1A2E] text-white shadow-lg"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Xem Thư Viện Ảnh</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Gallery Page - Minimal Grid
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
    'https://images.unsplash.com/photo-1626531805607-c3cd1ddce3f0?w=800',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
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
          <h2 
            className="text-6xl md:text-7xl text-[#1B2A41] font-light"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Khoảnh Khắc
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#C29B43]" />
            <Heart className="w-5 h-5 text-[#C29B43]" />
            <div className="w-12 h-px bg-[#C29B43]" />
          </div>
        </motion.div>

        {/* Grid Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.08,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                rotateZ: 1,
                boxShadow: '0 30px 60px rgba(194, 155, 67, 0.3)',
              }}
              className="aspect-square overflow-hidden cursor-pointer group relative border-2 border-[#E5E5E5] hover:border-[#C29B43] shadow-lg hover:shadow-2xl transition-all rounded-lg"
              onClick={() => setSelectedImage(index)}
            >
              <ImageWithFallback
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A41]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
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
              className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center p-8"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-6xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={`Gallery ${selectedImage + 1}`}
                  className="w-full h-full object-contain border-2 border-[#C29B43]"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-[#1B2A41] hover:bg-[#0F1A2E] text-white flex items-center justify-center text-2xl transition-all"
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
            className="px-12 py-6 bg-[#1B2A41] hover:bg-[#0F1A2E] text-white shadow-lg"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Xem Chi Tiết Sự Kiện</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Details Page - Minimal & Clean
function DetailsPage({ onNext }: { onNext: () => void }) {
  const events = [
    {
      type: 'Lễ Gia Tiên',
      time: '07:00',
      date: '15/03/2025',
      location: 'Tư Gia Nhà Gái',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    },
    {
      type: 'Lễ Thành Hôn',
      time: '11:00',
      date: '15/03/2025',
      location: 'Nhà Thờ Đức Bà',
      address: '01 Công xã Paris, Quận 1, TP.HCM',
    },
    {
      type: 'Tiệc Cưới',
      time: '18:00',
      date: '15/03/2025',
      location: 'Grand Palace Hotel',
      address: '789 Lê Lợi, Quận 1, TP.HCM',
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
          <h2 
            className="text-6xl md:text-7xl text-[#1B2A41] font-light"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Chương Trình
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#C29B43]" />
            <Calendar className="w-5 h-5 text-[#C29B43]" />
            <div className="w-12 h-px bg-[#C29B43]" />
          </div>
        </motion.div>

        {/* Events List */}
        <div className="space-y-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30, rotateX: -10 }}
              animate={{ opacity: 1, x: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 80,
              }}
              whileHover={{ 
                x: 10, 
                boxShadow: '0 20px 40px rgba(27, 42, 65, 0.15)',
                borderColor: 'rgba(194, 155, 67, 1)',
              }}
              className="border-l-4 border-[#C29B43] pl-10 py-10 hover:bg-[#FAF7F2] transition-all duration-300 rounded-r-xl shadow-md relative group overflow-hidden"
            >
              {/* Animated background accent */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C29B43] via-[#1B2A41] to-[#C29B43] opacity-0 group-hover:opacity-100"
                animate={{
                  backgroundPosition: ['0% 0%', '0% 100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="grid md:grid-cols-12 gap-6 items-start">
                {/* Time */}
                <div className="md:col-span-3 space-y-2">
                  <p 
                    className="text-6xl text-[#1B2A41] font-light"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {event.time}
                  </p>
                  <p 
                    className="text-sm text-[#666] tracking-wider"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                  >
                    {event.date}
                  </p>
                </div>

                {/* Details */}
                <div className="md:col-span-9 space-y-4">
                  <h3 
                    className="text-3xl text-[#1B2A41] font-light"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {event.type}
                  </h3>
                  <div className="space-y-2 text-[#666]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C29B43]" />
                      <span className="font-medium">{event.location}</span>
                    </p>
                    <p className="text-sm ml-6">{event.address}</p>
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
          className="grid md:grid-cols-2 gap-10 p-12 border-2 border-[#E5E5E5] bg-[#FAF7F2] shadow-xl rounded-lg"
        >
          <div className="space-y-4">
            <h3 
              className="text-2xl text-[#1B2A41] font-light"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Nhà Trai
            </h3>
            <div className="space-y-3 text-[#666]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              <p className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C29B43]" />
                <span>0901 234 567</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C29B43]" />
                <span>minh@example.com</span>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 
              className="text-2xl text-[#1B2A41] font-light"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Nhà Gái
            </h3>
            <div className="space-y-3 text-[#666]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              <p className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C29B43]" />
                <span>0902 345 678</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C29B43]" />
                <span>huong@example.com</span>
              </p>
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
            className="px-12 py-6 bg-[#1B2A41] hover:bg-[#0F1A2E] text-white shadow-lg"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Xem Bản Đồ</span>
            <ArrowRight className="w-4 h-4 ml-2" />
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
          <h2 
            className="text-6xl md:text-7xl text-[#1B2A41] font-light"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Địa Điểm
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#C29B43]" />
            <MapPin className="w-5 h-5 text-[#C29B43]" />
            <div className="w-12 h-px bg-[#C29B43]" />
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="border-2 border-[#E5E5E5] p-8 bg-[#FAF7F2] shadow-2xl rounded-xl"
        >
          <div className="aspect-video overflow-hidden border-2 border-[#C29B43] rounded-lg shadow-lg">
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
            <h3 
              className="text-3xl text-[#1B2A41] font-light"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Grand Palace Hotel
            </h3>
            <p className="text-lg text-[#666]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              789 Lê Lợi, Quận 1, TP. Hồ Chí Minh
            </p>
            <Button
              onClick={() => window.open('https://maps.google.com', '_blank')}
              className="mt-8 px-12 py-5 bg-[#C29B43] hover:bg-[#A88434] text-white shadow-xl shadow-[#C29B43]/30 font-semibold text-lg hover:scale-105 transition-all"
            >
              <MapPin className="w-5 h-5 mr-2" />
              <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Mở Google Maps</span>
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
            className="px-12 py-6 bg-[#1B2A41] hover:bg-[#0F1A2E] text-white shadow-lg"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Xác Nhận Tham Dự</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// RSVP Page - Minimal Form
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
        template: 'Minimal Elegant Enhanced',
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
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <h2 
            className="text-6xl md:text-7xl text-[#1B2A41] font-light"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            RSVP
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#C29B43]" />
            <Heart className="w-5 h-5 text-[#C29B43]" />
            <div className="w-12 h-px bg-[#C29B43]" />
          </div>
        </motion.div>

        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="border-2 border-[#E5E5E5] p-12 md:p-16 bg-[#FAF7F2] shadow-2xl rounded-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label 
                  className="text-sm text-[#666] uppercase tracking-wider font-semibold"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Họ và Tên *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-5 text-lg border-2 border-[#C29B43]/30 focus:border-[#C29B43] bg-white rounded-lg shadow-sm font-medium"
                  placeholder="Nhập họ tên của bạn"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                />
              </div>

              <div className="space-y-3">
                <label 
                  className="text-sm text-[#666] uppercase tracking-wider font-semibold"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Email (Không bắt buộc)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2A5D67]" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="p-5 pl-12 text-lg border-2 border-[#C29B43]/30 focus:border-[#C29B43] bg-white rounded-lg shadow-sm font-medium"
                    placeholder="example@email.com"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label 
                  className="text-sm text-[#666] uppercase tracking-wider font-semibold"
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
                  className="p-5 text-lg border-2 border-[#C29B43]/30 focus:border-[#C29B43] bg-white rounded-lg shadow-sm font-medium"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                />
              </div>

              <div className="space-y-3">
                <label 
                  className="text-sm text-[#666] uppercase tracking-wider font-semibold"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Lời Nhắn
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="p-5 text-lg border-2 border-[#C29B43]/30 focus:border-[#C29B43] bg-white min-h-36 rounded-lg shadow-sm font-medium"
                  placeholder="Gửi lời chúc đến cô dâu chú rể..."
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-7 text-lg bg-[#1B2A41] hover:bg-[#0F1A2E] text-white shadow-2xl shadow-[#1B2A41]/30 font-semibold hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Gửi Xác Nhận</span>
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="border-4 border-[#C29B43] p-16 text-center space-y-8 bg-[#FAF7F2] shadow-2xl rounded-xl relative overflow-hidden"
          >
            {/* Animated background rings */}
            <motion.div
              className="absolute inset-0 border-4 border-[#C29B43]/20 rounded-xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.1, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="w-28 h-28 mx-auto bg-[#C29B43] flex items-center justify-center rounded-full shadow-xl relative z-10"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </motion.div>
              
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 border-4 border-[#C29B43] rounded-full"
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.div>

            <div className="space-y-5">
              <h3 
                className="text-5xl text-[#1B2A41] font-light"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Cảm Ơn Bạn
              </h3>
              <p className="text-xl text-[#666] font-medium leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                Chúng tôi rất vui mừng khi bạn xác nhận tham dự. <br />
                Hẹn gặp lại bạn trong ngày trọng đại!
              </p>
            </div>

            <Button
              onClick={onNext}
              className="px-12 py-6 bg-[#1B2A41] hover:bg-[#0F1A2E] text-white shadow-lg"
            >
              <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Tiếp Theo</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// QR Code Page
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
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <h2 
            className="text-6xl md:text-7xl text-[#1B2A41] font-light"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Chia Sẻ
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#C29B43]" />
            <QrCode className="w-5 h-5 text-[#C29B43]" />
            <div className="w-12 h-px bg-[#C29B43]" />
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="border-2 border-[#E5E5E5] p-16 text-center space-y-10 bg-[#FAF7F2] shadow-2xl rounded-xl"
        >
          {/* QR Code */}
          <motion.div
            initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{
              rotateY: 15,
              rotateX: -5,
              scale: 1.05,
              boxShadow: '0 40px 80px rgba(194, 155, 67, 0.3)',
            }}
            className="inline-block p-10 bg-white border-4 border-[#C29B43] shadow-2xl rounded-lg relative group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-[#C29B43]/20 rounded-lg blur-xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="w-64 h-64 bg-[#1B2A41] flex items-center justify-center relative z-10">
              <QrCode className="w-48 h-48 text-white" strokeWidth={1} />
            </div>
          </motion.div>

          {/* Instructions */}
          <div className="space-y-6">
            <p 
              className="text-lg text-[#666]"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              Quét mã QR để xem thiệp mời
            </p>

            {/* URL */}
            <div className="bg-white p-6 border border-[#C29B43]/30">
              <p className="text-sm text-[#666] font-mono break-all">
                {invitationUrl}
              </p>
            </div>

            {/* Copy Button */}
            <Button
              onClick={handleCopy}
              className="px-12 py-5 bg-[#C29B43] hover:bg-[#A88434] text-white shadow-xl shadow-[#C29B43]/30 font-semibold text-lg hover:scale-105 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Sao Chép Link</span>
                </>
              )}
            </Button>
          </div>

          {/* Thank You */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-8 border-t-2 border-[#E5E5E5] space-y-4"
          >
            <p 
              className="text-3xl text-[#1B2A41] font-light"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Thank You
            </p>
            <p className="text-base text-[#666]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
              Sự hiện diện của <span className="font-semibold text-[#C29B43]">{guestName}</span> là món quà ý nghĩa nhất
            </p>
          </motion.div>

          {/* Back to Home */}
          <Button
            onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
            className="px-12 py-5 bg-white hover:bg-[#FAF7F2] text-[#1B2A41] border-2 border-[#1B2A41] hover:border-[#C29B43] shadow-xl font-semibold text-lg hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5 mr-2" />
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Về Trang Chủ</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
