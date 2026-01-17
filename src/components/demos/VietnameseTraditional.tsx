import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Users, Gift, Send, Phone, Home, QrCode, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';

export function VietnameseTraditional() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [rsvpSide, setRsvpSide] = useState<'bride' | 'groom'>('bride');

  // Get guest name from URL parameter
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guest') || 'Bạn và người thân';
  };

  // Pages: Cover → Story → Gallery → Details → Map → RSVP → QR
  const pages = ['cover', 'story', 'gallery', 'details', 'map', 'rsvp', 'qr'];

  // Typewriter effect for story
  useEffect(() => {
    if (currentPage === 1 && !isTyping) {
      const text = "Giữa những điều bình dị của đời sống Việt, chúng tôi gặp nhau và thương nhau từ lúc nào không hay. Tình yêu lớn lên qua từng ngày giản đơn, để hôm nay cùng nắm tay viết tiếp một chặng đường mới.";
      setIsTyping(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [currentPage, isTyping]);

  // Traditional patterns as SVG - Enhanced
  const TraditionalPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="traditional-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* Lotus flower pattern */}
          <circle cx="60" cy="60" r="25" fill="#DC143C" opacity="0.3"/>
          <circle cx="60" cy="60" r="15" fill="#C29B43" opacity="0.4"/>
          <circle cx="60" cy="60" r="8" fill="#FFD700" opacity="0.5"/>
          {/* Corner ornaments */}
          <circle cx="10" cy="10" r="5" fill="#C29B43" opacity="0.2"/>
          <circle cx="110" cy="110" r="5" fill="#DC143C" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#traditional-pattern)" />
    </svg>
  );

  // Floating lotus petals
  const FloatingLotus = () => (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -50,
            rotate: Math.random() * 360,
            opacity: 0,
          }}
          animate={{
            y: window.innerHeight + 50,
            rotate: Math.random() * 720,
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        >
          <div
            className="w-8 h-8 rounded-full"
            style={{
              background: i % 3 === 0 ? 'radial-gradient(circle, #DC143C, #FF69B4)' : 
                         i % 3 === 1 ? 'radial-gradient(circle, #FFD700, #C29B43)' :
                         'radial-gradient(circle, #FFC0CB, #FFB6C1)',
              filter: 'blur(1px)',
              opacity: 0.7,
            }}
          />
        </motion.div>
      ))}
    </>
  );

  const events = [
    {
      title: 'Lễ Ăn Hỏi',
      side: 'Nhà Gái',
      date: 'Thứ Sáu, 14/03/2025',
      time: '09:00 Sáng',
      location: 'Tư Gia Nhà Gái',
      address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      hostParents: 'Ông Trần Văn C & Bà Lê Thị D',
    },
    {
      title: 'Rước Dâu',
      side: 'Nhà Gái',
      date: 'Thứ Bảy, 15/03/2025',
      time: '07:00 Sáng',
      location: 'Tư Gia Nhà Gái',
      address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      hostParents: 'Ông Trần Văn C & Bà Lê Thị D',
    },
    {
      title: 'Lễ Gia Tiên',
      side: 'Nhà Trai',
      date: 'Thứ Bảy, 15/03/2025',
      time: '11:00 Sáng',
      location: 'Tư Gia Nhà Trai',
      address: '456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
      hostParents: 'Ông Nguyễn Văn A & Bà Trần Thị B',
    },
    {
      title: 'Tiệc Cưới',
      side: 'Nhà Trai',
      date: 'Thứ Bảy, 15/03/2025',
      time: '18:00 Chiều',
      location: 'Nhà Hàng Tiệc Cưới Hoa Sen',
      address: '789 Võ Văn Tần, Quận 3, TP.HCM',
      hostParents: 'Ông Nguyễn Văn A & Bà Trần Thị B',
    },
  ];

  const gallery = Array(6).fill(0).map((_, i) => 
    `https://images.unsplash.com/photo-${['1765248227263-cfd048f2c5c9', '1688789675055-a39c53d4abd6', '1755838280152-1ff8ec65dd02', '1626531805607-c3cd1ddce3f0', '1755838279349-f5471c4ffdd3', '1519027156611-f83273d3333a'][i]}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800`
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] via-white to-[#FFF8E7]">
      {/* Music Player - 199K Package */}
      <MusicPlayer autoPlay={true} showVolumeControl={true} allowCustomMusic={true} />

      {/* Traditional Pattern Background */}
      <div className="fixed inset-0 pointer-events-none">
        <TraditionalPattern />
      </div>

      {/* Hero Section - Red & Gold Traditional */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-8 left-8 w-32 h-32 border-t-4 border-l-4 border-[#DC143C] rounded-tl-3xl opacity-30" />
        <div className="absolute top-8 right-8 w-32 h-32 border-t-4 border-r-4 border-[#DC143C] rounded-tr-3xl opacity-30" />
        <div className="absolute bottom-8 left-8 w-32 h-32 border-b-4 border-l-4 border-[#DC143C] rounded-bl-3xl opacity-30" />
        <div className="absolute bottom-8 right-8 w-32 h-32 border-b-4 border-r-4 border-[#DC143C] rounded-br-3xl opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center space-y-12 max-w-4xl"
        >
          {/* Double Happiness Symbol (囍) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="text-9xl md:text-[200px] text-[#DC143C] opacity-20 select-none">
              囍
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#DC143C] to-[#C29B43] rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <p className="text-sm tracking-[0.4em] text-[#DC143C] uppercase">
              Hỷ Sự
            </p>
            <h1 
              className="text-4xl md:text-5xl text-[#DC143C]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Lễ Thành Hôn
            </h1>
          </motion.div>

          {/* Names */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <p className="text-sm text-[#666]">Chú Rể</p>
              <h2 
                className="text-5xl md:text-6xl text-[#C29B43]"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Nguyễn Văn Minh
              </h2>
            </div>
            
            <div className="flex items-center justify-center gap-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C29B43]" />
              <span className="text-4xl text-[#DC143C]">❤</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C29B43]" />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-[#666]">Cô Dâu</p>
              <h2 
                className="text-5xl md:text-6xl text-[#C29B43]"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Trần Thị Hương
              </h2>
            </div>
          </motion.div>

          {/* Date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="inline-block border-4 border-[#DC143C] rounded-2xl px-8 py-6 bg-white/80 backdrop-blur-sm"
          >
            <p className="text-sm text-[#666] mb-2">Ngày Cưới</p>
            <p className="text-3xl md:text-4xl text-[#DC143C]">
              15 • 03 • 2025
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Family Introduction - Two Sides */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl text-center text-[#DC143C]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Gia Đình Hai Bên
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Groom's Family */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border-4 border-[#C29B43]/30 rounded-3xl p-8 bg-gradient-to-br from-[#FFF8E7] to-white"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#DC143C] to-[#C29B43] rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 
                    className="text-3xl text-[#DC143C]"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Nhà Trai
                  </h3>
                  
                  <div className="space-y-2 text-[#666]">
                    <p className="text-lg">
                      <b className="text-[#1B2A41]">Cha:</b> Ông Nguyễn Văn A
                    </p>
                    <p className="text-lg">
                      <b className="text-[#1B2A41]">Mẹ:</b> Bà Trần Thị B
                    </p>
                  </div>

                  <div className="pt-4 space-y-2">
                    <p className="text-sm text-[#999]">Con trai thứ nhất</p>
                    <h4 className="text-2xl text-[#C29B43]">Nguyễn Văn Minh</h4>
                    <p className="text-sm text-[#666]">Sinh năm 1995</p>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" size="sm" className="border-[#C29B43] text-[#C29B43]">
                      <Phone className="w-4 h-4 mr-2" />
                      0901 234 567
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bride's Family */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border-4 border-[#DC143C]/30 rounded-3xl p-8 bg-gradient-to-br from-[#FFE5E5] to-white"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#DC143C] to-[#FF69B4] rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 
                    className="text-3xl text-[#DC143C]"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Nhà Gái
                  </h3>
                  
                  <div className="space-y-2 text-[#666]">
                    <p className="text-lg">
                      <b className="text-[#1B2A41]">Cha:</b> Ông Trần Văn C
                    </p>
                    <p className="text-lg">
                      <b className="text-[#1B2A41]">Mẹ:</b> Bà Lê Thị D
                    </p>
                  </div>

                  <div className="pt-4 space-y-2">
                    <p className="text-sm text-[#999]">Con gái duy nhất</p>
                    <h4 className="text-2xl text-[#C29B43]">Trần Thị Hương</h4>
                    <p className="text-sm text-[#666]">Sinh năm 1997</p>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" size="sm" className="border-[#DC143C] text-[#DC143C]">
                      <Phone className="w-4 h-4 mr-2" />
                      0902 345 678
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Schedule - Detailed */}
      <section className="py-24 px-6 bg-[#FFF8E7]">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl text-center text-[#DC143C]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Lịch Trình Chi Tiết
          </motion.h2>

          <div className="space-y-8">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`border-4 rounded-3xl p-8 ${
                  event.side === 'Nhà Trai'
                    ? 'border-[#C29B43]/30 bg-gradient-to-r from-[#FFF8E7] to-white'
                    : 'border-[#DC143C]/30 bg-gradient-to-r from-[#FFE5E5] to-white'
                }`}
              >
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  {/* Side Badge */}
                  <div className="md:col-span-2">
                    <div 
                      className={`inline-block px-4 py-2 rounded-full text-white text-sm ${
                        event.side === 'Nhà Trai' ? 'bg-[#C29B43]' : 'bg-[#DC143C]'
                      }`}
                    >
                      {event.side}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="md:col-span-7 space-y-3">
                    <h3 
                      className="text-3xl text-[#1B2A41]"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {event.title}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-[#666]">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#C29B43]" />
                          {event.date}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#C29B43]" />
                          {event.time}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#C29B43]" />
                          {event.location}
                        </p>
                        <p className="text-sm text-[#999] ml-6">
                          {event.address}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[#666] pt-2">
                      <b>Chủ Hôn:</b> {event.hostParents}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="md:col-span-3">
                    <Button 
                      className={`w-full ${
                        event.side === 'Nhà Trai'
                          ? 'bg-[#C29B43] hover:bg-[#A88434]'
                          : 'bg-[#DC143C] hover:bg-[#B8102F]'
                      } text-white`}
                    >
                      Xem Bản Đồ
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery - Áo Dài & Family */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl text-center text-[#DC143C]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Album Ảnh Cưới
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl border-4 border-[#C29B43]/30 cursor-pointer group"
              >
                <ImageWithFallback
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP - Split by Bride/Groom Side */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#FFF8E7] to-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-4 border-[#DC143C]/30 rounded-3xl p-8 md:p-12 space-y-8 bg-white"
          >
            <h2 
              className="text-4xl md:text-5xl text-center text-[#DC143C]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Xác Nhận Tham Dự
            </h2>

            {/* Side Selector */}
            <div className="flex gap-4">
              <Button
                onClick={() => setRsvpSide('bride')}
                className={`flex-1 ${
                  rsvpSide === 'bride'
                    ? 'bg-[#DC143C] text-white'
                    : 'bg-white border-2 border-[#DC143C] text-[#DC143C]'
                }`}
              >
                Nhà Gái
              </Button>
              <Button
                onClick={() => setRsvpSide('groom')}
                className={`flex-1 ${
                  rsvpSide === 'groom'
                    ? 'bg-[#C29B43] text-white'
                    : 'bg-white border-2 border-[#C29B43] text-[#C29B43]'
                }`}
              >
                Nhà Trai
              </Button>
            </div>

            <p className="text-center text-[#666]">
              Xác nhận cho{' '}
              <b className={rsvpSide === 'bride' ? 'text-[#DC143C]' : 'text-[#C29B43]'}>
                {rsvpSide === 'bride' ? 'Nhà Gái' : 'Nhà Trai'}
              </b>
            </p>

            {/* Form */}
            <div className="space-y-6">
              <Input 
                placeholder="Họ và tên *"
                className="border-2 border-[#C29B43]/30 focus:border-[#DC143C]"
              />
              <Input 
                type="number"
                placeholder="Số người tham dự *"
                className="border-2 border-[#C29B43]/30 focus:border-[#DC143C]"
              />
              <Textarea 
                placeholder="Lời chúc mừng đến gia đình..."
                className="border-2 border-[#C29B43]/30 focus:border-[#DC143C] min-h-[120px]"
              />
              <Button 
                className={`w-full py-6 text-white ${
                  rsvpSide === 'bride'
                    ? 'bg-[#DC143C] hover:bg-[#B8102F]'
                    : 'bg-[#C29B43] hover:bg-[#A88434]'
                }`}
              >
                <Send className="w-4 h-4 mr-2" />
                Gửi Xác Nhận
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#DC143C] to-[#C29B43] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-6xl opacity-30">囍</div>
          <p 
            className="text-2xl md:text-3xl"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Trân Trọng Kính Mời
          </p>
          <p className="text-sm opacity-80 max-w-2xl mx-auto">
            Sự hiện diện của <span className="font-semibold text-[#DC143C]">{getGuestName()}</span> là niềm vinh hạnh và hạnh phúc lớn nhất cho gia đình chúng tôi
          </p>
          
          <Button
            onClick={() => window.location.hash = '#/'}
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-[#DC143C] mt-8"
          >
            ← Về Trang Chủ
          </Button>
        </div>
      </section>
    </div>
  );
}
