import { motion } from 'motion/react';
import { useInView } from './hooks/useInView';

export function Welcome() {
  const { ref, isInView } = useInView();

  return (
    <section id="welcome-section" ref={ref} className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-pink-100/20 rounded-full blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative Top Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-sm text-rose-600 tracking-widest uppercase font-light">Lời Yêu Thương</span>
                <div className="w-2 h-2 rounded-full bg-rose-400" />
              </div>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-rose-900 font-light">
            Lời Ngỏ
          </h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mb-8"
          />

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl italic font-light"
            >
              "Tình yêu không làm cho thế giới quay tròn.<br />
              Tình yêu là những gì làm cho chuyến đi đáng giá."
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Chúng tôi rất hân hạnh được chia sẻ với bạn niềm vui trong ngày trọng đại nhất của cuộc đời. 
              Sự hiện diện của bạn sẽ là món quà quý giá nhất dành cho chúng tôi.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Trân trọng kính mời quý khách cùng gia đình đến tham dự buổi tiệc chung vui cùng gia đình chúng tôi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="pt-8"
            >
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-2xl md:text-3xl font-serif text-rose-700 font-light"
              >
                Rất hân hạnh được đón tiếp!
              </motion.p>
            </motion.div>
          </div>

          {/* Decorative Bottom Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center gap-3 mt-12"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-rose-300"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
