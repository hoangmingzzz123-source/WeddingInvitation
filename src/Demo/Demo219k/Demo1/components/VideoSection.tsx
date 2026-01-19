import { useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function VideoSection() {
  const { ref, isInView } = useInView();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-b from-white to-rose-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-rose-900">
            Video Cưới
          </h2>
          <div className="w-24 h-1 bg-rose-300 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Những khoảnh khắc đẹp nhất được ghi lại
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Background with Bokeh Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100 -z-10" />
          
          {/* Video Container */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
            {/* Thumbnail with Play Button */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1762941744800-385b067dff21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80"
                alt="Wedding Video Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300" />
            </div>

            {/* Play Button */}
            <motion.button
              onClick={() => setShowVideo(true)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
              >
                <Play className="w-10 h-10 text-rose-600 ml-1" />
              </motion.div>
            </motion.button>
          </div>

          {/* Video Modal */}
          {showVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVideo(false)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Wedding Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex justify-center gap-2 mt-12"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-rose-400"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
