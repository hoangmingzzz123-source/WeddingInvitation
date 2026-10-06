import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Play, Volume2, ChevronDown, Send, X, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';
import { MapSection } from '../MapSection';
import { VideoBgSection } from '../VideoBgSection';
import { CinematicPreloader } from '../effects/CinematicPreloader';
import { PREMIUM_GALLERY_IMAGES, UNSPLASH_IMAGES } from '../../utils/imageConstants';

export function CinematicLoveStory() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', guests: '1', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  // Love Story Timeline Data
  const timeline = [
    {
      year: '2018',
      month: 'Tháng 3',
      title: 'Lần Đầu Gặp Gỡ',
      story: 'Một buổi sáng xuân tươi đẹp, định mệnh đã sắp đặt để chúng mình gặp nhau tại quán cà phê nhỏ. Ánh mắt anh, nụ cười em - tất cả như một khởi đầu của chuyện tình cổ tích.',
      image: PREMIUM_GALLERY_IMAGES.pinimg_2
    },
    {
      year: '2019',
      month: 'Tháng 12',
      title: 'Lời Tỏ Tình',
      story: 'Dưới ánh đèn lung linh của Giáng sinh, anh đã quỳ gối và hỏi em câu hỏi quan trọng nhất đời anh. Giọt nước mắt hạnh phúc của em chính là câu trả lời.',
      image: PREMIUM_GALLERY_IMAGES.pinimg_11
    },
    {
      year: '2023',
      month: 'Tháng 6',
      title: 'Lễ Đính Hôn',
      story: 'Được gia đình hai bên chúc phúc, chúng mình chính thức trở thành gia đình. Ngày hôm đó, hạnh phúc tràn ngập trên khuôn mặt mọi người.',
      image: PREMIUM_GALLERY_IMAGES.afamilycdn_1
    },
    {
      year: '2027',
      month: 'Tháng 3',
      title: 'Lễ Cưới',
      story: 'Và cuối cùng, chúng mình sẽ nắm tay nhau bước vào hôn lễ thiêng liêng, khởi đầu cho hành trình mới - cùng nhau đến cuối con đường.',
      image: PREMIUM_GALLERY_IMAGES.pinimg_4
    }
  ];

  const events = [
    {
      icon: Calendar,
      title: 'Lễ Gia Tiên',
      date: 'Thứ 7, 13/03/2027',
      time: '07:00 AM',
      location: 'Tư Gia Nhà Gái',
      address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    },
    {
      icon: Heart,
      title: 'Lễ Cưới',
      date: 'Thứ 7, 13/03/2027',
      time: '11:00 AM',
      location: 'Nhà Thờ Đức Bà',
      address: '01 Công xã Paris, Q.1, TP.HCM',
    },
    {
      icon: MapPin,
      title: 'Tiệc Cưới',
      date: 'Thứ 7, 13/03/2027',
      time: '18:00 PM',
      location: 'Grand Palace',
      address: '789 Lê Lợi, Q.1, TP.HCM',
    }
  ];

  const gallery = [
    PREMIUM_GALLERY_IMAGES.pinimg_11,
    PREMIUM_GALLERY_IMAGES.pinimg_2,
    PREMIUM_GALLERY_IMAGES.pinimg_4,
    PREMIUM_GALLERY_IMAGES.pinimg_5,
    PREMIUM_GALLERY_IMAGES.pinimg_6,
    PREMIUM_GALLERY_IMAGES.pinimg_7,
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Music Player - 199K Package: Full Features */}
      <MusicPlayer autoPlay={false} showVolumeControl={true} allowCustomMusic={true} />

      {/* Film Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Hero Section - Fullscreen Cinematic */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        {/* Hero Background */}
        <motion.div 
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <ImageWithFallback
            src={PREMIUM_GALLERY_IMAGES.pinimg_11}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="relative z-10 text-center px-6 space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <p className="text-sm md:text-base tracking-[0.3em] text-[#C29B43] uppercase mb-4">
              We're Getting Married
            </p>
            <h1 
              className="text-6xl md:text-8xl text-white mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Minh & Hương
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">13 • 03 • 2027</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col items-center gap-4"
          >
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-6 rounded-full"
            >
              <Play className="w-5 h-5 mr-2" />
              Play Our Story
            </Button>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-8"
            >
              <ChevronDown className="w-8 h-8 text-white/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Invitation Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-black to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 md:p-16 space-y-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <Heart className="w-16 h-16 text-[#C29B43] mx-auto mb-6" />
            </motion.div>
            
            <h2 
              className="text-4xl md:text-5xl text-[#C29B43] mb-8"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Lời Mời
            </h2>
            
            <div className="space-y-6 text-gray-300 text-lg md:text-xl leading-relaxed">
              <p className="italic" style={{ fontFamily: '"Playfair Display", serif' }}>
                Kính thưa Quý khách,
              </p>
              
              <p>
                Trải qua bao ngày tháng yêu thương và gắn bó, chúng tôi đã quyết định cùng nhau bước vào giai đoạn mới của cuộc đời - hôn nhân. 
                Đây không chỉ là ngày trọng đại của hai gia đình mà còn là dịp để chúng tôi tri ân những người thân yêu đã luôn bên cạnh, 
                động viên và chúc phúc cho chúng tôi.
              </p>
              
              <p>
                Chúng tôi rất mong được đón tiếp Quý khách trong ngày vui của gia đình. Sự hiện diện của Quý khách chính là niềm vinh hạnh 
                và món quà ý nghĩa nhất mà chúng tôi có thể nhận được.
              </p>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="pt-8 border-t border-white/10 mt-8"
              >
                <p className="text-2xl md:text-3xl italic text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Trân trọng kính mời!
                </p>
                <div className="mt-6 flex items-center justify-center gap-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Gia đình chú rể</p>
                    <p className="text-xl font-semibold">Nguyễn Văn Minh</p>
                  </div>
                  <Heart className="w-8 h-8 text-[#C29B43] fill-[#C29B43]" />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Gia đình cô dâu</p>
                    <p className="text-xl font-semibold">Trần Thị Hương</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Love Story Timeline */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-[#0A0A0A] via-black to-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center mb-20 text-[#C29B43]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Our Love Story
          </motion.h2>

          {/* Timeline */}
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C29B43] to-transparent hidden md:block" />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative mb-24 md:mb-32 ${
                  index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'
                }`}
              >
                <div className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''
                }`}>
                  {/* Image */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-full md:w-1/2 relative group"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Center Dot */}
                    <div className="absolute top-1/2 -translate-y-1/2 hidden md:block"
                      style={{
                        [index % 2 === 0 ? 'left' : 'right']: '-4px',
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        className="w-8 h-8 bg-[#C29B43] rounded-full border-4 border-black shadow-lg"
                      />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="inline-block px-4 py-2 bg-[#C29B43]/20 rounded-full">
                      <p className="text-sm text-[#C29B43]">{item.year} • {item.month}</p>
                    </div>
                    <h3 
                      className="text-3xl md:text-4xl text-white"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      {item.story}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Details */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-black via-[#0A0A0A] to-black">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center mb-20 text-[#C29B43]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Wedding Details
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6 hover:bg-white/10 transition-all duration-500">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-[#C29B43]/20 rounded-full flex items-center justify-center group-hover:bg-[#C29B43]/30 transition-colors">
                    <event.icon className="w-8 h-8 text-[#C29B43]" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 
                      className="text-2xl text-white"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-gray-400">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </p>
                      <p className="text-sm text-gray-500 ml-6">
                        {event.address}
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <Button 
                    onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-[#C29B43] hover:bg-[#A88434] text-white"
                  >
                    Xem Bản Đồ
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery - Cinematic Masonry */}
      <section className="relative py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center mb-20 text-[#C29B43]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Gallery
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer"
                onClick={() => handleLightbox(index)}
              >
                <ImageWithFallback
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Grain effect on hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                    backgroundSize: '100px 100px',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map-section" className="relative py-24 px-6 bg-gradient-to-b from-black via-[#0A0A0A] to-black">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center mb-20 text-[#C29B43]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Location
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden"
          >
            <MapSection
              showHeading={false}
              className="!px-0 !py-0"
              location="Grand Palace"
              address="789 Lê Lợi, Quận 1, TP.HCM"
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-4"
            >
              <h3 className="text-2xl text-[#C29B43] font-semibold">Nhà Gái</h3>
              <p className="text-gray-400">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
              <Button 
                onClick={() => window.open('https://maps.google.com/?q=123+Nguyen+Hue+District+1+HCMC', '_blank')}
                className="w-full bg-[#C29B43] hover:bg-[#A88434] text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Mở Google Maps
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-4"
            >
              <h3 className="text-2xl text-[#C29B43] font-semibold">Nhà Trai</h3>
              <p className="text-gray-400">456 Lê Lợi, Quận 1, TP.HCM</p>
              <Button 
                onClick={() => window.open('https://maps.google.com/?q=456+Le+Loi+District+1+HCMC', '_blank')}
                className="w-full bg-[#C29B43] hover:bg-[#A88434] text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Mở Google Maps
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="relative max-w-5xl max-h-5xl">
            <ImageWithFallback
              src={gallery[lightboxIndex]}
              alt={`Gallery ${lightboxIndex + 1}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 right-4 cursor-pointer" onClick={closeLightbox}>
              <X className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-4 left-4 cursor-pointer" onClick={() => setLightboxIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}>
              <ChevronLeft className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-4 right-4 cursor-pointer" onClick={() => setLightboxIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}>
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Video Section */}
      <VideoBgSection
        title="Xem Video Cưới"
        subtitle="Câu chuyện tình yêu của chúng tôi"
        bgGradient="from-[#FFF8F0] via-white to-[#FFF8F0]"
        titleColor="text-[#C29B43]"
        subtitleColor="text-[#666]"
        bokehColors={['rgba(194, 155, 67, 0.15)', 'rgba(247, 218, 218, 0.15)']}
        playButtonColor="bg-[#C29B43]"
        borderColor="border-gray-200"
        accentColor="[#C29B43]"
      />

      {/* RSVP Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-black via-[#0A0A0A] to-black">
        <div className="max-w-2xl mx-auto">
          {!rsvpSubmitted ? (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await submitRSVPWithFallback({
                    name: formData.name,
                    attending: 'yes',
                    guestCount: parseInt(formData.guests) || 1,
                    message: formData.message || undefined,
                    template: 'Cinematic Love Story',
                  });
                  setRsvpSubmitted(true);
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 5000);
                } catch (error) {
                  console.error('Error submitting RSVP:', error);
                  setRsvpSubmitted(true);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 
                  className="text-4xl md:text-5xl text-[#C29B43]"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  RSVP
                </h2>
                <p className="text-gray-400">
                  Vui lòng xác nhận sự tham dự của bạn
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Họ và Tên *</label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Số Người Tham Dự *</label>
                  <Input 
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    placeholder="Số lượng khách"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Lời Chúc</label>
                  <Textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Gửi lời chúc phúc đến đôi uyên ương..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 min-h-[120px]"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C29B43] hover:bg-[#A88434] text-white py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-3 border-white border-t-transparent rounded-full mr-2"
                      />
                      Đang Gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Gửi Xác Nhận
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 md:p-16 text-center space-y-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0, -10, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-24 h-24 text-[#C29B43] mx-auto" />
              </motion.div>
              <h3 
                className="text-4xl md:text-5xl text-[#C29B43]"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Cảm Ơn Bạn!
              </h3>
              <p className="text-xl text-gray-300">
                Chúng tôi rất vui mừng được đón tiếp bạn trong ngày trọng đại của chúng tôi.
              </p>
              <Button
                onClick={() => {
                  setRsvpSubmitted(false);
                  setFormData({ name: '', guests: '1', message: '' });
                }}
                variant="outline"
                className="border-[#C29B43] text-[#C29B43] hover:bg-[#C29B43] hover:text-white"
              >
                Gửi xác nhận khác
              </Button>
            </motion.div>
          )}
        </div>
      </section>
      {/* Banking/QR Mừng Cưới Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-black via-[#0A0A0A] to-black">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-center mb-8 text-[#C29B43]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Mừng Cưới
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-400 mb-16 max-w-2xl mx-auto"
          >
            Thay vì hoa và quà tặng, chúng tôi trân trọng nhận được lời chúc phúc và sự hiện diện của bạn.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bride Banking */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6 hover:bg-white/10 transition-all"
            >
              <div className="text-center space-y-3 pb-6 border-b border-white/10">
                <Heart className="w-10 h-10 text-[#C29B43] mx-auto" />
                <h3 className="text-2xl text-[#C29B43] font-semibold">Cô Dâu</h3>
                <p className="text-gray-300">Trần Thị Hương</p>
              </div>
              <div className="flex justify-center py-4">
                <div className="p-4 bg-white rounded-xl">
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
                    <Mail className="w-32 h-32 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">Ngân hàng</p>
                  <p className="text-white font-semibold">Vietcombank</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">Số tài khoản</p>
                  <p className="text-white font-mono font-semibold">Dữ liệu minh họa</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">Chủ tài khoản</p>
                  <p className="text-white font-semibold">TRAN THI HUONG</p>
                </div>
              </div>
            </motion.div>

            {/* Groom Banking */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6 hover:bg-white/10 transition-all"
            >
              <div className="text-center space-y-3 pb-6 border-b border-white/10">
                <Heart className="w-10 h-10 text-[#C29B43] mx-auto" />
                <h3 className="text-2xl text-[#C29B43] font-semibold">Chú Rể</h3>
                <p className="text-gray-300">Nguyễn Văn Minh</p>
              </div>
              <div className="flex justify-center py-4">
                <div className="p-4 bg-white rounded-xl">
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
                    <Mail className="w-32 h-32 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">Ngân hàng</p>
                  <p className="text-white font-semibold">Techcombank</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">Số tài khoản</p>
                  <p className="text-white font-mono font-semibold">Dữ liệu minh họa</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">Chủ tài khoản</p>
                  <p className="text-white font-semibold">NGUYEN VAN MINH</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Share Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6 max-w-2xl mx-auto">
              <h3 className="text-2xl text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>Chia Sẻ Thiệp Cưới</h3>
              <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                <code className="text-sm text-gray-400 break-all">
                  https://thiepcuoi.vn/minh-huong-2027
                </code>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText('https://thiepcuoi.vn/minh-huong-2027');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="bg-[#C29B43] hover:bg-[#A88434] text-white"
              >
                {copied ? '✓ Đã Sao Chép!' : '📋 Sao Chép Link'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cg fill=\'none\' stroke=\'#C29B43\' stroke-width=\'2\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '100px 100px', backgroundRepeat: 'repeat' }} />
        </div>
      )}

      {/* Closing Scene */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1755838279349-f5471c4ffdd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
            alt="Closing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-6 space-y-8"
        >
          <p 
            className="text-2xl md:text-3xl text-gray-300 italic max-w-3xl mx-auto"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            "Tình yêu không chỉ là nhìn nhau, mà là cùng nhau nhìn về một hướng"
          </p>
          <h3 className="text-4xl md:text-5xl text-[#C29B43]">
            See You On Our Big Day
          </h3>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Heart className="w-16 h-16 text-[#C29B43] mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* Back to Home Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => window.location.hash = '#/'}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full px-6 py-3"
        >
          ← Về Trang Chủ
        </Button>
      </div>

      {/* Preloader */}
      {isLoading && <CinematicPreloader onComplete={() => setIsLoading(false)} />}
    </div>
  );
}
