import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Leaf, MapPin, Heart, Gift, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { FloatingParticles } from '../effects/FloatingParticles';
import { GoldenGlowButton } from '../effects/GoldenGlowButton';

export function GreenElegance() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const pages = ['Cover', 'Story', 'Gallery', 'Details', 'RSVP'];

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] via-[#F1F8E9] to-[#E8F5E9] overflow-hidden relative">
      <MusicPlayer autoPlay={true} showVolumeControl={true} />
      <FloatingParticles theme="green" density="medium" />

      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 1.5, type: "spring" }}
              className="relative"
            >
              <Leaf className="w-32 h-32 text-white" />
              <motion.div
                className="absolute inset-0 blur-2xl opacity-50"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                style={{
                  background: 'radial-gradient(circle, #fff, transparent)',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed top-4 left-4 z-40">
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-white/80 hover:bg-white text-[#2E7D32] backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Page Arrows */}
      {currentPage > 0 && (
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-[#2E7D32]" />
        </motion.button>
      )}

      {currentPage < pages.length - 1 && (
        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
        >
          <ChevronRight className="w-6 h-6 text-[#2E7D32]" />
        </motion.button>
      )}

      {/* Page Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {pages.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentPage(i)}
            whileHover={{ scale: 1.2 }}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentPage ? 'bg-[#2E7D32] w-8' : 'bg-[#2E7D32]/30'
            }`}
          />
        ))}
      </div>

      {/* Pages Content */}
      <AnimatePresence mode="wait">
        {currentPage === 0 && <CoverPage key="cover" />}
        {currentPage === 1 && <StoryPage key="story" />}
        {currentPage === 2 && <GalleryPage key="gallery" />}
        {currentPage === 3 && <DetailsPage key="details" />}
        {currentPage === 4 && <RSVPPage key="rsvp" />}
      </AnimatePresence>
    </div>
  );
}

// Cover Page
function CoverPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-8"
    >
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Decorative Leaves */}
        <motion.div
          initial={{ rotate: -45, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="inline-block"
        >
          <Leaf className="w-16 h-16 text-[#2E7D32] mx-auto" />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h1 
            className="text-6xl md:text-8xl text-[#1B5E20]"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Anh & Nhung
          </h1>
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="inline-block"
          >
            <Heart className="w-8 h-8 text-[#FF6B9D] fill-current" />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl text-[#2E7D32]"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          12 • 12 • 2025
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-8"
        >
          <p className="text-lg text-[#558B2F] italic mb-6">
            "Tình yêu không chỉ là nhìn nhau,<br />
            mà là cùng nhìn về một hướng"
          </p>
          
          <div className="inline-block px-8 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-[#2E7D32]">
              🌿 Green Garden Wedding 🌿
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Story Page
function StoryPage() {
  const timeline = [
    { year: '2020', event: 'Lần đầu gặp gỡ', icon: '💚' },
    { year: '2021', event: 'Bắt đầu hẹn hò', icon: '💕' },
    { year: '2023', event: 'Cầu hôn', icon: '💍' },
    { year: '2025', event: 'Đám cưới', icon: '💐' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen flex items-center justify-center p-8"
    >
      <div className="max-w-4xl w-full space-y-12">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl text-center text-[#1B5E20]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Câu Chuyện Tình Yêu
        </motion.h2>

        <div className="space-y-8">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-3xl"
              >
                {item.icon}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              >
                <div className="text-2xl text-[#2E7D32] mb-2">{item.year}</div>
                <div className="text-lg text-[#558B2F]">{item.event}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Gallery Page
function GalleryPage() {
  const photos = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600',
    'https://images.unsplash.com/photo-1522673607211-8f218747f297?w=600',
    'https://images.unsplash.com/photo-1545619376-bf509cf743e0?w=600',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-8"
    >
      <div className="max-w-6xl w-full space-y-8">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl text-center text-[#1B5E20]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          <Camera className="w-12 h-12 inline-block mb-2" /> Album Ảnh
        </motion.h2>

        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
            >
              <ImageWithFallback
                src={photo}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Details Page
function DetailsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="min-h-screen flex items-center justify-center p-8"
    >
      <div className="max-w-2xl w-full space-y-8">
        <motion.h2
          className="text-5xl text-center text-[#1B5E20]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Thông Tin Tiệc Cưới
        </motion.h2>

        <div className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg space-y-4"
          >
            <div className="flex items-center gap-4 text-[#2E7D32]">
              <MapPin className="w-6 h-6" />
              <div>
                <div className="text-sm text-[#558B2F]">Địa điểm</div>
                <div className="text-lg">Vườn Xuân Green Garden</div>
                <div className="text-sm">123 Đường Hoa, Hà Nội</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-4 text-[#2E7D32] mb-4">
              <Gift className="w-6 h-6" />
              <div className="text-lg">Mừng cưới</div>
            </div>
            <div className="text-sm text-[#558B2F]">
              Nếu bạn muốn gửi lời chúc, vui lòng chuyển khoản:<br />
              STK: 1234567890 - Ngân hàng ABC<br />
              Chủ TK: NGUYEN VAN A
            </div>
          </motion.div>

          <GoldenGlowButton icon={MapPin} variant="primary" className="w-full">
            Xem Bản Đồ
          </GoldenGlowButton>
        </div>
      </div>
    </motion.div>
  );
}

// RSVP Page
function RSVPPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen flex items-center justify-center p-8"
    >
      <div className="max-w-xl w-full">
        <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl space-y-6">
          <h2 
            className="text-4xl text-center text-[#1B5E20]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Xác Nhận Tham Dự
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all"
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all"
            />
            <select className="w-full px-4 py-3 rounded-xl border-2 border-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all">
              <option>Tôi sẽ tham dự</option>
              <option>Rất tiếc, tôi không thể đến</option>
            </select>
            <textarea
              placeholder="Lời nhắn"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all"
            />
          </div>

          <GoldenGlowButton icon={Heart} variant="primary" className="w-full">
            Gửi Xác Nhận
          </GoldenGlowButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
