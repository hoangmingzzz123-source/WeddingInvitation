import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from './hooks/useInView';
import { DEMO1_GALLERY_IMAGES, PREMIUM_GALLERY_IMAGES } from '../../../../utils/imageConstants';

const photos = [
  {
    url: DEMO1_GALLERY_IMAGES.weddingVenue,
    caption: 'Khoảnh khắc hạnh phúc'
  },
  {
    url: DEMO1_GALLERY_IMAGES.coupleBeachSunset,
    caption: 'Tình yêu chân thành'
  },
  {
    url: DEMO1_GALLERY_IMAGES.coupleDancing,
    caption: 'Những bước nhảy đầu tiên'
  },
  {
    url: DEMO1_GALLERY_IMAGES.coupleHolding,
    caption: 'Nắm tay nhau đi'
  },
  {
    url: PREMIUM_GALLERY_IMAGES.pinimg_2,
    caption: 'Hoàng hôn bên em'
  },
  {
    url: DEMO1_GALLERY_IMAGES.decorationFlowers,
    caption: 'Trang trí tiệc cưới'
  },
  {
    url: PREMIUM_GALLERY_IMAGES.pinimg_14,
    caption: 'Không gian tiệc cưới'
  },
  {
    url: PREMIUM_GALLERY_IMAGES.pinimg_7,
    caption: 'Tiếng cười hạnh phúc'
  },
  {
    url: PREMIUM_GALLERY_IMAGES.pinimg_3,
    caption: 'Lễ cưới ngoài trời'
  }
];

export function Gallery() {
  const { ref, isInView } = useInView();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % photos.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + photos.length) % photos.length);
    }
  };

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-rose-900">
            Album Ảnh Kỷ Niệm
          </h2>
          <div className="w-24 h-1 bg-rose-300 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những khoảnh khắc đẹp nhất của chúng tôi
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => openLightbox(index)}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-rose-300 transition-colors z-10"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 text-white hover:text-rose-300 transition-colors z-10"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 text-white hover:text-rose-300 transition-colors z-10"
              >
                <ChevronRight className="w-12 h-12" />
              </button>

              {/* Image */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={photos[selectedImage].url}
                  alt={photos[selectedImage].caption}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                />
                <p className="text-white text-center mt-4 text-lg">
                  {photos[selectedImage].caption}
                </p>
                <p className="text-white/60 text-center mt-2">
                  {selectedImage + 1} / {photos.length}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
