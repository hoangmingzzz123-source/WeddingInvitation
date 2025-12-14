import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, QrCode, MessageSquare, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function LuxuryGoldCinematic() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showLogo, setShowLogo] = useState(true);

  const pages = ['Cover', 'Invitation', 'Timeline', 'Gallery', 'Wishes'];

  useEffect(() => {
    // Hide logo after 3 seconds
    const timer = setTimeout(() => setShowLogo(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Bokeh particles
  const bokehParticles = Array.from({ length: 15 }, (_, i) => ({
    size: Math.random() * 100 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white overflow-hidden">
      {/* Music Player - 159K Package: Custom Music Allowed */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} allowCustomMusic={true} />

      {/* Bokeh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {bokehParticles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-2xl"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? '#C29B43' : i % 3 === 1 ? '#FFD700' : '#FFA500'
              }40, transparent)`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.6, 0.3],
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

      {/* Gold Foil Logo Intro */}
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
              {/* Shine tracking effect */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['200% 0%', '-200% 0%'],
                }}
                transition={{
                  duration: 2,
                  repeat: 1,
                  ease: "easeInOut",
                }}
              />
              
              <h1 
                className="text-8xl relative z-10"
                style={{ 
                  fontFamily: '"Great Vibes", cursive',
                  background: 'linear-gradient(135deg, #C29B43, #FFD700, #C29B43)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%',
                }}
              >
                A & N
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-40">
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-white/10 hover:bg-[#C29B43] text-white border border-[#C29B43]/50 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm transition-all"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Page Navigation Arrows */}
      {currentPage > 0 && (
        <motion.button
          whileHover={{ scale: 1.15, x: -5 }}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-[#C29B43]/50 flex items-center justify-center hover:bg-[#C29B43]/30 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      )}

      {currentPage < pages.length - 1 && (
        <motion.button
          whileHover={{ scale: 1.15, x: 5 }}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-[#C29B43]/50 flex items-center justify-center hover:bg-[#C29B43]/30 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      )}

      {/* Gold Border with Glow Animation */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-10"
        animate={{
          boxShadow: [
            'inset 0 0 20px rgba(194, 155, 67, 0.3)',
            'inset 0 0 40px rgba(194, 155, 67, 0.6)',
            'inset 0 0 20px rgba(194, 155, 67, 0.3)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          border: '2px solid rgba(194, 155, 67, 0.5)',
        }}
      />

      {/* Content Pages */}
      <div className="relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {currentPage === 0 && <CoverPage />}
            {currentPage === 1 && <InvitationPage />}
            {currentPage === 2 && <TimelinePage />}
            {currentPage === 3 && <GalleryPage />}
            {currentPage === 4 && <WishesPage />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentPage === i 
                ? 'bg-[#C29B43] w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function CoverPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        {/* Metallic Shine Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.h1 
            className="text-8xl md:text-9xl mb-4"
            style={{ 
              fontFamily: '"Great Vibes", cursive',
              background: 'linear-gradient(135deg, #C29B43 0%, #FFD700 50%, #C29B43 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 0%', '0% 0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Anh & Nhi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-2xl text-[#C29B43] tracking-widest"
          >
            12 • 12 • 2025
          </motion.p>
        </motion.div>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="h-px bg-gradient-to-r from-transparent via-[#C29B43] to-transparent"
        />
      </div>
    </section>
  );
}

function InvitationPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-[#C29B43]/30 shadow-2xl"
        >
          <h2 
            className="text-5xl text-[#C29B43] text-center mb-8"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Trân Trọng Kính Mời
          </h2>

          <div className="space-y-8 text-center">
            {[
              { icon: Calendar, text: 'Thứ 7, 12.12.2025' },
              { icon: Clock, text: '18:00 - 20:00' },
              { icon: MapPin, text: 'The Imperial Palace Hotel' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex items-center justify-center gap-4 text-xl"
              >
                <item.icon className="w-6 h-6 text-[#C29B43]" />
                <span className="text-white/90">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <MapSection 
          location="The Imperial Palace Hotel"
          address="789 Đường Nguyễn Huệ, Quận 1, TP.HCM"
          mapUrl="https://maps.google.com?q=Imperial+Palace+Hotel+Q1"
          premium={true}
        />
      </div>
    </section>
  );
}

function TimelinePage() {
  const timeline = [
    { year: '2019', title: 'First Meet', desc: 'A chance encounter that changed everything' },
    { year: '2021', title: 'Love Blooms', desc: 'Our journey together begins' },
    { year: '2025', title: 'Forever', desc: 'We say "I do"' },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-[#C29B43] text-center mb-16"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Our Story
        </motion.h2>

        <div className="space-y-12">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex items-center gap-6"
            >
              <div className="w-24 text-right text-[#C29B43] text-2xl">{item.year}</div>
              <div className="w-px h-20 bg-gradient-to-b from-[#C29B43] to-transparent" />
              <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-[#C29B43]/20">
                <h3 className="text-2xl text-[#FFD700] mb-2">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPage() {
  const images = [
   'https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp',
    'https://tuarts.net/wp-content/uploads/2015/12/117937145_4255715104503639_2707126124250519806_o.jpg'  ,
    'https://tuarts.net/wp-content/uploads/2020/05/60770796_2734489913292840_6737769278910496768_o-1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwtVDQB3iSQHP8hKhCyVCD1ictAV_LqN0YA&s',
    'https://demxanh.com/media/news/2810_studio-thai-binh-1.jpg' ,
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBiu-e-SK8GBBxhEhYa1XLBqDTlM91kAqe4Y5bL0VU_xoJSfbswLSloKC9NM8JbKhdCY&usqp=CAU',
    'https://tuarts.net/wp-content/uploads/2018/08/39900495_2187804601294710_8118125377903132672_o-801x1200.jpg'
   ];

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-[#C29B43] text-center mb-16"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Our Moments
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: i * 0.15,
                duration: 0.8,
                type: "spring"
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: '0 25px 50px rgba(194, 155, 67, 0.5)'
              }}
              className="aspect-square rounded-2xl overflow-hidden border-2 border-[#C29B43]/30 shadow-2xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <ImageWithFallback
                src={img}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WishesPage() {
  const [message, setMessage] = useState({ name: '', text: '' });

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-[#C29B43]/30 shadow-2xl">
          <h2 
            className="text-4xl text-[#C29B43] text-center mb-8"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Send Your Wishes
          </h2>

          <form className="space-y-6">
            <Input
              placeholder="Your Name"
              value={message.name}
              onChange={(e) => setMessage({ ...message, name: e.target.value })}
              className="bg-white/10 border-[#C29B43]/30 text-white placeholder:text-white/50 rounded-xl"
            />
            <Textarea
              placeholder="Your Message"
              value={message.text}
              onChange={(e) => setMessage({ ...message, text: e.target.value })}
              className="bg-white/10 border-[#C29B43]/30 text-white placeholder:text-white/50 rounded-xl"
              rows={4}
            />
            <Button className="w-full bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#A88434] hover:to-[#C29B43] text-white py-6 rounded-xl">
              Send Wishes
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}