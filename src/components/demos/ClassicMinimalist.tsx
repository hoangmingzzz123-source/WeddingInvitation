import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, X, Share2, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function ClassicMinimalist() {
  const [rsvpData, setRsvpData] = useState({ name: '', guests: '1', note: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const images = [
    'https://images.unsplash.com/photo-1658243862459-145b453dd74e?w=800',
    'https://images.unsplash.com/photo-1759887244219-17c3d64a7f01?w=800',
    'https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?w=800',
    'https://images.unsplash.com/photo-1627364155535-9ed50e63aece?w=800',
    'https://images.unsplash.com/photo-1742240439165-60790db1ee93?w=800',
    'https://images.unsplash.com/photo-1649072111605-3ea5047a4468?w=800',
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Music Player */}
      <MusicPlayer autoPlay={false} showVolumeControl={false} />

      {/* Back to Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-white hover:bg-[#C29B43] text-[#C29B43] hover:text-white border border-[#C29B43] rounded-full px-4 py-2 shadow-lg transition-all"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Cover Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      >
        {/* Gold Border */}
        <div className="absolute inset-8 border border-[#C29B43] opacity-30 rounded-lg" />
        
        {/* Background Pattern */}
        <svg className="absolute top-10 left-10 w-32 h-32 opacity-10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#C29B43" strokeWidth="0.5" />
          <path d="M50,10 L50,90 M10,50 L90,50" stroke="#C29B43" strokeWidth="0.5" />
        </svg>
        <svg className="absolute bottom-10 right-10 w-32 h-32 opacity-10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#C29B43" strokeWidth="0.5" />
          <path d="M50,10 L50,90 M10,50 L90,50" stroke="#C29B43" strokeWidth="0.5" />
        </svg>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center space-y-6"
        >
          <p className="text-[#C29B43] tracking-widest">WEDDING INVITATION</p>
          <h1 
            className="text-6xl md:text-7xl text-[#C29B43]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Linh & Khánh
          </h1>
          <div className="w-24 h-px bg-[#C29B43] mx-auto" />
          <p className="text-xl text-[#666]">20 • 12 • 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10"
        >
          <div className="text-center text-[#C29B43] animate-bounce">
            <p className="text-sm">Cuộn xuống</p>
            <span className="text-2xl">↓</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Wedding Info Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="text-center space-y-8">
            <h2 className="text-4xl text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>
              Chi Tiết Sự Kiện
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Date */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-[#C29B43]/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-[#C29B43]" />
                </div>
                <h3 className="text-xl">Ngày Cưới</h3>
                <p className="text-[#666]">Thứ 7 • 20/12/2025</p>
              </div>

              {/* Time */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-[#C29B43]/10 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-[#C29B43]" />
                </div>
                <h3 className="text-xl">Thời Gian</h3>
                <p className="text-[#666]">11:00 AM</p>
              </div>

              {/* Location */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-[#C29B43]/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-[#C29B43]" />
                </div>
                <h3 className="text-xl">Địa Điểm</h3>
                <p className="text-[#666] text-center">Nhà hàng Riverside Palace – Q4</p>
              </div>
            </div>

            <Button
              onClick={() => window.open('https://maps.google.com', '_blank')}
              className="bg-[#C29B43] hover:bg-[#A88434] text-white px-8 py-3 rounded-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Xem Bản Đồ
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Invitation Message */}
      <section className="py-20 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <h2 className="text-4xl text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Lời Mời
          </h2>
          <div className="w-24 h-px bg-[#C29B43] mx-auto" />
          <p className="text-lg text-[#444] leading-relaxed">
            Kính mời Quý khách đến tham dự buổi tiệc chung vui cùng gia đình chúng tôi. 
            Sự hiện diện của Quý khách là niềm vinh hạnh cho gia đình chúng tôi.
          </p>
          <p className="text-[#666]">
            Trân trọng kính mời!
          </p>
        </motion.div>
      </section>

      {/* Photo Album */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <h2 className="text-4xl text-[#C29B43] text-center" style={{ fontFamily: '"Playfair Display", serif' }}>
            Album Ảnh
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="aspect-square overflow-hidden rounded-xl shadow-lg"
              >
                <ImageWithFallback
                  src={img}
                  alt={`Wedding photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* RSVP Form */}
      <section className="py-20 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>
              Xác Nhận Tham Dự
            </h2>
            <p className="text-[#666]">Vui lòng cho chúng tôi biết bạn có thể tham dự</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                placeholder="Tên của bạn"
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                required
                className="border-[#C29B43]/30 focus:border-[#C29B43]"
              />
            </div>

            <div>
              <Input
                type="number"
                placeholder="Số lượng khách"
                value={rsvpData.guests}
                onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                min="1"
                required
                className="border-[#C29B43]/30 focus:border-[#C29B43]"
              />
            </div>

            <div>
              <Textarea
                placeholder="Ghi chú (tùy chọn)"
                value={rsvpData.note}
                onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                rows={4}
                className="border-[#C29B43]/30 focus:border-[#C29B43]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#C29B43] hover:bg-[#A88434] text-white py-6 rounded-full"
            >
              {submitted ? 'Đã gửi! Cảm ơn bạn ❤️' : 'Gửi Xác Nhận'}
            </Button>
          </form>
        </motion.div>
      </section>

      {/* QR Share */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          <h2 className="text-4xl text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Chia Sẻ Thiệp
          </h2>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
            <div className="w-48 h-48 bg-[#C29B43]/10 rounded-lg flex items-center justify-center mb-4">
              <p className="text-sm text-[#666] text-center px-4">QR Code<br/>Chia sẻ thiệp</p>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã copy link thiệp!');
              }}
              variant="outline"
              className="border-[#C29B43] text-[#C29B43] hover:bg-[#C29B43] hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-[#666] border-t border-[#C29B43]/20">
        <p>Made with 💝 for Linh & Khánh</p>
      </footer>
    </div>
  );
}