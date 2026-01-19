import { motion } from 'motion/react';
import { Shirt } from 'lucide-react';

export function DressCodeSection() {
  const colors = [
    { name: 'Đỏ đô', color: '#8B1E1E' },
    { name: 'Kem - Be', color: '#FBF6EE' },
    { name: 'Nâu', color: '#8B6F47' },
    { name: 'Vàng nhạt', color: '#F4E4C1' }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-[#FBF6EE]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full"
      >
        {/* Decorative top */}
        <div className="flex items-center justify-center mb-8">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-2 border-[#D4AF37]"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-[#FBF6EE] flex items-center justify-center border-2 border-[#D4AF37]">
              <Shirt size={40} className="text-[#8B1E1E]" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mb-8"
          >
            <h2 className="text-[#8B1E1E] mb-3">Trang Phục Tham Dự</h2>
            <motion.div 
              className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center mb-8"
          >
            <p className="text-[#3A2F2F] leading-relaxed italic">
              Quý khách vui lòng chọn trang phục theo gam màu truyền thống<br />
              để tôn vinh không khí lễ nghi Việt Nam
            </p>
          </motion.div>

          {/* Color palette */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {colors.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <div
                  className="w-20 h-20 rounded-full shadow-lg border-4 border-white ring-2 ring-[#D4AF37]/30"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-sm text-[#3A2F2F] text-center">{item.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Decorative bottom */}
        <div className="flex items-center justify-center mt-8">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
