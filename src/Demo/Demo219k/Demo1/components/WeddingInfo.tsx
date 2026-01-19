import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Phone, ArrowRight, Heart } from 'lucide-react';
import { useInView } from './hooks/useInView';

const events = [
  {
    title: 'Lễ Vu Quy',
    date: '15 tháng 6, 2025',
    time: '08:00 Sáng',
    location: 'Tư gia nhà gái',
    address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    phone: '0909 123 456',
    mapUrl: 'https://maps.google.com/?q=10.762622,106.660172',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50/50'
  },
  {
    title: 'Tiệc Cưới',
    date: '15 tháng 6, 2025',
    time: '18:00 Chiều',
    location: 'Nhà hàng tiệc cưới White Palace',
    address: '194 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP. Hồ Chí Minh',
    phone: '028 3844 9999',
    mapUrl: 'https://maps.google.com/?q=10.797970,106.677570',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50/50'
  }
];

export function WeddingInfo() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-24 px-4 bg-gradient-to-b from-rose-50/50 via-pink-50/20 to-rose-50/30 relative overflow-hidden">
      {/* Animated Background Elements - Enhanced */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-rose-300/30 to-pink-300/30 rounded-full blur-3xl"
        animate={{ 
          x: [0, 50, 0], 
          y: [0, -40, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl"
        animate={{ 
          x: [0, -40, 0], 
          y: [0, 40, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, delay: 2, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.4, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-40 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-300/25 to-pink-300/25 rounded-full blur-3xl"
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -30, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute bottom-40 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl"
        animate={{ 
          x: [0, -25, 0], 
          y: [0, 25, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ duration: 14, repeat: Infinity, delay: 3 }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-sm text-rose-600 tracking-widest uppercase font-light">Lịch Trình Sự Kiện</span>
                <div className="w-2 h-2 rounded-full bg-rose-400" />
              </div>
            </div>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900 font-light">
            Thông Tin Đám Cưới
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-32 h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 mx-auto mb-6"
          />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Chúng tôi rất mong được đón tiếp quý khách trong ngày trọng đại của mình
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {events.map((event, index) => (
            <EventCard key={index} event={event} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-br from-white to-rose-50/30 border border-rose-200/30 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2 font-light">
              Bản Đồ Địa Điểm
            </h3>
            <p className="text-gray-600 font-light">Tìm đường đến tiệc cưới của chúng tôi</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-rose-200/20"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0634203876657!2d106.67557!3d10.79797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ3JzUyLjciTiAxMDbCsDQwJzM5LjMiRQ!5e0!3m2!1svi!2s!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <motion.a
              href={events[1].mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white hover:bg-rose-50 text-rose-600 px-8 py-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold border-2 border-rose-300 hover:border-rose-500 group"
            >
              <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Xem Chỉ Đường
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.a>
          </motion.div>

          {/* RSVP Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <motion.button
              onClick={() => {
                const element = document.querySelector('#rsvp-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 hover:from-rose-100 hover:via-pink-100 hover:to-rose-100 text-rose-700 px-10 py-5 rounded-full shadow-2xl hover:shadow-rose-400/50 transition-all duration-300 font-bold text-lg group relative overflow-hidden border-3 border-rose-400"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-rose-200 via-pink-200 to-rose-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ zIndex: -1 }}
              />
              <Heart className="w-6 h-6 text-rose-600 group-hover:scale-125 transition-transform" />
              <span>Xác Nhận Tham Dự Ngay</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-4 text-gray-600 text-sm font-light"
            >
              Vui lòng xác nhận sớm để chúng tôi chuẩn bị chu đáo hơn
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function EventCard({ event, index, isInView }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      {/* Card Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />

      <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Accent Line */}
        <motion.div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${event.color} rounded-t-3xl`}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
          style={{ transformOrigin: 'left' }}
        />

        {/* Icon Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.2 + 0.2 }}
          className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 font-light">
          {event.title}
        </h3>

        <div className="space-y-6">
          {/* Date */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.2 + 0.3 }}
            className="flex items-start gap-4 group/item"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Ngày</p>
              <p className="text-gray-900 font-medium mt-1">{event.date}</p>
            </div>
          </motion.div>

          {/* Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.2 + 0.4 }}
            className="flex items-start gap-4 group/item"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Thời gian</p>
              <p className="text-gray-900 font-medium mt-1">{event.time}</p>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.2 + 0.5 }}
            className="flex items-start gap-4 group/item"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-300">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Địa điểm</p>
              <p className="text-gray-900 font-medium mt-1">{event.location}</p>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">{event.address}</p>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.2 + 0.6 }}
            className="flex items-start gap-4 group/item"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-300">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Liên hệ</p>
              <a href={`tel:${event.phone}`} className="text-rose-600 hover:text-rose-700 font-medium mt-1 inline-block hover:underline transition-colors">
                {event.phone}
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.2 + 0.7 }}
          className="mt-8 pt-8 border-t border-gray-200/50"
        >
          <motion.a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-rose-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold border-2 border-rose-300 hover:border-rose-500 group/btn"
          >
            <MapPin className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            <span>Xem Bản Đồ</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
}
