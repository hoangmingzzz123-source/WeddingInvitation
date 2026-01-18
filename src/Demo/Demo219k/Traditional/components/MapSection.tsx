import { motion } from 'motion/react';
import { MapPin, Navigation } from 'lucide-react';

export function MapSection() {
  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-b from-[#FBF6EE] to-white relative">
      {/* Floating incense smoke effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-40 h-40 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
              filter: 'blur(30px)',
              left: `${20 + i * 30}%`,
              bottom: 0
            }}
            animate={{
              y: [0, -600],
              x: [0, 20, -20, 0],
              opacity: [0, 0.5, 0.5, 0]
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-4xl w-full relative z-10"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h2 className="text-[#8B1E1E] mb-4">Địa Điểm Tổ Chức</h2>
          <motion.div 
            className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          />
        </motion.div>

        {/* Venue info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#D4AF37]"
        >
          {/* Map placeholder with decorative border */}
          <div className="relative h-64 md:h-96 bg-gradient-to-br from-[#FBF6EE] to-[#E8DCC8] overflow-hidden">
            {/* Subtle wave pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapWaves" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 0 50 Q 50 30 100 50 T 200 50" stroke="#3A2F2F" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapWaves)" />
              </svg>
            </div>
            
            {/* Map image with blur-to-clear effect */}
            <motion.img 
              src="https://images.unsplash.com/photo-1674970538959-e7475d8d376f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdmVudWUlMjBlbGVnYW50fGVufDF8fHx8MTc2NzE5ODgyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Wedding venue"
              className="w-full h-full object-cover opacity-60"
              initial={{ filter: 'blur(10px)' }}
              whileInView={{ filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
            />
            
            {/* Location pin - gentle drop */}
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1.2, 
                delay: 1.2,
                ease: [0.34, 1.56, 0.64, 1] // Gentle bounce
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin size={48} className="text-[#8B1E1E] fill-[#8B1E1E] drop-shadow-lg" />
                </motion.div>
                <motion.div 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#8B1E1E] rounded-full opacity-30 blur-md"
                  animate={{ scale: [0.8, 1, 0.8], opacity: [0.2, 0.3, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Decorative frame with drawn effect */}
            <motion.div 
              className="absolute inset-4 border-2 border-[#D4AF37] rounded-xl pointer-events-none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1, ease: "easeOut" }}
              style={{
                boxShadow: 'inset 0 0 40px rgba(212, 175, 55, 0.1)'
              }}
            />
          </div>

          {/* Venue details */}
          <div className="p-6 md:p-8 relative">
            {/* Subtle shimmer background */}
            <motion.div
              className="absolute inset-0 opacity-5"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%']
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                background: 'linear-gradient(135deg, transparent 40%, #D4AF37 50%, transparent 60%)',
                backgroundSize: '200% 200%'
              }}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              className="text-center mb-6 relative z-10"
            >
              <h3 className="text-[#3A2F2F] mb-3">Trung Tâm Tiệc Cưới Hoàng Gia</h3>
              <p className="text-[#3A2F2F] mb-1">123 Đường Lê Lợi, Phường Bến Nghé</p>
              <p className="text-[#3A2F2F]">Quận 1, Thành phố Hồ Chí Minh</p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
            >
              <motion.button 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8B1E1E] text-white rounded-lg shadow-md relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                />
                <MapPin size={20} />
                <span>Xem bản đồ</span>
              </motion.button>
              <motion.button 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg shadow-md relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3, delay: 1 }}
                />
                <Navigation size={20} />
                <span>Chỉ đường</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}