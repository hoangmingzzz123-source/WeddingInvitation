import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { useState } from 'react';

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-b from-[#FBF6EE] to-white relative">
      {/* Subtle floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#D4AF37]"
            style={{
              left: `${20 + i * 20}%`,
              bottom: 0,
              opacity: 0.1
            }}
            animate={{
              y: [0, -400, -400],
              opacity: [0, 0.15, 0]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
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
        {/* Decorative top border */}
        <div className="flex items-center justify-center mb-8 overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
            className="h-[2px] w-full origin-center"
            style={{
              background: 'linear-gradient(to right, transparent, #D4AF37 20%, #D4AF37 80%, transparent)'
            }}
          />
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-[#8B1E1E] mb-4">Video Ngày Cưới</h2>
          <motion.div 
            className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          />
        </motion.div>

        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-[#D4AF37] shadow-2xl bg-gradient-to-br from-[#8B1E1E] to-[#A73333]">
            {!isPlaying ? (
              <>
                {/* Thumbnail with blur-in effect */}
                <motion.img
                  src="https://images.unsplash.com/photo-1765868113625-3ef2ee2d5295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwd2VkZGluZyUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc2NzI1OTY5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  initial={{ filter: 'blur(8px)' }}
                  animate={{ filter: 'blur(0px)' }}
                  transition={{ duration: 1.5, delay: 0.9 }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Play button with gentle pulse */}
                <motion.button
                  onClick={() => setIsPlaying(true)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group relative overflow-hidden"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Gentle glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#D4AF37]"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0, 0.2, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <Play className="text-[#8B1E1E] ml-1 relative z-10" size={40} fill="currentColor" />
                </motion.button>

                {/* Decorative elements */}
                <motion.div 
                  className="absolute bottom-4 left-4 right-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div 
                        key={i}
                        className="w-2 h-2 bg-[#D4AF37] rounded-full"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div 
                className="w-full h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center text-white p-8">
                  <p className="mb-4">Video player would appear here</p>
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="px-6 py-2 bg-white text-[#8B1E1E] rounded-lg hover:bg-[#FBF6EE] transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            )}

            {/* Decorative frame corners */}
            {[
              { top: 4, left: 4, tl: true },
              { top: 4, right: 4, tr: true },
              { bottom: 4, left: 4, bl: true },
              { bottom: 4, right: 4, br: true }
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-8"
                style={pos}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
              >
                <div className={`w-full h-full ${
                  pos.tl ? 'border-t-2 border-l-2' :
                  pos.tr ? 'border-t-2 border-r-2' :
                  pos.bl ? 'border-b-2 border-l-2' :
                  'border-b-2 border-r-2'
                } border-white/50`} />
              </motion.div>
            ))}
          </div>

          {/* Outer decorative border */}
          <motion.div 
            className="absolute -inset-4 border-2 border-[#8B1E1E] rounded-3xl -z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.15 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.9 }}
          />
        </motion.div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          className="text-center mt-8"
        >
          <p className="text-[#3A2F2F] italic">
            Những khoảnh khắc đáng nhớ nhất trong ngày trọng đại
          </p>
        </motion.div>

        {/* Decorative bottom border */}
        <div className="flex items-center justify-center mt-8 overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
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