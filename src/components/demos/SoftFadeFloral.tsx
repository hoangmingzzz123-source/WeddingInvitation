import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function SoftFadeFloral() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1560113406-36a33855c51e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
      title: "Minh & Hương",
      subtitle: "Chúng mình sắp kết hôn",
      caption: "Sau những năm tháng bên nhau, chúng mình quyết định bắt đầu hành trình mới",
    },
    {
      image: "https://images.unsplash.com/photo-1761285367066-5875252d7558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
      title: "Lần Đầu Gặp Gỡ",
      subtitle: "Xuân 2020",
      caption: "Một buổi chiều tình cờ tại quán cà phê nhỏ, chúng mình đã gặp được định mệnh của đời mình",
    },
    {
      image: "https://images.unsplash.com/photo-1708746179240-41b44d5bdf55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
      title: "Kỷ Niệm Bên Nhau",
      subtitle: "4 năm yêu thương",
      caption: "Cùng nhau trải qua bao nhiêu kỷ niệm đẹp, từ những chuyến đi xa đến những buổi tối bên nhau",
    },
    {
      image: "https://images.unsplash.com/photo-1738800076744-c37b80b37d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
      title: "Lễ Cưới",
      subtitle: "15 • 03 • 2025",
      caption: "Hãy đến chung vui cùng chúng mình trong ngày trọng đại nhất đời",
    },
  ];

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F8F0E8] to-[#E8F4F8] relative overflow-hidden">
      {/* Music Player - 109K Package */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} />

      {/* Floral Border Decoration - Left */}
      <div className="fixed left-0 top-0 bottom-0 w-32 opacity-20 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1761285367066-5875252d7558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
          alt="Floral decoration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Floral Border Decoration - Right */}
      <div className="fixed right-0 top-0 bottom-0 w-32 opacity-20 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1708746179240-41b44d5bdf55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
          alt="Floral decoration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Back Button */}
      <Button
        onClick={() => window.location.hash = '#/'}
        className="fixed top-6 left-6 z-50 bg-white/90 hover:bg-white text-[#C8A2C8] border border-[#C8A2C8]/30 backdrop-blur-md"
      >
        <Home className="w-4 h-4 mr-2" />
        Về Trang Chủ
      </Button>

      {/* Slide Indicators */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`h-2 rounded-full transition-all duration-500 ${
              currentSlide === index 
                ? 'bg-white w-8' 
                : 'bg-white/40 w-2'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="fixed left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all group"
      >
        <ChevronLeft className="w-6 h-6 text-[#C8A2C8] group-hover:text-[#A882A8]" />
      </button>

      <button
        onClick={nextSlide}
        className="fixed right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all group"
      >
        <ChevronRight className="w-6 h-6 text-[#C8A2C8] group-hover:text-[#A882A8]" />
      </button>

      {/* Slides */}
      <div className="relative w-full h-screen">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ 
              opacity: 0,
              filter: 'blur(20px)',
            }}
            animate={{ 
              opacity: 1,
              filter: 'blur(0px)',
            }}
            exit={{ 
              opacity: 0,
              filter: 'blur(20px)',
            }}
            transition={{ 
              duration: 1.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <ImageWithFallback
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-end justify-center pb-32 px-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="max-w-3xl text-center space-y-6"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-white/80 text-sm tracking-[0.3em] uppercase"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-6xl md:text-7xl text-white"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed"
                  style={{ fontFamily: '"Libre Baskerville", serif' }}
                >
                  {slides[currentSlide].caption}
                </motion.p>

                {currentSlide === slides.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    <Button
                      className="mt-8 bg-white/90 hover:bg-white text-[#C8A2C8] px-10 py-6 text-lg rounded-full backdrop-blur-md"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Xác Nhận Tham Dự
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Soft Vignette */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.2) 100%)',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
