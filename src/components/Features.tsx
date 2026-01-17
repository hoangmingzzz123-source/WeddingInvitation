import React from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  ImageIcon, 
  Video, 
  QrCode, 
  MessageSquare, 
  Share2 
} from 'lucide-react';

const features = [
  {
    icon: UserCheck,
    title: 'Xác nhận khách mời Thông Minh',
    description: 'Xác nhận khách mời tự động, gửi email thông báo ngay lập tức',
  },
  {
    icon: ImageIcon,
    title: 'Album Ảnh Đẹp',
    description: 'Hiển thị hình ảnh cưới với hiệu ứng gallery chuyên nghiệp',
  },
  {
    icon: Video,
    title: 'Video Cưới',
    description: 'Nhúng video Youtube hoặc upload trực tiếp file MP4',
  },
  {
    icon: QrCode,
    title: 'QR Mừng Cưới',
    description: 'Khách mời dễ dàng gửi lời chúc và mừng cưới qua QR Banking',
  },
  {
    icon: MessageSquare,
    title: 'Guestbook',
    description: 'Sổ lưu bút với sticker & avatar cho khách mời gửi lời chúc',
  },
  {
    icon: Share2,
    title: 'Chia Sẻ Dễ Dàng',
    description: 'Chia sẻ ngay qua Zalo, Messenger, Facebook một cú nhấp chuột',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 px-4 md:px-16 bg-[#1B2A41]">
      <div className="max-w-7xl mx-auto">
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
            Tính Năng Nổi Bật
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Mọi thứ bạn cần để tạo thiệp cưới online hoàn hảo
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#C29B43]/50 transition-all"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 3 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <div className="w-16 h-16 bg-[#C29B43]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C29B43]/20 transition-all">
                    <Icon className="w-8 h-8 text-[#C29B43]" strokeWidth={1.5} />
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-xl text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <motion.div
                  className="absolute top-0 right-0 w-24 h-24 bg-[#C29B43]/5 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}