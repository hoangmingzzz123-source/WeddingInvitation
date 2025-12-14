import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Home, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function VintageGrain() {
  const [currentTab, setCurrentTab] = useState(0);
  
  const tabs = ['Cover', 'Story', 'Gallery', 'Map', 'Details'];

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#3E2723] relative overflow-hidden">
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} allowCustomMusic={true} />

      {/* Film Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Vintage Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 50%, rgba(62, 39, 35, 0.3) 100%)',
        }}
      />

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-40">
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-[#8B7355]/80 hover:bg-[#6D5A44] text-white rounded-full px-4 py-2 shadow-lg backdrop-blur-sm transition-all"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Vintage Tab Navigation */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40">
        <div className="flex gap-2 bg-[#F5EFE6]/90 backdrop-blur-sm px-4 py-2 rounded-full border border-[#8B7355]/30 shadow-lg">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setCurrentTab(i)}
              className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
                currentTab === i
                  ? 'bg-[#8B7355] text-white shadow-md'
                  : 'text-[#6D5A44] hover:bg-[#E8DCC8]'
              }`}
              style={{ fontFamily: '"Courier New", monospace' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content with Vignette Fade Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {currentTab === 0 && <CoverTab />}
          {currentTab === 1 && <StoryTab />}
          {currentTab === 2 && <GalleryTab />}
          {currentTab === 3 && <MapTab />}
          {currentTab === 4 && <DetailsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CoverTab() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-32">
      <div className="text-center space-y-8 max-w-3xl mx-auto relative">
        {/* Polaroid-style frame */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="bg-white p-4 shadow-2xl inline-block"
          style={{ 
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <div className="aspect-square w-80 overflow-hidden mb-4">
            <motion.div
              initial={{ filter: 'blur(20px) sepia(0.3)', opacity: 0 }}
              animate={{ filter: 'blur(0px) sepia(0.3)', opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <ImageWithFallback
                src="https://linhnga.vn/wp-content/uploads/2021/08/Bi%CC%80a-3-1400x933.jpeg"
                alt="Couple"
                className="w-full h-full object-cover"
                style={{ filter: 'sepia(0.3) contrast(1.1)' }}
              />
            </motion.div>
          </div>
          
          {/* Handwritten style text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-center"
            style={{ fontFamily: '"Caveat", cursive' }}
          >
            <p className="text-3xl text-[#3E2723]">Tom & Sarah</p>
            <p className="text-lg text-[#6D5A44]">Est. 2025</p>
          </motion.div>
        </motion.div>

        {/* Vintage badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 2, duration: 0.8, type: "spring" }}
          className="inline-block"
        >
          <div className="w-32 h-32 rounded-full border-4 border-[#8B7355] flex items-center justify-center bg-[#F5EFE6]">
            <div className="text-center">
              <Camera className="w-8 h-8 mx-auto mb-1 text-[#8B7355]" />
              <p className="text-xs text-[#6D5A44]" style={{ fontFamily: '"Courier New", monospace' }}>
                VINTAGE<br/>2025
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StoryTab() {
  const timeline = [
    { year: '2019', season: 'Spring', text: 'We met at a coffee shop on a rainy day' },
    { year: '2021', season: 'Summer', text: 'Our first trip together to the mountains' },
    { year: '2023', season: 'Autumn', text: 'The proposal under the falling leaves' },
    { year: '2025', season: 'Winter', text: 'Forever starts here' },
  ];

  return (
    <section className="min-h-screen py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center mb-16 text-[#8B7355]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Our Journey
        </motion.h2>

        <div className="space-y-12">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className={`flex items-start gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Year stamp */}
              <div className="flex-shrink-0 w-32 text-center">
                <div className="bg-white p-4 border-2 border-[#8B7355] inline-block transform rotate-2 shadow-lg">
                  <p className="text-3xl text-[#8B7355]" style={{ fontFamily: '"Courier New", monospace' }}>
                    {item.year}
                  </p>
                  <p className="text-sm text-[#6D5A44]">{item.season}</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white/60 backdrop-blur-sm p-6 border border-[#E8DCC8] shadow-md">
                <p className="text-lg text-[#3E2723] italic" style={{ fontFamily: '"Georgia", serif' }}>
                  "{item.text}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryTab() {
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
    <section className="min-h-screen py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center mb-16 text-[#8B7355]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Memory Lane
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 10 - 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05,
                rotate: Math.random() * 6 - 3,
                zIndex: 10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
              className="bg-white p-3 shadow-xl cursor-pointer"
              style={{
                transform: `rotate(${Math.random() * 4 - 2}deg)`,
              }}
            >
              <div className="aspect-square overflow-hidden">
                <ImageWithFallback
                  src={img}
                  alt={`Memory ${i + 1}`}
                  className="w-full h-full object-cover"
                  style={{ filter: 'sepia(0.25) contrast(1.05)' }}
                />
              </div>
              {/* Photo caption */}
              <p 
                className="mt-2 text-sm text-[#6D5A44] text-center italic"
                style={{ fontFamily: '"Caveat", cursive' }}
              >
                Memory #{i + 1}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapTab() {
  return (
    <section className="min-h-screen py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center mb-16 text-[#8B7355]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Venue Map
        </motion.h2>

        <MapSection
          className="w-full h-[500px] rounded-lg shadow-xl"
          center={{ lat: 37.7749, lng: -122.4194 }}
          zoom={13}
          marker={{ lat: 37.7749, lng: -122.4194 }}
          markerTitle="The Old Mill by the River"
        />
      </div>
    </section>
  );
}

function DetailsTab() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto w-full"
      >
        <div className="bg-white p-12 border-4 border-double border-[#8B7355] shadow-2xl relative">
          {/* Corner ornaments */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#8B7355]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#8B7355]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#8B7355]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#8B7355]" />

          <h2 
            className="text-4xl text-center mb-8 text-[#8B7355]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Wedding Details
          </h2>

          <div className="space-y-6 text-center">
            {[
              { icon: Calendar, label: 'Date', value: 'June 15th, 2025' },
              { icon: Clock, label: 'Time', value: '4:00 PM' },
              { icon: MapPin, label: 'Venue', value: 'The Old Mill by the River' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex items-center justify-center gap-4 py-4 border-b border-[#E8DCC8] last:border-0"
              >
                <item.icon className="w-6 h-6 text-[#8B7355]" />
                <div className="text-left">
                  <p className="text-sm text-[#6D5A44]" style={{ fontFamily: '"Courier New", monospace' }}>
                    {item.label}
                  </p>
                  <p className="text-lg text-[#3E2723]" style={{ fontFamily: '"Georgia", serif' }}>
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <Button className="bg-[#8B7355] hover:bg-[#6D5A44] text-white px-8 py-3 rounded-none shadow-lg">
              View Location
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}