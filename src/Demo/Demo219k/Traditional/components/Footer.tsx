import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#8B1E1E] text-[#FBF6EE] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        {/* Double happiness symbol */}
        <div className="mb-6">
          <svg width="60" height="60" viewBox="0 0 100 100" className="mx-auto">
            <text x="50" y="75" fontSize="60" fill="#D4AF37" textAnchor="middle" fontFamily="serif">囍</text>
          </svg>
        </div>

        {/* Names */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h3 className="text-[#D4AF37]">Hoàng Oanh</h3>
            <Heart className="text-[#D4AF37]" size={20} fill="currentColor" />
            <h3 className="text-[#D4AF37]">Thanh Tùng</h3>
          </div>
        </div>

        {/* Date */}
        <div className="mb-8">
          <p className="text-[#FBF6EE]/80">29.03.2026</p>
        </div>

        {/* Divider */}
        <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto mb-6"></div>

        {/* Thank you message */}
        <div className="mb-6">
          <p className="text-[#FBF6EE]/90 italic">
            Trân trọng kính mời
          </p>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
          <div className="w-2 h-2 bg-[#FBF6EE] rounded-full"></div>
          <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[#FBF6EE]/20">
          <p className="text-sm text-[#FBF6EE]/60">
            © 2026 Wedding Invitation
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
