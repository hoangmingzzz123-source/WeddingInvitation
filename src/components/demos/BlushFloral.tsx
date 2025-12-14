import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Calendar, MapPin, Clock, Send, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function BlushFloral() {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

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
        onClick={() => window.location.hash = '#/'}
        className="fixed top-6 left-6 z-50 bg-white/80 hover:bg-white text-[#F2C6CC] border-2 border-[#F2C6CC] backdrop-blur-sm"
      >
        <Home className="w-4 h-4 mr-2" />
        Về Trang Chủ
      </Button>

      {/* Page Indicator */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        {['Cover', 'Story', 'Details', 'RSVP'].map((_, index) => (
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
          {currentPage === 2 && <DetailsPage onNext={() => setCurrentPage(3)} />}
          {currentPage === 3 && <RSVPPage />}
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
            className="text-sm tracking-[0.3em] text-[#E6B7A6] uppercase mb-4"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Save The Date
          </p>
          
          <h1 
            className="text-7xl md:text-8xl text-[#F2C6CC] min-h-[100px]"
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
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#F2C6CC]" />
            <Heart className="w-6 h-6 text-[#E6B7A6]" fill="#E6B7A6" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#F2C6CC]" />
          </div>

          <p 
            className="text-2xl text-[#8B7355]"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            15 • 03 • 2025
          </p>

          <Button
            onClick={onNext}
            className="mt-8 bg-[#F2C6CC] hover:bg-[#E6B7A6] text-white px-8 py-6 text-lg rounded-full"
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
          className="text-5xl text-center text-[#F2C6CC]"
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
              image: "https://images.unsplash.com/photo-1560113406-36a33855c51e?w=600",
            },
            {
              title: "Yêu Thương Bắt Đầu",
              date: "Mùa Hè 2020",
              text: "Từ những cuộc trò chuyện đêm khuya, chúng mình dần nhận ra rằng đây là tình yêu đích thực...",
              image: "https://images.unsplash.com/photo-1761285367066-5875252d7558?w=600",
            },
            {
              title: "Lời Cầu Hôn",
              date: "Mùa Đông 2024",
              text: "Dưới bầu trời sao lấp lánh, anh đã quỳ gối và hỏi em câu hỏi quan trọng nhất...",
              image: "https://images.unsplash.com/photo-1708746179240-41b44d5bdf55?w=600",
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
                <p className="text-sm text-[#E6B7A6] tracking-wide">{story.date}</p>
                <h3 
                  className="text-4xl text-[#F2C6CC]"
                  style={{ fontFamily: '"Allura", cursive' }}
                >
                  {story.title}
                </h3>
                <p className="text-[#8B7355] leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {story.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Button
            onClick={onNext}
            className="bg-[#F2C6CC] hover:bg-[#E6B7A6] text-white px-8 py-6 rounded-full"
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
          className="text-5xl text-center text-[#F2C6CC]"
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
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-[#F2C6CC]/30 space-y-4"
            >
              <h3 
                className="text-3xl text-[#F2C6CC] text-center mb-6"
                style={{ fontFamily: '"Allura", cursive' }}
              >
                {event.title}
              </h3>
              
              <div className="space-y-3 text-[#8B7355]">
                <p className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#E6B7A6]" />
                  {event.date}
                </p>
                <p className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#E6B7A6]" />
                  {event.time}
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E6B7A6] mt-1" />
                  <span>
                    <b>{event.location}</b><br />
                    {event.address}
                  </span>
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 border-[#F2C6CC] text-[#F2C6CC] hover:bg-[#F2C6CC] hover:text-white"
              >
                Xem Bản Đồ
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Button
            onClick={onNext}
            className="bg-[#F2C6CC] hover:bg-[#E6B7A6] text-white px-8 py-6 rounded-full"
          >
            Xác Nhận Tham Dự
          </Button>
        </div>
      </div>
    </div>
  );
}

// RSVP Page
function RSVPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-[#F2C6CC]/30 space-y-8"
      >
        <h2 
          className="text-5xl text-center text-[#F2C6CC]"
          style={{ fontFamily: '"Allura", cursive' }}
        >
          Xác Nhận Tham Dự
        </h2>

        <p className="text-center text-[#8B7355]" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Sự hiện diện của bạn là niềm hạnh phúc lớn nhất của chúng mình ❤️
        </p>

        <div className="space-y-6">
          <Input 
            placeholder="Họ và tên *"
            className="border-2 border-[#F2C6CC]/30 focus:border-[#F2C6CC] rounded-xl py-6"
          />
          <Input 
            placeholder="Số điện thoại *"
            className="border-2 border-[#F2C6CC]/30 focus:border-[#F2C6CC] rounded-xl py-6"
          />
          <Input 
            type="number"
            placeholder="Số người tham dự *"
            className="border-2 border-[#F2C6CC]/30 focus:border-[#F2C6CC] rounded-xl py-6"
          />
          <Textarea 
            placeholder="Lời chúc đến cô dâu chú rể..."
            className="border-2 border-[#F2C6CC]/30 focus:border-[#F2C6CC] rounded-xl min-h-[150px]"
          />
          
          <Button 
            className="w-full bg-[#F2C6CC] hover:bg-[#E6B7A6] text-white py-6 rounded-xl text-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Gửi Xác Nhận
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
