import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function PhotoAlbumSection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Pre-wedding photos with real images
  const photos = [
    { 
      id: 1, 
      alt: 'Elegant couple portrait',
      url: 'https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp',
    },
    { 
      id: 2, 
      alt: 'Bride and groom portrait',
      url: 'https://tuarts.net/wp-content/uploads/2018/08/39900495_2187804601294710_8118125377903132672_o-801x1200.jpg'},
    { 
      id: 3, 
      alt: 'Romantic outdoor sunset',
      url: 'https://tuarts.net/wp-content/uploads/2015/12/117937145_4255715104503639_2707126124250519806_o.jpg'  ,
    },
    { 
      id: 4, 
      alt: 'Couple holding hands',
      url: 'https://tuarts.net/wp-content/uploads/2020/05/60770796_2734489913292840_6737769278910496768_o-1.jpg',
    },
    { 
      id: 5, 
      alt: 'Bride in white dress',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwtVDQB3iSQHP8hKhCyVCD1ictAV_LqN0YA&s',
    },
    { 
      id: 6, 
      alt: 'Couple dancing',
      url: 'https://demxanh.com/media/news/2810_studio-thai-binh-1.jpg' ,
    },
    { 
      id: 7, 
      alt: 'Groom smiling',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBiu-e-SK8GBBxhEhYa1XLBqDTlM91kAqe4Y5bL0VU_xoJSfbswLSloKC9NM8JbKhdCY&usqp=CAU',
    },
    { 
      id: 8, 
      alt: 'Couple in nature',
      url: 'https://tuarts.net/wp-content/uploads/2018/08/39900495_2187804601294710_8118125377903132672_o-801x1200.jpg',
    },
  ];

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? photos.length - 1 : selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === photos.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-gradient-to-b from-[#1C1C1C] via-[#5A1E2A] to-[#5A1E2A] py-20 px-6 flex items-center justify-center">
        <div className="w-full flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-6xl w-full"
          >
            {/* Title */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-6"
            >
              <Camera className="inline-block text-[#C9A24D]" size={48} />
            </motion.div>

            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-[#F6F1EB] text-3xl md:text-4xl tracking-[0.2em] mb-3 text-center"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              OUR STORY IN FRAMES
            </motion.h3>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '120px' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="h-[1px] bg-[#C9A24D] mx-auto mb-16"
            />

            {/* Film Strip Gallery */}
            <div className="relative">
              {/* Film strip holes decoration */}
              <div className="absolute -left-2 top-0 bottom-0 w-4 flex flex-col justify-around py-4 hidden md:flex">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm bg-[#C9A24D]/20 border border-[#C9A24D]/40" />
                ))}
              </div>
              <div className="absolute -right-2 top-0 bottom-0 w-4 flex flex-col justify-around py-4 hidden md:flex">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm bg-[#C9A24D]/20 border border-[#C9A24D]/40" />
                ))}
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    onClick={() => setSelectedImage(index)}
                    className="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-2 border-[#C9A24D]/40 hover:border-[#C9A24D] transition-all shadow-lg hover:shadow-[#C9A24D]/30"
                  >
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-[#F6F1EB] hover:text-[#C9A24D] transition-colors z-10"
            >
              <X size={32} />
            </button>

            {/* Previous button */}
            <button
              onClick={handlePrevious}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-[#F6F1EB] hover:text-[#C9A24D] transition-colors z-10 bg-[#1C1C1C]/50 rounded-full p-3"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-[#F6F1EB] hover:text-[#C9A24D] transition-colors z-10 bg-[#1C1C1C]/50 rounded-full p-3"
            >
              <ChevronRight size={32} />
            </button>

            {/* Image with fade transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl w-full px-6"
              >
                <img
                  src={photos[selectedImage].url}
                  alt={photos[selectedImage].alt}
                  className="w-full h-auto rounded-lg border-2 border-[#C9A24D] shadow-2xl"
                />
              </motion.div>
            </AnimatePresence>

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#F6F1EB] text-sm" style={{ fontFamily: 'Lora, serif' }}>
              {selectedImage + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}