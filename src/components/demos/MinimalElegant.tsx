import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Phone, Mail, Gift, Send, X, QrCode } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function MinimalElegant() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Get guest name from URL parameter
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guest') || 'Bạn và người thân';
  };

  const events = [
    {
      type: 'Lễ Gia Tiên',
      date: '15',
      month: 'Tháng 3',
      year: '2025',
      time: '07:00 AM',
      location: 'Tư gia nhà gái',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    },
    {
      type: 'Lễ Cưới',
      date: '15',
      month: 'Tháng 3',
      year: '2025',
      time: '11:00 AM',
      location: 'Nhà Thờ Đức Bà',
      address: '01 Công xã Paris, Quận 1, TP.HCM',
    },
    {
      type: 'Tiệc Cưới',
      date: '15',
      month: 'Tháng 3',
      year: '2025',
      time: '18:00 PM',
      location: 'Grand Palace Hotel',
      address: '789 Lê Lợi, Quận 1, TP.HCM',
    },
  ];

  const gallery = Array(9).fill(0).map((_, i) => 
    `https://images.unsplash.com/photo-${['1626531805607-c3cd1ddce3f0', '1755838280152-1ff8ec65dd02', '1755838279349-f5471c4ffdd3', '1519027156611-f83273d3333a', '1688789675055-a39c53d4abd6', '1765248227263-cfd048f2c5c9', '1626531805607-c3cd1ddce3f0', '1755838280152-1ff8ec65dd02', '1755838279349-f5471c4ffdd3'][i]}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800`
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Music Player - 159K Package */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} allowCustomMusic={true} />

      {/* Hero Section - Clean & Minimal */}
      <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '-10vh', opacity: 0 }}
            animate={{
              y: ['0vh', '120vh'],
              x: ['0px', `${50 + i * 10}px`, `-${30 + i * 5}px`, `${20 + i * 8}px`, '0px'],
              rotate: [0, 360],
              scale: [0.5, 1, 0.8, 1, 0.5],
              opacity: [0, 0.2, 0.2, 0],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'linear',
            }}
            className="absolute w-1.5 h-1.5 bg-[#C29B43] rounded-full shadow-lg"
            style={{
              left: `${(i * 8) % 100}%`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}

        {/* Corner Decorations */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-[#C29B43]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-[#C29B43]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-[#C29B43]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-[#C29B43]"
        />

        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1626531805607-c3cd1ddce3f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center space-y-12 max-w-4xl"
        >
          {/* Date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <p className="text-sm tracking-[0.3em] text-[#666] uppercase">Save The Date</p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-20 h-px bg-[#C29B43]" />
              <p className="text-6xl md:text-8xl tracking-wider text-[#1B2A41]"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                15
              </p>
              <div className="w-20 h-px bg-[#C29B43]" />
            </div>
            <p className="text-lg tracking-widest text-[#666]">03 • 2025</p>
          </motion.div>

          {/* Names */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h1 
              className="text-5xl md:text-7xl text-[#1B2A41]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Nguyễn Văn Minh
            </h1>
            <div className="flex items-center justify-center gap-6">
              <motion.div 
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scaleX: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-12 h-px bg-[#C29B43]" 
              />
              <motion.span 
                animate={{
                  scale: [1, 1.1, 1],
                  filter: [
                    'drop-shadow(0 0 0px rgba(194, 155, 67, 0))',
                    'drop-shadow(0 0 10px rgba(194, 155, 67, 0.8))',
                    'drop-shadow(0 0 0px rgba(194, 155, 67, 0))'
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-3xl text-[#C29B43]"
              >
                &
              </motion.span>
              <motion.div 
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scaleX: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-12 h-px bg-[#C29B43]" 
              />
            </div>
            <h1 
              className="text-5xl md:text-7xl text-[#1B2A41]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Trần Thị Hương
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-lg text-[#666] max-w-2xl mx-auto"
          >
            Trân trọng kính mời <span className="font-semibold text-[#C29B43]">{getGuestName()}</span> đến dự lễ cưới của chúng tôi
          </motion.p>
        </motion.div>
      </section>

      {/* Couple Info - Two Columns */}
      <section className="py-24 px-6 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Groom */}
            <motion.div
              initial={{ opacity: 0, x: -30, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              whileHover={{
                rotateY: 5,
                rotateX: -3,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 300 },
              }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="text-center space-y-6"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-[#C29B43]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1755838280152-1ff8ec65dd02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                  alt="Chú rể"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <h3 
                  className="text-3xl text-[#1B2A41]"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Nguyễn Văn Minh
                </h3>
                <p className="text-[#666] leading-relaxed">
                  Con trai ông <b>Nguyễn Văn A</b> và bà <b>Trần Thị B</b>
                </p>
                <p className="text-sm text-[#999] max-w-sm mx-auto">
                  Kỹ sư phần mềm, đam mê công nghệ và nhiếp ảnh. 
                  Tin rằng tình yêu là sự kiên nhẫn và thấu hiểu.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Phone className="w-4 h-4 mr-2" />
                    0901 234 567
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Bride */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotateY: 15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              whileHover={{
                rotateY: -5,
                rotateX: -3,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 300 },
              }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="text-center space-y-6"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-[#C29B43]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1765248227263-cfd048f2c5c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                  alt="Cô dâu"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <h3 
                  className="text-3xl text-[#1B2A41]"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Trần Thị Hương
                </h3>
                <p className="text-[#666] leading-relaxed">
                  Con gái ông <b>Trần Văn C</b> và bà <b>Lê Thị D</b>
                </p>
                <p className="text-sm text-[#999] max-w-sm mx-auto">
                  Kiến trúc sư, yêu nghệ thuật và thiên nhiên. 
                  Tin rằng hạnh phúc nằm ở những điều giản đơn nhất.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Phone className="w-4 h-4 mr-2" />
                    0902 345 678
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Timeline - Horizontal */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center text-[#1B2A41]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Lịch Trình Sự Kiện
          </motion.h2>

          <div className="space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{
                  rotateX: 2,
                  rotateY: -3,
                  scale: 1.01,
                  background: 'linear-gradient(135deg, rgba(194, 155, 67, 0.03) 0%, transparent 100%)',
                  boxShadow: '0 10px 30px rgba(194, 155, 67, 0.15)',
                  transition: { type: 'spring', stiffness: 300 },
                }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                }}
                className="border-l-4 border-[#C29B43] pl-8 py-6 rounded-r-xl"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  {/* Date */}
                  <div className="md:col-span-3 space-y-2">
                    <p 
                      className="text-6xl text-[#1B2A41]"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {event.date}
                    </p>
                    <p className="text-sm text-[#666] uppercase tracking-wider">
                      {event.month}
                    </p>
                    <p className="text-sm text-[#999]">{event.year}</p>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-6 space-y-4">
                    <h3 
                      className="text-3xl text-[#1B2A41]"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {event.type}
                    </h3>
                    <div className="space-y-2 text-[#666]">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C29B43]" />
                        {event.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#C29B43]" />
                        {event.location}
                      </p>
                      <p className="text-sm text-[#999] ml-6">
                        {event.address}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="md:col-span-3 relative">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-[#C29B43] via-transparent to-[#C29B43] opacity-20 rounded-lg"
                      style={{ filter: 'blur(4px)' }}
                    />
                    <Button 
                      variant="outline"
                      className="w-full border-[#C29B43] text-[#C29B43] hover:bg-[#C29B43] hover:text-white relative z-10"
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

      {/* Gallery - Grid 3×3 */}
      <section className="py-24 px-6 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center text-[#1B2A41]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Gallery
          </motion.h2>

          <div className="grid grid-cols-3 gap-4">
            {gallery.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95, rotateY: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 100,
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateZ: 2,
                  boxShadow: '0 20px 40px rgba(194, 155, 67, 0.3)',
                  transition: { type: 'spring', stiffness: 300 },
                }}
                onClick={() => setLightboxImage(img)}
                className="aspect-square overflow-hidden cursor-pointer rounded-lg relative group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10"
                  initial={false}
                />
                <ImageWithFallback
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          <Button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
          >
            <X className="w-6 h-6" />
          </Button>
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={lightboxImage}
            alt="Lightbox"
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>
      )}

      {/* RSVP + Gift Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* RSVP */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 
              className="text-4xl text-[#1B2A41]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              RSVP
            </h3>
            <p className="text-[#666]">
              Vui lòng xác nhận sự tham dự của bạn trước ngày 01/03/2025
            </p>
            
            <div className="space-y-4">
              <Input 
                placeholder="Họ và tên *"
                className="border-[#C29B43]/30 focus:border-[#C29B43]"
              />
              <Input 
                type="number"
                placeholder="Số người tham dự *"
                className="border-[#C29B43]/30 focus:border-[#C29B43]"
              />
              <Textarea 
                placeholder="Lời chúc (tùy chọn)"
                className="border-[#C29B43]/30 focus:border-[#C29B43] min-h-[100px]"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full bg-[#1B2A41] hover:bg-[#0F1A2E] text-white py-6 relative overflow-hidden group">
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 bg-[#C29B43] rounded-lg"
                  />
                  <Send className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">Gửi Xác Nhận</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Gift / QR Code */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 
              className="text-4xl text-[#1B2A41]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Mừng Cưới
            </h3>
            <p className="text-[#666]">
              Thay cho hoa và quà tặng, chúng tôi nhận mừng cưới qua:
            </p>

            <div className="border-2 border-[#C29B43]/20 rounded-2xl p-8 space-y-6 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  filter: [
                    'drop-shadow(0 0 0px rgba(194, 155, 67, 0))',
                    'drop-shadow(0 0 20px rgba(194, 155, 67, 0.8))',
                    'drop-shadow(0 0 0px rgba(194, 155, 67, 0))'
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex justify-center"
              >
                <Gift className="w-16 h-16 text-[#C29B43] fill-[#C29B43]/20" />
              </motion.div>
              
              {!showQR ? (
                <Button
                  onClick={() => setShowQR(true)}
                  className="bg-[#C29B43] hover:bg-[#A88434] text-white"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Xem QR Code
                </Button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  className="space-y-4"
                >
                  {/* Placeholder QR */}
                  <motion.div 
                    whileHover={{
                      rotateY: 10,
                      rotateX: 5,
                      scale: 1.05,
                      transition: { type: 'spring', stiffness: 300 },
                    }}
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(194, 155, 67, 0)',
                        '0 0 30px rgba(194, 155, 67, 0.4)',
                        '0 0 0px rgba(194, 155, 67, 0)'
                      ],
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }}
                    className="w-48 h-48 mx-auto bg-[#FAF7F2] border-2 border-[#C29B43] rounded-xl flex items-center justify-center"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <QrCode className="w-24 h-24 text-[#C29B43]" />
                  </motion.div>
                  <div className="space-y-2 text-sm text-[#666]">
                    <p><b>Ngân hàng:</b> Vietcombank</p>
                    <p><b>STK:</b> 0123456789</p>
                    <p><b>Chủ TK:</b> Nguyễn Văn Minh</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer / Closing */}
      <section className="py-16 px-6 bg-[#1B2A41] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <p 
            className="text-2xl md:text-3xl"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Thank You
          </p>
          <p className="text-sm text-gray-400">
            Sự hiện diện của <span className="font-semibold text-[#C29B43]">{getGuestName()}</span> là niềm vinh hạnh cho gia đình chúng tôi
          </p>
          
          <Button
            onClick={() => window.location.hash = '#/'}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#1B2A41] mt-8"
          >
            ← Về Trang Chủ
          </Button>
        </div>
      </section>
    </div>
  );
}
