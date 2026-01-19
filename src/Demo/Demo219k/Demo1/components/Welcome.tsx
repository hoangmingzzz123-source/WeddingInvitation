import { motion } from 'motion/react';
import { useInView } from './hooks/useInView';

export function Welcome() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-rose-900">
            Lời Ngỏ
          </h2>
          
          <div className="w-24 h-1 bg-rose-300 mx-auto mb-8"></div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg md:text-xl">
              Tình yêu không làm cho thế giới quay tròn.
              <br />
              Tình yêu là những gì làm cho chuyến đi đáng giá.
            </p>

            <p className="text-base md:text-lg max-w-2xl mx-auto">
              Chúng tôi rất hân hạnh được chia sẻ với bạn niềm vui trong ngày trọng đại nhất của cuộc đời.
              Sự hiện diện của bạn sẽ là món quà quý giá nhất dành cho chúng tôi.
            </p>

            <p className="text-base md:text-lg max-w-2xl mx-auto">
              Trân trọng kính mời quý khách cùng gia đình đến tham dự buổi tiệc chung vui cùng gia đình chúng tôi.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-8"
            >
              <p className="text-2xl md:text-3xl font-serif text-rose-800">
                Rất hân hạnh được đón tiếp!
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
