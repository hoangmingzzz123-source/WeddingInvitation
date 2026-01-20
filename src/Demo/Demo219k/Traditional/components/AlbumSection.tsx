import { motion } from 'motion/react';
import { useState } from 'react';
import { X } from 'lucide-react';
import { GALLERY_IMAGES, PREMIUM_GALLERY_IMAGES } from '../../../../utils/imageConstants';

export function AlbumSection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Placeholder images - in real app these would be actual wedding photos
  const photos = [
    GALLERY_IMAGES.studio_couple,
    GALLERY_IMAGES.tuarts_couple_1,
    GALLERY_IMAGES.tuarts_couple_2,
    PREMIUM_GALLERY_IMAGES.anhvien_mimosa_korea,
    PREMIUM_GALLERY_IMAGES.calibridal_wedding,
    PREMIUM_GALLERY_IMAGES.afamilycdn_1,
    PREMIUM_GALLERY_IMAGES.pinimg_4,
    PREMIUM_GALLERY_IMAGES.pinimg_5,
    PREMIUM_GALLERY_IMAGES.pinimg_6,
   ];

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-[#FBF6EE]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-[#8B1E1E] mb-4">Khoảnh Khắc Hạnh Phúc</h2>
          <motion.div 
            className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="relative aspect-square cursor-pointer group"
              onClick={() => setSelectedImage(index)}
            >
              <div className="w-full h-full rounded-xl overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={photo}
                  alt={`Wedding photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#8B1E1E] opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>

              {/* Decorative corner */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          ))}
        </div>

        {/* Fullscreen modal */}
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#FBF6EE] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="text-[#8B1E1E]" size={24} />
            </button>

            {/* Image */}
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={photos[selectedImage]}
              alt={`Wedding photo ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg border-4 border-[#D4AF37]"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-6 py-3 rounded-full">
              <span className="text-[#8B1E1E]">
                {selectedImage + 1} / {photos.length}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
