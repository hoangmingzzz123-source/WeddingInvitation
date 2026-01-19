import { motion } from 'motion/react';
import { QrCode, Smartphone, CreditCard, Share2 } from 'lucide-react';

export function QRSection() {
  const qrCodes = [
    { 
      icon: Smartphone, 
      title: 'Momo', 
      description: 'Quét mã để chuyển khoản qua Momo',
      color: '#A50064',
      account: '0987654321'
    },
    { 
      icon: CreditCard, 
      title: 'Ngân Hàng', 
      description: 'Vietcombank - 1234567890',
      color: '#D4AF37',
      account: 'NGUYEN VAN MINH'
    },
    { 
      icon: Share2, 
      title: 'Zalo/Facebook', 
      description: 'Kết nối và gửi lời chúc',
      color: '#0068FF',
      account: '@wedding2025'
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-b from-white to-[#FBF6EE] relative">
      {/* Subtle particle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-6xl w-full relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-4 border-[#8B1E1E] relative overflow-hidden"
        >
          {/* Silk shimmer background */}
          <motion.div 
            className="absolute inset-0 opacity-5"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              background: 'linear-gradient(120deg, transparent 30%, #D4AF37 50%, transparent 70%)',
              backgroundSize: '200% 200%'
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-[#8B1E1E] mb-3">Mừng Cưới Online</h2>
              <motion.div 
                className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              />
              <p className="text-[#3A2F2F]">
                Gửi lời chúc và mừng cưới đến chúng tôi
              </p>
            </motion.div>

            {/* QR Codes Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {qrCodes.map((qr, index) => (
                <motion.div
                  key={qr.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.9 + index * 0.15 }}
                  className="relative group"
                >
                  {/* Card background */}
                  <div className="bg-[#FBF6EE] rounded-xl p-6 border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-lg">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: qr.color }}
                    >
                      <qr.icon className="text-white" size={28} />
                    </motion.div>

                    {/* Title */}
                    <h4 className="text-[#8B1E1E] text-xl mb-3 text-center">
                      {qr.title}
                    </h4>

                    {/* QR Code placeholder */}
                    <div className="relative mb-4">
                      <div className="w-40 h-40 mx-auto bg-white rounded-lg shadow-md border-2 border-[#D4AF37]/30 flex items-center justify-center relative overflow-hidden">
                        {/* QR pattern simulation */}
                        <div className="absolute inset-3 grid grid-cols-6 grid-rows-6 gap-1">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className={`${
                                Math.random() > 0.5 ? 'bg-[#8B1E1E]' : 'bg-transparent'
                              } rounded-sm`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 + index * 0.15 + i * 0.01, duration: 0.2 }}
                            />
                          ))}
                        </div>
                        
                        {/* Center icon */}
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.5 + index * 0.15, duration: 0.4 }}
                        >
                          <div className="w-10 h-10 bg-white rounded-md shadow-md flex items-center justify-center border border-[#D4AF37]">
                            <QrCode className="text-[#8B1E1E]" size={20} />
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[#3A2F2F] text-sm text-center mb-2">
                      {qr.description}
                    </p>
                    
                    {/* Account info */}
                    <p className="text-[#8B1E1E] text-xs text-center font-semibold">
                      {qr.account}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.8, ease: "easeOut" }}
              className="text-center"
            >
              <p className="text-[#3A2F2F] italic">
                Sự hiện diện của bạn là món quà ý nghĩa nhất với chúng tôi
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}