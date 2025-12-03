import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Palette, Zap, Smartphone, Sparkles, Crown, Users, HeartHandshake, Shield } from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: '99+ Mẫu Thiết Kế',
    description: 'Đa dạng phong cách từ minimalist đến luxury sang trọng',
    color: '#C29B43',
    gradient: 'from-[#C29B43] to-[#FFD700]',
  },
  {
    icon: Zap,
    title: 'Tốc Độ Tải Cực Nhanh',
    description: 'Tối ưu hiệu năng, tải trang dưới 2 giây',
    color: '#F7DADA',
    gradient: 'from-[#F7DADA] to-[#FFB6C1]',
  },
  {
    icon: Smartphone,
    title: 'Hoàn Hảo Mọi Thiết Bị',
    description: 'Responsive 100% trên mobile, tablet, desktop',
    color: '#1B2A41',
    gradient: 'from-[#1B2A41] to-[#3B5A91]',
  },
  {
    icon: Sparkles,
    title: 'Hiệu Ứng Cao Cấp',
    description: 'Animation mượt mà, hiệu ứng 3D, parallax đẹp mắt',
    color: '#C29B43',
    gradient: 'from-[#FFD700] to-[#FFA500]',
  },
  {
    icon: Crown,
    title: 'Tùy Chỉnh Theo Yêu Cầu',
    description: 'Cá nhân hóa hoàn toàn theo concept đám cưới của bạn',
    color: '#9B59B6',
    gradient: 'from-[#9B59B6] to-[#E74C3C]',
  },
  {
    icon: Users,
    title: '50+ Cặp Đôi Tin Dùng',
    description: 'Được tin tưởng bởi hàng nghìn cặp đôi trên toàn quốc',
    color: '#27AE60',
    gradient: 'from-[#27AE60] to-[#2ECC71]',
  },
  {
    icon: HeartHandshake,
    title: 'Hỗ Trợ Tận Tâm 24/7',
    description: 'Đội ngũ support nhiệt tình, giải đáp mọi thắc mắc',
    color: '#E91E63',
    gradient: 'from-[#E91E63] to-[#F8BBD0]',
  },
  {
    icon: Shield,
    title: 'Bảo Mật & An Toàn',
    description: 'Dữ liệu được mã hóa, bảo vệ thông tin tuyệt đối',
    color: '#1B2A41',
    gradient: 'from-[#1B2A41] to-[#34495E]',
  },
];

export function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <section 
      ref={containerRef}
      className="relative py-24 px-4 md:px-16 bg-gradient-to-br from-[#FAF7F2] via-white to-[#FFF4E6] overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#C29B43] rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#F7DADA] rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div 
        style={{ opacity, scale }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#C29B43] to-[#FFD700] rounded-full">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-white">Vì Sao Chọn Chúng Tôi?</span>
            </div>
          </motion.div>

          <h2 
            className="text-5xl md:text-6xl text-[#C29B43]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Ưu Điểm Vượt Trội
          </h2>
          <p className="text-xl text-[#4A4A4A] max-w-3xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm thiệp cưới online tốt nhất với công nghệ hiện đại và dịch vụ tận tâm
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.05 }}
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Glowing Border Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color}40, transparent)`,
                      padding: '2px',
                    }}
                  />

                  <div className="relative z-10 space-y-4">
                    {/* Icon Container */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex"
                    >
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl"
                        style={{
                          background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                        }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 
                      className="text-xl text-[#1B2A41] group-hover:text-[#C29B43] transition-colors duration-300"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#6F6F6F] leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Decorative Shine Effect */}
                    <motion.div
                      className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"
                      style={{ background: feature.color }}
                    />
                  </div>
                </div>

                {/* Counter Number */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[#C29B43] to-[#FFD700] rounded-full flex items-center justify-center text-white shadow-lg z-20"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  {index + 1}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Counter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '50+', label: 'Cặp Đôi Hạnh Phúc' },
            { number: '45+', label: 'Mẫu Thiết Kế' },
            { number: '24/7', label: 'Hỗ Trợ Khách Hàng' },
            { number: '100%', label: 'Hài Lòng' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.1,
                type: "spring",
              }}
              className="text-center"
            >
              <motion.div
                className="text-5xl md:text-6xl bg-gradient-to-r from-[#C29B43] to-[#FFD700] bg-clip-text text-transparent mb-2"
                style={{ 
                  fontFamily: '"Playfair Display", serif',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {stat.number}
              </motion.div>
              <p className="text-[#6F6F6F]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
