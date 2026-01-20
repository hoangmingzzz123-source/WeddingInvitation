import { motion } from 'motion/react';
import { Heart, Sparkles, MessageCircleHeart, Church, Calendar } from 'lucide-react';
import { useInView } from './hooks/useInView';
import { PREMIUM_GALLERY_IMAGES } from '../../../../utils/imageConstants';

const timeline = [
  {
    icon: Heart,
    date: '01.03.2019',
    title: 'Lần Đầu Gặp Gỡ',
    description: 'Định mệnh đã sắp đặt để hai chúng tôi gặp nhau trong một buổi chiều mưa phùn tại quán cà phê nhỏ. Ánh mắt anh và nụ cười em đã làm nên câu chuyện tình yêu này.',
    image: PREMIUM_GALLERY_IMAGES.pinimg_17 },
  {
    icon: Sparkles,
    date: '15.05.2019',
    title: 'Hẹn Hò Đầu Tiên',
    description: 'Chuyến đi biển đầu tiên, nơi chúng tôi cùng nhau xây những tòa lâu đài cát và hứa hẹn sẽ cùng nhau xây dựng tổ ấm trong tương lai.',
    image: 'https://images.unsplash.com/photo-1726251903562-4af66fc61634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBiZWFjaCUyMHN1bnNldHxlbnwxfHx8fDE3NjQ3ODg3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    icon: MessageCircleHeart,
    date: '20.12.2021',
    title: 'Lời Cầu Hôn',
    description: 'Dưới bầu trời đêm đầy sao, anh đã quỳ gối và hỏi em một câu hỏi quan trọng nhất đời anh. Và em đã gật đầu với hạnh phúc tràn ngập.',
    image: 'https://images.unsplash.com/photo-1630326844982-9b35b01cfe59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3MlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc2NDc4ODczMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    icon: Calendar,
    date: '10.01.2025',
    title: 'Ăn Hỏi',
    description: 'Ngày trọng đại khi hai gia đình chính thức kết thân, cùng nhau chuẩn bị cho đám cưới sắp tới với bao nhiêu niềm vui và háo hức.',
    image: PREMIUM_GALLERY_IMAGES.pinimg_14  },
  {
    icon: Church,
    date: '15.06.2025',
    title: 'Đám Cưới',
    description: 'Ngày mà chúng tôi chính thức trở thành vợ chồng, bắt đầu hành trình mới với tư cách là một gia đình. Cảm ơn bạn đã đồng hành cùng chúng tôi!',
    image: PREMIUM_GALLERY_IMAGES.pinimg_4  },
];

export function LoveStory() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-b from-white to-rose-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-rose-900">
            Câu Chuyện Tình Yêu
          </h2>
          <div className="w-24 h-1 bg-rose-300 mx-auto"></div>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-rose-200 hidden md:block"></div>

          {timeline.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 0;

            return (
              <TimelineItem
                key={index}
                item={item}
                icon={Icon}
                isEven={isEven}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, icon: Icon, isEven, index }: any) {
  const { ref, isInView } = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={`relative mb-12 md:mb-20 ${
        isEven ? 'md:pr-1/2' : 'md:pl-1/2'
      }`}
    >
      <div className={`md:flex ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}>
        {/* Icon Circle */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-rose-500 rounded-full items-center justify-center z-10 shadow-lg">
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Content Card */}
        <div className={`md:w-1/2 ${isEven ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            {/* Mobile Icon */}
            <div className="flex md:hidden items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-rose-600">{item.date}</p>
            </div>

            {/* Desktop Date */}
            <p className="hidden md:block text-rose-600 mb-2">{item.date}</p>

            <h3 className="text-2xl font-serif text-rose-900 mb-3">
              {item.title}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              {item.description}
            </p>

            {/* Image */}
            <div className="rounded-lg overflow-hidden group">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Spacer for the other side */}
        <div className="hidden md:block w-1/2"></div>
      </div>
    </motion.div>
  );
}
