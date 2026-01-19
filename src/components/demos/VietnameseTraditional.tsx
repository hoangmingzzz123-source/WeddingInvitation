import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Users, Gift, Send, Phone, Home, QrCode, Image as ImageIcon, Mail } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';
import { VideoBgSection } from '../VideoBgSection';

export function VietnameseTraditional() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [rsvpSide, setRsvpSide] = useState<'bride' | 'groom'>('bride');
  const [formData, setFormData] = useState({ name: '', phone: '', guests: '1', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wishes, setWishes] = useState<Array<{ name: string; message: string; side: string }>>([
    { name: 'Anh Tuấn', message: 'Chúc hai em hạnh phúc bên nhau mãi mãi! 💕', side: 'Nhà Trai' },
    { name: 'Chị Lan', message: 'Đẹp lắm em! Một tương lai tươi sáng đang chờ đón hai em.', side: 'Nhà Gái' },
    { name: 'Cô Hương', message: 'Yêu thương là nền tảng, hai em sẽ xây dựng một gia đình đẹp.', side: 'Nhà Gái' },
  ]);

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

      {/* Hero Section - Red & Gold Traditional - Modern Luxury */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#DC143C]/10 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C29B43]/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        {/* Decorative Lines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-20 left-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#C29B43] to-transparent"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-20 left-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#DC143C] to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center space-y-12 max-w-4xl"
        >
          {/* Double Happiness Symbol (囍) - Luxury Glass Effect */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.3, type: 'spring', stiffness: 100 }}
            className="relative"
          >
            <div className="text-9xl md:text-[200px] text-[#DC143C] opacity-10 select-none">
              囍
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ boxShadow: ['0 0 20px rgba(220, 20, 60, 0.3)', '0 0 40px rgba(220, 20, 60, 0.6)', '0 0 20px rgba(220, 20, 60, 0.3)'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-[#DC143C] via-[#E83E4E] to-[#C29B43] rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl"
              >
                <Heart className="w-12 h-12 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <motion.p 
              className="text-sm tracking-[0.3em] text-[#C29B43] uppercase font-light"
              animate={{ letterSpacing: ['0.3em', '0.4em', '0.3em'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ✨ Hỷ Sự ✨
            </motion.p>
            <h1 
              className="text-5xl md:text-7xl bg-gradient-to-r from-[#DC143C] via-[#C29B43] to-[#DC143C] bg-clip-text text-transparent font-bold"
              style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '0.05em' }}
            >
              Lễ Thành Hôn
            </h1>
          </motion.div>

          {/* Names - Modern Glass Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 w-full"
          >
            <motion.div 
              whileHover={{ y: -5 }}
              className="space-y-2 p-6 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl flex-1"
            >
              <p className="text-xs tracking-widest text-[#C29B43] uppercase font-light">Chú Rể</p>
              <h2 
                className="text-5xl md:text-5xl lg:text-6xl bg-gradient-to-r from-[#C29B43] to-[#FFD700] bg-clip-text text-transparent whitespace-nowrap"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Nguyễn Văn Minh
              </h2>
            </motion.div>
            
            <motion.div 
              className="hidden md:flex items-center justify-center gap-6 h-32"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1 }}
            >
              <motion.div 
                className="w-px h-full bg-gradient-to-b from-transparent to-[#C29B43]"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.span 
                className="text-4xl flex-shrink-0"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💕
              </motion.span>
              <motion.div 
                className="w-px h-full bg-gradient-to-b from-[#DC143C] to-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1 }}
              className="md:hidden"
            >
              <motion.span 
                className="text-5xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💕
              </motion.span>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="space-y-2 p-6 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl flex-1"
            >
              <p className="text-xs tracking-widest text-[#DC143C] uppercase font-light">Cô Dâu</p>
              <h2 
                className="text-5xl md:text-5xl lg:text-6xl bg-gradient-to-r from-[#DC143C] to-[#FF69B4] bg-clip-text text-transparent whitespace-nowrap"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Trần Thị Hương
              </h2>
            </motion.div>
          </motion.div>

          {/* Date - Modern Luxury Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            className="inline-block border-2 border-[#C29B43]/30 rounded-3xl px-10 py-8 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl shadow-2xl"
          >
            <p className="text-xs tracking-widest text-[#C29B43] uppercase mb-3 font-light">Ngày Trọng Đại</p>
            <p className="text-4xl md:text-5xl font-bold text-[#DC143C] tracking-wider">
              15 • 03 • 2025
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Family Introduction - Two Sides */}
      <section className="py-24 px-6 bg-gradient-to-b from-white via-[#FFF8E7] to-white relative">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center bg-gradient-to-r from-[#DC143C] to-[#C29B43] bg-clip-text text-transparent font-bold"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Gia Đình Hai Bên
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Groom's Family */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="border-2 border-[#C29B43]/30 rounded-3xl p-8 bg-gradient-to-br from-white/80 via-[#FFF8E7]/50 to-white/80 backdrop-blur-md shadow-2xl hover:shadow-3xl transition-all"
            >
              <div className="text-center space-y-6">
                <motion.div 
                  animate={{ boxShadow: ['0 0 20px rgba(194, 155, 67, 0.3)', '0 0 40px rgba(194, 155, 67, 0.6)', '0 0 20px rgba(194, 155, 67, 0.3)'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-[#C29B43] to-[#FFD700] rounded-full flex items-center justify-center shadow-lg border border-white/30"
                >
                  <Users className="w-10 h-10 text-white" />
                </motion.div>
                
                <div className="space-y-3">
                  <h3 
                    className="text-3xl bg-gradient-to-r from-[#C29B43] to-[#FFD700] bg-clip-text text-transparent font-bold"
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

                  <div className="pt-4 space-y-2 border-t border-[#C29B43]/20">
                    <p className="text-sm text-[#999]">Con trai thứ nhất</p>
                    <h4 className="text-2xl font-bold text-[#C29B43]">Nguyễn Văn Minh</h4>
                    <p className="text-sm text-[#666]">Sinh năm 1995</p>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" size="sm" className="border-[#C29B43] text-[#C29B43] hover:bg-[#FFF8E7]">
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
              whileHover={{ y: -8 }}
              className="border-2 border-[#DC143C]/30 rounded-3xl p-8 bg-gradient-to-br from-white/80 via-[#FFE5E5]/50 to-white/80 backdrop-blur-md shadow-2xl hover:shadow-3xl transition-all"
            >
              <div className="text-center space-y-6">
                <motion.div 
                  animate={{ boxShadow: ['0 0 20px rgba(220, 20, 60, 0.3)', '0 0 40px rgba(220, 20, 60, 0.6)', '0 0 20px rgba(220, 20, 60, 0.3)'] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-[#DC143C] to-[#FF69B4] rounded-full flex items-center justify-center shadow-lg border border-white/30"
                >
                  <Users className="w-10 h-10 text-white" />
                </motion.div>
                
                <div className="space-y-3">
                  <h3 
                    className="text-3xl bg-gradient-to-r from-[#DC143C] to-[#FF69B4] bg-clip-text text-transparent font-bold"
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

                  <div className="pt-4 space-y-2 border-t border-[#DC143C]/20">
                    <p className="text-sm text-[#999]">Con gái duy nhất</p>
                    <h4 className="text-2xl font-bold text-[#DC143C]">Trần Thị Hương</h4>
                    <p className="text-sm text-[#666]">Sinh năm 1997</p>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" size="sm" className="border-[#DC143C] text-[#DC143C] hover:bg-[#FFE5E5]">
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
      <section className="py-24 px-6 bg-gradient-to-b from-white via-[#FFF8E7] to-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center bg-gradient-to-r from-[#DC143C] to-[#C29B43] bg-clip-text text-transparent font-bold"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Lịch Trình Chi Tiết
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`border-2 rounded-3xl p-8 backdrop-blur-md transition-all hover:shadow-2xl ${
                  event.side === 'Nhà Trai'
                    ? 'border-[#C29B43]/30 bg-gradient-to-r from-white/70 via-[#FFF8E7]/40 to-white/70'
                    : 'border-[#DC143C]/30 bg-gradient-to-r from-white/70 via-[#FFE5E5]/40 to-white/70'
                }`}
              >
                <div className="space-y-4 h-full flex flex-col">
                  {/* Side Badge */}
                  <div>
                    <div 
                      className={`inline-block px-4 py-2 rounded-full text-white text-sm ${
                        event.side === 'Nhà Trai' ? 'bg-[#C29B43]' : 'bg-[#DC143C]'
                      }`}
                    >
                      {event.side}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="space-y-3 flex-1">
                    <h3 
                      className="text-2xl text-[#1B2A41] font-semibold"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-[#666]">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#C29B43] flex-shrink-0" />
                        <span>{event.date}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C29B43] flex-shrink-0" />
                        <span>{event.time}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#C29B43] flex-shrink-0" />
                        <span>{event.location}</span>
                      </p>
                      <p className="text-xs text-[#999] ml-6">
                        {event.address}
                      </p>
                    </div>

                    <p className="text-xs text-[#666] pt-2">
                      <b>Chủ Hôn:</b> {event.hostParents}
                    </p>
                  </div>

                  {/* Action */}
                  <Button 
                    className={`w-full mt-4 ${
                      event.side === 'Nhà Trai'
                        ? 'bg-[#C29B43] hover:bg-[#A88434]'
                        : 'bg-[#DC143C] hover:bg-[#B8102F]'
                    } text-white`}
                  >
                    Xem Bản Đồ
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery - Áo Dài & Family */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center bg-gradient-to-r from-[#DC143C] to-[#C29B43] bg-clip-text text-transparent font-bold"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Album Ảnh Cưới
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.08, zIndex: 10 }}
                className="relative aspect-[3/4] overflow-hidden rounded-3xl border-2 border-[#C29B43]/30 cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
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

      {/* Video Section */}
      <VideoBgSection
        title="Xem Video Cưới"
        subtitle="Những khoảnh khắc đẹp nhất của chúng tôi"
        bgGradient="from-[#FFF8E7] to-white"
        titleColor="text-[#DC143C]"
        subtitleColor="text-[#666]"
        bokehColors={['rgba(220, 20, 60, 0.1)', 'rgba(194, 155, 67, 0.1)']}
        playButtonColor="bg-[#DC143C]"
        borderColor="border-[#C29B43]/30"
        accentColor="[#C29B43]"
      />

      {/* Wishes/Lời Chúc Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 
              className="text-4xl md:text-5xl text-[#DC143C]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Lời Chúc Từ Các Vị Khách
            </h2>
            <p className="text-lg text-[#666]">
              Những lời yêu thương từ những người thân yêu
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {wishes.map((wish, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`border-4 rounded-2xl p-8 space-y-4 bg-gradient-to-br transition-shadow hover:shadow-xl ${
                  wish.side === 'Nhà Trai'
                    ? 'border-[#C29B43]/30 from-[#FFF8E7] to-white'
                    : 'border-[#DC143C]/30 from-[#FFE5E5] to-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl text-[#1B2A41] font-semibold">{wish.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs text-white ${
                    wish.side === 'Nhà Trai' ? 'bg-[#C29B43]' : 'bg-[#DC143C]'
                  }`}>
                    {wish.side}
                  </span>
                </div>
                <p className="text-[#666] italic leading-relaxed">"{wish.message}"</p>
                <div className="flex gap-1 pt-2">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-lg">❤️</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banking/Gift Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#FFF8E7] to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 
              className="text-4xl md:text-5xl text-[#DC143C]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Quà Tặng & Mừng Cưới
            </h2>
            <p className="text-lg text-[#666]">
              Nếu vui lòng gửi những lời chúc và quà tặng đến cho chúng tôi
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bride's Account */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border-4 border-[#DC143C]/30 rounded-3xl p-8 bg-white/90 backdrop-blur space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl text-[#DC143C] font-semibold">Cô Dâu</h3>
                <p className="text-[#666]">Trần Thị Hương</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#FFE5E5] rounded-xl border border-[#DC143C]/20">
                  <p className="text-xs text-[#666] mb-2">Ngân hàng</p>
                  <p className="text-lg text-[#1B2A41] font-semibold">Vietcombank</p>
                </div>
                <div className="p-4 bg-[#FFF8E7] rounded-xl border border-[#C29B43]/20">
                  <p className="text-xs text-[#666] mb-2">Số tài khoản</p>
                  <p className="text-lg text-[#1B2A41] font-mono font-semibold">1234567890</p>
                </div>
                <div className="p-4 bg-white border border-[#C29B43]/30 rounded-xl">
                  <p className="text-xs text-[#666] mb-2">Chủ tài khoản</p>
                  <p className="text-lg text-[#1B2A41] font-semibold">TRAN THI HUONG</p>
                </div>
              </div>

              <div className="aspect-square bg-gradient-to-br from-[#FFE5E5] to-[#FFF8E7] rounded-xl flex items-center justify-center border-2 border-dashed border-[#DC143C]/30">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-[#DC143C]/30 mx-auto mb-2" />
                  <p className="text-sm text-[#999]">QR Code</p>
                </div>
              </div>
            </motion.div>

            {/* Groom's Account */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border-4 border-[#C29B43]/30 rounded-3xl p-8 bg-white/90 backdrop-blur space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl text-[#C29B43] font-semibold">Chú Rể</h3>
                <p className="text-[#666]">Nguyễn Văn Minh</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#FFF8E7] rounded-xl border border-[#C29B43]/20">
                  <p className="text-xs text-[#666] mb-2">Ngân hàng</p>
                  <p className="text-lg text-[#1B2A41] font-semibold">Techcombank</p>
                </div>
                <div className="p-4 bg-[#FFF8E7] rounded-xl border border-[#C29B43]/20">
                  <p className="text-xs text-[#666] mb-2">Số tài khoản</p>
                  <p className="text-lg text-[#1B2A41] font-mono font-semibold">0987654321</p>
                </div>
                <div className="p-4 bg-white border border-[#C29B43]/30 rounded-xl">
                  <p className="text-xs text-[#666] mb-2">Chủ tài khoản</p>
                  <p className="text-lg text-[#1B2A41] font-semibold">NGUYEN VAN MINH</p>
                </div>
              </div>

              <div className="aspect-square bg-gradient-to-br from-[#FFF8E7] to-[#FFE5E5] rounded-xl flex items-center justify-center border-2 border-dashed border-[#C29B43]/30">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-[#C29B43]/30 mx-auto mb-2" />
                  <p className="text-sm text-[#999]">QR Code</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Share Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-gradient-to-r from-[#FFF8E7] to-[#FFE5E5] rounded-2xl border border-[#C29B43]/30"
          >
            <p className="text-sm text-[#666] mb-3">Chia sẻ lời chúc và mừng cưới</p>
            <div className="flex gap-3">
              <Input
                value={window.location.href}
                readOnly
                className="bg-white border-[#C29B43]/30 text-[#666]"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="bg-[#DC143C] hover:bg-[#B8102F] text-white whitespace-nowrap"
              >
                {copied ? '✓ Copied!' : 'Sao chép'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RSVP - Split by Bride/Groom Side */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#FFF8E7] to-white">
        <div className="max-w-3xl mx-auto">
          {!rsvpSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-4 border-[#DC143C]/30 rounded-3xl p-8 md:p-12 space-y-8 bg-white shadow-2xl"
            >
              <motion.div 
                className="text-center space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 
                  className="text-4xl md:text-5xl text-[#DC143C]"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Xác Nhận Tham Dự
                </h2>
                <p className="text-[#666]">
                  Vui lòng xác nhận sự tham dự của bạn để chúng tôi chuẩn bị tiếp đón
                </p>
              </motion.div>

              {/* Side Selector */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setRsvpSide('bride')}
                  className={`flex-1 py-6 transition-all duration-300 ${
                    rsvpSide === 'bride'
                      ? 'bg-[#DC143C] text-white shadow-lg scale-105'
                      : 'bg-white border-2 border-[#DC143C] text-[#DC143C] hover:bg-[#FFE5E5]'
                  }`}
                >
                  👰 Nhà Gái
                </Button>
                <Button
                  onClick={() => setRsvpSide('groom')}
                  className={`flex-1 py-6 transition-all duration-300 ${
                    rsvpSide === 'groom'
                      ? 'bg-[#C29B43] text-white shadow-lg scale-105'
                      : 'bg-white border-2 border-[#C29B43] text-[#C29B43] hover:bg-[#FFF8E7]'
                  }`}
                >
                  🤵 Nhà Trai
                </Button>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#C29B43] to-transparent" />

              <p className="text-center text-[#666]">
                Xác nhận cho{' '}
                <b className={rsvpSide === 'bride' ? 'text-[#DC143C]' : 'text-[#C29B43]'}>
                  {rsvpSide === 'bride' ? '👰 Nhà Gái' : '🤵 Nhà Trai'}
                </b>
              </p>

              {/* Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!formData.name.trim() || parseInt(formData.guests) < 1) {
                    alert('Vui lòng điền đầy đủ thông tin');
                    return;
                  }
                  setIsSubmitting(true);
                  try {
                    await submitRSVPWithFallback({
                      name: formData.name,
                      attending: 'yes',
                      guestCount: parseInt(formData.guests) || 1,
                      message: formData.message || 'Không có lời nhắn',
                      template: 'Vietnamese Traditional',
                    });
                    setRsvpSubmitted(true);
                  } catch (error) {
                    console.error('RSVP submission error:', error);
                    alert('Gửi thành công! Cảm ơn sự xác nhận của bạn.');
                    setRsvpSubmitted(true);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm text-[#666] mb-2 font-semibold">Họ và Tên *</label>
                  <Input 
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-2 border-[#C29B43]/30 focus:border-[#DC143C] text-[#1B2A41]"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm text-[#666] mb-2 font-semibold">Số Điện Thoại</label>
                  <Input 
                    placeholder="Nhập số điện thoại (không bắt buộc)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-2 border-[#C29B43]/30 focus:border-[#DC143C] text-[#1B2A41]"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm text-[#666] mb-2 font-semibold">Số Người Tham Dự *</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#C29B43]/30 focus:border-[#DC143C] rounded-lg text-[#1B2A41] focus:outline-none"
                    required
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'người' : 'người'}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm text-[#666] mb-2 font-semibold">Lời Chúc Mừng</label>
                  <Textarea 
                    placeholder="Gửi lời chúc mừng đến gia đình..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border-2 border-[#C29B43]/30 focus:border-[#DC143C] text-[#1B2A41] min-h-[120px]"
                  />
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-6 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    rsvpSide === 'bride'
                      ? 'bg-[#DC143C] hover:bg-[#B8102F] disabled:bg-[#999]'
                      : 'bg-[#C29B43] hover:bg-[#A88434] disabled:bg-[#999]'
                  } text-white shadow-lg`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Xác Nhận Tham Dự
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-xs text-center text-[#999]">
                💝 Thông tin của bạn sẽ được lưu trữ an toàn và chỉ dùng cho mục đích tổ chức sự kiện
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-7xl"
              >
                ✨
              </motion.div>
              <h3 className="text-4xl text-[#DC143C] font-semibold" style={{ fontFamily: '"Playfair Display", serif' }}>
                Cảm ơn bạn!
              </h3>
              <p className="text-xl text-[#666]">
                Chúng tôi đã nhận được xác nhận từ <b className={rsvpSide === 'bride' ? 'text-[#DC143C]' : 'text-[#C29B43]'}>{formData.name}</b>
              </p>
              <p className="text-lg text-[#999]">
                Chúng tôi rất mong được gặp bạn trong ngày trọng đại của chúng tôi!
              </p>
              <Button
                onClick={() => {
                  setRsvpSubmitted(false);
                  setFormData({ name: '', phone: '', guests: '1', message: '' });
                }}
                className="bg-[#C29B43] hover:bg-[#A88434] text-white py-6"
              >
                ← Quay Lại
              </Button>
            </motion.div>
          )}
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
