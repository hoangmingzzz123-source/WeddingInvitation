import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useInView } from './hooks/useInView';

const events = [
  {
    title: 'Lễ Vu Quy',
    date: '15 tháng 6, 2025',
    time: '08:00 Sáng',
    location: 'Tư gia nhà gái',
    address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    phone: '0909 123 456',
    mapUrl: 'https://maps.google.com/?q=10.762622,106.660172'
  },
  {
    title: 'Tiệc Cưới',
    date: '15 tháng 6, 2025',
    time: '18:00 Chiều',
    location: 'Nhà hàng tiệc cưới White Palace',
    address: '194 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP. Hồ Chí Minh',
    phone: '028 3844 9999',
    mapUrl: 'https://maps.google.com/?q=10.797970,106.677570'
  }
];

export function WeddingInfo() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-rose-900">
            Thông Tin Đám Cưới
          </h2>
          <div className="w-24 h-1 bg-rose-300 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
          className="bg-rose-50 rounded-lg p-8"
        >
          <h3 className="text-2xl font-serif text-rose-900 mb-6 text-center">
            Bản Đồ Đến Tiệc Cưới
          </h3>
          <div className="rounded-lg overflow-hidden shadow-lg">
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
          </div>
          <div className="mt-6 text-center">
            <a
              href={events[1].mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition-colors duration-300"
            >
              <MapPin className="w-5 h-5" />
              Xem Chỉ Đường
            </a>
          </div>
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
      className="bg-gradient-to-br from-rose-50 to-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
    >
      <h3 className="text-3xl font-serif text-rose-900 mb-6 text-center">
        {event.title}
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Ngày</p>
            <p className="text-gray-800">{event.date}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Thời gian</p>
            <p className="text-gray-800">{event.time}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Địa điểm</p>
            <p className="text-gray-800">{event.location}</p>
            <p className="text-gray-600 text-sm mt-1">{event.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Liên hệ</p>
            <a href={`tel:${event.phone}`} className="text-rose-600 hover:text-rose-700">
              {event.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-rose-200">
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition-colors duration-300"
        >
          <MapPin className="w-5 h-5" />
          Xem Bản Đồ
        </a>
      </div>
    </motion.div>
  );
}
