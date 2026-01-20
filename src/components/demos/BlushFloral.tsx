import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Calendar, MapPin, Clock, Send, Home, QrCode, Mail } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { PREMIUM_GALLERY_IMAGES } from '../../utils/imageConstants';

export function BlushFloral() {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Get guest name from URL parameter
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guest') || 'Bạn và người thân';
  };

  const coupleNames = "Minh & Hương";
  
  // Typewriter effect
  useEffect(() => {
    if (currentPage === 0 && isTyping) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= coupleNames.length) {
          setDisplayedText(coupleNames.slice(0, index));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [currentPage, isTyping]);

  // Floating petals animation data
  const petals = Array(15).fill(0).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-[#FAF7F2] relative overflow-hidden">
      {/* Music Player - 109K Package */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} />

      {/* Paper Grain Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Rose Petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute -top-10"
            style={{ left: petal.left }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.sin(petal.id) * 50, 0],
              rotate: [0, 360],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div 
              className="w-3 h-3 rounded-full blur-sm"
              style={{
                background: 'radial-gradient(circle, #F2C6CC, #E6B7A6)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Back Button */}
      <Button
        onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
        className="fixed top-6 left-6 z-50 bg-white/80 hover:bg-white text-[#F2C6CC] border-2 border-[#F2C6CC] backdrop-blur-sm"
      >
        <Home className="w-4 h-4 mr-2" />
        Về Trang Chủ
      </Button>

      {/* Page Indicator */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        {['Trang Bìa', 'Câu Chuyện', 'Album', 'Chi Tiết', 'Bản Đồ', 'Xác Nhận', 'QR'].map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentPage(index);
              if (index === 0) {
                setDisplayedText('');
                setIsTyping(true);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              currentPage === index 
                ? 'bg-[#F2C6CC] w-6' 
                : 'bg-[#F2C6CC]/30'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen"
        >
          {currentPage === 0 && <CoverPage displayedText={displayedText} onNext={() => setCurrentPage(1)} />}
          {currentPage === 1 && <StoryPage onNext={() => setCurrentPage(2)} />}
          {currentPage === 2 && <GalleryPage onNext={() => setCurrentPage(3)} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
          {currentPage === 3 && <DetailsPage onNext={() => setCurrentPage(4)} />}
          {currentPage === 4 && <MapPage onNext={() => setCurrentPage(5)} />}
          {currentPage === 5 && <RSVPPage submitted={rsvpSubmitted} setSubmitted={setRsvpSubmitted} onNext={() => setCurrentPage(6)} guestName={getGuestName()} />}
          {currentPage === 6 && <QRCodePage />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Cover Page
function CoverPage({ displayedText, onNext }: { displayedText: string; onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Watercolor Roses - Top Left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: -10 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute top-10 left-10 w-64 h-64 opacity-30"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1761285367066-5875252d7558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
          alt="Rose decoration"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Watercolor Peonies - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
        animate={{ opacity: 1, scale: 1, rotate: 10 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute bottom-10 right-10 w-64 h-64 opacity-30"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1708746179240-41b44d5bdf55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
          alt="Peony decoration"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Center Content */}
      <div className="text-center space-y-8 max-w-2xl z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p 
            className="text-sm tracking-[0.3em] text-[#B8860B] uppercase mb-4 font-semibold"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Save The Date
          </p>
          
          <h1 
            className="text-7xl md:text-8xl text-[#8B4513] min-h-[100px] font-bold"
            style={{ fontFamily: '"Allura", cursive' }}
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              |
            </motion.span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8B4513]" />
            <Heart className="w-6 h-6 text-[#B8860B]" fill="#B8860B" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#8B4513]" />
          </div>

          <p 
            className="text-2xl text-[#8B4513] font-bold"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            15 • 03 • 2025
          </p>

          <Button
            onClick={onNext}
            autoFocus
            className="mt-8 bg-gradient-to-r from-[#D946A6] to-[#EC4899] hover:from-[#BE185D] hover:to-[#D946A6] text-black px-8 py-6 text-lg rounded-full shadow-lg font-semibold ring-2 ring-[#F2C6CC]/50"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Xem Thiệp Cưới
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Story Page
function StoryPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center text-[#8B4513] font-bold"
          style={{ fontFamily: '"Allura", cursive' }}
        >
          Chuyện Tình Của Chúng Mình
        </motion.h2>

        <div className="space-y-12">
          {[
            {
              title: "Lần Đầu Gặp Gỡ",
              date: "Mùa Xuân 2020",
              text: "Một buổi sáng xuân tươi đẹp, chúng mình đã gặp nhau trong khoảnh khắc tình cờ đẹp như mơ...",
              image: PREMIUM_GALLERY_IMAGES.pinimg_11,
            },
            {
              title: "Yêu Thương Bắt Đầu",
              date: "Mùa Hè 2020",
              text: "Từ những cuộc trò chuyện đêm khuya, chúng mình dần nhận ra rằng đây là tình yêu đích thực...",
              image: PREMIUM_GALLERY_IMAGES.pinimg_2,
            },
            {
              title: "Lời Cầu Hôn",
              date: "Mùa Đông 2024",
              text: "Dưới bầu trời sao lấp lánh, anh đã quỳ gối và hỏi em câu hỏi quan trọng nhất...",
              image: PREMIUM_GALLERY_IMAGES.pinimg_4,
            },
          ].map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
              className="flex flex-col md:flex-row gap-8 items-center"
            >
              <div className={`flex-1 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#F2C6CC]/20 rounded-3xl transform rotate-3" />
                  <ImageWithFallback
                    src={story.image}
                    alt={story.title}
                    className="relative w-full h-64 object-cover rounded-3xl"
                  />
                </div>
              </div>
              <div className={`flex-1 space-y-4 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <p className="text-sm text-[#B8860B] tracking-wide font-semibold">{story.date}</p>
                <h3 
                  className="text-4xl text-[#8B4513] font-bold"
                  style={{ fontFamily: '"Allura", cursive' }}
                >
                  {story.title}
                </h3>
                <p className="text-[#654321] leading-relaxed font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {story.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Button
            onClick={onNext}
            autoFocus
            className="bg-gradient-to-r from-[#D946A6] to-[#EC4899] hover:from-[#BE185D] hover:to-[#D946A6] text-black px-8 py-6 rounded-full shadow-lg font-semibold ring-2 ring-[#F2C6CC]/50"
          >
            Tiếp Theo
          </Button>
        </div>
      </div>
    </div>
  );
}

// Details Page
function DetailsPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center text-[#8B4513] font-bold"
          style={{ fontFamily: '"Allura", cursive' }}
        >
          Thông Tin Lễ Cưới
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Lễ Thành Hôn",
              date: "15 Tháng 3, 2025",
              time: "10:00 Sáng",
              location: "Nhà Hàng Tiệc Cưới",
              address: "123 Nguyễn Huệ, Q.1, TP.HCM",
            },
            {
              title: "Tiệc Cưới",
              date: "15 Tháng 3, 2025",
              time: "18:00 Tối",
              location: "Trung Tâm Hội Nghị",
              address: "456 Lê Lợi, Q.1, TP.HCM",
            },
          ].map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-[#8B4513]/30 space-y-4"
            >
              <h3 
                className="text-3xl text-[#8B4513] text-center mb-6 font-bold"
                style={{ fontFamily: '"Allura", cursive' }}
              >
                {event.title}
              </h3>
              
              <div className="space-y-3 text-[#654321] font-medium">
                <p className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#B8860B]" />
                  {event.date}
                </p>
                <p className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#B8860B]" />
                  {event.time}
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B8860B] mt-1" />
                  <span>
                    <b>{event.location}</b><br />
                    {event.address}
                  </span>
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => onNext()}
                className="w-full mt-4 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-black font-semibold"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Xem Bản Đồ
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Button
            onClick={onNext}
            autoFocus
            className="bg-gradient-to-r from-[#D946A6] to-[#EC4899] hover:from-[#BE185D] hover:to-[#D946A6] text-black px-8 py-6 rounded-full shadow-lg font-semibold ring-2 ring-[#F2C6CC]/50"
          >
            Xác Nhận Tham Dự
          </Button>
        </div>
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
    'https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp',
    'https://demxanh.com/media/news/2810_studio-thai-binh-1.jpg' ,
    'https://demxanh.com/media/news/2810_studio-thai-binh-3.jpg' ,
    PREMIUM_GALLERY_IMAGES.pinimg_11,
    PREMIUM_GALLERY_IMAGES.pinimg_2,
    PREMIUM_GALLERY_IMAGES.pinimg_4,
    PREMIUM_GALLERY_IMAGES.pinimg_5,
    PREMIUM_GALLERY_IMAGES.pinimg_6,
    PREMIUM_GALLERY_IMAGES.pinimg_7,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center text-[#8B4513] font-bold"
          style={{ fontFamily: '"Allura", cursive' }}
        >
          Album Ảnh Cưới
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImage(index)}
              className="aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
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
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                src={images[selectedImage]}
                alt="Selected"
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="text-center pt-8">
          <Button
            onClick={onNext}
            autoFocus
            className="bg-gradient-to-r from-[#D946A6] to-[#EC4899] hover:from-[#BE185D] hover:to-[#D946A6] text-black px-8 py-6 rounded-full shadow-lg font-semibold ring-2 ring-[#F2C6CC]/50"
          >
            Tiếp Theo
          </Button>
        </div>
      </div>
    </div>
  );
}

// Map Page
// Gallery Page
function MapPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center text-[#8B4513] font-bold"
          style={{ fontFamily: '"Allura", cursive' }}
        >
          Bản Đồ Địa Điểm
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 border-2 border-[#8B4513]/30"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.325652528464!2d106.69751731428708!3d10.782926192320595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc1%3A0xb42d12560499f1b7!2zTmjDoCBIw6BuZyBUaeG7h2MgQ8aw4bubaSBHcmFuZCBQYWxhY2U!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '1.5rem' }}
            allowFullScreen
            loading="lazy"
          />
        </motion.div>

        <div className="text-center space-y-4">
          <p className="text-[#654321] font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            <MapPin className="w-5 h-5 inline mr-2 text-[#B8860B]" />
            Nhà Hàng Tiệc Cưới Grand Palace
          </p>
          <p className="text-[#654321] font-medium">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
          
          <Button
            onClick={onNext}
            autoFocus
            className="bg-gradient-to-r from-[#D946A6] to-[#EC4899] hover:from-[#BE185D] hover:to-[#D946A6] text-black px-8 py-6 rounded-full shadow-lg font-semibold ring-2 ring-[#F2C6CC]/50 mt-4"
          >
            Tiếp Theo
          </Button>
        </div>
      </div>
    </div>
  );
}

// RSVP Page
// RSVP Page
function RSVPPage({ submitted, setSubmitted, onNext, guestName }: { submitted: boolean; setSubmitted: (value: boolean) => void; onNext: () => void; guestName: string }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', guests: '1', message: '' });
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
        template: 'Blush Floral',
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-[#F2C6CC]/30 space-y-8"
      >
        {!submitted ? (
          <>
            <h2 
              className="text-5xl text-center text-[#8B4513] font-bold"
              style={{ fontFamily: '"Allura", cursive' }}
            >
              Xác Nhận Tham Dự
            </h2>

            <p className="text-center text-[#654321] font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Sự hiện diện của <span className="font-semibold text-[#D4A5A5]">{guestName}</span> là niềm hạnh phúc lớn nhất của chúng mình ❤️
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input 
                placeholder="Họ và tên *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-2 border-[#F2C6CC]/30 focus:border-[#F2C6CC] rounded-xl py-6"
              />
              <Input 
                placeholder="Số điện thoại *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="border-2 border-[#F2C6CC]/30 focus:border-[#F2C6CC] rounded-xl py-6"
              />
              <Input 
                type="number"
                placeholder="Số người tham dự *"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                required
                min="1"
                className="border-2 border-[#F2C6CC]/30 focus:border-[#F2C6CC] rounded-xl py-6"
              />
              <Textarea 
                placeholder="Lời chúc đến cô dâu chú rể..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="border-2 border-[#F2C6CC]/30 focus:border-[#F2C6CC] rounded-xl min-h-[150px]"
              />
              
              <Button 
                type="submit"
                autoFocus
                className="w-full bg-gradient-to-r from-[#D946A6] to-[#EC4899] hover:from-[#BE185D] hover:to-[#D946A6] text-black py-6 rounded-xl text-lg shadow-lg font-semibold ring-2 ring-[#F2C6CC]/50"
              >
                <Send className="w-5 h-5 mr-2" />
                Gửi Xác Nhận
              </Button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="w-20 h-20 mx-auto bg-[#F2C6CC]/20 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-[#F2C6CC]" fill="#F2C6CC" />
            </div>
            <h3 className="text-3xl text-[#F2C6CC]" style={{ fontFamily: '"Allura", cursive' }}>
              Cảm ơn bạn!
            </h3>
            <p className="text-[#8B7355]">Chúng mình đã nhận được xác nhận của bạn</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="border-[#8B4513] text-[#8B4513]"
              >
                Gửi lại
              </Button>
              <Button
                onClick={onNext}
                autoFocus
                className="bg-gradient-to-r from-[#D946A6] to-[#EC4899] hover:from-[#BE185D] hover:to-[#D946A6] text-black shadow-lg font-semibold ring-2 ring-[#F2C6CC]/50"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Xem QR Code
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// QR Code Page
function QRCodePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-[#8B4513]/30 space-y-8 text-center"
      >
        <h2 
          className="text-5xl text-center text-[#8B4513] font-bold"
          style={{ fontFamily: '"Allura", cursive' }}
        >
          Mã QR Thiệp Cưới
        </h2>

        <p className="text-[#654321] font-medium">
          Quét mã QR để chia sẻ thiệp cưới với bạn bè
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-2xl shadow-xl mx-auto w-fit"
        >
          <div className="w-64 h-64 bg-gradient-to-br from-[#FAF7F2] to-[#E8E0D5] rounded-xl flex items-center justify-center">
            <QrCode className="w-48 h-48 text-[#8B4513]" strokeWidth={1} />
          </div>
        </motion.div>

        <div className="space-y-4">
          <p className="text-sm text-[#654321]">
            Link thiệp cưới: <span className="font-semibold">https://wedding.example.com/minh-huong</span>
          </p>
          
          <Button
            onClick={() => navigator.clipboard.writeText('https://wedding.example.com/minh-huong')}
            variant="outline"
            className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-black"
          >
            Sao chép link
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
