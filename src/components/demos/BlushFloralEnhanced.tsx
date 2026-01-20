import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Heart, Calendar, MapPin, Clock, Send, Home, QrCode, Mail, Phone, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { PREMIUM_GALLERY_IMAGES } from '../../utils/imageConstants';

export function BlushFloralEnhanced() {
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
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const coupleNames = "Minh & Hương";
  const loveStory = `Giữa những điều bình dị của đời sống Việt, chúng tôi gặp nhau và thương nhau từ lúc nào không hay. Tình yêu lớn lên qua từng ngày giản đơn, để hôm nay cùng nắm tay viết tiếp một chặng đường mới.
Chúng tôi trân trọng kính mời Quý khách đến chung vui trong ngày trọng đại của chúng tôi, để cùng chia sẻ niềm hạnh phúc và khởi đầu cho một hành trình mới đầy yêu thương. Sự hiện diện của Quý khách là món quà vô giá đối với chúng tôi.`;
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
          {currentPage === 6 && <QRCodePage copied={copied} setCopied={setCopied} guestName={getGuestName()} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Enhanced Cover Page
function CoverPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Corner Decorations */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-[#FF69B4] rounded-tl-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="absolute top-8 right-8 w-24 h-24 border-t-4 border-r-4 border-[#FF69B4] rounded-tr-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="absolute bottom-8 left-8 w-24 h-24 border-b-4 border-l-4 border-[#FF69B4] rounded-bl-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-[#FF69B4] rounded-br-xl"
      />

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
            style={{ fontFamily: '"Allura", cursive' }}
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
              rotate: [0, 5, -5, 0],
              filter: [
                'drop-shadow(0 0 0px rgba(255, 105, 180, 0))',
                'drop-shadow(0 0 20px rgba(255, 105, 180, 0.8))',
                'drop-shadow(0 0 0px rgba(255, 105, 180, 0))'
              ],
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
            style={{ fontFamily: '"Allura", cursive' }}
          >
            Câu Chuyện Tình Yêu
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <motion.div 
              animate={{ scaleX: [0.8, 1, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#FFB6C1]" 
            />
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.2, 1],
                filter: [
                  'drop-shadow(0 0 0px rgba(255, 105, 180, 0))',
                  'drop-shadow(0 0 15px rgba(255, 105, 180, 0.8))',
                  'drop-shadow(0 0 0px rgba(255, 105, 180, 0))'
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-6 h-6 text-[#FF69B4]" />
            </motion.div>
            <motion.div 
              animate={{ scaleX: [0.8, 1, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#FFB6C1]" 
            />
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
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              whileHover={{
                rotateY: 5,
                rotateX: -3,
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(255, 105, 180, 0.3)',
                transition: { type: 'spring', stiffness: 300 },
              }}
              transition={{ duration: 0.8, delay: 1.5 + index * 0.2, type: 'spring', stiffness: 100 }}
              className="bg-gradient-to-br from-white/80 to-[#FFF0F5]/80 backdrop-blur-sm p-8 rounded-2xl text-center shadow-lg border border-[#FFB6C1]/20 relative overflow-hidden group"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                initial={false}
              />
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
    PREMIUM_GALLERY_IMAGES.pinimg_11,
    PREMIUM_GALLERY_IMAGES.pinimg_2,
    PREMIUM_GALLERY_IMAGES.pinimg_4,
    PREMIUM_GALLERY_IMAGES.pinimg_5,
    PREMIUM_GALLERY_IMAGES.pinimg_6,
    PREMIUM_GALLERY_IMAGES.pinimg_7,
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
            style={{ fontFamily: '"Allura", cursive' }}
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
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              whileHover={{
                scale: 1.03,
                rotateY: 3,
                rotateZ: 1,
                boxShadow: '0 25px 50px rgba(255, 105, 180, 0.35)',
                transition: { type: 'spring', stiffness: 300 },
              }}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
              className={`cursor-pointer group relative overflow-hidden rounded-2xl shadow-lg ${
                index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
              onClick={() => setSelectedImage(index)}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full z-10 pointer-events-none"
                transition={{ duration: 1, ease: 'linear' }}
              />
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
            style={{ fontFamily: '"Allura", cursive' }}
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
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, rotateX: -10 }}
              animate={{ opacity: 1, x: 0, rotateX: 0 }}
              whileHover={{
                rotateX: 2,
                rotateY: index % 2 === 0 ? -3 : 3,
                scale: 1.02,
                y: -8,
                boxShadow: '0 25px 50px rgba(255, 105, 180, 0.25)',
                transition: { type: 'spring', stiffness: 300 },
              }}
              transition={{ duration: 0.8, delay: index * 0.2, type: 'spring', stiffness: 100 }}
              className="group bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-[#FFB6C1]/30"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Icon */}
                <motion.div
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 10,
                    rotateY: 15,
                    transition: { type: 'spring', stiffness: 300 },
                  }}
                  animate={{
                    boxShadow: [
                      '0 10px 20px rgba(255, 105, 180, 0.3)',
                      '0 10px 30px rgba(255, 105, 180, 0.5)',
                      '0 10px 20px rgba(255, 105, 180, 0.3)'
                    ],
                  }}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center text-5xl shadow-lg`}
                  style={{ transformStyle: 'preserve-3d' }}
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
        <div className="space-y-8">
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-3xl font-bold text-[#FF69B4] text-center"
            style={{ fontFamily: '"Libre Baskerville", serif' }}
          >
            Thông Tin Liên Hệ
          </motion.h3>

          {/* Nhà Trai */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateX: -10 }}
            animate={{ opacity: 1, x: 0, rotateX: 0 }}
            whileHover={{
              rotateX: 2,
              rotateY: -3,
              scale: 1.02,
              y: -8,
              boxShadow: '0 25px 50px rgba(255, 105, 180, 0.25)',
              transition: { type: 'spring', stiffness: 300 },
            }}
            transition={{ duration: 0.8, delay: 0.9, type: 'spring', stiffness: 100 }}
            className="group bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-[#FFB6C1]/30"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Icon */}
              <motion.div
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 10,
                  rotateY: 15,
                  transition: { type: 'spring', stiffness: 300 },
                }}
                animate={{
                  boxShadow: [
                    '0 10px 20px rgba(255, 105, 180, 0.3)',
                    '0 10px 30px rgba(255, 105, 180, 0.5)',
                    '0 10px 20px rgba(255, 105, 180, 0.3)'
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] flex items-center justify-center text-5xl shadow-lg"
                style={{ transformStyle: 'preserve-3d' }}
              >
                🤵
              </motion.div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <h4 
                  className="text-3xl md:text-4xl font-bold text-[#FF69B4]"
                  style={{ fontFamily: '"Libre Baskerville", serif' }}
                >
                  Nhà Trai
                </h4>

                <div className="space-y-3 text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Phone className="w-5 h-5 text-[#FF69B4]" />
                    <span className="text-lg">0123 456 789</span>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Mail className="w-5 h-5 text-[#FF69B4]" />
                    <span className="text-lg">minh@example.com</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nhà Gái */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateX: -10 }}
            animate={{ opacity: 1, x: 0, rotateX: 0 }}
            whileHover={{
              rotateX: 2,
              rotateY: 3,
              scale: 1.02,
              y: -8,
              boxShadow: '0 25px 50px rgba(255, 105, 180, 0.25)',
              transition: { type: 'spring', stiffness: 300 },
            }}
            transition={{ duration: 0.8, delay: 1, type: 'spring', stiffness: 100 }}
            className="group bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-[#FFB6C1]/30"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Icon */}
              <motion.div
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 10,
                  rotateY: 15,
                  transition: { type: 'spring', stiffness: 300 },
                }}
                animate={{
                  boxShadow: [
                    '0 10px 20px rgba(255, 105, 180, 0.3)',
                    '0 10px 30px rgba(255, 105, 180, 0.5)',
                    '0 10px 20px rgba(255, 105, 180, 0.3)'
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#FFC0CB] flex items-center justify-center text-5xl shadow-lg"
                style={{ transformStyle: 'preserve-3d' }}
              >
                👰
              </motion.div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <h4 
                  className="text-3xl md:text-4xl font-bold text-[#FF69B4]"
                  style={{ fontFamily: '"Libre Baskerville", serif' }}
                >
                  Nhà Gái
                </h4>

                <div className="space-y-3 text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Phone className="w-5 h-5 text-[#FF69B4]" />
                    <span className="text-lg">0987 654 321</span>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Mail className="w-5 h-5 text-[#FF69B4]" />
                    <span className="text-lg">huong@example.com</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

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
            style={{ fontFamily: '"Allura", cursive' }}
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
  const [formData, setFormData] = useState({ name: '', email: '', guests: 1, message: '', attending: 'yes' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitRSVPWithFallback({
        name: formData.name,
        email: formData.email || undefined,
        attending: formData.attending as 'yes' | 'no',
        guestCount: formData.attending === 'yes' ? formData.guests : 0,
        message: formData.message || undefined,
        template: 'Blush Floral Enhanced',
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#FF69B4]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-bl from-[#FFB6C1]/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="w-16 h-16 mx-auto text-[#FF69B4] fill-[#FF69B4]" />
          </motion.div>
          
          <h2
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#FF69B4] via-[#FFB6C1] to-[#FF69B4] bg-clip-text text-transparent"
            style={{ fontFamily: '"Allura", cursive' }}
          >
            Xác Nhận Tham Dự
          </h2>
          
          <p className="text-lg text-[#8B5A6B] max-w-2xl mx-auto" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Sự hiện diện của bạn là niềm hạnh phúc lớn nhất đối với chúng tôi. <br />
            Vui lòng xác nhận để chúng tôi chuẩn bị chu đáo hơn 💕
          </p>
        </motion.div>

        {!submitted ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* RSVP Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl border-2 border-[#FFB6C1]/30 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#FF69B4]/10 to-transparent rounded-full blur-2xl" />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.15, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute top-4 left-4 w-12 h-12 border-t-3 border-l-3 border-[#FF69B4] rounded-tl-xl"
                />

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="text-center pb-6 border-b-2 border-[#FFB6C1]/20">
                    <h3 
                      className="text-3xl font-bold text-[#FF69B4]"
                      style={{ fontFamily: '"Libre Baskerville", serif' }}
                    >
                      Thông Tin Tham Dự
                    </h3>
                  </div>

                  {/* Attending Choice */}
                  <div className="space-y-4">
                    <label className="block text-center text-lg font-bold text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Bạn có thể tham dự không?
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: 'yes' })}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                          formData.attending === 'yes'
                            ? 'bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] text-white border-[#FF69B4] shadow-xl shadow-[#FF69B4]/40'
                            : 'bg-white/80 border-[#FFB6C1] hover:border-[#FF69B4] hover:shadow-lg text-[#8B5A6B]'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <motion.div 
                          animate={{ 
                            scale: formData.attending === 'yes' ? [1, 1.2, 1] : 1,
                          }}
                          transition={{ duration: 0.5 }}
                          className="text-4xl mb-2"
                        >
                          ✓
                        </motion.div>
                        <div className="font-bold text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Có, tôi sẽ đến
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: 'no' })}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                          formData.attending === 'no'
                            ? 'bg-gradient-to-br from-gray-500 to-gray-600 text-white border-gray-500 shadow-xl shadow-gray-500/40'
                            : 'bg-white/80 border-gray-300 hover:border-gray-400 hover:shadow-lg text-[#8B5A6B]'
                        }`}
                      >
                        <motion.div 
                          animate={{ 
                            scale: formData.attending === 'no' ? [1, 1.2, 1] : 1,
                          }}
                          transition={{ duration: 0.5 }}
                          className="text-4xl mb-2"
                        >
                          ✗
                        </motion.div>
                        <div className="font-bold text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Không thể đến
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.attending === 'yes' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                      >
                        {/* Name */}
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-sm font-bold text-[#FF69B4] uppercase tracking-wide">
                            <Heart className="w-4 h-4 fill-[#FF69B4]" />
                            Họ và Tên *
                          </label>
                          <motion.div
                            animate={{ 
                              scale: focusedField === 'name' ? 1.02 : 1,
                            }}
                          >
                            <Input
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              onFocus={() => setFocusedField('name')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Nhập họ tên của bạn"
                              className="w-full p-4 text-base rounded-xl border-2 border-[#FFB6C1]/50 focus:border-[#FF69B4] bg-white/80 transition-all duration-300"
                              style={{ fontFamily: '"Poppins", sans-serif' }}
                            />
                          </motion.div>
                        </div>

                        {/* Guests */}
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-sm font-bold text-[#FF69B4] uppercase tracking-wide">
                            <Calendar className="w-4 h-4 fill-[#FF69B4]" />
                            Số Lượng Khách *
                          </label>
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#FFF0F5] to-white rounded-xl border-2 border-[#FFB6C1]/30">
                            <motion.button
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] text-white text-xl font-bold shadow-md"
                            >
                              -
                            </motion.button>

                            <div className="flex-1 text-center">
                              <motion.div 
                                key={formData.guests}
                                initial={{ scale: 1.3, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent"
                                style={{ fontFamily: '"Libre Baskerville", serif' }}
                              >
                                {formData.guests}
                              </motion.div>
                              <p className="text-xs text-[#8B5A6B] mt-1">khách</p>
                            </div>

                            <motion.button
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, guests: Math.min(10, prev.guests + 1) }))}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] text-white text-xl font-bold shadow-md"
                            >
                              +
                            </motion.button>
                          </div>
                          <p className="text-xs text-center text-[#8B5A6B]/70 italic">Tối đa 10 khách</p>
                        </div>

                        {/* Message */}
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-sm font-bold text-[#FF69B4] uppercase tracking-wide">
                            <Sparkles className="w-4 h-4 fill-[#FF69B4]" />
                            Lời Nhắn Gửi
                          </label>
                          <Textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            onFocus={() => setFocusedField('message')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Gửi lời chúc mừng đến cô dâu chú rể..."
                            className="w-full p-4 text-base min-h-28 rounded-xl border-2 border-[#FFB6C1]/50 focus:border-[#FF69B4] bg-white/80 transition-all duration-300 resize-none"
                            style={{ fontFamily: '"Poppins", sans-serif' }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="relative w-full py-6 text-lg font-bold bg-gradient-to-r from-[#FF69B4] via-[#FFB6C1] to-[#FF69B4] text-white shadow-2xl shadow-[#FF69B4]/40 hover:shadow-[#FF69B4]/60 disabled:opacity-50 overflow-hidden group rounded-xl border-0 transition-all duration-300"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      <motion.div
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                              <Send className="w-5 h-5" />
                            </motion.div>
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {formData.attending === 'yes' ? 'Gửi Xác Nhận Tham Dự' : 'Gửi Phản Hồi'}
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Why RSVP */}
              <div className="bg-gradient-to-br from-white via-[#FFF0F5] to-white p-8 rounded-[2rem] shadow-xl border-2 border-[#FFB6C1]/30">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#FF69B4] mb-2" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                      Tại Sao Cần RSVP?
                    </h3>
                    <p className="text-[#8B5A6B] leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Xác nhận sớm giúp chúng tôi chuẩn bị chu đáo hơn cho ngày trọng đại
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: '🍽️', text: 'Sắp xếp chỗ ngồi và thực đơn phù hợp' },
                    { icon: '🎁', text: 'Chuẩn bị quà lưu niệm cho từng vị khách' },
                    { icon: '📸', text: 'Đảm bảo khoảnh khắc của bạn được ghi lại' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white/60 rounded-xl"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <p className="text-sm text-[#8B5A6B]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        {item.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] p-8 rounded-[2rem] shadow-xl text-white">
                <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Cần Hỗ Trợ?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-white/80">Liên hệ</p>
                      <p className="font-semibold">0123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-white/80">Email</p>
                      <p className="font-semibold">contact@wedding.com</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/90 italic pt-4 border-t border-white/20">
                    Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative bg-gradient-to-br from-white via-[#FFF0F5] to-white p-16 rounded-[2.5rem] shadow-2xl text-center space-y-8 overflow-hidden border-2 border-[#FFB6C1]/40"
        >
          {/* Background Decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#FF69B4]/20"
            />
            <motion.div
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#FFB6C1]/20"
            />
          </div>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(255, 105, 180, 0.4)',
                  '0 0 0 20px rgba(255, 105, 180, 0)',
                  '0 0 0 0 rgba(255, 105, 180, 0)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] mx-auto"
            >
              <Check className="w-14 h-14 text-white" strokeWidth={3} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 relative z-10"
          >
            <h3 
              className="text-5xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent"
              style={{ fontFamily: '"Allura", cursive' }}
            >
              Cảm Ơn Bạn!
            </h3>
            <p className="text-2xl text-[#8B5A6B] font-medium" style={{ fontFamily: '"Libre Baskerville", serif' }}>
              Xác nhận của bạn đã được ghi nhận
            </p>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-4xl"
            >
              💕
            </motion.div>
            <p className="text-lg text-[#8B5A6B]/80" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Chúng tôi rất mong được gặp bạn tại buổi tiệc!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative z-10"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNext}
                className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:from-[#FF1493] hover:to-[#FF69B4] text-white shadow-xl hover:shadow-2xl transition-all rounded-2xl"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Xem Mã QR <span className="ml-2">→</span>
              </Button>
            </motion.div>
          </motion.div>
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
            style={{ fontFamily: '"Allura", cursive' }}
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
            initial={{ rotate: -180, opacity: 0, rotateY: -90 }}
            animate={{ rotate: 0, opacity: 1, rotateY: 0 }}
            whileHover={{
              rotateY: 10,
              rotateX: 5,
              scale: 1.05,
              transition: { type: 'spring', stiffness: 300 },
            }}
            transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 100 }}
            className="inline-block p-8 bg-white rounded-3xl shadow-xl border-4 border-[#FFB6C1]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div 
              animate={{
                boxShadow: [
                  '0 0 0px rgba(255, 105, 180, 0)',
                  '0 0 40px rgba(255, 105, 180, 0.6)',
                  '0 0 0px rgba(255, 105, 180, 0)'
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-64 h-64 bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] rounded-2xl flex items-center justify-center"
            >
              <QrCode className="w-48 h-48 text-white" strokeWidth={1.5} />
            </motion.div>
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
              Sự hiện diện của <span className="font-semibold text-[#D4A5A5]">{guestName}</span> là món quà ý nghĩa nhất với chúng tôi
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
