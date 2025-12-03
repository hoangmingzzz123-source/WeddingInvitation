import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, Crown, Flower2, Diamond } from 'lucide-react';

const packages = [
  {
    name: 'Basic Elegant',
    price: '109.000đ',
    color: '#F8E7EA',
    icon: Flower2,
    features: [
      '01 trang thiệp đơn giản',
      'Tối đa 10 hình ảnh',
      'Form RSVP cơ bản',
      'Bản đồ Google Maps',
      'Hiệu ứng nhẹ nhàng',
      'Nhạc nền có sẵn',
      'Tùy chỉnh màu sắc cơ bản',
      'Chia sẻ qua link & QR',
    ],
    popular: false,
  },
  {
    name: 'Premium Interactive',
    price: '159.000đ',
    color: '#E7EDF7',
    icon: Crown,
    features: [
      '03 trang thiệp đầy đủ',
      'Tối đa 30 hình ảnh',
      'Form RSVP nâng cao + Email',
      'Hiệu ứng hoạt hình nâng cao',
      'Upload nhạc nền riêng',
      'Nút chia sẻ Zalo/Messenger',
      'Thiết kế theo chủ đề',
      'Tùy chỉnh font chữ',
    ],
    popular: true,
  },
  {
    name: 'Diamond Premium',
    price: '219.000đ',
    color: '#FFF4D3',
    icon: Diamond,
    features: [
      '05 trang thiệp cao cấp',
      'Album ảnh không giới hạn',
      'Video cưới nhúng',
      'Mừng cưới online - QR Banking',
      'Guestbook với sticker',
      'Hiệu ứng 3D & Animation',
      'Thiết kế concept riêng',
      'Cá nhân hóa hoàn toàn',
    ],
    popular: false,
  },
];

export function PricingPackages() {
  return (
    <section id="packages" className="relative py-24 px-4 md:px-16 bg-white">
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
            Gói Thiệp Cưới
          </h2>
          <p className="text-xl text-[#4A4A4A] max-w-2xl mx-auto">
            Lựa chọn gói phù hợp với phong cách đám cưới của bạn
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                }}
                className="relative rounded-2xl p-8 shadow-lg transition-all duration-300"
                style={{ backgroundColor: pkg.color }}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#C29B43] text-white px-4 py-1">
                      Phổ biến nhất
                    </Badge>
                  </div>
                )}

                {/* Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-6 flex justify-center"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Icon className="w-8 h-8 text-[#C29B43]" />
                  </div>
                </motion.div>

                {/* Package Name */}
                <h3 
                  className="text-3xl text-center mb-2 text-[#1A1A1A]"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {pkg.name}
                </h3>

                {/* Price Badge */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white px-6 py-2 rounded-full shadow-md">
                    <span className="text-2xl text-[#C29B43]">{pkg.price}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-[#C29B43] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#333]">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => {
                      // Extract price and convert to filter format (199.000đ -> 199k)
                      const priceNum = pkg.price.replace(/[^\d]/g, '').slice(0, 3);
                      // Set hash to trigger filter
                      window.location.hash = `#templates-filter-${priceNum}k`;
                      // Scroll to templates section
                      setTimeout(() => {
                        document.getElementById('templates')?.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }, 100);
                    }}
                    className={`w-full rounded-full py-6 transition-all ${
                      pkg.popular
                        ? 'bg-[#C29B43] hover:bg-[#A88434] text-white'
                        : 'bg-white hover:bg-[#FAF7F2] text-[#C29B43] border-2 border-[#C29B43]'
                    }`}
                  >
                    Xem Demo Gói {pkg.price.replace('.000đ', 'K')}
                  </Button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 text-[#6F6F6F]"
        >
          <p>✨ Tất cả các gói đều được tối ưu cho mọi thiết bị và trình duyệt</p>
        </motion.div>
      </div>
    </section>
  );
}