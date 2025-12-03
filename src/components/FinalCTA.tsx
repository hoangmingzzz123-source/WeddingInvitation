import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="relative py-32 px-4 md:px-16 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7DADA]/30 via-white to-white" />

      {/* Animated Light Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: Math.random() * 300 + 150,
              height: Math.random() * 300 + 150,
              background: `radial-gradient(circle, ${
                i % 3 === 0
                  ? 'rgba(194, 155, 67, 0.15)'
                  : i % 3 === 1
                  ? 'rgba(247, 218, 218, 0.15)'
                  : 'rgba(255, 244, 211, 0.15)'
              } 0%, transparent 70%)`,
              left: `${(i * 20) % 100}%`,
              top: `${(i * 15) % 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-24 h-24 bg-gradient-to-br from-[#C29B43] to-[#A88434] rounded-full flex items-center justify-center shadow-2xl"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl text-[#C29B43]"
          style={{ 
            fontFamily: '"Playfair Display", serif',
          }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 20px rgba(194, 155, 67, 0.3)',
                '0 0 40px rgba(194, 155, 67, 0.5)',
                '0 0 20px rgba(194, 155, 67, 0.3)',
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Tạo Thiệp Cưới Online
            <br />
            Ngay Hôm Nay
          </motion.span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-[#4A4A4A] max-w-2xl mx-auto"
        >
          Chỉ cần 5 phút để có một thiệp cưới online đẹp lung linh, 
          chia sẻ tình yêu đến mọi người thật dễ dàng
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto py-8"
        >
          {[
            { number: '50+', label: 'Cặp đôi tin tưởng' },
            { number: '45+', label: 'Mẫu thiệp đẹp' },
            { number: '4.9★', label: 'Đánh giá trung bình' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="space-y-2"
            >
              <div className="text-4xl text-[#C29B43]">{stat.number}</div>
              <div className="text-sm text-[#6F6F6F]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#C29B43] hover:bg-[#A88434] text-white px-10 py-7 rounded-full shadow-2xl text-lg transition-all"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Bắt Đầu Tạo Thiệp Ngay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => window.open('https://zalo.me', '_blank')}
              variant="outline"
              className="border-2 border-[#C29B43] text-[#C29B43] hover:bg-[#C29B43] hover:text-white px-10 py-7 rounded-full text-lg transition-all"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Liên Hệ Tư Vấn
            </Button>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-6 text-sm text-[#6F6F6F] pt-8"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Không cần kỹ năng thiết kế</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Hỗ trợ 24/7</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Sửa đổi không giới hạn</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="relative z-10 text-center mt-20 pt-8 border-t border-[#C29B43]/20"
      >
        <p className="text-sm text-[#6F6F6F]">
          © 2024 Thiệp Cưới Online. Made with 💝 for every couple's special day.
        </p>
      </motion.div> */}
    </section>
  );
}