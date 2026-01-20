import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { PREMIUM_GALLERY_IMAGES } from '../../../../utils/imageConstants';

export function Cover() {
  const scrollToContent = () => {
    const element = document.querySelector('#welcome-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${PREMIUM_GALLERY_IMAGES.pinimg_16})`,
          }}
        />
      </motion.div>

      {/* Animated Background Bokeh */}
      <motion.div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        {/* Decorative Top Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="h-px w-12 bg-white/40" />
          <span className="text-sm tracking-[0.2em] uppercase opacity-80">Wedding Day</span>
          <div className="h-px w-12 bg-white/40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-lg tracking-[0.3em] mb-6 uppercase opacity-90 font-light">Wedding Invitation</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-4">
            <motion.span 
              className="block text-5xl md:text-7xl font-serif mb-2 font-light"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Minh Anh
            </motion.span>
            <span className="block text-3xl md:text-4xl opacity-60">&</span>
            <motion.span 
              className="block text-5xl md:text-7xl font-serif mt-2 font-light"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              Tuấn Kiệt
            </motion.span>
          </h1>
        </motion.div>

        {/* Decorative Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-12"
        >
          <div className="inline-block border-t-2 border-b-2 border-white/40 py-4 px-8 backdrop-blur-sm bg-white/5 rounded-lg">
            <p className="text-2xl md:text-3xl font-serif font-light">15.06.2025</p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-lg tracking-wide max-w-2xl mx-auto mb-12 opacity-90 leading-relaxed"
        >
          Trân trọng kính mời quý khách đến dự tiệc chung vui cùng gia đình chúng tôi
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-8 py-3 border-2 border-white/50 rounded-full text-white font-light tracking-widest hover:border-white hover:bg-white/10 transition-all mb-12"
        >
          Xem Thêm
        </motion.button>
      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-white/70 cursor-pointer hover:text-white transition-colors"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
}
