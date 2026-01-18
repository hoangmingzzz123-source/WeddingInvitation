import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, QrCode, MessageSquare, Home, ChevronLeft, ChevronRight, Mail, Send } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function LuxuryGoldCinematic() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showLogo, setShowLogo] = useState(true);

  // Get guest name from URL parameter
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guest') || 'Bạn và người thân';
  };

  const pages = ['Trang Bìa', 'Lời Mời', 'Dòng Thời Gian', 'Album', 'RSVP', 'QR Code'];

  useEffect(() => {
    // Hide logo after 3 seconds
    const timer = setTimeout(() => setShowLogo(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Bokeh particles
  const bokehParticles = Array.from({ length: 15 }, (_, i) => ({
    size: Math.random() * 100 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white overflow-hidden">
      {/* Music Player - 159K Package: Custom Music Allowed */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} allowCustomMusic={true} />

      {/* Bokeh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {bokehParticles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-2xl"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? '#C29B43' : i % 3 === 1 ? '#FFD700' : '#FFA500'
              }40, transparent)`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Gold Foil Logo Intro */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="relative"
            >
              {/* Shine tracking effect */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['200% 0%', '-200% 0%'],
                }}
                transition={{
                  duration: 2,
                  repeat: 1,
                  ease: "easeInOut",
                }}
              />
              
              <h1 
                className="text-8xl relative z-10"
                style={{ 
                  fontFamily: '"Great Vibes", cursive',
                  background: 'linear-gradient(135deg, #C29B43, #FFD700, #C29B43)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%',
                }}
              >
                A & N
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-40">
        <Button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="bg-white/10 hover:bg-[#C29B43] text-white border border-[#C29B43]/50 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm transition-all"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Page Navigation Arrows */}
      {currentPage > 0 && (
        <motion.button
          whileHover={{ scale: 1.15, x: -5 }}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-[#C29B43]/50 flex items-center justify-center hover:bg-[#C29B43]/30 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      )}

      {currentPage < pages.length - 1 && (
        <motion.button
          whileHover={{ scale: 1.15, x: 5 }}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-[#C29B43]/50 flex items-center justify-center hover:bg-[#C29B43]/30 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      )}

      {/* Gold Border with Glow Animation */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-10"
        animate={{
          boxShadow: [
            'inset 0 0 20px rgba(194, 155, 67, 0.3)',
            'inset 0 0 40px rgba(194, 155, 67, 0.6)',
            'inset 0 0 20px rgba(194, 155, 67, 0.3)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          border: '2px solid rgba(194, 155, 67, 0.5)',
        }}
      />

      {/* Content Pages */}
      <div className="relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {currentPage === 0 && <CoverPage />}
            {currentPage === 1 && <InvitationPage guestName={getGuestName()} />}
            {currentPage === 2 && <TimelinePage />}
            {currentPage === 3 && <GalleryPage />}
            {currentPage === 4 && <RSVPPage />}
            {currentPage === 5 && <QRPage />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentPage === i 
                ? 'bg-[#C29B43] w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function CoverPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        {/* Metallic Shine Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.h1 
            className="text-8xl md:text-9xl mb-4"
            style={{ 
              fontFamily: '"Great Vibes", cursive',
              background: 'linear-gradient(135deg, #C29B43 0%, #FFD700 50%, #C29B43 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 0%', '0% 0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Anh & Nhi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-2xl text-[#C29B43] tracking-widest"
          >
            12 • 12 • 2025
          </motion.p>
        </motion.div>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="h-px bg-gradient-to-r from-transparent via-[#C29B43] to-transparent"
        />
      </div>
    </section>
  );
}

function InvitationPage({ guestName }: { guestName: string }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-[#C29B43]/30 shadow-2xl"
        >
          <h2 
            className="text-5xl text-[#C29B43] text-center mb-8"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Trân Trọng Kính Mời <span className="font-semibold">{guestName}</span>
          </h2>

          <div className="space-y-8 text-center">
            {[
              { icon: Calendar, text: 'Thứ 7, 12.12.2025' },
              { icon: Clock, text: '18:00 - 20:00' },
              { icon: MapPin, text: 'The Imperial Palace Hotel' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex items-center justify-center gap-4 text-xl"
              >
                <item.icon className="w-6 h-6 text-[#C29B43]" />
                <span className="text-white/90">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <MapSection 
          location="The Imperial Palace Hotel"
          address="789 Đường Nguyễn Huệ, Quận 1, TP.HCM"
          mapUrl="https://maps.google.com?q=Imperial+Palace+Hotel+Q1"
          premium={true}
        />
      </div>
    </section>
  );
}

function TimelinePage() {
  const timeline = [
    {
      year: '2019',
      title: 'Lần Đầu Gặp Gỡ',
      desc: 'Một cuộc gặp gỡ tình cờ đã thay đổi mọi thứ 💫',
      image: 'https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp',
      objectPosition: 'center', // center | top | bottom | left | right | '20% 30%'
    },
    {
      year: '2021',
      title: 'Yêu Thương Đơm Hoa',
      desc: 'Chúng tôi bắt đầu hành trình bên nhau 💖',
      image: 'https://tuarts.net/wp-content/uploads/2020/05/60770796_2734489913292840_6737769278910496768_o-1.jpg',
      objectPosition: '30% 18%', // Lấy phần đầu ảnh
    },
    {
      year: '2025',
      title: 'Mãi Mãi Bên Nhau',
      desc: 'Chúng tôi nói lời "I Do" 💍',
      image: 'https://tuarts.net/wp-content/uploads/2015/12/117937145_4255715104503639_2707126124250519806_o.jpg',
      objectPosition: 'center',
    },
  ];

  return (
    <section className="relative min-h-screen px-6 py-28 bg-[#0B0B0B] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#C29B43]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-5xl md:text-6xl mb-24 text-[#E6C36A]"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Câu Chuyện Của Chúng Tôi
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-[#C29B43] via-[#FFD700] to-transparent opacity-60" />

          <div className="space-y-28">
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                  className="relative flex flex-col md:flex-row items-center"
                >
                  {/* LEFT */}
                  <div className="w-full md:w-1/2 flex justify-end md:pr-12 mb-8 md:mb-0">
                    {isLeft ? (
                      <TimelineCard item={item} align="right" />
                    ) : (
                      <TimelineImage src={item.image} objectPosition={item.objectPosition} />
                    )}
                  </div>

                  {/* CENTER DOT */}
                  <div className="absolute md:static left-1/2 -translate-x-1/2 md:translate-x-0 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C29B43] shadow-lg shadow-[#FFD700]/40"
                    />
                  </div>

                  {/* RIGHT */}
                  <div className="w-full md:w-1/2 flex justify-start md:pl-12 mt-8 md:mt-0">
                    {!isLeft ? (
                      <TimelineCard item={item} align="left" />
                    ) : (
                      <TimelineImage src={item.image} objectPosition={item.objectPosition} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== Timeline Card ===== */
function TimelineCard({
  item,
  align,
}: {
  item: { year: string; title: string; desc: string };
  align: 'left' | 'right';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`
        w-full
        max-w-md
        min-h-64
        flex
        flex-col
        justify-center
        bg-white/5
        backdrop-blur-md
        rounded-3xl
        p-8
        border
        border-[#C29B43]/30
        shadow-xl
        ${align === 'right' ? 'text-right' : 'text-left'}
      `}
    >
      <span className="block text-sm tracking-widest text-[#FFD700] mb-2">
        {item.year}
      </span>
      <h3
        className="text-3xl text-[#E6C36A] mb-3"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        {item.title}
      </h3>
      <p className="text-white/70 leading-relaxed">
        {item.desc}
      </p>
    </motion.div>
  );
}

/* ===== Timeline Image ===== */
function TimelineImage({ 
  src, 
  objectPosition = 'center' 
}: { 
  src: string;
  objectPosition?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="
        relative
        w-full
        max-w-md
        h-48
        rounded-3xl
        overflow-hidden
        border
        border-[#C29B43]/30
        shadow-2xl
        flex
        items-center
      "
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        style={{ objectPosition }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </motion.div>
  );
}


function GalleryPage() {
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
          className="text-5xl text-[#C29B43] text-center mb-16"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Our Moments
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: i * 0.15,
                duration: 0.8,
                type: "spring"
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: '0 25px 50px rgba(194, 155, 67, 0.5)'
              }}
              className="aspect-square rounded-2xl overflow-hidden border-2 border-[#C29B43]/30 shadow-2xl"
              style={{ transformStyle: 'preserve-3d' }}
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

function RSVPPage() {
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null);
  const [formData, setFormData] = useState({ name: '', guests: 1, message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full"
      >
        {!submitted ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-[#C29B43]/30 shadow-2xl">
            <h2 
              className="text-4xl text-[#C29B43] text-center mb-8"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Xác Nhận Tham Dự
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Attendance Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setAttending('yes')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    attending === 'yes'
                      ? 'bg-[#C29B43] border-[#FFD700] shadow-lg shadow-[#C29B43]/50'
                      : 'bg-white/5 border-[#C29B43]/30 hover:border-[#C29B43]/50'
                  }`}
                >
                  <div className="text-2xl mb-2">✓</div>
                  <div className="text-lg">Có, tôi sẽ đến</div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setAttending('no')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    attending === 'no'
                      ? 'bg-[#C29B43] border-[#FFD700] shadow-lg shadow-[#C29B43]/50'
                      : 'bg-white/5 border-[#C29B43]/30 hover:border-[#C29B43]/50'
                  }`}
                >
                  <div className="text-2xl mb-2">✗</div>
                  <div className="text-lg">Không thể đến</div>
                </motion.button>
              </div>

              <AnimatePresence>
                {attending === 'yes' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <Input
                      placeholder="Họ và tên"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/10 border-[#C29B43]/30 text-white placeholder:text-white/50 rounded-xl"
                      required
                    />
                    
                    <div className="flex items-center gap-4">
                      <label className="text-white/90">Số lượng khách:</label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, guests: Math.max(1, formData.guests - 1) })}
                          className="w-10 h-10 rounded-full bg-white/10 border border-[#C29B43]/30 hover:bg-[#C29B43]/30"
                        >
                          -
                        </button>
                        <span className="text-2xl text-[#C29B43] w-12 text-center">{formData.guests}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, guests: formData.guests + 1 })}
                          className="w-10 h-10 rounded-full bg-white/10 border border-[#C29B43]/30 hover:bg-[#C29B43]/30"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <Textarea
                      placeholder="Lời nhắn (không bắt buộc)"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-white/10 border-[#C29B43]/30 text-white placeholder:text-white/50 rounded-xl"
                      rows={3}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {attending && (
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#A88434] hover:to-[#C29B43] text-white py-6 rounded-xl"
                >
                  Gửi Xác Nhận
                </Button>
              )}
            </form>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-[#C29B43]/30 shadow-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-6xl mb-4"
            >
              ✓
            </motion.div>
            <h3 className="text-3xl text-[#C29B43] mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
              Cảm Ơn Bạn!
            </h3>
            <p className="text-white/70 text-lg">
              Chúng tôi đã nhận được phản hồi của bạn.
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

function QRPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-[#C29B43]/30 shadow-2xl">
          <h2 
            className="text-4xl text-[#C29B43] text-center mb-1"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Mừng hạnh phúc
          </h2>
          <h4
            className="text-xl text-[#C29B43] text-center mb-12"
             style={{ fontFamily: '"Playfair Display", serif' }}
          > cho cô dâu chú rể</h4>

          <div className="flex flex-col items-center space-y-6">
            {/* QR Code Placeholder */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-64 h-64 bg-white rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <QrCode className="w-full h-full text-[#C29B43] px-4 py-4" />
            </motion.div>

            <p className="text-white/70 text-center max-w-md">
              Nguyen Van A
            <br/>1900991919
            <br/>Techcombank
            </p>

            <Button className="bg-gradient-to-r from-[#C29B43] to-[#FFD700] hover:from-[#A88434] hover:to-[#C29B43] text-white px-8 py-3 rounded-xl">
              Tải Về Mã QR
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}