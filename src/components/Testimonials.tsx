import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Thị Lan Anh',
    wedding: 'Đám cưới 15/08/2024',
    avatar: 'https://2hstudio.vn/wp-content/uploads/2024/12/JIN_0516.jpg',
    rating: 5,
    content: 'Thiệp cưới online quá đẹp và sang trọng! Khách mời ai cũng khen ngợi. Giao diện dễ sử dụng, hiệu ứng mượt mà. Đội ngũ hỗ trợ nhiệt tình. Rất đáng tiền!',
  },
  {
    id: 2,
    name: 'Trần Minh Đức',
    wedding: 'Đám cưới 22/09/2024',
    avatar: 'https://watermark.lovepik.com/photo/20211209/large/lovepik-groom-image-picture_501759121.jpg',
    rating: 5,
    content: 'Tính năng xác nhận tham dự và QR mừng cưới rất tiện lợi. Giúp mình quản lý khách mời dễ dàng hơn nhiều. Mẫu thiệp đa dạng, hiệu ứng 3D cực kỳ ấn tượng!',
  },
  {
    id: 3,
    name: 'Lê Thu Hà & Phạm Tuấn Anh',
    wedding: 'Đám cưới 10/10/2024',
    avatar: 'https://images.pexels.com/photos/34952489/pexels-photo-34952489.jpeg?cs=srgb&dl=pexels-le-hao-quang-249157828-34952489.jpg&fm=jpg',
    rating: 5,
    content: 'Chúng mình chọn gói Diamond Premium và hoàn toàn hài lòng! Album ảnh không giới hạn, video nhúng mượt mà, guestbook đẹp lung linh. Recommend cho các cặp đôi!',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="relative py-24 px-4 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 
            className="text-5xl md:text-6xl text-[#C29B43]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-xl text-[#4A4A4A] max-w-2xl mx-auto">
            Hơn 50 cặp đôi đã tin tưởng và hài lòng
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#FAF7F2] to-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-16 h-16 text-[#C29B43] opacity-10" />

              {/* Content */}
              <div className="relative z-10">
                {/* Avatar & Info */}
                <div className="flex items-center gap-6 mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#C29B43] shadow-lg">
                      <ImageWithFallback
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Gold Ring */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#C29B43] rounded-full flex items-center justify-center border-4 border-white">
                      <span className="text-white text-xs">💍</span>
                    </div>
                  </motion.div>

                  <div>
                    <h3 className="text-2xl text-[#1A1A1A] mb-1">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-[#6F6F6F]">
                      {testimonials[currentIndex].wedding}
                    </p>
                    {/* Rating */}
                    <div className="flex gap-1 mt-2">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#C29B43] text-[#C29B43]" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-lg text-[#333] leading-relaxed"
                >
                  "{testimonials[currentIndex].content}"
                </motion.p>
              </div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F7DADA] rounded-full blur-3xl opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={handlePrev}
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full border-2 border-[#C29B43] text-[#C29B43] hover:bg-[#C29B43] hover:text-white transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </motion.div>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all ${
                    index === currentIndex
                      ? 'w-8 h-3 bg-[#C29B43]'
                      : 'w-3 h-3 bg-[#C29B43]/30 hover:bg-[#C29B43]/50'
                  } rounded-full`}
                />
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={handleNext}
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full border-2 border-[#C29B43] text-[#C29B43] hover:bg-[#C29B43] hover:text-white transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}