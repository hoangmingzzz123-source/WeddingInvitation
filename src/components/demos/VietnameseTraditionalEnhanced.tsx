import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Users, Gift, Send, Phone, Home, QrCode, Image as ImageIcon, ChevronLeft, ChevronRight, X, Mail } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';
import { PREMIUM_GALLERY_IMAGES } from '../../utils/imageConstants';

export function VietnameseTraditionalEnhanced() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', guests: '1', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const pages = ['cover', 'story', 'gallery', 'details', 'map', 'rsvp', 'banking', 'qr'];

  // Gallery images
  const gallery = [
    'https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp',
    PREMIUM_GALLERY_IMAGES.pinimg_11,
    PREMIUM_GALLERY_IMAGES.pinimg_2,
    PREMIUM_GALLERY_IMAGES.pinimg_4,
    PREMIUM_GALLERY_IMAGES.pinimg_5,
    PREMIUM_GALLERY_IMAGES.pinimg_6,
    PREMIUM_GALLERY_IMAGES.pinimg_7,
    PREMIUM_GALLERY_IMAGES.afamilycdn_1,
    PREMIUM_GALLERY_IMAGES.calibridal_wedding,
  ];

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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-xl md:text-2xl leading-relaxed text-[#333]"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Tình yêu là hành trình kỳ diệu, hôn nhân là bến đỗ hạnh phúc. Từ ngày đầu tiên gặp gỡ, chúng tôi đã biết rằng định mệnh đã sắp đặt cho chúng tôi một người. Hôm nay, trước sự chứng kiến của gia đình, bạn bè và người thân, chúng tôi hân hạnh thông báo về lễ thành hôn của chúng tôi.
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
                      onClick={() => setCurrentPage(4)}
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
                  <Button 
                    onClick={() => window.open('https://maps.google.com/?q=123+Nguyen+Hue+District+1+HCMC', '_blank')}
                    className="w-full bg-[#DC143C] hover:bg-[#C41E3A]"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Mở Google Maps
                  </Button>
                </div>
                <div className="p-8 bg-gradient-to-br from-[#FFF8E7] to-white rounded-2xl border-2 border-[#C29B43]/20">
                  <h3 className="text-2xl font-bold text-[#C29B43] mb-4">Nhà Trai</h3>
                  <p className="text-[#666] mb-4">456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM</p>
                  <Button 
                    onClick={() => window.open('https://maps.google.com/?q=456+Le+Loi+District+1+HCMC', '_blank')}
                    className="w-full bg-[#C29B43] hover:bg-[#B8860B]"
                  >
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
            <div className="max-w-3xl mx-auto space-y-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <h2
                  className="text-5xl md:text-6xl font-bold"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    background: 'linear-gradient(135deg, #DC143C, #C29B43)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Xác Nhận Tham Dự
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C29B43]" />
                  <Heart className="w-6 h-6 text-[#DC143C] fill-[#DC143C]" />
                  <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C29B43]" />
                </div>
                <p className="text-lg text-[#666] max-w-2xl mx-auto">
                  Sự hiện diện của bạn là niềm vinh hạnh cho chúng tôi. Vui lòng xác nhận tham dự để chúng tôi chuẩn bị chu đáo hơn.
                </p>
              </motion.div>

              {!rsvpSubmitted ? (
                <motion.form
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    try {
                      await submitRSVPWithFallback({
                        name: formData.name,
                        email: formData.phone,
                        attending: 'yes',
                        guestCount: parseInt(formData.guests) || 1,
                        message: formData.message || undefined,
                        template: 'Vietnamese Traditional Enhanced',
                      });
                      setRsvpSubmitted(true);
                    } catch (error) {
                      console.error('Error submitting RSVP:', error);
                      setRsvpSubmitted(true);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="relative"
                >
                  {/* Decorative corners */}
                  
                  <div className="p-8 md:p-12 bg-gradient-to-br from-white via-[#FFF8E7]/30 to-white rounded-3xl shadow-2xl border-4 border-[#FFD700]/30 space-y-4">
                    {/* Form Fields */}
                    <div className="space-y-6">
                      {/* Name Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-3"
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#8B4513] uppercase tracking-wider">
                          <Users className="w-4 h-4 text-[#DC143C]" />
                          Họ và Tên *
                        </label>
                        <div className="relative group">
                          <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nhập họ và tên của bạn"
                            className="h-14 text-lg border-2 border-[#C29B43]/30 focus:border-[#DC143C] rounded-xl pl-4 pr-12 transition-all group-hover:border-[#C29B43]/50 bg-white/80 backdrop-blur-sm"
                          />
                          <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C29B43]/50 pointer-events-none" />
                        </div>
                      </motion.div>

                      {/* Phone Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-3"
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#8B4513] uppercase tracking-wider">
                          <Phone className="w-4 h-4 text-[#DC143C]" />
                          Số Điện Thoại *
                        </label>
                        <div className="relative group">
                          <Input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Nhập số điện thoại"
                            className="h-14 text-lg border-2 border-[#C29B43]/30 focus:border-[#DC143C] rounded-xl pl-4 pr-12 transition-all group-hover:border-[#C29B43]/50 bg-white/80 backdrop-blur-sm"
                          />
                          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C29B43]/50 pointer-events-none" />
                        </div>
                      </motion.div>

                      {/* Guest Count Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-3"
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#8B4513] uppercase tracking-wider">
                          <Heart className="w-4 h-4 text-[#DC143C]" />
                          Số Người Tham Dự *
                        </label>
                        <div className="relative group">
                          <Input
                            type="number"
                            required
                            min="1"
                            max="20"
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                            placeholder="Số lượng khách"
                            className="h-14 text-lg border-2 border-[#C29B43]/30 focus:border-[#DC143C] rounded-xl pl-4 pr-12 transition-all group-hover:border-[#C29B43]/50 bg-white/80 backdrop-blur-sm"
                          />
                          <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C29B43]/50 pointer-events-none" />
                        </div>
                      </motion.div>

                      {/* Message Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-3"
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#8B4513] uppercase tracking-wider">
                          <Mail className="w-4 h-4 text-[#DC143C]" />
                          Lời Chúc (không bắt buộc)
                        </label>
                        <div className="relative group">
                          <Textarea
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Gửi lời chúc phúc đến đôi uyên ương..."
                            className="text-lg border-2 border-[#C29B43]/30 focus:border-[#DC143C] rounded-xl p-4 transition-all group-hover:border-[#C29B43]/50 resize-none bg-white/80 backdrop-blur-sm"
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 text-xl font-bold bg-gradient-to-r from-[#DC143C] via-[#C41E3A] to-[#C29B43] hover:from-[#C41E3A] hover:via-[#DC143C] hover:to-[#B8860B] text-white rounded-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(220,20,60,0.4)]"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-3"
                            />
                            Đang Gửi...
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6 mr-3" />
                            Gửi Xác Nhận Tham Dự
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Note */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="text-center text-sm text-[#999] italic"
                    >
                      * Thông tin của bạn sẽ được bảo mật tuyệt đối
                    </motion.p>
                  </div>

                  
                </motion.form>
              ) : (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
                  className="relative"
                >
                  {/* Success card decorative corners */}
                  <div className="absolute -top-3 -left-3 w-24 h-24 border-t-4 border-l-4 border-[#DC143C]/40 rounded-tl-3xl pointer-events-none" />
                  <div className="absolute -top-3 -right-3 w-24 h-24 border-t-4 border-r-4 border-[#C29B43]/40 rounded-tr-3xl pointer-events-none" />
                  <div className="absolute -bottom-3 -left-3 w-24 h-24 border-b-4 border-l-4 border-[#C29B43]/40 rounded-bl-3xl pointer-events-none" />
                  <div className="absolute -bottom-3 -right-3 w-24 h-24 border-b-4 border-r-4 border-[#DC143C]/40 rounded-br-3xl pointer-events-none" />

                  <div className="p-12 md:p-16 bg-gradient-to-br from-[#FFE5E5] via-white to-[#FFF8E7] rounded-3xl shadow-2xl border-4 border-[#FFD700]/50 text-center space-y-8">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0, -10, 0],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="relative inline-block"
                    >
                      <div className="absolute inset-0 bg-[#DC143C]/20 blur-3xl rounded-full" />
                      <Heart className="relative w-28 h-28 text-[#DC143C] fill-[#DC143C] drop-shadow-2xl" />
                    </motion.div>
                    
                    <div className="space-y-4">
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold text-[#DC143C]" 
                        style={{ fontFamily: '"Playfair Display", serif' }}
                      >
                        Cảm Ơn Bạn Rất Nhiều!
                      </motion.h3>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-32 h-1 mx-auto bg-gradient-to-r from-transparent via-[#C29B43] to-transparent rounded-full"
                      />
                    </div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-xl md:text-2xl text-[#666] leading-relaxed max-w-xl mx-auto"
                    >
                      Chúng tôi rất vui mừng và hạnh phúc được đón tiếp bạn trong ngày trọng đại nhất cuộc đời chúng tôi.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                    >
                      <Button
                        onClick={() => {
                          setRsvpSubmitted(false);
                          setFormData({ name: '', phone: '', guests: '1', message: '' });
                        }}
                        variant="outline"
                        className="px-8 py-6 text-lg border-2 border-[#C29B43] text-[#C29B43] hover:bg-[#C29B43] hover:text-white rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Gửi xác nhận khác
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 'banking':
        return (
          <motion.div
            key="banking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-6 py-20"
          >
            <div className="max-w-5xl mx-auto space-y-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <h2
                  className="text-5xl md:text-6xl font-bold"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    background: 'linear-gradient(135deg, #DC143C, #C29B43)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Mừng Cưới
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C29B43]" />
                  <Gift className="w-6 h-6 text-[#DC143C] fill-[#DC143C]" />
                  <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C29B43]" />
                </div>
                <p className="text-lg text-[#666] max-w-2xl mx-auto">
                  Thay vì hoa và quà tặng, chúng tôi trân trọng nhận được lời chúc phúc và sự hiện diện của bạn.
                </p>
              </motion.div>

              {/* Banking Cards */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Bride */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative group"
                >
                  {/* Decorative corners */}
                  <div className="absolute -top-2 -left-2 w-16 h-16 border-t-4 border-l-4 border-[#DC143C]/40 rounded-tl-2xl pointer-events-none z-10" />
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-4 border-r-4 border-[#DC143C]/40 rounded-br-2xl pointer-events-none z-10" />
                  
                  <div className="p-8 bg-gradient-to-br from-[#FFE5E5] via-white to-[#FFF8E7] rounded-2xl shadow-2xl border-4 border-[#FFD700]/30 space-y-6 hover:scale-[1.02] transition-transform">
                    {/* Title */}
                    <div className="text-center space-y-2 pb-4 border-b-2 border-[#DC143C]/20">
                      <Heart className="w-8 h-8 mx-auto text-[#DC143C] fill-[#DC143C]" />
                      <h3 className="text-2xl font-bold text-[#DC143C]" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Cô Dâu
                      </h3>
                      <p className="text-lg text-[#666]">Trần Thị Hương</p>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center py-4">
                      <div className="relative p-4 bg-white rounded-xl border-4 border-[#DC143C]/30 shadow-lg group-hover:shadow-2xl transition-shadow">
                        <div className="w-48 h-48 bg-gradient-to-br from-[#DC143C]/10 to-[#FFD700]/10 flex items-center justify-center rounded-lg">
                          <QrCode className="w-40 h-40 text-[#DC143C]" />
                        </div>
                      </div>
                    </div>

                    {/* Bank Info */}
                    <div className="space-y-3 text-center">
                      <div className="p-4 bg-white/80 rounded-xl border-2 border-[#DC143C]/20">
                        <p className="text-sm text-[#8B4513] font-semibold mb-1">Ngân hàng</p>
                        <p className="text-lg font-bold text-[#333]">Vietcombank</p>
                      </div>
                      <div className="p-4 bg-white/80 rounded-xl border-2 border-[#DC143C]/20">
                        <p className="text-sm text-[#8B4513] font-semibold mb-1">Số tài khoản</p>
                        <p className="text-lg font-bold text-[#333] font-mono">1234567890</p>
                      </div>
                      <div className="p-4 bg-white/80 rounded-xl border-2 border-[#DC143C]/20">
                        <p className="text-sm text-[#8B4513] font-semibold mb-1">Chủ tài khoản</p>
                        <p className="text-lg font-bold text-[#333]">TRAN THI HUONG</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Groom */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative group"
                >
                  {/* Decorative corners */}
                  <div className="absolute -top-2 -left-2 w-16 h-16 border-t-4 border-l-4 border-[#C29B43]/40 rounded-tl-2xl pointer-events-none z-10" />
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-4 border-r-4 border-[#C29B43]/40 rounded-br-2xl pointer-events-none z-10" />
                  
                  <div className="p-8 bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFE5E5] rounded-2xl shadow-2xl border-4 border-[#FFD700]/30 space-y-6 hover:scale-[1.02] transition-transform">
                    {/* Title */}
                    <div className="text-center space-y-2 pb-4 border-b-2 border-[#C29B43]/20">
                      <Heart className="w-8 h-8 mx-auto text-[#C29B43] fill-[#C29B43]" />
                      <h3 className="text-2xl font-bold text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Chú Rể
                      </h3>
                      <p className="text-lg text-[#666]">Nguyễn Văn Minh</p>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center py-4">
                      <div className="relative p-4 bg-white rounded-xl border-4 border-[#C29B43]/30 shadow-lg group-hover:shadow-2xl transition-shadow">
                        <div className="w-48 h-48 bg-gradient-to-br from-[#C29B43]/10 to-[#FFD700]/10 flex items-center justify-center rounded-lg">
                          <QrCode className="w-40 h-40 text-[#C29B43]" />
                        </div>
                      </div>
                    </div>

                    {/* Bank Info */}
                    <div className="space-y-3 text-center">
                      <div className="p-4 bg-white/80 rounded-xl border-2 border-[#C29B43]/20">
                        <p className="text-sm text-[#8B4513] font-semibold mb-1">Ngân hàng</p>
                        <p className="text-lg font-bold text-[#333]">Techcombank</p>
                      </div>
                      <div className="p-4 bg-white/80 rounded-xl border-2 border-[#C29B43]/20">
                        <p className="text-sm text-[#8B4513] font-semibold mb-1">Số tài khoản</p>
                        <p className="text-lg font-bold text-[#333] font-mono">0987654321</p>
                      </div>
                      <div className="p-4 bg-white/80 rounded-xl border-2 border-[#C29B43]/20">
                        <p className="text-sm text-[#8B4513] font-semibold mb-1">Chủ tài khoản</p>
                        <p className="text-lg font-bold text-[#333]">NGUYEN VAN MINH</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Thank You Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center p-8 bg-gradient-to-r from-[#FFE5E5] via-[#FFF8E7] to-[#FFE5E5] rounded-2xl border-2 border-[#FFD700]/30"
              >
                <p className="text-xl md:text-2xl text-[#666] italic" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  "Tình cảm và sự hiện diện của bạn là món quà quý giá nhất dành cho chúng tôi."
                </p>
              </motion.div>
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
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#DC143C] to-[#C29B43] hover:from-[#C41E3A] hover:to-[#B8860B] text-white rounded-xl shadow-lg transition-all"
                >
                  {copied ? (
                    <>
                      ✓ Đã Sao Chép!
                    </>
                  ) : (
                    <>
                      📋 Sao Chép Link
                    </>
                  )}
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
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
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
