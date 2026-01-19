import React from 'react';
import { motion } from 'motion/react';
import { Film, Calendar, Clock, MapPin } from 'lucide-react';

export function WeddingDetailsSection() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#5A1E2A] to-[#1C1C1C] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1707374661682-d804856cee22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJndW5keSUyMGdvbGQlMjB3ZWRkaW5nJTIwZGVjb3J8ZW58MXx8fHwxNjcyNTY3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Wedding decor"
          className="w-full h-full object-cover opacity-8"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#5A1E2A]/95 via-[#1C1C1C]/90 to-[#1C1C1C]/95" />
      </div>

      <div className="w-full flex justify-center items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-3xl w-full"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12"
          >
            <Film className="inline-block text-[#C9A24D] mb-4" size={40} />
            <p className="text-[#C9A24D] text-sm tracking-[0.3em]" style={{ fontFamily: 'Lora, serif' }}>
              WEDDING PREMIERE
            </p>
          </motion.div>

          {/* Movie Ticket Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            {/* Gold border glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A24D] via-[#C9A24D] to-[#C9A24D] rounded-2xl blur-md opacity-40" />
            
            {/* Main ticket card */}
            <div className="relative bg-[#F6F1EB] rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden">
              {/* Notches (ticket holes) */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[#1C1C1C] rounded-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-[#1C1C1C] rounded-full" />
              
              {/* Decorative line */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent mb-8"
              />

              {/* Date Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Calendar className="text-[#5A1E2A]" size={24} />
                  <h3 className="text-[#5A1E2A] text-4xl md:text-5xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                    MARCH 29, 2026
                  </h3>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Clock className="text-[#5A1E2A]" size={20} />
                  <p className="text-[#5A1E2A] text-xl tracking-[0.1em]" style={{ fontFamily: 'Lora, serif' }}>
                    SATURDAY • 4:30 PM
                  </p>
                </div>
              </motion.div>

              {/* Divider */}
              <div className="border-t-2 border-dashed border-[#C9A24D]/40 my-8" />

              {/* Venue Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <MapPin className="text-[#5A1E2A]" size={24} />
                  <h4 className="text-[#5A1E2A] text-2xl md:text-3xl tracking-[0.1em]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    RIVERSIDE PALACE
                  </h4>
                </div>
                <p className="text-[#5A1E2A]/70 text-lg" style={{ fontFamily: 'Lora, serif' }}>
                  Ho Chi Minh City
                </p>
              </motion.div>

              {/* Decorative line */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1.3 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent mt-8"
              />

              {/* Ticket number */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="text-center mt-6"
              >
                <p className="text-[#5A1E2A]/40 text-xs tracking-[0.3em]" style={{ fontFamily: 'Lora, serif' }}>
                  ADMIT ONE • VIP GUEST
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}