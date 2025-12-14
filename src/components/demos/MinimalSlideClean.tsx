import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Mail, Phone, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function MinimalSlideClean() {
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = ['Trang Chủ', 'Thông Tin', 'Album', 'Bản Đồ', 'Liên Hệ'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] via-white to-[#F0F9FF]">
      {/* Music Player */}
      <MusicPlayer autoPlay={false} showVolumeControl={false} allowCustomMusic={true} />

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-white hover:bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE] rounded-full px-4 py-2 shadow-lg transition-all"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Minimalist Navigation */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex gap-2 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg border border-[#BFDBFE]/50">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setCurrentTab(i)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                currentTab === i
                  ? 'bg-[#1E40AF] text-white shadow-md'
                  : 'text-[#666] hover:bg-[#F0F9FF]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content with Slide Left Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-screen"
        >
          {currentTab === 0 && <HomeTab />}
          {currentTab === 1 && <InfoTab />}
          {currentTab === 2 && <AlbumTab />}
          {currentTab === 3 && <MapTab />}
          {currentTab === 4 && <ContactTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HomeTab() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left - Image slides from left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://tphcm.cdnchinhphu.vn/334895287454388224/2023/1/20/img20230120004105-16741501441981810620786.jpg"
              alt="Couple"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Clean accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-[#1E40AF] rounded-3xl"
            style={{ originX: 0 }}
          />
        </motion.div>

        {/* Right - Text slides from right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-6xl md:text-7xl mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              <span className="text-[#1E40AF]">An</span>
              <span className="text-[#94A3B8]"> & </span>
              <span className="text-[#1E40AF]">Huy</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-2xl text-[#64748B]"
            >
              25.07.2025
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-lg text-[#475569] leading-relaxed"
          >
            Chúng tôi rất hân hạnh được chia sẻ niềm vui trong ngày đặc biệt này cùng bạn.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Button 
              className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-8 py-6 rounded-xl"
              onClick={() => window.open('https://maps.google.com', '_blank')}
            >
              Xem Địa Điểm
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function InfoTab() {
  const infoCards = [
    { icon: Calendar, title: 'Ngày', value: 'Thứ 7, 25.07.2025', color: '#3B82F6' },
    { icon: Clock, title: 'Giờ', value: '09:30 AM', color: '#06B6D4' },
    { icon: MapPin, title: 'Địa điểm', value: 'Grand Convention Center', color: '#8B5CF6' },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-5xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center mb-16 text-[#1E40AF]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Chi Tiết Sự Kiện
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {infoCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              whileHover={{ 
                y: -10,
                boxShadow: '0 20px 40px rgba(30, 64, 175, 0.15)'
              }}
              className="bg-white rounded-2xl p-8 text-center space-y-4 shadow-lg border border-[#BFDBFE]/50"
            >
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="w-8 h-8" style={{ color: card.color }} />
              </div>
              <h3 className="text-xl text-[#334155]">{card.title}</h3>
              <p className="text-[#64748B]">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Button
            onClick={() => window.open('https://maps.google.com', '_blank')}
            className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#1E3A8A] hover:to-[#2563EB] text-white px-12 py-6 rounded-xl shadow-lg"
          >
            Mở Google Maps
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function AlbumTab() {
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
          className="text-5xl text-center mb-16 text-[#1E40AF]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Kỷ Niệm Của Chúng Tôi
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.1,
                zIndex: 10,
                boxShadow: '0 25px 50px rgba(30, 64, 175, 0.25)'
              }}
              className="aspect-square rounded-2xl overflow-hidden shadow-lg relative group"
            >
              <ImageWithFallback
                src={img}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Ripple effect on hover */}
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                whileHover={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-[#1E40AF] rounded-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapTab() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full"
      >
        <MapSection />
      </motion.div>
    </section>
  );
}

function ContactTab() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full"
      >
        <div className="bg-white rounded-3xl p-12 shadow-2xl border border-[#BFDBFE]/50">
          <h2 
            className="text-4xl text-center mb-12 text-[#1E40AF]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Liên Hệ Với Chúng Tôi
          </h2>

          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'wedding@anhuy.com' },
              { icon: Phone, label: 'Điện thoại', value: '+84 123 456 789' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#F0F9FF] border border-[#BFDBFE]/50"
              >
                <div className="w-12 h-12 rounded-full bg-[#1E40AF] flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#64748B]">{item.label}</p>
                  <p className="text-lg text-[#1E40AF]">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}