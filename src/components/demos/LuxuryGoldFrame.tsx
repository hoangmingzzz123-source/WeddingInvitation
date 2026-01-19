import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Send, Home, Gift, Mail } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function LuxuryGoldFrame() {
  const [rsvpData, setRsvpData] = useState({ name: '', guests: '1', note: '' });
  const [submitted, setSubmitted] = useState(false);

  // Get guest name from URL parameter
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guest') || 'Bạn và người thân';
  };

  // Gold sparkle particles
  const sparkles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 2,
  }));

  const events = [
    { title: 'Lễ Vu Quy', time: '08:00', date: '15/03/2025', location: 'Tư gia nhà gái' },
    { title: 'Lễ Cưới', time: '18:00', date: '15/03/2025', location: 'Grand Palace Hotel' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1510] via-[#2D2416] to-[#1A1510] text-white relative overflow-hidden">
      <MusicPlayer autoPlay={true} showVolumeControl={false} allowCustomMusic={true} />

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="bg-[#C29B43]/20 hover:bg-[#C29B43] text-[#FFD700] border border-[#C29B43] rounded-full px-4 py-2 shadow-lg transition-all backdrop-blur-md"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Gold Sparkles */}
      <div className="fixed inset-0 pointer-events-none">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              boxShadow: '0 0 10px #FFD700',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
            }}
          />
        ))}
      </div>

      {/* Ornate Corner Decorations */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top Left Corner */}
        <svg className="absolute top-0 left-0 w-48 h-48 text-[#C29B43]" viewBox="0 0 100 100">
          <path d="M0,0 L30,0 C20,10 10,20 0,30 Z" fill="currentColor" opacity="0.6"/>
          <circle cx="15" cy="15" r="3" fill="#FFD700"/>
          <path d="M5,0 L15,0 L0,15 L0,5 Z" fill="currentColor" opacity="0.8"/>
        </svg>

        {/* Top Right Corner */}
        <svg className="absolute top-0 right-0 w-48 h-48 text-[#C29B43]" viewBox="0 0 100 100">
          <path d="M100,0 L70,0 C80,10 90,20 100,30 Z" fill="currentColor" opacity="0.6"/>
          <circle cx="85" cy="15" r="3" fill="#FFD700"/>
          <path d="M95,0 L85,0 L100,15 L100,5 Z" fill="currentColor" opacity="0.8"/>
        </svg>

        {/* Bottom Left Corner */}
        <svg className="absolute bottom-0 left-0 w-48 h-48 text-[#C29B43]" viewBox="0 0 100 100">
          <path d="M0,100 L30,100 C20,90 10,80 0,70 Z" fill="currentColor" opacity="0.6"/>
          <circle cx="15" cy="85" r="3" fill="#FFD700"/>
          <path d="M5,100 L15,100 L0,85 L0,95 Z" fill="currentColor" opacity="0.8"/>
        </svg>

        {/* Bottom Right Corner */}
        <svg className="absolute bottom-0 right-0 w-48 h-48 text-[#C29B43]" viewBox="0 0 100 100">
          <path d="M100,100 L70,100 C80,90 90,80 100,70 Z" fill="currentColor" opacity="0.6"/>
          <circle cx="85" cy="85" r="3" fill="#FFD700"/>
          <path d="M95,100 L85,100 L100,85 L100,95 Z" fill="currentColor" opacity="0.8"/>
        </svg>
      </div>

      {/* Hero Section with Gold Frame */}
      <section className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="max-w-6xl w-full">
          {/* Ornate Gold Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative p-8 md:p-16"
          >
            {/* Frame Border - Animated */}
            <div className="absolute inset-0 border-4 border-[#C29B43] rounded-3xl">
              <div className="absolute inset-2 border-2 border-[#FFD700]/50 rounded-3xl"></div>
              <div className="absolute inset-4 border border-[#C29B43]/30 rounded-3xl"></div>
            </div>

            {/* Corner Ornaments */}
            {[
              { top: -4, left: -4, rotate: 0 },
              { top: -4, right: -4, rotate: 90 },
              { bottom: -4, right: -4, rotate: 180 },
              { bottom: -4, left: -4, rotate: 270 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-8"
                style={{ ...pos }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              >
                <svg viewBox="0 0 20 20" className="w-full h-full" style={{ transform: `rotate(${pos.rotate}deg)` }}>
                  <circle cx="10" cy="10" r="8" fill="#C29B43"/>
                  <circle cx="10" cy="10" r="5" fill="#FFD700"/>
                  <circle cx="10" cy="10" r="2" fill="#FFFFFF"/>
                </svg>
              </motion.div>
            ))}

            {/* Content Inside Frame */}
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border-4 border-[#C29B43] shadow-2xl">
                  <ImageWithFallback
                    src="https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp"
                    alt="Couple"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Decorative corners on image */}
                <div className="absolute -top-3 -left-3 w-12 h-12 border-t-4 border-l-4 border-[#FFD700]"></div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-4 border-r-4 border-[#FFD700]"></div>
              </motion.div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-8 text-center md:text-left"
              >
                <div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="w-20 h-1 bg-gradient-to-r from-[#C29B43] to-[#FFD700] mb-6 mx-auto md:mx-0"
                  />
                  
                  <h1 
                    className="text-6xl md:text-7xl text-[#FFD700] mb-4"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Văn Minh
                  </h1>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 my-6">
                    <div className="w-16 h-px bg-[#C29B43]"></div>
                    <Heart className="w-6 h-6 text-[#FFD700]" fill="#FFD700" />
                    <div className="w-16 h-px bg-[#C29B43]"></div>
                  </div>
                  
                  <h1 
                    className="text-6xl md:text-7xl text-[#FFD700]"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Thu Hương
                  </h1>
                </div>

                <div className="space-y-3 text-[#E5D4A0]">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Calendar className="w-5 h-5 text-[#C29B43]" />
                    <span className="text-xl">15 • Tháng 3 • 2025</span>
                  </div>
                  <p className="text-lg leading-relaxed">
                    Trân trọng kính mời <span className="font-semibold text-[#FFD700]">{getGuestName()}</span> đến dự lễ cưới của chúng tôi
                  </p>
                </div>

                <Button className="bg-[#C29B43] hover:bg-[#FFD700] text-white hover:text-black px-8 py-6 text-lg rounded-xl border-2 border-[#FFD700] transition-all">
                  Xem Chi Tiết
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Section with Luxury Cards */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center text-[#FFD700] mb-16"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Sự Kiện
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative p-8 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(194, 155, 67, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
                  border: '2px solid',
                  borderImage: 'linear-gradient(135deg, #C29B43, #FFD700) 1',
                }}
              >
                {/* Decorative corner elements */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#FFD700]"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#FFD700]"></div>

                <div className="space-y-4">
                  <h3 className="text-3xl text-[#FFD700]" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 text-[#E5D4A0]">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#C29B43]" />
                      <span>{event.time} - {event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#C29B43]" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full border-[#C29B43] text-[#FFD700] hover:bg-[#C29B43] hover:text-white"
                  >
                    Xem Bản Đồ
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP with Gold Frame */}
      <section className="py-24 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl border-4 border-[#C29B43]"
            style={{
              background: 'linear-gradient(135deg, rgba(194, 155, 67, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
            }}
          >
            <div className="absolute inset-4 border-2 border-[#FFD700]/30 rounded-2xl"></div>

            <div className="relative z-10">
              <h2 
                className="text-4xl md:text-5xl text-center text-[#FFD700] mb-8"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Xác Nhận Tham Dự
              </h2>

              {!submitted ? (
                <div className="space-y-6">
                  <Input
                    placeholder="Họ và tên *"
                    value={rsvpData.name}
                    onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                    className="bg-black/30 border-[#C29B43] text-white placeholder:text-gray-400"
                  />
                  <Input
                    type="number"
                    placeholder="Số người tham dự *"
                    value={rsvpData.guests}
                    onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                    className="bg-black/30 border-[#C29B43] text-white placeholder:text-gray-400"
                  />
                  <Textarea
                    placeholder="Lời chúc (tùy chọn)"
                    value={rsvpData.note}
                    onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                    className="bg-black/30 border-[#C29B43] text-white placeholder:text-gray-400 min-h-[120px]"
                  />
                  <Button
                    onClick={() => setSubmitted(true)}
                    className="w-full bg-[#C29B43] hover:bg-[#FFD700] text-white hover:text-black py-6 text-lg border-2 border-[#FFD700]"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Gửi Xác Nhận
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="w-20 h-20 mx-auto bg-[#C29B43]/20 rounded-full flex items-center justify-center border-2 border-[#FFD700]">
                    <Gift className="w-10 h-10 text-[#FFD700]" />
                  </div>
                  <h3 className="text-2xl text-[#FFD700]">Cảm ơn bạn!</h3>
                  <p className="text-[#E5D4A0]">Chúng tôi rất mong được gặp bạn</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
