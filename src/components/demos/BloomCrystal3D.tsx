import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { MapPin, Calendar, Clock, QrCode, MessageSquare, Play, Heart, Send, Home, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';
import { GALLERY_IMAGES } from '../../utils/imageConstants';

export function BloomCrystal3D() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rsvpData, setRsvpData] = useState({ name: '', email: '', guests: '1', note: '', attending: 'yes' });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [guestbook, setGuestbook] = useState<Array<{ name: string; message: string; sticker: string }>>([
    { name: 'Minh Anh', message: 'Chúc hai bạn hạnh phúc mãi mãi!', sticker: '❤️' },
    { name: 'Thu Hà', message: 'Trăm năm hạnh phúc!', sticker: '🌸' },
  ]);
  const [newMessage, setNewMessage] = useState({ name: '', message: '', sticker: '❤️' });
  const [showQR, setShowQR] = useState(false);

  const stickers = ['❤️', '💝', '🌸', '🎉', '💐', '🥂', '💍', '✨'];

  const images = [
    GALLERY_IMAGES.studio_couple,
    GALLERY_IMAGES.tuarts_couple_1,
    GALLERY_IMAGES.tuarts_couple_2,
    GALLERY_IMAGES.encrypted_couple,
    GALLERY_IMAGES.demxanh_studio,
    GALLERY_IMAGES.tuarts_bride,
    GALLERY_IMAGES.tuarts_couple_3
  ];

  const pages = [
    'Cover',
    'Thông Tin',
    'Video',
    'Album',
    'Mừng Cưới',
    'RSVP',
    'Guestbook'
  ];

  // Handle swipe gestures
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold && currentPage > 0) {
      // Swipe right - go to previous page
      setCurrentPage(prev => prev - 1);
    } else if (info.offset.x < -swipeThreshold && currentPage < pages.length - 1) {
      // Swipe left - go to next page
      setCurrentPage(prev => prev + 1);
    }
  };

  // 3D Bloom Animation Component
  const BloomFlower = () => (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4 }}
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32"
          style={{
            background: 'radial-gradient(circle, rgba(194, 155, 67, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: `rotate(${i * 45}deg) translateY(-80px)`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.4, delay: i * 0.1 }}
        />
      ))}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Music Player - 199K Package: Full Control */}
      <MusicPlayer autoPlay={true} showVolumeControl={true} allowCustomMusic={true} />

      {/* Back to Home Button */}
      <div className="fixed top-20 left-4 z-50">
        <Button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="bg-white/90 hover:bg-[#C29B43] text-[#C29B43] hover:text-white border border-[#C29B43] rounded-full px-4 py-2 shadow-lg transition-all backdrop-blur-sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>

      {/* Navigation Arrows */}
      {currentPage > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.15, x: -5 }}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#C29B43] hover:text-white transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      )}

      {currentPage < pages.length - 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.15, x: 5 }}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#C29B43] hover:text-white transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      )}

      {/* Glittering particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#C29B43] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation Menu */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="flex justify-center gap-2 py-4 px-4 overflow-x-auto">
          {pages.map((page, index) => (
            <button
              key={page}
              onClick={() => setCurrentPage(index)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                currentPage === index
                  ? 'bg-[#C29B43] text-white shadow-lg'
                  : 'bg-white text-[#666] hover:bg-[#C29B43]/10'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </nav>

      <div className="pt-20">
        <AnimatePresence mode="wait">
          {/* Page 1: Cover with 3D Bloom */}
          {currentPage === 0 && (
            <motion.section
              key="cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center relative"
            >
              <BloomFlower />
              
              {/* Crystal Border Effect */}
              <div className="absolute inset-8 border-4 border-[#C29B43] opacity-20 rounded-3xl"
                style={{
                  boxShadow: '0 0 40px rgba(194, 155, 67, 0.3), inset 0 0 40px rgba(194, 155, 67, 0.1)',
                }}
              />

              {/* Golden shimmer border animation */}
              <motion.div
                className="absolute inset-8 rounded-3xl"
                style={{
                  border: '2px solid transparent',
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #C29B43, #FFD700, #C29B43)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="text-center space-y-8 z-10 px-4"
              >
                <motion.h1
                  className="text-7xl md:text-8xl text-[#C29B43]"
                  style={{ 
                    fontFamily: '"Playfair Display", serif',
                    textShadow: '0 4px 8px rgba(0,0,0,0.1), 0 8px 16px rgba(194, 155, 67, 0.3)',
                  }}
                >
                  Hương & Minh
                </motion.h1>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#C29B43]" />
                  <Heart className="w-8 h-8 text-[#C29B43] fill-[#C29B43]" />
                  <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#C29B43]" />
                </div>

                <p className="text-3xl text-[#666]">20 • 12 • 2025</p>

                <Button
                  onClick={() => setCurrentPage(1)}
                  className="bg-[#C29B43] hover:bg-[#A88434] text-white px-12 py-6 rounded-full text-lg shadow-2xl"
                >
                  Vào Thiệp
                </Button>
              </motion.div>
            </motion.section>
          )}

          {/* Page 2: Wedding Info - Glassmorphism */}
          {currentPage === 1 && (
            <motion.section
              key="info"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="min-h-screen flex items-center justify-center px-4 py-20"
            >
              <div className="max-w-5xl w-full space-y-8">
                <h2 className="text-5xl text-[#C29B43] text-center mb-12" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Thông Tin Sự Kiện
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: Calendar, title: 'Ngày Cưới', content: 'Thứ 7, 20/12/2025' },
                    { icon: Clock, title: 'Thời Gian', content: '11:00 AM' },
                    { icon: MapPin, title: 'Địa Điểm', content: 'Riverside Palace, Q4' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white/40 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-2xl"
                      style={{
                        boxShadow: '0 8px 32px rgba(194, 155, 67, 0.15)',
                      }}
                    >
                      <item.icon className="w-12 h-12 text-[#C29B43] mx-auto mb-4" />
                      <h3 className="text-xl text-center mb-2">{item.title}</h3>
                      <p className="text-[#666] text-center">{item.content}</p>
                    </motion.div>
                  ))}
                </div>

                <MapSection 
                  location="Riverside Palace"
                  address="456 Đường Phạm Văn Đồng, Quận Thủ Đức, TP.HCM"
                  mapUrl="https://maps.google.com?q=Riverside+Palace+Thu+Duc"
                  premium={true}
                  className="mt-8"
                />
              </div>
            </motion.section>
          )}

          {/* Page 3: Video */}
          {currentPage === 2 && (
            <motion.section
              key="video"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="min-h-screen flex items-center justify-center px-4 py-20"
            >
              <div className="max-w-4xl w-full space-y-8">
                <h2 className="text-5xl text-[#C29B43] text-center" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Video Cưới
                </h2>

                <motion.div
                  whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(194, 155, 67, 0.4)' }}
                  className="aspect-video bg-gradient-to-br from-[#1B2A41] to-[#0F1A2E] rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer"
                >
                  <ImageWithFallback
                    src="https://thanhnien.mediacdn.vn/Uploaded/voba/2022_04_07/anh-4-9373.jpg"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 bg-[#C29B43] rounded-full flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(194, 155, 67, 0.7)',
                          '0 0 0 20px rgba(194, 155, 67, 0)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* Page 4: Album Carousel */}
          {currentPage === 3 && (
            <motion.section
              key="album"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center px-4 py-20"
            >
              <div className="max-w-6xl w-full space-y-12">
                <h2 className="text-5xl text-[#C29B43] text-center" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Album Ảnh Cưới
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {images.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05,
                        rotateY: 5,
                        boxShadow: '0 20px 40px rgba(194, 155, 67, 0.3)',
                      }}
                      className="aspect-square rounded-2xl overflow-hidden shadow-xl"
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Page 4: QR Wedding Gift - Updated with 3 QR Codes */}
          {currentPage === 4 && (
            <motion.section
              key="qr"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="min-h-screen flex items-center justify-center px-4 py-20"
            >
              <div className="max-w-6xl w-full space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-5xl text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Mừng Cưới Online
                  </h2>
                  <p className="text-lg text-[#666]">
                    Thay lời chúc phúc, bạn có thể gửi lời chúc và mừng cưới cho chúng tôi
                  </p>
                </div>

                {/* 3 QR Codes Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { 
                      icon: '📱', 
                      title: 'Momo',
                      account: '0987654321',
                      name: 'NGUYEN VAN MINH',
                      color: '#A50064'
                    },
                    { 
                      icon: '🏦', 
                      title: 'Ngân Hàng',
                      account: '1234567890',
                      name: 'Vietcombank',
                      color: '#C29B43'
                    },
                    { 
                      icon: '💬', 
                      title: 'Zalo/Facebook',
                      account: '@wedding2025',
                      name: 'Kết nối với chúng tôi',
                      color: '#0068FF'
                    }
                  ].map((qr, index) => (
                    <motion.div
                      key={qr.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 hover:border-[#C29B43] transition-all"
                    >
                      <div className="text-center space-y-4">
                        <div className="text-5xl mb-4">{qr.icon}</div>
                        <h3 className="text-2xl text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>
                          {qr.title}
                        </h3>
                        
                        <motion.div
                          animate={{
                            boxShadow: [
                              '0 0 20px rgba(194, 155, 67, 0.2)',
                              '0 0 30px rgba(194, 155, 67, 0.4)',
                              '0 0 20px rgba(194, 155, 67, 0.2)',
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-block bg-white p-6 rounded-2xl"
                        >
                          <div className="w-48 h-48 bg-gradient-to-br from-[#C29B43]/10 to-[#F7DADA]/10 rounded-xl flex items-center justify-center">
                            <QrCode className="w-40 h-40" style={{ color: qr.color }} />
                          </div>
                        </motion.div>
                        
                        <div className="space-y-2">
                          <p className="text-lg"><strong>STK:</strong> {qr.account}</p>
                          <p className="text-sm text-[#666]">{qr.name}</p>
                        </div>

                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(qr.account);
                            alert('Đã copy: ' + qr.account);
                          }}
                          className="bg-[#C29B43] hover:bg-[#A88434] text-white px-6 py-2 rounded-full"
                        >
                          Copy {qr.title === 'Ngân Hàng' ? 'STK' : 'ID'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <p className="text-center text-[#666] italic">
                  Sự hiện diện của bạn là món quà ý nghĩa nhất với chúng tôi
                </p>
              </div>
            </motion.section>
          )}

          {/* Page 6: RSVP Advanced - Updated with Attending Field */}
          {currentPage === 5 && (
            <motion.section
              key="rsvp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center px-4 py-20"
            >
              <div className="max-w-2xl w-full">
                <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/80">
                  <h2 className="text-4xl text-[#C29B43] text-center mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Xác Nhận Tham Dự
                  </h2>

                  {!rsvpSubmitted ? (
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          await submitRSVPWithFallback({
                            name: rsvpData.name,
                            attending: rsvpData.attending === 'yes' ? 'yes' : 'no',
                            guestCount: parseInt(rsvpData.guests) || 1,
                            message: rsvpData.note || 'Không có lời nhắn',
                            template: 'BloomCrystal3D Demo',
                          });
                          setRsvpSubmitted(true);
                          setTimeout(() => {
                            setRsvpSubmitted(false);
                            setRsvpData({ name: '', email: '', guests: '1', note: '', attending: 'yes' });
                          }, 3000);
                        } catch (error) {
                          console.error('RSVP error:', error);
                          setRsvpSubmitted(true);
                          setTimeout(() => {
                            setRsvpSubmitted(false);
                            setRsvpData({ name: '', email: '', guests: '1', note: '', attending: 'yes' });
                          }, 3000);
                        }
                      }} 
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-[#666] mb-2">Họ và tên *</label>
                        <Input
                          value={rsvpData.name}
                          onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                          placeholder="Nhập họ và tên của bạn"
                          className="border-2 border-[#C29B43]/30 focus:border-[#C29B43] rounded-xl"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#666] mb-2">Email</label>
                        <Input
                          type="email"
                          value={rsvpData.email}
                          onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="border-2 border-[#C29B43]/30 focus:border-[#C29B43] rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-[#666] mb-2">Bạn có tham dự không? *</label>
                        <div className="flex gap-4">
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="radio"
                              name="attending"
                              value="yes"
                              checked={rsvpData.attending === 'yes'}
                              onChange={(e) => setRsvpData({ ...rsvpData, attending: e.target.value })}
                              className="peer sr-only"
                            />
                            <div className="px-4 py-3 rounded-xl border-2 border-[#C29B43]/30 peer-checked:border-[#C29B43] peer-checked:bg-[#C29B43]/10 text-center transition-all">
                              <span>Có, tôi sẽ đến</span>
                            </div>
                          </label>
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="radio"
                              name="attending"
                              value="no"
                              checked={rsvpData.attending === 'no'}
                              onChange={(e) => setRsvpData({ ...rsvpData, attending: e.target.value })}
                              className="peer sr-only"
                            />
                            <div className="px-4 py-3 rounded-xl border-2 border-[#C29B43]/30 peer-checked:border-[#C29B43] peer-checked:bg-[#C29B43]/10 text-center transition-all">
                              <span>Xin lỗi, không thể</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#666] mb-2">Số lượng khách *</label>
                        <Input
                          type="number"
                          value={rsvpData.guests}
                          onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                          placeholder="Số lượng khách"
                          min="1"
                          className="border-2 border-[#C29B43]/30 focus:border-[#C29B43] rounded-xl"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#666] mb-2">Lời nhắn của bạn</label>
                        <Textarea
                          value={rsvpData.note}
                          onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                          placeholder="Ghi chú đặc biệt (ăn chay, dị ứng...)"
                          rows={4}
                          className="border-2 border-[#C29B43]/30 focus:border-[#C29B43] rounded-xl"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#C29B43] hover:bg-[#A88434] text-white py-6 rounded-full text-lg"
                      >
                        Gửi Xác Nhận
                      </Button>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6"
                      >
                        <Heart className="w-12 h-12 text-green-600" fill="currentColor" />
                      </motion.div>
                      <h3 className="text-3xl text-[#C29B43] mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Xác Nhận Thành Công!
                      </h3>
                      <p className="text-lg text-[#666]">
                        Cảm ơn bạn đã xác nhận. Chúng tôi rất mong được gặp bạn!
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.section>
          )}

          {/* Page 7: Guestbook - Updated */}
          {currentPage === 6 && (
            <motion.section
              key="guestbook"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen px-4 py-20"
            >
              <div className="max-w-4xl mx-auto space-y-12">
                <h2 className="text-5xl text-[#C29B43] text-center" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Sổ Lưu Bút
                </h2>

                {/* Write Message */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl text-[#C29B43] mb-6">Gửi lời chúc</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#666] mb-2">Tên của bạn</label>
                      <Input
                        placeholder="Nhập tên của bạn"
                        value={newMessage.name}
                        onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                        className="border-2 border-[#C29B43]/30 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[#666] mb-2">Lời chúc của bạn</label>
                      <Textarea
                        placeholder="Gửi lời chúc đến cô dâu chú rể..."
                        value={newMessage.message}
                        onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                        rows={3}
                        className="border-2 border-[#C29B43]/30 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[#666] mb-2">Chọn biểu tượng</label>
                      <div className="flex gap-2 flex-wrap">
                        {stickers.map((sticker) => (
                          <button
                            key={sticker}
                            onClick={() => setNewMessage({ ...newMessage, sticker })}
                            className={`text-3xl p-3 rounded-xl transition-all ${
                              newMessage.sticker === sticker
                                ? 'bg-[#C29B43] scale-125'
                                : 'bg-gray-100 hover:scale-110'
                            }`}
                          >
                            {sticker}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        if (newMessage.name && newMessage.message) {
                          setGuestbook([...guestbook, newMessage]);
                          setNewMessage({ name: '', message: '', sticker: '❤️' });
                        }
                      }}
                      className="w-full bg-[#C29B43] hover:bg-[#A88434] text-white py-4 rounded-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Gửi Lời Chúc
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-[#666]">{guestbook.length} lời chúc</p>
                  </div>

                  {guestbook.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#C29B43]/20"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{msg.sticker}</div>
                        <div className="flex-1">
                          <p className="text-lg text-[#C29B43] mb-2">{msg.name}</p>
                          <p className="text-[#666]">{msg.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}