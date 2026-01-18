import { motion } from 'motion/react';
import { Calendar, Clock } from 'lucide-react';

export function WeddingDateSection() {
  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="clouds" x="0" y="0" width="300" height="200" patternUnits="userSpaceOnUse">
              <path 
                d="M 0 100 Q 75 60 150 100 T 300 100" 
                stroke="#3A2F2F" 
                strokeWidth="1" 
                fill="none" 
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#clouds)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-2xl w-full relative z-10"
      >
        {/* Decorative top border - drawn effect */}
        <div className="flex items-center justify-center mb-8 overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
            className="h-[2px] w-full origin-center"
            style={{
              background: 'linear-gradient(to right, transparent, #D4AF37 20%, #D4AF37 80%, transparent)'
            }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-4 border-[#8B1E1E] relative overflow-hidden">
          {/* Subtle silk shimmer background */}
          <motion.div 
            className="absolute inset-0 opacity-5"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{
              background: 'linear-gradient(45deg, transparent 30%, #D4AF37 50%, transparent 70%)',
              backgroundSize: '200% 200%'
            }}
          />

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-4 right-4 text-[#8B1E1E] text-6xl">囍</div>
            <div className="absolute bottom-4 left-4 text-[#8B1E1E] text-6xl">囍</div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="text-center mb-8"
            >
              <h2 className="text-[#8B1E1E] mb-3">Lễ Thành Hôn</h2>
              <motion.div 
                className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              />
            </motion.div>

            {/* Date - ink reveal effect */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              className="bg-[#FBF6EE] rounded-xl p-6 mb-6 border-2 border-[#D4AF37] relative overflow-hidden"
            >
              {/* Gentle shimmer */}
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)'
                }}
              />
              
              <div className="flex items-center justify-center gap-3 mb-3 relative z-10">
                <Calendar className="text-[#8B1E1E]" size={24} />
                <h3 className="text-[#8B1E1E] text-center">Chủ Nhật</h3>
              </div>
              <p className="text-center text-2xl text-[#3A2F2F] relative z-10">
                29 tháng 03 năm 2026
              </p>
            </motion.div>

            {/* Time */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
              className="bg-[#FBF6EE] rounded-xl p-6 border-2 border-[#D4AF37] relative overflow-hidden"
            >
              {/* Gentle shimmer */}
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2, delay: 0.5 }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)'
                }}
              />
              
              <div className="flex items-center justify-center gap-3 mb-3 relative z-10">
                <Clock className="text-[#8B1E1E]" size={24} />
                <h3 className="text-[#8B1E1E] text-center">Giờ Cử Hành</h3>
              </div>
              <p className="text-center text-2xl text-[#3A2F2F] relative z-10">
                10:30 Sáng
              </p>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
              className="mt-8 flex justify-center gap-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-[#8B1E1E]' : 'bg-[#D4AF37]'}`}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="flex items-center justify-center mt-8 overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
            className="h-[2px] w-full origin-center"
            style={{
              background: 'linear-gradient(to right, transparent, #D4AF37 20%, #D4AF37 80%, transparent)'
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}