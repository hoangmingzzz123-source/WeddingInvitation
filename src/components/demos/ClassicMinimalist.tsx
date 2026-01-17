import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, X, Share2, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function ClassicMinimalist() {
  const [rsvpData, setRsvpData] = useState({ name: '', guests: '1', note: '' });
  const [submitted, setSubmitted] = useState(false);

  // Get guest name from URL parameter
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guest') || 'Bạn và người thân';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const images = [
    'https://trongdongpalace.com/wp-content/uploads/2024/04/to-chuc-dam-cuoi-4-1.jpg',
    'https://tiff.vn/wp-content/uploads/2025/06/nghi-thuc-rai-hoa-trong-dam-cuoi-da-co-lich-su-tu-lau-doi.jpg',
    'https://tphcm.cdnchinhphu.vn/334895287454388224/2023/1/20/tiec-cuoi-1-1674150641907468449774.jpg',
    'https://static-images.vnncdn.net/vps_images_publish/000001/000003/2024/9/10/dam-cuoi-xuc-dong-cua-dien-vien-anh-duc-va-vo-kem-12-tuoi-4891.jpg?width=0&s=dd3S-SiZ9fG9l2zACWLx6g',
    'https://www.tierra.vn/wp-content/uploads/2025/08/ao-tac-co-phuc-viet-nam-768x1024.jpg',
    'https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp',
    ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Music Player */}
      <MusicPlayer autoPlay={false} showVolumeControl={false} allowCustomMusic={true} />

      {/* Back to Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
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
            Kính mời <span className="font-semibold text-[#C29B43]">{getGuestName()}</span> đến tham dự buổi tiệc chung vui cùng gia đình chúng tôi. 
            Sự hiện diện của <span className="font-semibold text-[#C29B43]">{getGuestName()}</span> là niềm vinh hạnh cho gia đình chúng tôi.
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

      {/* Map Section */}
      <MapSection 
        location="Nhà hàng Riverside Palace"
        address="123 Đường Tôn Đức Thắng, Quận 1, TP.HCM"
        mapUrl="https://maps.google.com/?q=Riverside+Palace+Ho+Chi+Minh"
        premium={false}
      />

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
            Mừng cưới cùng chúng tôi
          </h2>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
            <div className="w-48 h-48 bg-[#C29B43]/10 rounded-lg flex items-center justify-center mb-4">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://wedding-invitation.example.com/minh-khanh"
                alt="QR Code"
                className="w-40 h-40"
              />
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
              Sao Chép Link
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