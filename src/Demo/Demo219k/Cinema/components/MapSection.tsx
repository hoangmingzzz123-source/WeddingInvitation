import { motion } from 'motion/react';
import { Navigation, ParkingCircle } from 'lucide-react';

export function MapSection() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#5A1E2A] to-[#1C1C1C] flex items-center justify-center px-6 py-20">
      <div className="w-full flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl w-full"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12"
          >
            <p className="text-[#C9A24D] text-sm tracking-[0.3em] mb-2" style={{ fontFamily: 'Lora, serif' }}>
              FILM LOCATION
            </p>
            <h3 className="text-[#F6F1EB] text-3xl md:text-4xl tracking-[0.15em]" style={{ fontFamily: 'Playfair Display, serif' }}>
              RIVERSIDE PALACE
            </h3>
          </motion.div>
<br/>
          {/* <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[1px] bg-[#C9A24D] mx-auto mb-12"
          /> */}

          {/* Map Container with Gold Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative mb-8"
          >
            {/* Gold glow */}
            <div className="absolute inset-0 bg-[#C9A24D] blur-lg opacity-20 rounded-2xl" />
            
            {/* Map frame */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#C9A24D] shadow-2xl">
              {/* Film grain overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />
              
              <iframe
                className="block aspect-video w-full border-0"
                src="https://maps.google.com/maps?q=Riverside+Palace,+Ho+Chi+Minh+City&output=embed"
                title="Bản đồ Riverside Palace, Thành phố Hồ Chí Minh"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
<br/>
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid md:grid-cols-2 gap-6 md:gap-8"
          >
            <a
              href="https://www.google.com/maps/search/?api=1&query=Riverside+Palace%2C+Ho+Chi+Minh+City"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-gradient-to-r from-[#C9A24D] to-[#C9A24D]/80 text-[#1C1C1C] hover:shadow-lg hover:shadow-[#C9A24D]/40 transition-all duration-300 group"
              style={{ fontFamily: 'Lora, serif' }}
            >
              <Navigation size={20} className="group-hover:scale-110 transition-transform" />
              <span className="tracking-[0.1em]">Mở Google Maps</span>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Parking+near+Riverside+Palace%2C+Ho+Chi+Minh+City"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-5 rounded-full border-2 border-[#C9A24D] text-[#F6F1EB] hover:bg-[#C9A24D]/10 transition-all duration-300 group"
              style={{ fontFamily: 'Lora, serif' }}
            >
              <ParkingCircle size={20} className="group-hover:scale-110 transition-transform" />
              <span className="tracking-[0.1em]">Tìm bãi đỗ xe gần đây</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
