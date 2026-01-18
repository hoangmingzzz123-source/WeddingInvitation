import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Send, Home, Mail } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function ModernDarkBlue() {
  const [rsvpData, setRsvpData] = useState({ name: '', guests: '1', note: '' });
  const [submitted, setSubmitted] = useState(false);

  // Get guest name from URL parameter
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guest') || 'Bạn và người thân';
  };

  // Geometric patterns for modern look
  const geometricElements = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 40 + Math.random() * 80,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 20 + Math.random() * 15,
    delay: Math.random() * 5,
  }));

  const events = [
    {
      title: 'Lễ Vu Quy',
      time: '08:00 AM',
      date: '15/03/2025',
      location: 'Nhà Gái',
      address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    },
    {
      title: 'Lễ Thành Hôn',
      time: '18:00 PM',
      date: '15/03/2025',
      location: 'Grand Palace Hotel',
      address: '456 Lê Lợi, Q.1, TP.HCM',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white relative overflow-hidden">
      <MusicPlayer autoPlay={true} showVolumeControl={false} allowCustomMusic={true} />

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="bg-white/10 hover:bg-[#3B82F6] text-white border border-white/20 rounded-full px-4 py-2 shadow-lg transition-all backdrop-blur-md"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Animated Geometric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        {geometricElements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute border-2 border-blue-400"
            style={{
              width: el.size,
              height: el.size,
              left: `${el.x}%`,
              top: `${el.y}%`,
              borderRadius: el.id % 3 === 0 ? '50%' : el.id % 3 === 1 ? '0%' : '10%',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              delay: el.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Image with modern frame */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#3B82F6]">
                <ImageWithFallback
                  src="https://tphcm.cdnchinhphu.vn/334895287454388224/2023/1/20/img20230120004105-16741501441981810620786.jpg"
                  alt="Couple"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Accent corners */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-[#60A5FA] rounded-tl-2xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-[#60A5FA] rounded-br-2xl" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-[#3B82F6]" />
                <span className="text-[#60A5FA] uppercase tracking-widest text-sm">Wedding Invitation</span>
              </motion.div>

              <h1 
                className="text-6xl md:text-7xl font-light"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Văn Minh
                <span className="block text-[#3B82F6] mt-2">&</span>
                <span className="block mt-2">Thu Hương</span>
              </h1>

              <div className="flex items-center gap-4 text-xl text-gray-300">
                <Calendar className="w-5 h-5 text-[#3B82F6]" />
                <span>15 • 03 • 2025</span>
              </div>
            </div>

            <p className="text-lg text-gray-400 leading-relaxed">
              Chúng tôi rất hân hạnh được mời bạn đến tham dự lễ cưới của chúng tôi. 
              Sự hiện diện của <span className="font-semibold text-[#64B5F6]">{getGuestName()}</span> sẽ là niềm vinh hạnh lớn nhất cho gia đình chúng tôi.
            </p>

            <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-6 text-lg rounded-xl">
              Xem Lời Mời
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Event Timeline */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center mb-16"
            style={{ fontFamily: '"Playfair Display", serif' }}
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
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-[#3B82F6]/50 transition-all"
              >
                <div className="space-y-6">
                  <h3 className="text-3xl text-[#60A5FA]" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {event.title}
                  </h3>
                  
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#3B82F6]" />
                      <span>{event.time} - {event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#3B82F6]" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-sm text-gray-400 ml-8">{event.address}</p>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
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
            className="bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/10"
          >
            <h2 
              className="text-4xl md:text-5xl text-center mb-8"
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
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  type="number"
                  placeholder="Số người tham dự *"
                  value={rsvpData.guests}
                  onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Textarea
                  placeholder="Lời chúc (tùy chọn)"
                  value={rsvpData.note}
                  onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                />
                <Button
                  onClick={() => setSubmitted(true)}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-6 text-lg"
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
                <div className="w-20 h-20 mx-auto bg-[#3B82F6]/20 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-[#3B82F6]" />
                </div>
                <h3 className="text-2xl text-[#60A5FA]">Cảm ơn bạn!</h3>
                <p className="text-gray-400">Chúng tôi đã nhận được xác nhận của bạn</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
