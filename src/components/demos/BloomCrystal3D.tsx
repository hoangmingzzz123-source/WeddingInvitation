import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { MapPin, Calendar, Clock, QrCode, MessageSquare, Play, Heart, Send, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function BloomCrystal3D() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rsvpData, setRsvpData] = useState({ name: '', email: '', guests: '1', note: '', attending: true });
  const [guestbook, setGuestbook] = useState<Array<{ name: string; message: string; sticker: string }>>([
    { name: 'Minh Anh', message: 'Chúc hai bạn hạnh phúc mãi mãi!', sticker: '❤️' },
    { name: 'Thu Hà', message: 'Trăm năm hạnh phúc!', sticker: '🌸' },
  ]);
  const [newMessage, setNewMessage] = useState({ name: '', message: '', sticker: '❤️' });
  const [showQR, setShowQR] = useState(false);

  const stickers = ['❤️', '💝', '🌸', '🎉', '💐', '🥂', '💍', '✨'];

  const images = [
    'https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp',
    'https://tuarts.net/wp-content/uploads/2015/12/117937145_4255715104503639_2707126124250519806_o.jpg'  ,
    'https://tuarts.net/wp-content/uploads/2020/05/60770796_2734489913292840_6737769278910496768_o-1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwtVDQB3iSQHP8hKhCyVCD1ictAV_LqN0YA&s',
    'https://demxanh.com/media/news/2810_studio-thai-binh-1.jpg' ,
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBiu-e-SK8GBBxhEhYa1XLBqDTlM91kAqe4Y5bL0VU_xoJSfbswLSloKC9NM8JbKhdCY&usqp=CAU',
    'https://tuarts.net/wp-content/uploads/2018/08/39900495_2187804601294710_8118125377903132672_o-801x1200.jpg'
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

          {/* Page 5: QR Wedding Gift */}
          {currentPage === 4 && (
            <motion.section
              key="qr"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="min-h-screen flex items-center justify-center px-4 py-20"
            >
              <div className="max-w-2xl w-full space-y-8 text-center">
                <h2 className="text-5xl text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Mừng Cưới Online
                </h2>
                <p className="text-lg text-[#666]">
                  Thay lời chúc phúc, bạn có thể gửi lời chúc và mừng cưới cho chúng tôi qua QR Code
                </p>

                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(194, 155, 67, 0.3)',
                      '0 0 40px rgba(194, 155, 67, 0.5)',
                      '0 0 20px rgba(194, 155, 67, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block bg-white p-8 rounded-3xl"
                >
                  <div className="w-64 h-64 bg-gradient-to-br from-[#C29B43]/10 to-[#F7DADA]/10 rounded-2xl flex items-center justify-center">
                    <QrCode className="w-48 h-48 text-[#C29B43]" />
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <p className="text-lg">Ngân hàng: <strong>Vietcombank</strong></p>
                    <p className="text-lg">STK: <strong>1234567890</strong></p>
                    <p className="text-lg">Chủ TK: <strong>NGUYEN VAN MINH</strong></p>
                  </div>

                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText('1234567890');
                      alert('Đã copy số tài khoản!');
                    }}
                    className="mt-6 bg-[#C29B43] hover:bg-[#A88434] text-white px-8 py-3 rounded-full"
                  >
                    Copy Số Tài Khoản
                  </Button>
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* Page 6: RSVP Advanced */}
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

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div className="relative">
                      <Input
                        placeholder=" "
                        className="peer border-2 border-[#C29B43]/30 focus:border-[#C29B43] rounded-xl pt-6"
                        required
                      />
                      <label className="absolute left-4 top-2 text-xs text-[#666] peer-placeholder-shown:top-4 peer-placeholder-shown:text-base transition-all">
                        Họ và tên
                      </label>
                    </div>

                    <div className="relative">
                      <Input
                        type="email"
                        placeholder=" "
                        className="peer border-2 border-[#C29B43]/30 focus:border-[#C29B43] rounded-xl pt-6"
                        required
                      />
                      <label className="absolute left-4 top-2 text-xs text-[#666] peer-placeholder-shown:top-4 peer-placeholder-shown:text-base transition-all">
                        Email
                      </label>
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        id="attending"
                        checked={rsvpData.attending}
                        onChange={(e) => setRsvpData({ ...rsvpData, attending: e.target.checked })}
                        className="w-5 h-5 accent-[#C29B43]"
                      />
                      <label htmlFor="attending" className="text-lg">Tôi sẽ tham dự</label>
                    </div>

                    <Input
                      type="number"
                      placeholder="Số lượng khách"
                      min="1"
                      className="border-2 border-[#C29B43]/30 focus:border-[#C29B43] rounded-xl"
                    />

                    <Textarea
                      placeholder="Lời nhắn của bạn"
                      rows={4}
                      className="border-2 border-[#C29B43]/30 focus:border-[#C29B43] rounded-xl"
                    />

                    <Button
                      type="submit"
                      className="w-full bg-[#C29B43] hover:bg-[#A88434] text-white py-6 rounded-full text-lg"
                    >
                      Gửi Xác Nhận
                    </Button>
                  </form>
                </div>
              </div>
            </motion.section>
          )}

          {/* Page 7: Guestbook */}
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
                    <Input
                      placeholder="Tên của bạn"
                      value={newMessage.name}
                      onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                      className="border-2 border-[#C29B43]/30 rounded-xl"
                    />

                    <Textarea
                      placeholder="Lời chúc của bạn..."
                      value={newMessage.message}
                      onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                      rows={3}
                      className="border-2 border-[#C29B43]/30 rounded-xl"
                    />

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