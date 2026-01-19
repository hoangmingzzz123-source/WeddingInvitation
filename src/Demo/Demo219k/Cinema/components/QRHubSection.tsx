import React from 'react';
import { motion } from 'motion/react';
import { QrCode, Smartphone, CreditCard, Share2 } from 'lucide-react';

export function QRHubSection() {
  const qrCodes = [
    { 
      icon: Smartphone, 
      title: 'Momo', 
      description: 'Quét mã để chuyển khoản qua Momo',
      color: '#A50064'
    },
    { 
      icon: CreditCard, 
      title: 'Banking', 
      description: 'Chuyển khoản ngân hàng',
      color: '#C9A24D'
    },
    { 
      icon: Share2, 
      title: 'Zalo/Facebook', 
      description: 'Kết nối và gửi lời chúc',
      color: '#0068FF'
    },
  ];

  return (
    <section className="min-h-screen bg-[#1C1C1C] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Animated pulsing spotlight */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C9A24D] blur-[150px] rounded-full"
      />

      <div className="w-full flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-6xl w-full relative z-10"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h3 className="text-[#F6F1EB] text-3xl md:text-5xl tracking-[0.2em] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              MỪNG CƯỚI ONLINE
            </h3>
            <p className="text-[#C9A24D] text-lg md:text-xl tracking-[0.15em]" style={{ fontFamily: 'Lora, serif' }}>
              Gửi lời chúc và mừng cưới đến cô dâu chú rể
            </p>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[1px] bg-[#C9A24D] mx-auto mb-16"
          />

          {/* QR Codes Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {qrCodes.map((qr, index) => (
              <motion.div
                key={qr.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 + index * 0.2 }}
                className="relative group"
              >
                {/* Card glow effect */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                  className="absolute inset-0 bg-[#C9A24D] blur-2xl rounded-2xl"
                />

                <div className="relative bg-gradient-to-br from-[#F6F1EB] to-[#F6F1EB]/95 rounded-2xl p-8 shadow-2xl border-2 border-[#C9A24D]/30 hover:border-[#C9A24D] transition-all duration-300 group-hover:transform group-hover:scale-105">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C9A24D]/70 flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: qr.color }}
                  >
                    <qr.icon className="text-white" size={32} />
                  </motion.div>

                  {/* Title */}
                  <h4 className="text-[#5A1E2A] text-2xl mb-3 text-center tracking-[0.1em]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {qr.title}
                  </h4>

                  {/* QR Code placeholder */}
                  <motion.div 
                    className="w-48 h-48 mx-auto bg-white rounded-xl shadow-lg border-2 border-[#C9A24D]/30 flex items-center justify-center mb-4 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* QR pattern animation */}
                    <motion.div
                      animate={{ 
                        opacity: [0, 0.1, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-[#C9A24D] rounded-xl"
                    />
                    
                    <QrCode className="text-[#1C1C1C] relative z-10" size={160} strokeWidth={1.5} />
                  </motion.div>

                  {/* Description */}
                  <p className="text-[#5A1E2A]/70 text-sm text-center" style={{ fontFamily: 'Lora, serif' }}>
                    {qr.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-[#F6F1EB]/60 text-center mt-12 text-lg italic" 
            style={{ fontFamily: 'Lora, serif' }}
          >
            Sự hiện diện của bạn là món quà ý nghĩa nhất với chúng tôi
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}