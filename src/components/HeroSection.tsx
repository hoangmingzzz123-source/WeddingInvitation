import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles, Heart, Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4 md:px-16 py-16 overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'linear-gradient(135deg, #ffffff 0%, #FFF3F3 100%)',
            'linear-gradient(135deg, #FFF3F3 0%, #FFF4E6 100%)',
            'linear-gradient(135deg, #FFF4E6 0%, #ffffff 100%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Golden Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#C29B43]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF4D3] rounded-full shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#C29B43]" />
            <span className="text-sm text-[#A88434]">Sang trọng & Hiện đại</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-5xl md:text-7xl text-[#C29B43] tracking-wide"
            style={{ 
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '0.5px',
            }}
          >
            <motion.span
              animate={{
                textShadow: [
                  '0 0 10px rgba(194, 155, 67, 0.3)',
                  '0 0 20px rgba(194, 155, 67, 0.5)',
                  '0 0 10px rgba(194, 155, 67, 0.3)',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Wedding Invitation
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-2xl text-[#4A4A4A]"
            style={{ 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 300,
            }}
          >
            Cá Nhân Hóa – Đa Hiệu Ứng – Thiết Kế Hiện Đại
            <br />
            <motion.span
              className="inline-block mt-2 text-lg text-[#C29B43]"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              ✨ Tạo thiệp mời đám cưới điện tử đẹp lung linh
            </motion.span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-base text-[#333]"
          >
            ⚡ Chỉ từ 199K • 99+ Mẫu thiệp cao cấp • Tùy chỉnh dễ dàng
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            {/* Main CTA with Glow */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative bg-[#C29B43] hover:bg-[#A88434] text-white px-8 py-6 rounded-full shadow-lg overflow-hidden group"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                {/* Golden Glow Effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 25px rgba(194, 155, 67, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3)',
                  }}
                />
                
                {/* Shimmer Animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <span className="relative z-10 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Xem 99+ Mẫu Thiệp Cưới
                </span>
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => {
                  const videoSection = document.querySelector('[id*="video"]');
                  videoSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="outline"
                className="border-2 border-[#C29B43] text-[#C29B43] hover:bg-[#C29B43] hover:text-white px-8 py-6 rounded-full transition-all group"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Xem Video Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Links to Packages */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4"
          >
            {[
              { label: 'Gói 199K', color: '#F7DADA' },
              { label: 'Gói 299K', color: '#FFE5B4' },
              { label: 'Gói 399K', color: '#E6D7FF' },
            ].map((pkg, i) => (
              <motion.button
                key={pkg.label}
                whileHover={{ scale: 1.1, y: -2 }}
                onClick={() => {
                  const priceNum = pkg.label.replace(/\D/g, '');
                  window.location.hash = `#templates-filter-${priceNum}k`;
                  setTimeout(() => {
                    document.getElementById('templates')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 100);
                }}
                className="px-4 py-2 rounded-full text-sm transition-all shadow-md hover:shadow-lg"
                style={{
                  backgroundColor: pkg.color,
                  color: '#1B2A41',
                }}
              >
                {pkg.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Content - Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <motion.div
            animate={{ 
              y: [0, -12, 0],
              rotate: [8, 10, 8],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 blur-3xl opacity-30 rounded-3xl"
                style={{ background: 'radial-gradient(circle, #FFDDB0 0%, transparent 70%)' }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <ImageWithFallback
                src="https://thiepcuoionline.huythanhjewelry.vn/img/home-banner.webp"
                alt="Wedding Invitation Card"
                className="relative w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -top-10 -left-10 w-32 h-32 bg-[#F7DADA] rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C29B43] rounded-full blur-3xl opacity-10"
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}