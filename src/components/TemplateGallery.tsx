import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Eye, Music, MapPin, Smartphone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { navigateTo } from '../Router';
import { PREMIUM_GALLERY_IMAGES, TEMPLATE_GALLERY_IMAGES, UNSPLASH_IMAGES } from '../utils/imageConstants';

type PackageType = 'all' | '109k' | '159k' | '199k';

const templates = [
  {
    name: 'Classic Minimalist',
    image: PREMIUM_GALLERY_IMAGES.anhvien_mimosa_korea,
    style: 'Minimalist',
    demoUrl: '/demo/classic-minimalist',
    package: '109k' as PackageType,
    description: 'Tối giản sang trọng',
    features: ['Nhạc nền', 'Album', 'Bản đồ'],
  },
  {
    name: 'Blush Floral',
    image: PREMIUM_GALLERY_IMAGES.calibridal_wedding,
    style: 'Floral',
    demoUrl: '/demo/blush-floral',
    package: '109k' as PackageType,
    description: 'Hoa văn pastel nhẹ nhàng',
    features: ['Watercolor', 'Album', 'Timeline'],
  },
  {
    name: 'Soft Fade Floral',
    image: TEMPLATE_GALLERY_IMAGES.bloomCrystal,
    style: 'Watercolor Pastel',
    demoUrl: '/demo/soft-fade-floral',
    package: '109k' as PackageType,
    description: 'Chuyển màu mượt mà',
    features: ['Fade Effect', 'Music', 'Map'],
  },
  {
    name: 'Minimal Slide Clean',
    image: TEMPLATE_GALLERY_IMAGES.minimalElegant,
    style: 'Modern Clean',
    demoUrl: '/demo/minimal-slide-clean',
    package: '109k' as PackageType,
    description: 'Hiện đại trẻ trung',
    features: ['Swipe', 'Clean UI', 'Fast'],
  },
  {
    name: 'Modern Dark Blue',
    image: TEMPLATE_GALLERY_IMAGES.luxuryGold,
    style: 'Modern',
    demoUrl: '/demo/modern-dark-blue',
    package: '109k' as PackageType,
    description: 'Xanh navy sang trọng',
    features: ['Dark Mode', 'Elegant', 'Premium'],
  },
  {
    name: 'Minimal Elegant',
    image: PREMIUM_GALLERY_IMAGES.afamilycdn_1,
    style: 'Luxury Editorial',
    demoUrl: '/demo/minimal-elegant-basic',
    package: '159k' as PackageType,
    description: 'Sang trọng tối giản',
    features: ['Editorial', 'Grid Layout', 'Lightbox'],
  },
  {
    name: 'Luxury Gold Frame',
    image: PREMIUM_GALLERY_IMAGES.pinimg_1, 
    style: 'Luxury',
    demoUrl: '/demo/luxury-gold-frame',
    package: '159k' as PackageType,
    description: 'Khung viền vàng kim',
    features: ['Gold Effect', 'Luxury', '3 Pages'],
  },
  {
    name: 'Luxury Gold Cinematic',
    image: PREMIUM_GALLERY_IMAGES.pinimg_11,
    style: 'Cinematic Luxury',
    demoUrl: '/demo/luxury-gold-cinematic',
    package: '159k' as PackageType,
    description: 'Điện ảnh đẳng cấp',
    features: ['Bokeh', 'Cinematic', 'Premium'],
  },
  {
    name: 'Vintage Film Memory',
    image: PREMIUM_GALLERY_IMAGES.pinimg_4,
    style: 'Vintage',
    demoUrl: '/demo/vintage-film',
    package: '159k' as PackageType,
    description: 'Film grain cổ điển',
    features: ['Vintage', 'Film Grain', 'Retro'],
  },
  {
    name: 'Romantic Watercolor',
    image: PREMIUM_GALLERY_IMAGES.pinimg_3,
    style: 'Romantic',
    demoUrl: '/demo/romantic-watercolor',
    package: '159k' as PackageType,
    description: 'Màu nước lãng mạn',
    features: ['Watercolor', 'Romantic', 'Soft'],
  },
  {
    name: 'Cinematic Love Story',
    image: PREMIUM_GALLERY_IMAGES.toplist_beewedding,
    style: 'Cinematic Film',
    demoUrl: '/demo/cinematic-love-story',
    package: '199k' as PackageType,
    description: 'Kể chuyện tình yêu điện ảnh',
    features: ['Timeline', 'Scroll Animation', 'Film Grain'],
  },
  {
    name: 'Vietnamese Traditional',
    image: PREMIUM_GALLERY_IMAGES.hstudio_aodai,
    style: 'Traditional Luxury',
    demoUrl: '/demo/vietnamese-traditional',
    package: '199k' as PackageType,
    description: 'Truyền thống Việt sang trọng',
    features: ['Song Hỷ', 'Gia Đình 2 Bên', 'Đỏ Vàng'],
  },
  {
    name: '3D Bloom Crystal',
    image: TEMPLATE_GALLERY_IMAGES.korean_studio,
    style: '3D Effect',
    demoUrl: '/demo/bloom-crystal-3d',
    package: '199k' as PackageType,
    description: 'Hiệu ứng 3D cao cấp',
    features: ['3D', 'Crystal', '5 Pages'],
  },
  {
    name: 'Art Deco Royal',
    image: TEMPLATE_GALLERY_IMAGES.luxe_venue,
    style: 'Art Deco',
    demoUrl: '/demo/art-deco-royal',
    package: '199k' as PackageType,
    description: 'Hoàng gia Art Deco',
    features: ['Art Deco', 'Royal', 'Luxury'],
  },
  {
    name: 'Tropical Sunset',
    image: PREMIUM_GALLERY_IMAGES.pinimg_5,
    style: 'Tropical',
    demoUrl: '/demo/tropical-sunset',
    package: '199k' as PackageType,
    description: 'Nhiệt đới hoàng hôn',
    features: ['Tropical', 'Vibrant', 'Unique'],
  },
];

export function TemplateGallery() {
  const [activeFilter, setActiveFilter] = useState<PackageType>('all');
  const [highlightPackage, setHighlightPackage] = useState<PackageType | null>(null);

  // Listen for hash changes to auto-filter (keeping for backward compatibility)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      const filterParam = new URLSearchParams(search).get('filter');
      
      if (hash.includes('filter-109k') || filterParam === '109k') {
        setActiveFilter('109k');
        setHighlightPackage('109k');
        setTimeout(() => setHighlightPackage(null), 3000);
      } else if (hash.includes('filter-159k') || filterParam === '159k') {
        setActiveFilter('159k');
        setHighlightPackage('159k');
        setTimeout(() => setHighlightPackage(null), 3000);
      } else if (hash.includes('filter-199k') || filterParam === '199k') {
        setActiveFilter('199k');
        setHighlightPackage('199k');
        setTimeout(() => setHighlightPackage(null), 3000);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const filteredTemplates = activeFilter === 'all' 
    ? templates 
    : templates.filter(t => t.package === activeFilter);

  const getPackageColor = (pkg: PackageType) => {
    switch(pkg) {
      case '109k': return '#F7DADA';
      case '159k': return '#FFE5B4';
      case '199k': return '#E6D7FF';
      default: return '#FAF7F2';
    }
  };

  return (
    <section id="templates" className="relative py-24 px-4 md:px-16 bg-gradient-to-b from-white to-[#FAF7F2]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 
            className="text-5xl md:text-6xl text-[#C29B43]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            45+ Mẫu Thiệp Đẹp Lung Linh
          </h2>
          <p className="text-xl text-[#4A4A4A] max-w-2xl mx-auto">
            Từ tối giản đến sang trọng, từ vintage đến hiện đại
          </p>
        </motion.div>

        {/* Filter Bar - Sticky */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="sticky top-[60px] z-40 mb-12 bg-white/90 backdrop-blur-md rounded-full py-4 px-6 shadow-lg"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Tất cả', value: 'all' as PackageType },
              { label: 'Gói 109K', value: '109k' as PackageType },
              { label: 'Gói 159K', value: '159k' as PackageType },
              { label: 'Gói 199K', value: '199k' as PackageType },
            ].map((filter) => (
              <motion.button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'bg-gradient-to-r from-[#C29B43] to-[#FFD700] text-white shadow-lg'
                    : 'bg-white text-[#666] hover:shadow-md border border-[#C29B43]/20'
                }`}
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '16px',
                  backgroundColor: activeFilter === filter.value && filter.value !== 'all' 
                    ? getPackageColor(filter.value) 
                    : undefined,
                  outline: activeFilter === filter.value ? `2px solid #C29B43` : 'none',
                }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.45,
                  delay: index * 0.05,
                  layout: { type: "spring", stiffness: 300, damping: 30 }
                }}
                className="group relative overflow-hidden rounded-2xl shadow-lg bg-white"
                style={{
                  boxShadow: highlightPackage === template.package
                    ? '0 0 30px rgba(194, 155, 67, 0.6)'
                    : undefined,
                  border: highlightPackage === template.package
                    ? '3px solid #C29B43'
                    : undefined,
                }}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    <ImageWithFallback
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Gold Border Effect on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(194, 155, 67, 0.3) 50%, transparent 70%)',
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* Overlay on Hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ y: 20 }}
                      whileHover={{ y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Button
                        onClick={() => window.open(window.location.origin + template.demoUrl, '_blank')}
                        className="bg-[#C29B43] hover:bg-[#A88434] text-white rounded-full px-6 py-3 shadow-xl"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem Demo
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Package Badge */}
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm backdrop-blur-sm"
                    style={{
                      backgroundColor: getPackageColor(template.package),
                      color: '#1B2A41',
                    }}
                  >
                    {template.package.toUpperCase()}
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6 space-y-2">
                  <h3 
                    className="text-2xl text-[#C29B43]"
                    style={{ fontFamily: '"Dancing Script", cursive' }}
                  >
                    {template.name}
                  </h3>
                  <p className="text-sm text-[#6F6F6F]">{template.style}</p>
                  
                  {/* Description */}
                  <p className="text-xs text-[#999] mt-1">{template.description}</p>
                  
                  {/* Features Icons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {template.features.map((feature, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#FAF7F2] rounded-full text-xs text-[#666]"
                      >
                        {feature.includes('Nhạc') || feature.includes('Music') ? (
                          <Music className="w-3 h-3" />
                        ) : feature.includes('Bản đồ') || feature.includes('Map') ? (
                          <MapPin className="w-3 h-3" />
                        ) : (
                          <Smartphone className="w-3 h-3" />
                        )}
                        {feature}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigateTo('/templates')}
              className="bg-[#1B2A41] hover:bg-[#0F1A2E] text-white px-8 py-6 rounded-full"
            >
              Xem tất cả mẫu thiệp
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}