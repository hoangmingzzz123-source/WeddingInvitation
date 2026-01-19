import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Send, Home, Mail } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function RomanticWatercolor() {
  const [rsvpData, setRsvpData] = useState({ name: '', guests: '1', note: '' });
  const [submitted, setSubmitted] = useState(false);

  // Watercolor blobs with varied colors
  const watercolorBlobs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: 200 + Math.random() * 300,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: [
      'rgba(255, 182, 193, 0.3)', // Light Pink
      'rgba(255, 218, 185, 0.25)', // Peach
      'rgba(230, 230, 250, 0.3)', // Lavender
      'rgba(255, 240, 245, 0.35)', // Lavender Blush
      'rgba(255, 228, 225, 0.3)', // Misty Rose
      'rgba(240, 248, 255, 0.25)', // Alice Blue
      'rgba(255, 245, 238, 0.3)', // Seashell
      'rgba(248, 248, 255, 0.25)', // Ghost White
    ][i],
    duration: 20 + Math.random() * 15,
    delay: Math.random() * 5,
  }));

  // Paint drips/splashes
  const paintSplashes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 10 + Math.random() * 30,
    opacity: 0.1 + Math.random() * 0.2,
  }));

  const events = [
    { title: 'Lễ Vu Quy', time: '08:00 AM', date: '15/03/2025', location: 'Nhà Gái' },
    { title: 'Tiệc Cưới', time: '18:00 PM', date: '15/03/2025', location: 'Riverside Palace' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF0F5] to-[#F0F8FF] relative overflow-hidden">
      <MusicPlayer autoPlay={true} showVolumeControl={false} allowCustomMusic={true} />

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="bg-white/80 hover:bg-[#FFB6C1] text-[#666] border border-[#FFB6C1]/50 rounded-full px-4 py-2 shadow-lg transition-all backdrop-blur-sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Animated Watercolor Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {watercolorBlobs.map((blob) => (
          <motion.div
            key={blob.id}
            className="absolute rounded-full"
            style={{
              width: blob.size,
              height: blob.size,
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
              filter: 'blur(60px)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              delay: blob.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Paint Splashes/Texture */}
      <div className="fixed inset-0 pointer-events-none">
        {paintSplashes.map((splash) => (
          <div
            key={splash.id}
            className="absolute rounded-full"
            style={{
              width: splash.size,
              height: splash.size,
              left: `${splash.x}%`,
              top: `${splash.y}%`,
              background: `radial-gradient(circle, rgba(255, 182, 193, ${splash.opacity}) 0%, transparent 100%)`,
              filter: 'blur(10px)',
            }}
          />
        ))}
      </div>

      {/* Watercolor Paper Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Image with Watercolor Border */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative">
              {/* Watercolor splash background */}
              <div className="absolute -inset-8 bg-gradient-to-br from-pink-200/40 via-purple-200/30 to-blue-200/40 rounded-full blur-3xl"></div>
              
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp"
                  alt="Couple"
                  className="w-full h-full object-cover"
                />
                
                {/* Watercolor edge effect */}
                <div className="absolute inset-0 border-8 border-white/40 rounded-3xl" 
                     style={{ 
                       borderImage: 'linear-gradient(45deg, rgba(255,182,193,0.5), rgba(230,230,250,0.5), rgba(255,218,185,0.5)) 1',
                       filter: 'blur(1px)'
                     }}
                />
              </div>

              {/* Floating watercolor elements */}
              <motion.div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 182, 193, 0.4) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(230, 230, 250, 0.4) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: 1,
                }}
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '80px' }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 rounded-full"
                style={{
                  background: 'linear-gradient(to right, rgba(255, 182, 193, 0.8), rgba(230, 230, 250, 0.8))',
                }}
              />

              <div>
                <h1 
                  className="text-6xl md:text-7xl mb-4"
                  style={{ 
                    fontFamily: '"Playfair Display", serif',
                    background: 'linear-gradient(135deg, #FF69B4, #DDA0DD, #87CEEB)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Văn Minh
                </h1>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
                  <Heart className="w-6 h-6 text-[#FF69B4]" fill="#FF69B4" />
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
                </div>

                <h1 
                  className="text-6xl md:text-7xl"
                  style={{ 
                    fontFamily: '"Playfair Display", serif',
                    background: 'linear-gradient(135deg, #FF69B4, #DDA0DD, #87CEEB)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Thu Hương
                </h1>
              </div>

              <div className="space-y-3 text-[#666]">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#FF69B4]" />
                  <span className="text-xl">15 • Tháng 3 • 2025</span>
                </div>
                <p className="text-lg leading-relaxed">
                  Tình yêu là bức tranh đẹp nhất mà chúng tôi vẽ nên. 
                  Hân hạnh được chia sẻ khoảnh khắc đặc biệt này cùng bạn.
                </p>
              </div>
            </div>

            <Button 
              className="px-8 py-6 text-lg rounded-full shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FFB6C1, #DDA0DD)',
                border: 'none',
              }}
            >
              Xem Thiệp Cưới
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center mb-16"
            style={{ 
              fontFamily: '"Playfair Display", serif',
              background: 'linear-gradient(135deg, #FF69B4, #DDA0DD)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Chương Trình
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-xl"
              >
                {/* Watercolor splash decoration */}
                <div 
                  className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-30"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 182, 193, 0.6) 0%, transparent 70%)',
                  }}
                />

                <div className="space-y-4 relative z-10">
                  <h3 
                    className="text-3xl"
                    style={{ 
                      fontFamily: '"Playfair Display", serif',
                      color: '#FF69B4',
                    }}
                  >
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 text-[#666]">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#FF69B4]" />
                      <span>{event.time} - {event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#FF69B4]" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full border-[#FFB6C1] text-[#FF69B4] hover:bg-[#FFB6C1] hover:text-white"
                  >
                    Xem Bản Đồ
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl"
          >
            {/* Decorative watercolor splashes */}
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-radial from-pink-200/40 to-transparent blur-2xl"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-gradient-radial from-purple-200/40 to-transparent blur-2xl"></div>

            <div className="relative z-10">
              <h2 
                className="text-4xl md:text-5xl text-center mb-8"
                style={{ 
                  fontFamily: '"Playfair Display", serif',
                  background: 'linear-gradient(135deg, #FF69B4, #DDA0DD)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Xác Nhận Tham Dự
              </h2>

              {!submitted ? (
                <div className="space-y-6">
                  <Input
                    placeholder="Họ và tên *"
                    value={rsvpData.name}
                    onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                    className="border-[#FFB6C1]/50 focus:border-[#FF69B4]"
                  />
                  <Input
                    type="number"
                    placeholder="Số người tham dự *"
                    value={rsvpData.guests}
                    onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                    className="border-[#FFB6C1]/50 focus:border-[#FF69B4]"
                  />
                  <Textarea
                    placeholder="Lời chúc (tùy chọn)"
                    value={rsvpData.note}
                    onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                    className="border-[#FFB6C1]/50 focus:border-[#FF69B4] min-h-[120px]"
                  />
                  <Button
                    onClick={() => setSubmitted(true)}
                    className="w-full py-6 text-lg rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #FFB6C1, #DDA0DD)',
                    }}
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
                  <div 
                    className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #FFB6C1, #DDA0DD)',
                    }}
                  >
                    <Heart className="w-10 h-10 text-white" fill="white" />
                  </div>
                  <h3 className="text-2xl text-[#FF69B4]">Cảm ơn bạn!</h3>
                  <p className="text-[#666]">Chúng tôi rất mong được gặp bạn</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
