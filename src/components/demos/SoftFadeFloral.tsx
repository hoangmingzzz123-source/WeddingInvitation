import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function SoftFadeFloral() {
  const [currentTab, setCurrentTab] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = ['Cover', 'Thông Tin', 'Album', 'Lời Mời', 'RSVP'];

  // Watercolor blobs
  const watercolorBlobs = [
    { color: 'rgba(247, 218, 218, 0.3)', size: 300, x: '10%', y: '15%' },
    { color: 'rgba(255, 228, 196, 0.2)', size: 250, x: '80%', y: '25%' },
    { color: 'rgba(230, 230, 250, 0.25)', size: 200, x: '15%', y: '70%' },
    { color: 'rgba(248, 231, 234, 0.3)', size: 280, x: '75%', y: '80%' },
  ];

  // Floating leaves/petals
  const floatingElements = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FFF3F3] to-[#F8F0FF] relative overflow-hidden">
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} />

      {/* Back Button */}
      <div className="fixed top-20 left-4 z-50">
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-white/80 hover:bg-[#F7DADA] text-[#666] border border-[#F7DADA]/50 rounded-full px-4 py-2 shadow-lg transition-all backdrop-blur-sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Watercolor Background - Animated */}
      <div className="fixed inset-0 pointer-events-none">
        {watercolorBlobs.map((blob, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: blob.size,
              height: blob.size,
              left: blob.x,
              top: blob.y,
              background: blob.color,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Floating Leaves/Petals - Parallax */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingElements.map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-10}%`,
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M10 0 Q15 5 10 10 Q5 5 10 0"
                fill="rgba(247, 218, 218, 0.4)"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-md border-b border-[#F7DADA]/30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setCurrentTab(i)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                  currentTab === i
                    ? 'bg-[#F7DADA] text-white shadow-lg'
                    : 'bg-white/50 text-[#666] hover:bg-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content with Cross-Fade Transition */}
      <div className="pt-24">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {currentTab === 0 && <CoverTab scrollY={scrollY} />}
          {currentTab === 1 && <InfoTab />}
          {currentTab === 2 && <AlbumTab />}
          {currentTab === 3 && <InvitationTab />}
          {currentTab === 4 && <RSVPTab />}
        </motion.div>
      </div>
    </div>
  );
}

function CoverTab({ scrollY }: { scrollY: number }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="text-center space-y-8 relative z-10"
        style={{
          transform: `scale(${1 + scrollY * 0.00005})`,
        }}
      >
        {/* Image with Blur to Clear */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-white/50 shadow-2xl"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1658243862459-145b453dd74e?w=600"
            alt="Couple"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Text with Staggered Fade-Up */}
        <motion.div className="space-y-4">
          {['Minh', '&', 'Linh'].map((text, i) => (
            <motion.h1
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.12, duration: 0.6 }}
              className="text-6xl md:text-7xl text-[#C29B43]"
              style={{ fontFamily: '"Great Vibes", cursive' }}
            >
              {text}
            </motion.h1>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-2xl text-[#666]"
          >
            15.06.2025
          </motion.p>
        </motion.div>

        {/* Decorative Icons with Parallax */}
        <motion.div
          className="flex justify-center gap-4"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Heart className="w-6 h-6 text-[#F7DADA] fill-[#F7DADA] opacity-60" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function InfoTab() {
  return (
    <section className="min-h-screen py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-12"
      >
        <h2 
          className="text-5xl text-[#C29B43] text-center"
          style={{ fontFamily: '"Great Vibes", cursive' }}
        >
          Thông Tin Sự Kiện
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Calendar, title: 'Ngày', text: '15.06.2025' },
            { icon: Clock, title: 'Giờ', text: '10:00 AM' },
            { icon: MapPin, title: 'Địa điểm', text: 'The Manor Garden' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center space-y-3 border border-white/50 shadow-lg"
            >
              <item.icon className="w-10 h-10 mx-auto text-[#F7DADA]" />
              <h3 className="text-xl text-[#444]">{item.title}</h3>
              <p className="text-[#666]">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function AlbumTab() {
  const images = [
    'https://images.unsplash.com/photo-1658243862459-145b453dd74e?w=800',
    'https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?w=800',
    'https://images.unsplash.com/photo-1759887244219-17c3d64a7f01?w=800',
    'https://images.unsplash.com/photo-1627364155535-9ed50e63aece?w=800',
  ];

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        <h2 
          className="text-5xl text-[#C29B43] text-center"
          style={{ fontFamily: '"Great Vibes", cursive' }}
        >
          Album Kỷ Niệm
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(247, 218, 218, 0.4)' }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-xl"
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

function InvitationTab() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center space-y-6 bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/50 shadow-2xl"
      >
        <h2 
          className="text-4xl text-[#C29B43]"
          style={{ fontFamily: '"Great Vibes", cursive' }}
        >
          Lời Mời
        </h2>
        <p className="text-lg text-[#444] leading-relaxed italic">
          Tình yêu là điều kỳ diệu nhất chúng tôi tìm thấy.<br />
          Chúng tôi rất vinh hạnh được đón tiếp bạn trong ngày trọng đại của đời mình.
        </p>
      </motion.div>
    </section>
  );
}

function RSVPTab() {
  const [formData, setFormData] = useState({ name: '', guests: '1', note: '' });

  return (
    <section className="min-h-screen py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
          <h2 
            className="text-4xl text-[#C29B43] text-center mb-8"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Xác Nhận Tham Dự
          </h2>

          <form className="space-y-6">
            <Input
              placeholder="Tên của bạn"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/80 border-[#F7DADA] rounded-xl"
            />
            <Input
              type="number"
              placeholder="Số khách"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              className="bg-white/80 border-[#F7DADA] rounded-xl"
            />
            <Textarea
              placeholder="Lời nhắn"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="bg-white/80 border-[#F7DADA] rounded-xl"
              rows={4}
            />
            <Button className="w-full bg-[#F7DADA] hover:bg-[#C29B43] text-white py-6 rounded-full">
              Gửi Xác Nhận
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
