import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Users, Gift, Send, Phone, Home, QrCode, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function VietnameseTraditionalEnhanced() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const pages = ['cover', 'story', 'gallery', 'details', 'map', 'rsvp', 'qr'];

  // Gallery images
  const gallery = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
    'https://images.unsplash.com/photo-1525258854165-8dbe544937d5?w=800',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
  ];

  // Typewriter effect
  useEffect(() => {
    if (currentPage === 1 && !isTyping) {
      const text = "Tình yêu là hành trình kỳ diệu, hôn nhân là bến đỗ hạnh phúc. Từ ngày đầu tiên gặp gỡ, chúng tôi đã biết rằng định mệnh đã sắp đặt cho chúng tôi những một người. Hôm nay, trước sự chứng kiến của gia đình, bạn bè và người thân, chúng tôi hân hạnh thông báo về lễ thành hôn của chúng tôi.";
      setIsTyping(true);
      setDisplayedText('');
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(prev => prev + text[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [currentPage]);

  // Fireworks on page change
  useEffect(() => {
    setShowFireworks(true);
    const timer = setTimeout(() => setShowFireworks(false), 2000);
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Floating lotus petals
  const FloatingLotus = () => (
    <>
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -100,
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
          }}
          animate={{
            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            rotate: Math.random() * 720 + 360,
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
        >
          <div
            className="w-10 h-10 rounded-full blur-sm"
            style={{
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(220, 20, 60, 0.8), rgba(255, 105, 180, 0.4))' 
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(255, 215, 0, 0.8), rgba(194, 155, 67, 0.4))'
                : 'radial-gradient(circle, rgba(255, 192, 203, 0.8), rgba(255, 182, 193, 0.4))',
            }}
          />
        </motion.div>
      ))}
    </>
  );

  // Fireworks particles
  const Fireworks = () => (
    <AnimatePresence>
      {showFireworks && (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: '50%',
                top: '30%',
                background: i % 2 === 0 ? '#FFD700' : '#DC143C',
              }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i / 30) * Math.PI * 2) * (100 + Math.random() * 200),
                y: Math.sin((i / 30) * Math.PI * 2) * (100 + Math.random() * 200),
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );

  // Red lanterns decoration
  const RedLanterns = () => (
    <>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-24 pointer-events-none z-10"
          style={{
            left: i < 2 ? `${10 + i * 30}%` : 'auto',
            right: i >= 2 ? `${10 + (i - 2) * 30}%` : 'auto',
            top: '5%',
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Lantern top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-t-xl" />
          {/* Lantern body */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-16 bg-gradient-to-br from-[#DC143C] via-[#C41E3A] to-[#8B0000] rounded-2xl shadow-2xl border-2 border-[#FFD700]" />
          {/* Gold trim */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#FFD700]" />
          <div className="absolute top-15 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#FFD700]" />
          {/* Tassel */}
          <div className="absolute top-19 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-[#FFD700] to-transparent" />
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-[#FFD700] to-[#C29B43] rounded-b-full"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Glow effect */}
          <div className="absolute inset-0 bg-[#FFD700] opacity-20 blur-xl rounded-full" />
        </motion.div>
      ))}
    </>
  );

  const renderPage = () => {
    switch (pages[currentPage]) {
      case 'cover':
        return (
          <motion.div
            key="cover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex items-center justify-center px-6 py-20 relative"
          >
            {/* Traditional corner ornaments */}
            <div className="absolute top-12 left-12 w-40 h-40 border-t-8 border-l-8 border-[#DC143C]/40 rounded-tl-[3rem] opacity-50" />
            <div className="absolute top-12 right-12 w-40 h-40 border-t-8 border-r-8 border-[#DC143C]/40 rounded-tr-[3rem] opacity-50" />
            <div className="absolute bottom-12 left-12 w-40 h-40 border-b-8 border-l-8 border-[#DC143C]/40 rounded-bl-[3rem] opacity-50" />
            <div className="absolute bottom-12 right-12 w-40 h-40 border-b-8 border-r-8 border-[#DC143C]/40 rounded-br-[3rem] opacity-50" />

            <div className="relative z-10 text-center space-y-12 max-w-4xl">
              {/* Double Happiness Symbol with glow */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.3, type: "spring" }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 blur-3xl opacity-40"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-[250px] text-[#DC143C]">囍</div>
                </motion.div>
                <div className="relative text-[200px] md:text-[250px] select-none" style={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #FFD700 50%, #DC143C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(220, 20, 60, 0.5))',
                }}>
                  囍
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-6"
              >
                <motion.div
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(220, 20, 60, 0.3)',
                      '0 0 40px rgba(255, 215, 0, 0.5)',
                      '0 0 20px rgba(220, 20, 60, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-xl tracking-[0.5em] text-[#DC143C] uppercase font-bold mb-3">
                    Hỷ Sự
                  </p>
                  <h1 
                    className="text-5xl md:text-7xl font-bold"
                    style={{ 
                      fontFamily: '"Playfair Display", serif',
                      background: 'linear-gradient(135deg, #DC143C 0%, #C29B43 50%, #DC143C 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Lễ Thành Hôn
                  </h1>
                </motion.div>
              </motion.div>

              {/* Names with elegant animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <p className="text-base text-[#8B4513] tracking-widest">CHÚ RỂ</p>
                  <motion.h2 
                    whileHover={{ scale: 1.05 }}
                    className="text-6xl md:text-7xl font-bold cursor-pointer"
                    style={{ 
                      fontFamily: '"Great Vibes", cursive',
                      color: '#C29B43',
                      filter: 'drop-shadow(0 2px 10px rgba(194, 155, 67, 0.3))',
                    }}
                  >
                    Nguyễn Văn Minh
                  </motion.h2>
                </div>
                
                <div className="flex items-center justify-center gap-12">
                  <motion.div 
                    className="w-24 h-px"
                    style={{
                      background: 'linear-gradient(to right, transparent, #C29B43)',
                    }}
                    animate={{ scaleX: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0, -10, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-12 h-12 text-[#DC143C] fill-[#DC143C]" />
                  </motion.div>
                  <motion.div 
                    className="w-24 h-px"
                    style={{
                      background: 'linear-gradient(to left, transparent, #C29B43)',
                    }}
                    animate={{ scaleX: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-base text-[#8B4513] tracking-widest">CÔ DÂU</p>
                  <motion.h2 
                    whileHover={{ scale: 1.05 }}
                    className="text-6xl md:text-7xl font-bold cursor-pointer"
                    style={{ 
                      fontFamily: '"Great Vibes", cursive',
                      color: '#C29B43',
                      filter: 'drop-shadow(0 2px 10px rgba(194, 155, 67, 0.3))',
                    }}
                  >
                    Trần Thị Hương
                  </motion.h2>
                </div>
              </motion.div>

              {/* Date with elegant border */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="inline-block relative"
              >
                <motion.div
                  className="absolute inset-0 border-4 border-[#DC143C] rounded-3xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(220, 20, 60, 0.3)',
                      '0 0 40px rgba(255, 215, 0, 0.5)',
                      '0 0 20px rgba(220, 20, 60, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative px-12 py-8 bg-gradient-to-br from-white/95 to-[#FFF8E7]/95 backdrop-blur-sm rounded-3xl">
                  <p className="text-sm text-[#8B4513] mb-3 tracking-widest">NGÀY CƯỚI</p>
                  <p className="text-4xl md:text-5xl font-bold" style={{
                    background: 'linear-gradient(135deg, #DC143C, #C29B43)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    15 • 03 • 2025
                  </p>
                </div>
              </motion.div>

              {/* Next page hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-2 text-[#C29B43]"
                >
                  <p className="text-sm tracking-widest">VUỐT ĐỂ XEM THÊM</p>
                  <ChevronRight className="w-8 h-8" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'story':
        return (
          <motion.div
            key="story"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center px-6 py-20"
          >
            <div className="max-w-4xl space-y-12 text-center">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  background: 'linear-gradient(135deg, #DC143C, #C29B43)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Câu Chuyện Tình Yêu
              </motion.h2>

              <motion.div
                className="relative p-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-[#FFD700]/30"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#DC143C] rounded-tl-2xl" />
                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#DC143C] rounded-tr-2xl" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#DC143C] rounded-bl-2xl" />
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#DC143C] rounded-br-2xl" />

                <motion.p 
                  className="text-xl md:text-2xl leading-relaxed text-[#3333]"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  {displayedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-1 h-6 bg-[#DC143C] ml-1"
                  />
                </motion.p>
              </motion.div>

              {/* Timeline preview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {[
                  { year: '2019', title: 'Gặp Gỡ', icon: '👋' },
                  { year: '2021', title: 'Yêu Nhau', icon: '❤️' },
                  { year: '2024', title: 'Cầu Hôn', icon: '💍' },
                  { year: '2025', title: 'Kết Hôn', icon: '💒' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-6 bg-gradient-to-br from-[#FFF8E7] to-white rounded-2xl shadow-lg border-2 border-[#FFD700]/20"
                  >
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <div className="text-2xl font-bold text-[#DC143C] mb-2">{item.year}</div>
                    <div className="text-sm text-[#666]">{item.title}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        );

      case 'gallery':
        return (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen px-6 py-20"
          >
            <div className="max-w-7xl mx-auto space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold text-center"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  background: 'linear-gradient(135deg, #DC143C, #C29B43)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Album Ảnh Cưới
              </motion.h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    onClick={() => setSelectedImage(i)}
                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-xl border-4 border-[#FFD700]/30 group"
                  >
                    <img 
                      src={img} 
                      alt={`Wedding ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <ImageIcon className="w-6 h-6 mx-auto" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
              {selectedImage !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedImage(null)}
                  className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                >
                  <Button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                  <motion.img
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    src={gallery[selectedImage]}
                    alt="Full size"
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 'details':
        return (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-6 py-20"
          >
            <div className="max-w-6xl mx-auto space-y-16">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold text-center"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  background: 'linear-gradient(135deg, #DC143C, #C29B43)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Chi Tiết Sự Kiện
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: 'Lễ Ăn Hỏi',
                    side: 'Nhà Gái',
                    date: 'Thứ Sáu, 14/03/2025',
                    time: '09:00 Sáng',
                    location: 'Tư Gia Nhà Gái',
                    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
                    color: 'from-[#FFE5E5] to-white',
                    borderColor: 'border-[#DC143C]/30',
                  },
                  {
                    title: 'Rước Dâu',
                    side: 'Nhà Gái',
                    date: 'Thứ Bảy, 15/03/2025',
                    time: '07:00 Sáng',
                    location: 'Tư Gia Nhà Gái',
                    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
                    color: 'from-[#FFF8E7] to-white',
                    borderColor: 'border-[#C29B43]/30',
                  },
                  {
                    title: 'Lễ Gia Tiên',
                    side: 'Nhà Trai',
                    date: 'Thứ Bảy, 15/03/2025',
                    time: '11:00 Sáng',
                    location: 'Tư Gia Nhà Trai',
                    address: '456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
                    color: 'from-[#E6F3FF] to-white',
                    borderColor: 'border-[#1E40AF]/30',
                  },
                  {
                    title: 'Tiệc Cưới',
                    side: 'Nhà Trai',
                    date: 'Thứ Bảy, 15/03/2025',
                    time: '18:00 Chiều',
                    location: 'Nhà Hàng Tiệc Cưới Hoa Sen',
                    address: '789 Võ Văn Tần, Quận 3, TP.HCM',
                    color: 'from-[#FFE5E5] to-[#FFF8E7]',
                    borderColor: 'border-[#DC143C]/30',
                  },
                ].map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`p-8 bg-gradient-to-br ${event.color} rounded-3xl shadow-xl border-4 ${event.borderColor} space-y-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-3xl font-bold text-[#DC143C] mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                          {event.title}
                        </h3>
                        <p className="text-sm text-[#8B4513] font-semibold">{event.side}</p>
                      </div>
                      <Heart className="w-8 h-8 text-[#DC143C] fill-[#DC143C]" />
                    </div>

                    <div className="space-y-3 text-[#666]">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#C29B43]" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#C29B43]" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#C29B43] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-[#333]">{event.location}</p>
                          <p className="text-sm">{event.address}</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-[#DC143C] to-[#C29B43] hover:from-[#C41E3A] hover:to-[#B8860B] text-white font-semibold py-6 rounded-xl shadow-lg"
                    >
                      <MapPin className="w-5 h-5 mr-2" />
                      Xem Bản Đồ
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'map':
        return (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-6 py-20"
          >
            <div className="max-w-6xl mx-auto space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold text-center"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  background: 'linear-gradient(135deg, #DC143C, #C29B43)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Bản Đồ Địa Điểm
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#FFD700]/30"
              >
                <MapSection />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <div className="p-8 bg-gradient-to-br from-[#FFE5E5] to-white rounded-2xl border-2 border-[#DC143C]/20">
                  <h3 className="text-2xl font-bold text-[#DC143C] mb-4">Nhà Gái</h3>
                  <p className="text-[#666] mb-4">123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM</p>
                  <Button className="w-full bg-[#DC143C] hover:bg-[#C41E3A]">
                    <MapPin className="w-5 h-5 mr-2" />
                    Mở Google Maps
                  </Button>
                </div>
                <div className="p-8 bg-gradient-to-br from-[#FFF8E7] to-white rounded-2xl border-2 border-[#C29B43]/20">
                  <h3 className="text-2xl font-bold text-[#C29B43] mb-4">Nhà Trai</h3>
                  <p className="text-[#666] mb-4">456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM</p>
                  <Button className="w-full bg-[#C29B43] hover:bg-[#B8860B]">
                    <MapPin className="w-5 h-5 mr-2" />
                    Mở Google Maps
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'rsvp':
        return (
          <motion.div
            key="rsvp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-6 py-20"
          >
            <div className="max-w-2xl mx-auto space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold text-center"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  background: 'linear-gradient(135deg, #DC143C, #C29B43)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Xác Nhận Tham Dự
              </motion.h2>

              {!rsvpSubmitted ? (
                <motion.form
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setRsvpSubmitted(true);
                  }}
                  className="p-10 bg-white rounded-3xl shadow-2xl border-4 border-[#FFD700]/30 space-y-6"
                >
                  <div className="space-y-4">
                    <Input
                      placeholder="Họ và tên *"
                      required
                      className="h-14 text-lg border-2 border-[#C29B43]/30 focus:border-[#DC143C] rounded-xl"
                    />
                    <Input
                      type="tel"
                      placeholder="Số điện thoại *"
                      required
                      className="h-14 text-lg border-2 border-[#C29B43]/30 focus:border-[#DC143C] rounded-xl"
                    />
                    <Input
                      type="number"
                      placeholder="Số người tham dự *"
                      required
                      min="1"
                      className="h-14 text-lg border-2 border-[#C29B43]/30 focus:border-[#DC143C] rounded-xl"
                    />
                    <Textarea
                      placeholder="Lời chúc (không bắt buộc)"
                      rows={4}
                      className="text-lg border-2 border-[#C29B43]/30 focus:border-[#DC143C] rounded-xl resize-none"
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#DC143C] to-[#C29B43] hover:from-[#C41E3A] hover:to-[#B8860B] text-white rounded-xl shadow-lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Gửi Xác Nhận
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="p-12 bg-gradient-to-br from-[#FFE5E5] to-[#FFF8E7] rounded-3xl shadow-2xl border-4 border-[#FFD700]/50 text-center space-y-6"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0, -10, 0],
                    }}
                    transition={{ duration: 1 }}
                  >
                    <Heart className="w-24 h-24 mx-auto text-[#DC143C] fill-[#DC143C]" />
                  </motion.div>
                  <h3 className="text-4xl font-bold text-[#DC143C]" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Cảm Ơn Bạn!
                  </h3>
                  <p className="text-xl text-[#666]">
                    Chúng tôi rất vui mừng được đón tiếp bạn trong ngày trọng đại của chúng tôi.
                  </p>
                  <Button
                    onClick={() => setRsvpSubmitted(false)}
                    variant="outline"
                    className="border-2 border-[#C29B43] text-[#C29B43] hover:bg-[#C29B43] hover:text-white"
                  >
                    Gửi xác nhận khác
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 'qr':
        return (
          <motion.div
            key="qr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-6 py-20 flex items-center justify-center"
          >
            <div className="max-w-2xl w-full space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold text-center"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  background: 'linear-gradient(135deg, #DC143C, #C29B43)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Chia Sẻ Thiệp
              </motion.h2>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-12 bg-white rounded-3xl shadow-2xl border-4 border-[#FFD700]/30 text-center space-y-8"
              >
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-[#FFE5E5] to-[#FFF8E7] rounded-2xl flex items-center justify-center border-4 border-[#DC143C]/20">
                  <QrCode className="w-48 h-48 text-[#DC143C]" />
                </div>

                <div className="space-y-4">
                  <p className="text-xl font-semibold text-[#333]">Quét mã QR để xem thiệp</p>
                  <div className="p-4 bg-[#F5F5F5] rounded-xl">
                    <code className="text-sm text-[#666] break-all">
                      https://thiepcuoi.vn/minh-huong-2025
                    </code>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText('https://thiepcuoi.vn/minh-huong-2025');
                  }}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#DC143C] to-[#C29B43] hover:from-[#C41E3A] hover:to-[#B8860B] text-white rounded-xl shadow-lg"
                >
                  📋 Sao Chép Link
                </Button>
              </motion.div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFE5E5] relative overflow-hidden">
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={true} allowCustomMusic={true} />

      {/* Floating effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingLotus />
        <Fireworks />
      </div>

      {/* Red Lanterns */}
      <RedLanterns />

      {/* Traditional pattern background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lotus-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="25" fill="#DC143C" opacity="0.1"/>
              <circle cx="60" cy="60" r="15" fill="#C29B43" opacity="0.15"/>
              <circle cx="60" cy="60" r="8" fill="#FFD700" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lotus-pattern)" />
        </svg>
      </div>

      {/* Back to home */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-6 z-40"
      >
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-white/90 hover:bg-white text-[#DC143C] border-2 border-[#DC143C]/30 rounded-full px-6 py-3 shadow-lg backdrop-blur-sm font-semibold"
        >
          <Home className="w-5 h-5 mr-2" />
          Trang chủ
        </Button>
      </motion.div>

      {/* Page content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {currentPage > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1, x: -5 }}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-white/90 hover:bg-white rounded-full border-2 border-[#DC143C]/30 flex items-center justify-center shadow-xl transition-all"
          autoFocus
        >
          <ChevronLeft className="w-7 h-7 text-[#DC143C]" />
        </motion.button>
      )}

      {currentPage < pages.length - 1 && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1, x: 5 }}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-white/90 hover:bg-white rounded-full border-2 border-[#DC143C]/30 flex items-center justify-center shadow-xl transition-all"
          autoFocus
        >
          <ChevronRight className="w-7 h-7 text-[#DC143C]" />
        </motion.button>
      )}

      {/* Page indicators */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {pages.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentPage(i)}
            whileHover={{ scale: 1.2 }}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentPage
                ? 'bg-[#DC143C] w-8'
                : 'bg-[#DC143C]/30 hover:bg-[#DC143C]/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
