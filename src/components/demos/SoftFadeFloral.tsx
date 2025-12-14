import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Home, Heart, MapPin, Calendar, Clock, Send, QrCode } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

export function SoftFadeFloral() {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1560113406-36a33855c51e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
      title: "Minh & Hương",
      subtitle: "Chúng mình sắp kết hôn",
      caption: "Sau những năm tháng bên nhau, chúng mình quyết định bắt đầu hành trình mới",
    },
    {
      image: "https://images.unsplash.com/photo-1761285367066-5875252d7558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
      title: "Lần Đầu Gặp Gỡ",
      subtitle: "Xuân 2020",
      caption: "Một buổi chiều tình cờ tại quán cà phê nhỏ, chúng mình đã gặp được định mệnh của đời mình",
    },
    {
      image: "https://images.unsplash.com/photo-1708746179240-41b44d5bdf55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
      title: "Kỷ Niệm Bên Nhau",
      subtitle: "4 năm yêu thương",
      caption: "Cùng nhau trải qua bao nhiêu kỷ niệm đẹp, từ những chuyến đi xa đến những buổi tối bên nhau",
    },
    {
      image: "https://images.unsplash.com/photo-1738800076744-c37b80b37d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
      title: "Lễ Cưới",
      subtitle: "15 • 03 • 2025",
      caption: "Hãy đến chung vui cùng chúng mình trong ngày trọng đại nhất đời",
    },
  ];

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto advance slides (only on slideshow page)
  useEffect(() => {
    if (currentPage === 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [currentSlide, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F8F0E8] to-[#E8F4F8] relative overflow-hidden">
      {/* Music Player - 159K Package */}
      <MusicPlayer autoPlay={true} showVolumeControl={false} allowCustomMusic={true} />

      {/* Floral Border Decoration - Left */}
      <div className="fixed left-0 top-0 bottom-0 w-32 opacity-20 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1761285367066-5875252d7558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
          alt="Floral decoration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Floral Border Decoration - Right */}
      <div className="fixed right-0 top-0 bottom-0 w-32 opacity-20 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1708746179240-41b44d5bdf55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
          alt="Floral decoration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Back Button */}
      <Button
        onClick={() => window.location.hash = '#/'}
        className="fixed top-6 left-6 z-50 bg-white/90 hover:bg-white text-[#C8A2C8] border border-[#C8A2C8]/30 backdrop-blur-md"
      >
        <Home className="w-4 h-4 mr-2" />
        Về Trang Chủ
      </Button>

      {/* Page Indicators */}
      {currentPage === 0 ? (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentSlide === index 
                  ? 'bg-white w-8' 
                  : 'bg-white/40 w-2'
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {['Slideshow', 'Gallery', 'Details', 'Map', 'RSVP', 'QR'].map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPage === index 
                  ? 'bg-[#C8A2C8] w-8' 
                  : 'bg-[#C8A2C8]/30 w-2'
              }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows - Only on slideshow page */}
      {currentPage === 0 && (
        <>
          <button
            onClick={prevSlide}
            className="fixed left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all group"
          >
            <ChevronLeft className="w-6 h-6 text-[#C8A2C8] group-hover:text-[#A882A8]" />
          </button>

          <button
            onClick={nextSlide}
            className="fixed right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all group"
          >
            <ChevronRight className="w-6 h-6 text-[#C8A2C8] group-hover:text-[#A882A8]" />
          </button>
        </>
      )}

      {/* Pages */}
      <div className="relative w-full min-h-screen">
        {currentPage === 0 && (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              initial={{ 
                opacity: 0,
                filter: 'blur(20px)',
              }}
              animate={{ 
                opacity: 1,
                filter: 'blur(0px)',
              }}
              exit={{ 
                opacity: 0,
                filter: 'blur(20px)',
              }}
              transition={{ 
                duration: 1.5,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute inset-0"
            >
            {/* Background Image */}
            <div className="absolute inset-0">
              <ImageWithFallback
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="max-w-3xl text-center space-y-6"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-black/80 text-sm tracking-[0.3em] uppercase"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-6xl md:text-7xl text-black"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-black/90 text-lg max-w-2xl mx-auto leading-relaxed"
                  style={{ fontFamily: '"Libre Baskerville", serif' }}
                >
                  {slides[currentSlide].caption}
                </motion.p>

                {currentSlide === slides.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    <Button
                      onClick={() => setCurrentPage(1)}
                      className="mt-8 bg-white/90 hover:bg-white text-[#C8A2C8] px-10 py-6 text-lg rounded-full backdrop-blur-md"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Xem Album Ảnh
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Soft Vignette */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.2) 100%)',
              }}
            />
          </motion.div>
        </AnimatePresence>
        )}

        {currentPage === 1 && <GalleryPage onNext={() => setCurrentPage(2)} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
        {currentPage === 2 && <DetailsPage onNext={() => setCurrentPage(3)} />}
        {currentPage === 3 && <MapPage onNext={() => setCurrentPage(4)} />}
        {currentPage === 4 && <RSVPPage submitted={rsvpSubmitted} setSubmitted={setRsvpSubmitted} onNext={() => setCurrentPage(5)} />}
        {currentPage === 5 && <QRCodePage />}
      </div>
    </div>
  );
}

// Gallery Page
function GalleryPage({ onNext, selectedImage, setSelectedImage }: { 
  onNext: () => void; 
  selectedImage: number | null;
  setSelectedImage: (index: number | null) => void;
}) {
  const images = [
    "https://images.unsplash.com/photo-1560113406-36a33855c51e?w=800",
    "https://images.unsplash.com/photo-1761285367066-5875252d7558?w=800",
    "https://images.unsplash.com/photo-1708746179240-41b44d5bdf55?w=800",
    "https://images.unsplash.com/photo-1519027156611-f83273d3333a?w=800",
    "https://images.unsplash.com/photo-1738800076744-c37b80b37d31?w=800",
    "https://images.unsplash.com/photo-1606216794079-c24943c3cb82?w=800",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center text-[#C8A2C8]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Album Ảnh Cưới
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImage(index)}
              className="aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg"
            >
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                src={images[selectedImage]}
                alt="Selected"
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center pt-8">
          <Button
            onClick={onNext}
            className="bg-[#C8A2C8] hover:bg-[#A882A8] text-black px-8 py-6 rounded-full"
          >
            Tiếp Theo
          </Button>
        </div>
      </div>
    </div>
  );
}

// Details Page
function DetailsPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl w-full space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center text-[#C8A2C8]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Thông Tin Tiệc Cưới
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ceremony */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 space-y-6 border-2 border-[#C8A2C8]/30"
          >
            <Heart className="w-12 h-12 text-[#C8A2C8] mx-auto" />
            <h3 className="text-3xl text-center text-[#C8A2C8]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Lễ Vu Quy
            </h3>
            <div className="space-y-4 text-center text-[#8B7355]">
              <p className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5 text-[#C8A2C8]" />
                <span>Thứ Bảy, 15 tháng 3, 2025</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-[#C8A2C8]" />
                <span>09:00 Sáng</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5 text-[#C8A2C8]" />
                <span>Tư gia nhà gái</span>
              </p>
              <p className="text-sm">123 Lê Lợi, Quận 1, TP.HCM</p>
            </div>
          </motion.div>

          {/* Reception */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 space-y-6 border-2 border-[#C8A2C8]/30"
          >
            <Heart className="w-12 h-12 text-[#C8A2C8] mx-auto" fill="#C8A2C8" />
            <h3 className="text-3xl text-center text-[#C8A2C8]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Tiệc Cưới
            </h3>
            <div className="space-y-4 text-center text-[#8B7355]">
              <p className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5 text-[#C8A2C8]" />
                <span>Thứ Bảy, 15 tháng 3, 2025</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-[#C8A2C8]" />
                <span>18:00 Chiều</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5 text-[#C8A2C8]" />
                <span>Nhà Hàng Tiệc Cưới Grand Palace</span>
              </p>
              <p className="text-sm">456 Nguyễn Huệ, Quận 1, TP.HCM</p>
            </div>
          </motion.div>
        </div>

        <div className="text-center pt-8">
          <Button
            onClick={onNext}
            className="bg-[#C8A2C8] hover:bg-[#A882A8] text-black px-8 py-6 rounded-full"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Xem Bản Đồ
          </Button>
        </div>
      </div>
    </div>
  );
}

// Map Page
function MapPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center text-[#C8A2C8]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Bản Đồ Địa Điểm
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 border-2 border-[#C8A2C8]/30"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.325652528464!2d106.69751731428708!3d10.782926192320595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc1%3A0xb42d12560499f1b7!2zTmjDoCBIw6BuZyBUaeG7h2MgQ8aw4bubaSBHcmFuZCBQYWxhY2U!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '1.5rem' }}
            allowFullScreen
            loading="lazy"
          />
        </motion.div>

        <div className="text-center space-y-4">
          <p className="text-[#8B7355]" style={{ fontFamily: '"Poppins", sans-serif' }}>
            <MapPin className="w-5 h-5 inline mr-2 text-[#C8A2C8]" />
            Nhà Hàng Tiệc Cưới Grand Palace
          </p>
          <p className="text-[#8B7355]">456 Nguyễn Huệ, Quận 1, TP.HCM</p>
          
          <Button
            onClick={onNext}
            className="bg-[#C8A2C8] hover:bg-[#A882A8] text-black px-8 py-6 rounded-full mt-4"
          >
            Tiếp Theo
          </Button>
        </div>
      </div>
    </div>
  );
}

// RSVP Page
function RSVPPage({ submitted, setSubmitted, onNext }: { submitted: boolean; setSubmitted: (value: boolean) => void; onNext: () => void }) {
  const [formData, setFormData] = useState({ name: '', phone: '', guests: '1', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-[#C8A2C8]/30 space-y-8"
      >
        {!submitted ? (
          <>
            <h2 
              className="text-5xl text-center text-[#C8A2C8]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Xác Nhận Tham Dự
            </h2>

            <p className="text-center text-[#8B7355]" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Sự hiện diện của bạn là niềm hạnh phúc lớn nhất của chúng mình ❤️
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input 
                placeholder="Họ và tên *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-2 border-[#C8A2C8]/30 focus:border-[#C8A2C8] rounded-xl py-6"
              />
              <Input 
                placeholder="Số điện thoại *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="border-2 border-[#C8A2C8]/30 focus:border-[#C8A2C8] rounded-xl py-6"
              />
              <Input 
                type="number"
                placeholder="Số người tham dự *"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                required
                min="1"
                className="border-2 border-[#C8A2C8]/30 focus:border-[#C8A2C8] rounded-xl py-6"
              />
              <Textarea 
                placeholder="Lời chúc đến cô dâu chú rể..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="border-2 border-[#C8A2C8]/30 focus:border-[#C8A2C8] rounded-xl min-h-[150px]"
              />
              
              <Button 
                type="submit"
                className="w-full bg-[#C8A2C8] hover:bg-[#A882A8] text-black py-6 rounded-xl text-lg"
              >
                <Send className="w-5 h-5 mr-2" />
                Gửi Xác Nhận
              </Button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="w-20 h-20 mx-auto bg-[#C8A2C8]/20 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-[#C8A2C8]" fill="#C8A2C8" />
            </div>
            <h3 className="text-3xl text-[#C8A2C8]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Cảm ơn bạn!
            </h3>
            <p className="text-[#8B7355]">Chúng mình đã nhận được xác nhận của bạn</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="border-[#C8A2C8] text-[#C8A2C8]"
              >
                Gửi lại
              </Button>
              <Button
                onClick={onNext}
                className="bg-[#C8A2C8] hover:bg-[#A882A8] text-black"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Xem QR Code
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// QR Code Page
function QRCodePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-[#C8A2C8]/30 space-y-8 text-center"
      >
        <h2 
          className="text-5xl text-center text-[#C8A2C8]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Mã QR Thiệp Cưới
        </h2>

        <p className="text-[#8B7355]">
          Quét mã QR để chia sẻ thiệp cưới với bạn bè
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-2xl shadow-xl mx-auto w-fit"
        >
          <div className="w-64 h-64 bg-gradient-to-br from-[#FFF5F5] to-[#E8F4F8] rounded-xl flex items-center justify-center">
            <QrCode className="w-48 h-48 text-[#C8A2C8]" strokeWidth={1} />
          </div>
        </motion.div>

        <div className="space-y-4">
          <p className="text-sm text-[#8B7355]">
            Link thiệp cưới: <span className="font-semibold">https://wedding.example.com/minh-huong</span>
          </p>
          
          <Button
            onClick={() => navigator.clipboard.writeText('https://wedding.example.com/minh-huong')}
            variant="outline"
            className="border-[#C8A2C8] text-[#C8A2C8] hover:bg-[#C8A2C8] hover:text-black"
          >
            Sao chép link
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
