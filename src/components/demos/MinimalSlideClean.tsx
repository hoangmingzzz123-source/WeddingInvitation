import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Mail, Phone, Home, Send } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
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
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="bg-white/95 hover:bg-[#DBEAFE] text-[#1E40AF] border-2 border-[#BFDBFE] rounded-full px-5 py-2.5 shadow-xl font-semibold transition-all hover:shadow-2xl hover:scale-105"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Minimalist Navigation */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex gap-2 bg-white/95 backdrop-blur-md rounded-full p-2 shadow-xl border border-[#BFDBFE]">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setCurrentTab(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                currentTab === i
                  ? 'bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white shadow-lg shadow-blue-500/30'
                  : 'text-[#64748B] hover:bg-[#F0F9FF] hover:text-[#1E40AF]'
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
              className="text-6xl md:text-8xl mb-6 font-bold"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              <span className="text-[#1E40AF]">An</span>
              <span className="text-[#94A3B8] font-light"> & </span>
              <span className="text-[#1E40AF]">Huy</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-3xl text-[#3B82F6] font-semibold tracking-wider"
            >
              25.07.2025
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-xl text-[#475569] leading-relaxed font-medium"
          >
            Chúng tôi rất hân hạnh được chia sẻ niềm vui trong ngày đặc biệt này cùng bạn.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Button 
              className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#1E3A8A] hover:to-[#2563EB] text-white px-10 py-6 rounded-xl shadow-xl shadow-blue-500/30 font-semibold text-lg hover:scale-105 transition-all"
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
          className="text-5xl md:text-6xl text-center mb-16 text-[#1E40AF] font-bold"
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
                y: -12,
                scale: 1.05,
                boxShadow: '0 25px 50px rgba(30, 64, 175, 0.2)'
              }}
              className="bg-white rounded-3xl p-10 text-center space-y-5 shadow-xl border-2 border-[#BFDBFE] hover:border-[#3B82F6] transition-colors"
            >
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="w-10 h-10" style={{ color: card.color }} />
              </div>
              <h3 className="text-xl font-bold text-[#334155]">{card.title}</h3>
              <p className="text-[#64748B] font-medium text-lg">{card.value}</p>
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
            className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#1E3A8A] hover:to-[#2563EB] text-white px-12 py-7 rounded-xl shadow-xl shadow-blue-500/30 font-semibold text-lg hover:scale-105 transition-all"
          >
            <MapPin className="w-5 h-5 mr-2 inline" />
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
          className="text-5xl md:text-6xl text-center mb-16 text-[#1E40AF] font-bold"
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
                scale: 1.08,
                zIndex: 10,
                boxShadow: '0 30px 60px rgba(30, 64, 175, 0.3)'
              }}
              className="aspect-square rounded-3xl overflow-hidden shadow-xl border-2 border-white hover:border-[#3B82F6] relative group transition-all"
            >
              <ImageWithFallback
                src={img}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E40AF]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-[#BFDBFE]">
          <h2 
            className="text-5xl text-center mb-12 text-[#1E40AF] font-bold"
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
                whileHover={{ x: 10, boxShadow: '0 10px 30px rgba(30, 64, 175, 0.15)' }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-[#F0F9FF] border-2 border-[#BFDBFE] hover:border-[#3B82F6] transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] flex items-center justify-center shadow-lg">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#64748B] uppercase tracking-wide">{item.label}</p>
                  <p className="text-lg font-bold text-[#1E40AF] mt-1">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}