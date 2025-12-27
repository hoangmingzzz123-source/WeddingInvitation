import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MapPin, Calendar, Clock, Phone, Mail, Send, Home, QrCode, Copy, Check, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function MinimalElegantEnhanced() {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

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
              opacity: [0, 0.15, 0.15, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-1 h-1 rounded-full bg-[#C29B43]" />
          </motion.div>
        ))}
      </div>

      {/* Back Button */}
      <Button
        onClick={() => window.location.hash = '#/'}
        className="fixed top-8 left-8 z-50 bg-white hover:bg-[#FAF7F2] text-[#1B2A41] border border-[#E5E5E5] shadow-sm transition-all hover:shadow-md"
      >
        <Home className="w-4 h-4 mr-2" />
        Trang Chủ
      </Button>

      {/* Minimal Page Indicator */}
      <div className="fixed top-8 right-8 z-50 flex gap-2">
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
            className={`transition-all duration-300 ${
              currentPage === index 
                ? 'w-8 h-1 bg-[#1B2A41]' 
                : 'w-6 h-1 bg-[#E5E5E5] hover:bg-[#C29B43]'
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
          {currentPage === 0 && <CoverPage onNext={() => setCurrentPage(1)} opacity={opacity} />}
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

// Cover Page - Minimal & Elegant
function CoverPage({ onNext, opacity }: { onNext: () => void; opacity: any }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-8 relative">
      {/* Subtle Background Image */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{ opacity }}
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1626531805607-c3cd1ddce3f0?w=1920"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-16 max-w-5xl">
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
            Save The Date
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
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-6 h-6 text-[#C29B43]" />
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
          Trân trọng kính mời Quý khách đến dự Lễ Cưới của chúng tôi
        </motion.p>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Button
            onClick={onNext}
            className="group px-12 py-6 bg-[#1B2A41] hover:bg-[#0F1A2E] text-white border-0 shadow-lg transition-all hover:shadow-xl"
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Khám Phá Câu Chuyện</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
          className="bg-[#FAF7F2] p-12 md:p-20 border border-[#E5E5E5] relative"
        >
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C29B43]" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#C29B43]" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#C29B43]" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C29B43]" />

          <p 
            className="text-xl md:text-2xl text-[#1B2A41] leading-loose text-justify"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 + index * 0.15 }}
              className="text-center space-y-3 border-l-2 border-[#C29B43] pl-6"
            >
              <p 
                className="text-4xl text-[#1B2A41] font-light"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {item.year}
              </p>
              <p 
                className="text-sm text-[#666] uppercase tracking-wider"
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="aspect-square overflow-hidden cursor-pointer group relative border border-[#E5E5E5]"
              onClick={() => setSelectedImage(index)}
            >
              <ImageWithFallback
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#1B2A41]/0 group-hover:bg-[#1B2A41]/20 transition-colors duration-300" />
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
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="border-l-4 border-[#C29B43] pl-8 py-8 hover:bg-[#FAF7F2] transition-colors duration-300"
            >
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
          className="grid md:grid-cols-2 gap-8 p-12 border-2 border-[#E5E5E5] bg-[#FAF7F2]"
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
          className="border-2 border-[#E5E5E5] p-6 bg-[#FAF7F2]"
        >
          <div className="aspect-video overflow-hidden border border-[#C29B43]">
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
              className="mt-6 px-10 py-4 bg-[#C29B43] hover:bg-[#A88434] text-white shadow-lg"
            >
              <MapPin className="w-4 h-4 mr-2" />
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
            className="border-2 border-[#E5E5E5] p-12 md:p-16 bg-[#FAF7F2]"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label 
                  className="text-sm text-[#666] uppercase tracking-wider"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Họ và Tên *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-4 text-lg border-[#C29B43]/30 focus:border-[#C29B43] bg-white"
                  placeholder="Nhập họ tên của bạn"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                />
              </div>

              <div className="space-y-3">
                <label 
                  className="text-sm text-[#666] uppercase tracking-wider"
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
                  className="p-4 text-lg border-[#C29B43]/30 focus:border-[#C29B43] bg-white"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                />
              </div>

              <div className="space-y-3">
                <label 
                  className="text-sm text-[#666] uppercase tracking-wider"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Lời Nhắn
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="p-4 text-lg border-[#C29B43]/30 focus:border-[#C29B43] bg-white min-h-32"
                  placeholder="Gửi lời chúc đến cô dâu chú rể..."
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg bg-[#1B2A41] hover:bg-[#0F1A2E] text-white shadow-lg"
              >
                <Send className="w-4 h-4 mr-2" />
                <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Gửi Xác Nhận</span>
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="border-2 border-[#C29B43] p-16 text-center space-y-8 bg-[#FAF7F2]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="w-24 h-24 mx-auto bg-[#C29B43] flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.div>

            <div className="space-y-4">
              <h3 
                className="text-4xl text-[#1B2A41] font-light"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Cảm Ơn Bạn
              </h3>
              <p className="text-lg text-[#666]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
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
          className="border-2 border-[#E5E5E5] p-16 text-center space-y-8 bg-[#FAF7F2]"
        >
          {/* QR Code */}
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="inline-block p-8 bg-white border-4 border-[#C29B43]"
          >
            <div className="w-64 h-64 bg-[#1B2A41] flex items-center justify-center">
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
              className="px-10 py-4 bg-[#C29B43] hover:bg-[#A88434] text-white shadow-lg"
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
              Sự hiện diện của bạn là món quà ý nghĩa nhất
            </p>
          </motion.div>

          {/* Back to Home */}
          <Button
            onClick={() => window.location.hash = '#/'}
            className="px-10 py-4 bg-white hover:bg-[#FAF7F2] text-[#1B2A41] border-2 border-[#1B2A41] shadow-lg"
          >
            <Home className="w-4 h-4 mr-2" />
            <span style={{ fontFamily: '"Montserrat", sans-serif' }}>Về Trang Chủ</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
