import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Facebook, MessageCircle, Send, Heart, Shield, Award, Clock } from 'lucide-react';

export function EnhancedFooter() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Trang chủ', href: '#home' },
    { label: 'Gói thiệp', href: '#packages' },
    { label: 'Mẫu thiệp', href: '#templates' },
    { label: 'Hướng dẫn', href: '#video' },
  ];

  const policies = [
    { label: 'Chính sách bảo mật', href: '#' },
    { label: 'Điều khoản sử dụng', href: '#' },
    { label: 'Chính sách hoàn tiền', href: '#' },
    { label: 'Câu hỏi thường gặp', href: '#' },
  ];

  const paymentMethods = [
    { name: 'Momo', icon: '💳' },
    { name: 'ZaloPay', icon: '💰' },
    { name: 'Banking', icon: '🏦' },
    { name: 'VNPay', icon: '💵' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#1B2A41] via-[#2A3A51] to-[#1B2A41] text-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-[#C29B43] rounded-full blur-3xl"
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
          className="absolute bottom-0 right-0 w-96 h-96 bg-[#F7DADA] rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-16 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 
              className="text-3xl bg-gradient-to-r from-[#C29B43] to-[#FFD700] bg-clip-text text-transparent"
              style={{ 
                fontFamily: '"Playfair Display", serif',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Thiệp Cưới Online
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Tạo thiệp cưới online đẹp lung linh với hàng trăm mẫu thiết kế sang trọng, 
              hiện đại. Gửi lời mời đến mọi người thật dễ dàng và ý nghĩa.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              {[
                { icon: Shield, text: 'Bảo mật' },
                { icon: Award, text: 'Uy tín' },
                { icon: Clock, text: '24/7' },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs"
                >
                  <badge.icon className="w-3 h-3 text-[#C29B43]" />
                  {badge.text}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg text-[#C29B43]" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Liên kết nhanh
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <motion.li key={i} whileHover={{ x: 5 }}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-[#C29B43] transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg text-[#C29B43]" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Chính sách
            </h4>
            <ul className="space-y-2">
              {policies.map((link, i) => (
                <motion.li key={i} whileHover={{ x: 5 }}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-[#C29B43] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg text-[#C29B43]" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Liên hệ
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 mt-0.5 text-[#C29B43] flex-shrink-0" />
                <div>
                  <p>Hotline: 0123 456 789</p>
                  <p className="text-xs text-gray-400">Hỗ trợ 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 mt-0.5 text-[#C29B43] flex-shrink-0" />
                <a href="mailto:contact@thiepcuoi.vn" className="hover:text-[#C29B43] transition-colors">
                  contact@thiepcuoi.vn
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin className="w-4 h-4 mt-0.5 text-[#C29B43] flex-shrink-0" />
                <span>Hà Nội, Việt Nam</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: Facebook, color: '#1877F2', label: 'Facebook' },
                { icon: MessageCircle, color: '#0088CC', label: 'Zalo' },
                { icon: Send, color: '#E91E63', label: 'Messenger' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" style={{ color: social.color }} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-white/10 pt-8 mb-8"
        >
          <div className="text-center mb-4">
            <h5 className="text-sm text-gray-400 mb-4">Phương thức thanh toán</h5>
            <div className="flex flex-wrap justify-center gap-4">
              {paymentMethods.map((method, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-sm text-gray-300">{method.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-white/10 pt-8 text-center"
        >
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            © {currentYear} Thiệp Cưới Online. 
            <span className="inline-flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> in Vietnam
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Designed & Developed with ❤️ for your special day
          </p>
        </motion.div>
      </div>

      {/* Floating Golden Accent */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#C29B43] to-transparent opacity-50"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </footer>
  );
}
