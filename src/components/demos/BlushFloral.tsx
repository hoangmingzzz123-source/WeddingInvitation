import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function BlushFloral() {
  const [rsvpData, setRsvpData] = useState({ name: '', guests: '1', note: '' });
  const [submitted, setSubmitted] = useState(false);

  // Floating petals animation
  const petals = Array.from({ length: 8 }, (_, i) => i);

  const loveStory = [
    { year: '2020', title: 'Lần Đầu Gặp Gỡ', icon: '👫', description: 'Chúng mình gặp nhau tại quán cafe yêu thích' },
    { year: '2022', title: 'Ngày Kỷ Niệm', icon: '💝', description: 'Chính thức bên nhau và tạo nên những kỷ niệm đẹp' },
    { year: '2025', title: 'Về Chung Một Nhà', icon: '💍', description: 'Quyết định cùng nhau bước vào hôn nhân' },
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-[#FFF3F3] to-white relative overflow-hidden">
      {/* Music Player */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} />

      {/* Floating Petals */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {petals.map((petal) => (
          <motion.div
            key={petal}
            className="absolute w-4 h-4 rounded-full"
            style={{
              background: 'radial-gradient(circle, #F7DADA 0%, transparent 70%)',
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
            }}
            animate={{
              y: window.innerHeight + 20,
              x: Math.random() * window.innerWidth,
              rotate: 360,
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Cover with Full-Screen Image */}
      <section className="relative min-h-screen flex items-center justify-center">
        <ImageWithFallback
          src="https://riversidepalace.vn/newsmultidata/1j.peg"
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Floral Corner Decorations */}
        <div className="absolute top-0 left-0 w-48 h-48 opacity-70">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="50" cy="50" r="30" fill="#F7DADA" opacity="0.5" />
            <circle cx="80" cy="30" r="20" fill="#F8E7EA" opacity="0.6" />
            <circle cx="30" cy="80" r="20" fill="#F8E7EA" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-48 h-48 opacity-70">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="150" cy="150" r="30" fill="#F7DADA" opacity="0.5" />
            <circle cx="120" cy="170" r="20" fill="#F8E7EA" opacity="0.6" />
            <circle cx="170" cy="120" r="20" fill="#F8E7EA" opacity="0.6" />
          </svg>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/80" />

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center px-4"
        >
          <h1 
            className="text-7xl md:text-8xl text-[#C29B43] mb-4"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Mai & Tuấn
          </h1>
          <p className="text-2xl text-[#666] italic">20.12.2025</p>
        </motion.div>
      </section>

      {/* Wedding Info with Blur Background */}
      <section className="py-20 px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-[#F7DADA]">
            <h2 className="text-4xl text-[#C29B43] text-center mb-12" style={{ fontFamily: '"Great Vibes", cursive' }}>
              Thông Tin Sự Kiện
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-3">
                <Calendar className="w-10 h-10 text-[#F7DADA]" />
                <h3 className="text-xl">Thứ 7</h3>
                <p className="text-[#666]">20 Tháng 12, 2025</p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <Clock className="w-10 h-10 text-[#F7DADA]" />
                <h3 className="text-xl">11:00 AM</h3>
                <p className="text-[#666]">Giờ bắt đầu</p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <MapPin className="w-10 h-10 text-[#F7DADA]" />
                <h3 className="text-xl">Địa điểm</h3>
                <p className="text-[#666] text-center">Nhà hàng Riverside Palace</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={() => window.open('https://maps.google.com', '_blank')}
                className="bg-[#F7DADA] hover:bg-[#C29B43] text-[#666] hover:text-white px-8 py-3 rounded-full transition-all"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Xem Bản Đồ
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Invitation Message with Floral Frame */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-[#FFF3F3]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6 relative"
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <Heart className="w-12 h-12 text-[#F7DADA] fill-[#F7DADA]" />
          </div>
          
          <h2 className="text-4xl text-[#C29B43]" style={{ fontFamily: '"Great Vibes", cursive' }}>
            Lời Mời Chân Thành
          </h2>
          
          <p className="text-lg text-[#444] leading-relaxed italic">
            Tình yêu là điều kỳ diệu nhất mà chúng tôi tìm thấy trong cuộc đời này.
            <br />
            Xin hân hạnh được mời bạn đến chung vui cùng gia đình trong ngày trọng đại của chúng tôi.
          </p>
        </motion.div>
      </section>

      {/* Love Story Timeline */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <h2 className="text-5xl text-[#C29B43] text-center mb-16" style={{ fontFamily: '"Great Vibes", cursive' }}>
            Câu Chuyện Tình Yêu
          </h2>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#F7DADA] transform -translate-x-1/2" />

            {loveStory.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#F7DADA]">
                    <h3 className="text-2xl text-[#C29B43] mb-2">{story.title}</h3>
                    <p className="text-sm text-[#666] mb-2">{story.year}</p>
                    <p className="text-[#444]">{story.description}</p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-[#F7DADA] rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-lg">
                  {story.icon}
                </div>

                <div className="w-5/12" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Album - Masonry Style */}
      <section className="py-20 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto space-y-12"
        >
          <h2 className="text-5xl text-[#C29B43] text-center" style={{ fontFamily: '"Great Vibes", cursive' }}>
            Album Kỷ Niệm
          </h2>

          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(247, 218, 218, 0.5)' }}
                className="break-inside-avoid mb-4 rounded-2xl overflow-hidden shadow-lg"
                style={{ aspectRatio: index % 3 === 0 ? '3/4' : index % 3 === 1 ? '1/1' : '4/3' }}
              >
                <ImageWithFallback
                  src={img}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Map Section */}
      <MapSection 
        location="Vườn Tiệc Cưới Rose Garden"
        address="456 Đường Hồng Hà, Quận Tân Bình, TP.HCM"
        mapUrl="https://maps.google.com/?q=Rose+Garden+Wedding+Ho+Chi+Minh"
        premium={false}
      />

      {/* RSVP */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-[#FFF3F3]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-[#F7DADA]">
            <h2 className="text-4xl text-[#C29B43] text-center mb-8" style={{ fontFamily: '"Great Vibes", cursive' }}>
              Xác Nhận Tham Dự
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
              <Input
                placeholder="Tên của bạn"
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                className="border-2 border-[#F7DADA] focus:border-[#C29B43] rounded-xl"
                required
              />

              <Input
                type="number"
                placeholder="Số lượng khách"
                value={rsvpData.guests}
                onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                className="border-2 border-[#F7DADA] focus:border-[#C29B43] rounded-xl"
                required
              />

              <Textarea
                placeholder="Lời nhắn của bạn"
                value={rsvpData.note}
                onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                className="border-2 border-[#F7DADA] focus:border-[#C29B43] rounded-xl"
                rows={4}
              />

              <Button
                type="submit"
                className="w-full bg-[#F7DADA] hover:bg-[#C29B43] text-[#666] hover:text-white py-6 rounded-full transition-all"
              >
                {submitted ? 'Cảm ơn bạn! 💝' : 'Gửi Xác Nhận'}
              </Button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-[#666]">
        <p className="italic">Made with love for Mai & Tuấn 💕</p>
      </footer>
    </div>
  );
}