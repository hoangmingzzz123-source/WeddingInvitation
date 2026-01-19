import { motion } from 'motion/react';
import { Heart, Facebook, Instagram, Mail, Phone, Gift } from 'lucide-react';
import { useInView } from './hooks/useInView';
import { useState } from 'react';

export function Footer() {
  const { ref, isInView } = useInView();
  const [showQR, setShowQR] = useState(false);

  return (
    <footer ref={ref} className="bg-gradient-to-b from-rose-50 to-rose-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Gift Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-serif text-rose-900 mb-6 flex items-center justify-center gap-2">
            <Gift className="w-8 h-8" />
            Mừng Cưới
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Sự hiện diện của bạn là món quà quý giá nhất với chúng tôi.
            Tuy nhiên, nếu bạn muốn gửi lời chúc bằng một phần quà nhỏ, chúng tôi rất trân trọng.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Bride's Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-rose-800 mb-4">Mừng cưới đến cô dâu</p>
              <h4 className="text-xl font-serif text-rose-900 mb-4">Minh Anh</h4>
              <div className="space-y-2 text-gray-700">
                <p>Ngân hàng: <strong>Vietcombank</strong></p>
                <p>STK: <strong>0123456789</strong></p>
                <p>Chủ TK: <strong>NGUYEN THI MINH ANH</strong></p>
              </div>
            </div>

            {/* Groom's Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-rose-800 mb-4">Mừng cưới đến chú rể</p>
              <h4 className="text-xl font-serif text-rose-900 mb-4">Tuấn Kiệt</h4>
              <div className="space-y-2 text-gray-700">
                <p>Ngân hàng: <strong>Techcombank</strong></p>
                <p>STK: <strong>9876543210</strong></p>
                <p>Chủ TK: <strong>LE TUAN KIET</strong></p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="mt-8">
            <button
              onClick={() => setShowQR(!showQR)}
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition-colors duration-300"
            >
              <Gift className="w-5 h-5" />
              {showQR ? 'Ẩn Mã QR' : 'Xem Mã QR'}
            </button>

            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 grid md:grid-cols-2 gap-8 max-w-2xl mx-auto"
              >
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <p className="text-rose-800 mb-4">QR Mừng Cô Dâu</p>
                  <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p className="text-sm">QR Code</p>
                      <p className="text-xs mt-2">Scan để chuyển khoản</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <p className="text-rose-800 mb-4">QR Mừng Chú Rể</p>
                  <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p className="text-sm">QR Code</p>
                      <p className="text-xs mt-2">Scan để chuyển khoản</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-24 h-1 bg-rose-300 mx-auto my-12"></div>

        {/* Contact & Social */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <div className="flex justify-center gap-6 mb-8">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-colors duration-300 shadow-md"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-colors duration-300 shadow-md"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="mailto:wedding@example.com"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-colors duration-300 shadow-md"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="tel:+84909123456"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-colors duration-300 shadow-md"
            >
              <Phone className="w-6 h-6" />
            </a>
          </div>

          <div className="mb-8">
            <p className="text-gray-600 mb-2">Liên hệ với chúng tôi:</p>
            <p className="text-gray-700">
              <a href="tel:+84909123456" className="hover:text-rose-600">Cô dâu: 0909 123 456</a>
              {' '} | {' '}
              <a href="tel:+84909654321" className="hover:text-rose-600">Chú rể: 0909 654 321</a>
            </p>
            <p className="text-gray-700 mt-2">
              <a href="mailto:wedding@example.com" className="hover:text-rose-600">
                wedding@example.com
              </a>
            </p>
          </div>

          {/* Thank You Message */}
          <div className="max-w-2xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/50 rounded-lg p-8 backdrop-blur-sm"
            >
              <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <p className="text-xl font-serif text-rose-900 mb-4">
                Thank You
              </p>
              <p className="text-gray-700 leading-relaxed">
                Chân thành cảm ơn tất cả những lời chúc phúc và sự hiện diện của quý khách.
                Đây sẽ là kỷ niệm đẹp nhất trong cuộc đời chúng tôi!
              </p>
            </motion.div>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            <p className="mb-2">© 2025 Minh Anh & Tuấn Kiệt</p>
            <p className="flex items-center justify-center gap-2">
              Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for our special day
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
