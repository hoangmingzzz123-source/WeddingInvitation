import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Send, Home, ChevronLeft, ChevronRight, QrCode, X, Sparkles, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';

export function LuxuryGoldCinematicEnhanced() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pages = ['cover', 'story', 'gallery', 'details', 'map', 'rsvp', 'qr'];

  const gallery = [
       'https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp',
    'https://tuarts.net/wp-content/uploads/2015/12/117937145_4255715104503639_2707126124250519806_o.jpg'  ,
    'https://tuarts.net/wp-content/uploads/2020/05/60770796_2734489913292840_6737769278910496768_o-1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwtVDQB3iSQHP8hKhCyVCD1ictAV_LqN0YA&s',
    'https://demxanh.com/media/news/2810_studio-thai-binh-1.jpg' ,
    'https://tuarts.net/wp-content/uploads/2018/08/39900495_2187804601294710_8118125377903132672_o-801x1200.jpg'
    
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced bokeh particles - larger and more
  const bokehParticles = Array.from({ length: 25 }, (_, i) => ({
    size: Math.random() * 150 + 80,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 12,
    delay: Math.random() * 8,
  }));

  // Golden sparkles
  const GoldenSparkles = () => (
    <>
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-4 h-4 text-[#FFD700]" />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 relative"
          >
            {/* Geometric luxury frame */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Corner decorations */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-32"
                  style={{
                    top: i < 2 ? '8%' : 'auto',
                    bottom: i >= 2 ? '8%' : 'auto',
                    left: i % 2 === 0 ? '5%' : 'auto',
                    right: i % 2 === 1 ? '5%' : 'auto',
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d={i < 2 
                        ? i % 2 === 0
                          ? "M 0,30 L 0,0 L 30,0" // Top-left
                          : "M 70,0 L 100,0 L 100,30" // Top-right
                        : i % 2 === 0
                          ? "M 0,70 L 0,100 L 30,100" // Bottom-left
                          : "M 70,100 L 100,100 L 100,70" // Bottom-right
                      }
                      stroke="url(#goldGradient)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C29B43" />
                        <stop offset="50%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#C29B43" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 text-center space-y-16 max-w-5xl">
              {/* Luxury diamond icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, type: "spring" }}
                className="relative"
              >
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="relative"
                >
                  <svg width="120" height="120" viewBox="0 0 100 100" className="mx-auto">
                    <defs>
                      <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#FFF" />
                        <stop offset="100%" stopColor="#C29B43" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="50,10 80,40 50,90 20,40"
                      fill="url(#diamondGradient)"
                      stroke="#FFD700"
                      strokeWidth="2"
                    />
                    <polygon
                      points="50,10 65,25 50,40 35,25"
                      fill="rgba(255,255,255,0.5)"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  className="absolute inset-0 blur-2xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8), transparent)',
                  }}
                />
              </motion.div>

              {/* Wedding announcement */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <motion.p
                  className="text-sm tracking-[0.5em] uppercase"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFF, #FFD700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  Hôn Lễ Của
                </motion.p>
                <h1 
                  className="text-6xl md:text-8xl font-bold"
                  style={{ 
                    fontFamily: '"Cormorant Garamond", serif',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFF 50%, #FFD700 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
                  }}
                >
                  Vũ Thế Long
                </h1>
              </motion.div>

              {/* Ampersand with animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Heart 
                    className="w-16 h-16 mx-auto"
                    style={{
                      color: '#FFD700',
                      filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
                    }}
                    fill="#FFD700"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <h1 
                  className="text-6xl md:text-8xl font-bold"
                  style={{ 
                    fontFamily: '"Cormorant Garamond", serif',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFF 50%, #FFD700 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
                  }}
                >
                  Cao Thanh Ngân
                </h1>
              </motion.div>

              {/* Date */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="relative inline-block"
              >
                <motion.div
                  className="absolute inset-0 border-4 rounded-2xl"
                  style={{
                    borderImage: 'linear-gradient(135deg, #FFD700, #FFF, #FFD700) 1',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(255, 215, 0, 0.3)',
                      '0 0 40px rgba(255, 215, 0, 0.6)',
                      '0 0 20px rgba(255, 215, 0, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <div className="relative px-16 py-8 bg-black/40 backdrop-blur-md rounded-2xl border-4 border-[#FFD700]">
                  <p className="text-base text-[#FFD700] mb-2 tracking-widest">SAVE THE DATE</p>
                  <p className="text-4xl md:text-5xl font-bold text-white">
                    15 • 03 • 2025
                  </p>
                </div>
              </motion.div>

              {/* Scroll hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-2"
                  style={{ color: '#FFD700' }}
                >
                  <p className="text-sm tracking-widest">VUỐT ĐỂ TIẾP TỤC</p>
                  <ChevronRight className="w-6 h-6" />
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
            className="min-h-screen flex items-center justify-center px-6 py-20"
          >
            <div className="max-w-4xl space-y-16 text-center">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-7xl font-bold"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  background: 'linear-gradient(135deg, #FFD700, #FFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Câu Chuyện Tình Yêu
              </motion.h2>

              <motion.div
                className="relative p-12 bg-black/30 backdrop-blur-md rounded-3xl border-2 border-[#FFD700]/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                  animate={{
                    background: [
                      'linear-gradient(90deg, transparent, transparent)',
                      'linear-gradient(90deg, transparent, rgba(255,215,0,0.2), transparent)',
                      'linear-gradient(90deg, transparent, transparent)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="text-2xl md:text-3xl leading-relaxed text-white/90"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  Giữa dòng đời xuôi ngược, chúng tôi gặp nhau bằng một chữ duyên. Từ hai con người xa lạ, học cách yêu thương, thấu hiểu và cùng nắm tay đi đến hôm nay. Hôn lễ này là lời hẹn trăm năm bắt đầu.
                </motion.p>
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
              >
                {[
                  { year: '2019', title: 'Gặp Gỡ', icon: '✨' },
                  { year: '2021', title: 'Yêu Nhau', icon: '❤️' },
                  { year: '2024', title: 'Đính Hôn', icon: '💍' },
                  { year: '2025', title: 'Kết Hôn', icon: '💒' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.15 }}
                    whileHover={{ 
                      y: -10,
                      boxShadow: '0 20px 40px rgba(255, 215, 0, 0.3)',
                    }}
                    className="p-8 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-2xl border-2 border-[#FFD700]/20 backdrop-blur-sm"
                  >
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <div className="text-3xl font-bold text-[#FFD700] mb-2">{item.year}</div>
                    <div className="text-base text-white/70">{item.title}</div>
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
            className="min-h-screen px-6 py-20"
          >
            <div className="max-w-7xl mx-auto space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-7xl font-bold text-center"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  background: 'linear-gradient(135deg, #FFD700, #FFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Album Ảnh
              </motion.h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      zIndex: 10,
                      boxShadow: '0 20px 60px rgba(255, 215, 0, 0.4)',
                    }}
                    onClick={() => setSelectedImage(i)}
                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 border-[#FFD700]/20 group"
                  >
                    <img 
                      src={img} 
                      alt={`Wedding ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                        <Sparkles className="w-6 h-6 mx-auto" />
                      </div>
                    </div>
                    {/* Gold frame effect */}
                    <div className="absolute inset-0 border-4 border-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
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
                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#FFD700]/20 hover:bg-[#FFD700]/30 border-2 border-[#FFD700]"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                  <motion.img
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    src={gallery[selectedImage]}
                    alt="Full size"
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border-4 border-[#FFD700]"
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
                className="text-6xl md:text-7xl font-bold text-center"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  background: 'linear-gradient(135deg, #FFD700, #FFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Chi Tiết Sự Kiện
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-10">
                {[
                  {
                    title: 'Lễ Thành Hôn',
                    date: 'Thứ Bảy, 15 Tháng 3, 2025',
                    time: '16:00',
                    location: 'Hội Trường Lớn',
                    address: 'Khách Sạn Sang Trọng, 123 Đại Lộ Vàng, Quận 1',
                    icon: '💒',
                    gradient: 'from-[#FFD700]/20 via-[#FFA500]/10 to-transparent',
                  },
                  {
                    title: 'Tiệc Chiêu Đãi',
                    date: 'Thứ Bảy, 15 Tháng 3, 2025',
                    time: '18:30',
                    location: 'Phòng Pha Lê',
                    address: 'Khách Sạn Sang Trọng, 123 Đại Lộ Vàng, Quận 1',
                    icon: '🥂',
                    gradient: 'from-[#C29B43]/20 via-[#FFD700]/10 to-transparent',
                  },
                ].map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: i * 0.2,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{ 
                      y: -15,
                      scale: 1.02,
                      boxShadow: '0 40px 80px rgba(255, 215, 0, 0.4)',
                    }}
                    className={`relative p-12 bg-gradient-to-br ${event.gradient} backdrop-blur-xl rounded-[2rem] border-4 border-[#FFD700]/40 space-y-8 overflow-hidden group`}
                  >
                    {/* Animated background glow */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.15), transparent 70%)',
                      }}
                    />

                    {/* Corner decoration */}
                    <div className="absolute top-4 right-4 text-6xl opacity-20 group-hover:opacity-40 transition-opacity">
                      {event.icon}
                    </div>

                    {/* Title section */}
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                      >
                        <Heart className="w-12 h-12 text-[#FFD700] mb-4" fill="#FFD700" />
                      </motion.div>
                      <h3 className="text-5xl font-bold mb-3" style={{ 
                        fontFamily: '"Cormorant Garamond", serif',
                        background: 'linear-gradient(135deg, #FFD700, #FFF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        {event.title}
                      </h3>
                      <div className="h-1 w-24 bg-gradient-to-r from-[#FFD700] to-transparent rounded-full" />
                    </div>

                    {/* Details section */}
                    <div className="relative z-10 space-y-5">
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-5 p-4 bg-black/20 rounded-2xl backdrop-blur-sm border border-[#FFD700]/20"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C29B43] flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-lg text-white font-medium px-4">{event.date}</span>
                      </motion.div>

                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-5 p-4 bg-black/20 rounded-2xl backdrop-blur-sm border border-[#FFD700]/20"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C29B43] flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-lg text-white font-medium px-4">{event.time}</span>
                      </motion.div>

                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-5 p-4 bg-black/20 rounded-2xl backdrop-blur-sm border border-[#FFD700]/20"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C29B43] flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-black" />
                        </div>
                        <div className="flex-1 px-4">
                          <p className="text-xl font-bold text-[#FFD700] mb-1">{event.location}</p>
                          <p className="text-base text-white/70 leading-relaxed">{event.address}</p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Action button */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className="relative w-full h-16 text-xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] hover:from-[#FFF] hover:via-[#FFD700] hover:to-[#FFF] text-black rounded-2xl shadow-2xl shadow-[#FFD700]/30 overflow-hidden group/btn"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        />
                        <MapPin className="w-6 h-6 mr-3 relative z-10" />
                        <span className="relative z-10">Xem Bản Đồ</span>
                      </Button>
                    </motion.div>
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
                className="text-6xl md:text-7xl font-bold text-center"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  background: 'linear-gradient(135deg, #FFD700, #FFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Địa Điểm
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/30 backdrop-blur-md rounded-3xl overflow-hidden border-4 border-[#FFD700]/30"
              >
                <MapSection />
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
            className="min-h-screen px-6 py-20 flex items-center justify-center"
          >
            <div className="max-w-2xl w-full space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-7xl font-bold text-center"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  background: 'linear-gradient(135deg, #FFD700, #FFF)',
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
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!attending) return;
                    
                    setIsSubmitting(true);
                    try {
                      await submitRSVPWithFallback({
                        name: formData.name,
                        email: formData.email || undefined,
                        attending: attending,
                        guestCount: attending === 'yes' ? guestCount : 0,
                        message: formData.message || undefined,
                        template: 'Luxury Gold Cinematic Enhanced',
                      });
                      setRsvpSubmitted(true);
                    } catch (error) {
                      console.error('Error submitting RSVP:', error);
                      setRsvpSubmitted(true);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="p-12 bg-black/30 backdrop-blur-md rounded-3xl border-2 border-[#FFD700]/30 space-y-6"
                >
                  {/* Attendance Buttons */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAttending('yes')}
                      className={`p-8 rounded-2xl border-2 transition-all ${
                        attending === 'yes'
                          ? 'bg-[#FFD700] border-[#FFD700] text-black shadow-lg shadow-[#FFD700]/50'
                          : 'bg-white/5 border-[#FFD700]/30 hover:border-[#FFD700]/50 text-white'
                      }`}
                    >
                      <div className="text-4xl mb-2">✓</div>
                      <div className="text-xl font-bold">Có, tôi sẽ đến</div>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAttending('no')}
                      className={`p-8 rounded-2xl border-2 transition-all ${
                        attending === 'no'
                          ? 'bg-[#FFD700] border-[#FFD700] text-black shadow-lg shadow-[#FFD700]/50'
                          : 'bg-white/5 border-[#FFD700]/30 hover:border-[#FFD700]/50 text-white'
                      }`}
                    >
                      <div className="text-4xl mb-2">✗</div>
                      <div className="text-xl font-bold">Không thể đến</div>
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {attending === 'yes' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <Input
                          placeholder="Họ và tên *"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-16 text-lg bg-white/10 border-2 border-[#FFD700]/30 focus:border-[#FFD700] rounded-xl text-white placeholder:text-white/50"
                        />
                        
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFD700]" />
                          <Input
                            type="email"
                            placeholder="Email (không bắt buộc)"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-16 pl-12 text-lg bg-white/10 border-2 border-[#FFD700]/30 focus:border-[#FFD700] rounded-xl text-white placeholder:text-white/50"
                          />
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border-2 border-[#FFD700]/30">
                          <label className="text-white/90 text-lg flex-1">Số lượng khách:</label>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                              className="w-12 h-12 rounded-full bg-white/10 border-2 border-[#FFD700]/30 hover:bg-[#FFD700]/30 text-white text-2xl font-bold"
                            >
                              −
                            </button>
                            <span className="text-3xl font-bold text-[#FFD700] w-16 text-center">{guestCount}</span>
                            <button
                              type="button"
                              onClick={() => setGuestCount(guestCount + 1)}
                              className="w-12 h-12 rounded-full bg-white/10 border-2 border-[#FFD700]/30 hover:bg-[#FFD700]/30 text-white text-2xl font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <Textarea
                          placeholder="Lời nhắn (không bắt buộc)"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="text-lg bg-white/10 border-2 border-[#FFD700]/30 focus:border-[#FFD700] rounded-xl resize-none text-white placeholder:text-white/50"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {attending && (
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#C29B43] hover:from-[#FFF] hover:to-[#FFD700] text-black rounded-xl shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 mr-2 border-2 border-black border-t-transparent rounded-full"
                          />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 mr-2" />
                          Gửi Xác Nhận
                        </>
                      )}
                    </Button>
                  )}
                </motion.form>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="p-16 bg-black/30 backdrop-blur-md rounded-3xl border-4 border-[#FFD700] text-center space-y-8"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0, -10, 0],
                    }}
                    transition={{ duration: 1 }}
                  >
                    <Heart className="w-28 h-28 mx-auto text-[#FFD700]" fill="#FFD700" />
                  </motion.div>
                  <h3 className="text-5xl font-bold text-[#FFD700]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    Cảm Ơn Bạn!
                  </h3>
                  <p className="text-2xl text-white/90">
                    Chúng tôi rất mong được đón tiếp bạn trong ngày trọng đại.
                  </p>
                  <Button
                    onClick={() => setRsvpSubmitted(false)}
                    variant="outline"
                    className="border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black h-14 px-8 text-lg"
                  >
                    Gửi Tiếp
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
                className="text-6xl md:text-7xl font-bold text-center"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  background: 'linear-gradient(135deg, #FFD700, #FFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Quét mã QR
              </motion.h2>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-16 bg-black/30 backdrop-blur-md rounded-3xl border-4 border-[#FFD700]/30 text-center space-y-10"
              >
                <div className="w-72 h-72 mx-auto bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-2xl flex items-center justify-center border-4 border-[#FFD700]/40 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: [
                        'linear-gradient(45deg, transparent, rgba(255,215,0,0.1), transparent)',
                        'linear-gradient(225deg, transparent, rgba(255,215,0,0.1), transparent)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />
                  <QrCode className="w-full h-full text-[#FFD700] relative z-10 p-4" />
                </div>

                <div className="space-y-4">
                  <p className="text-2xl font-semibold text-white">Mừng cưới cô dâu chú rể</p>
                  <div className="p-4 bg-white/10 rounded-xl border border-[#FFD700]/30">
                    <code className="text-base text-[#FFD700] break-all text-center">
                      Nguyen Van A - 1998794321 - BIDV
                    </code>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText('Nguyen Van A - 1998794321 - BIDV');
                  }}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#C29B43] hover:from-[#FFF] hover:to-[#FFD700] text-black rounded-xl shadow-lg"
                >
                  📋 Sao chép STK
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
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white overflow-hidden">
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={true} allowCustomMusic={true} />

      {/* Enhanced Bokeh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {bokehParticles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? 'rgba(255, 215, 0, 0.4)' : 
                i % 3 === 1 ? 'rgba(194, 155, 67, 0.3)' : 
                'rgba(255, 165, 0, 0.35)'
              }, transparent)`,
            }}
            animate={{
              x: [0, Math.random() * 60 - 30, 0],
              y: [0, Math.random() * 60 - 30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Golden Sparkles */}
      <div className="fixed inset-0 pointer-events-none">
        <GoldenSparkles />
      </div>

      {/* Gold Logo Intro */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 blur-3xl"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                style={{
                  background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6), transparent)',
                }}
              />
              <h1 
                className="text-9xl relative z-10"
                style={{ 
                  fontFamily: '"Great Vibes", cursive',
                  background: 'linear-gradient(135deg, #FFD700, #FFF, #FFD700)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                L & N
              </h1>
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                }}
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: 2,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-6 z-40"
      >
        <Button
          onClick={() => window.location.hash = '#/'}
          className="bg-white/10 hover:bg-[#FFD700] hover:text-black text-white border-2 border-[#FFD700]/50 rounded-full px-6 py-3 shadow-lg backdrop-blur-sm font-semibold transition-all"
        >
          <Home className="w-5 h-5 mr-2" />
          Trang chủ
        </Button>
      </motion.div>

      {/* Gold Border Frame */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-10"
        animate={{
          boxShadow: [
            'inset 0 0 30px rgba(255, 215, 0, 0.3)',
            'inset 0 0 60px rgba(255, 215, 0, 0.6)',
            'inset 0 0 30px rgba(255, 215, 0, 0.3)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          border: '3px solid rgba(255, 215, 0, 0.5)',
        }}
      />

      {/* Page content */}
      <div className="relative z-20">
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
          className="fixed left-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-white/10 hover:bg-[#FFD700]/30 rounded-full border-2 border-[#FFD700]/50 flex items-center justify-center shadow-xl transition-all backdrop-blur-sm"
          autoFocus
        >
          <ChevronLeft className="w-7 h-7 text-[#FFD700]" />
        </motion.button>
      )}

      {currentPage < pages.length - 1 && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1, x: 5 }}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-white/10 hover:bg-[#FFD700]/30 rounded-full border-2 border-[#FFD700]/50 flex items-center justify-center shadow-xl transition-all backdrop-blur-sm"
          autoFocus
        >
          <ChevronRight className="w-7 h-7 text-[#FFD700]" />
        </motion.button>
      )}

      {/* Page indicators */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {pages.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentPage(i)}
            whileHover={{ scale: 1.2 }}
            className={`h-3 rounded-full transition-all ${
              i === currentPage
                ? 'bg-[#FFD700] w-10 shadow-lg shadow-[#FFD700]/50'
                : 'bg-white/30 w-3 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
