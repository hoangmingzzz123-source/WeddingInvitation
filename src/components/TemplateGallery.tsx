import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Eye, Music, MapPin, Smartphone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type PackageType = 'all' | '199k' | '299k' | '399k';

const templates = [
  {
    name: 'Classic Minimalist',
    image: 'https://images.unsplash.com/photo-1759887244219-17c3d64a7f01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwaW52aXRhdGlvbiUyMGVsZWdhbnR8ZW58MXx8fHwxNzYzNjkyNjE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Minimalist',
    demoUrl: '#/demo/classic-minimalist',
    package: '199k' as PackageType,
    description: 'Tối giản sang trọng',
    features: ['Nhạc nền', 'RSVP', 'Bản đồ'],
  },
  {
    name: 'Blush Floral',
    image: 'https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvcmFsJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NjM2NDAxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Floral',
    demoUrl: '#/demo/blush-floral',
    package: '199k' as PackageType,
    description: 'Hoa văn pastel nhẹ nhàng',
    features: ['Watercolor', 'Album', 'Timeline'],
  },
  {
    name: 'Soft Fade Floral',
    image: 'https://images.unsplash.com/photo-1658243862459-145b453dd74e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcm9tYW50aWN8ZW58MXx8fHwxNzYzNjAyMjEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Watercolor Pastel',
    demoUrl: '#/demo/soft-fade-floral',
    package: '199k' as PackageType,
    description: 'Chuyển màu mượt mà',
    features: ['Fade Effect', 'Music', 'Map'],
  },
  {
    name: 'Minimal Slide Clean',
    image: 'https://images.unsplash.com/photo-1627364155535-9ed50e63aece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWRkaW5nJTIwbWluaW1hbHxlbnwxfHx8fDE3NjM2OTI2MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Modern Clean',
    demoUrl: '#/demo/minimal-slide-clean',
    package: '199k' as PackageType,
    description: 'Hiện đại trẻ trung',
    features: ['Swipe', 'Clean UI', 'Fast'],
  },
  {
    name: 'Modern Dark Blue',
    image: 'https://images.unsplash.com/photo-1627364155535-9ed50e63aece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWRkaW5nJTIwbWluaW1hbHxlbnwxfHx8fDE3NjM2OTI2MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Modern',
    demoUrl: '#/demo/modern-dark-blue',
    package: '199k' as PackageType,
    description: 'Xanh navy sang trọng',
    features: ['Dark Mode', 'Elegant', 'Premium'],
  },
  {
    name: 'Luxury Gold Frame',
    image: 'https://images.unsplash.com/photo-1742240439165-60790db1ee93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwZ29sZHxlbnwxfHx8fDE3NjM2NjUxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Luxury',
    demoUrl: '#/demo/luxury-gold-frame',
    package: '299k' as PackageType,
    description: 'Khung viền vàng kim',
    features: ['Gold Effect', 'Luxury', '3 Pages'],
  },
  {
    name: 'Luxury Gold Cinematic',
    image: 'https://images.unsplash.com/photo-1742240439165-60790db1ee93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwZ29sZHxlbnwxfHx8fDE3NjM2NjUxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Cinematic Luxury',
    demoUrl: '#/demo/luxury-gold-cinematic',
    package: '299k' as PackageType,
    description: 'Điện ảnh đẳng cấp',
    features: ['Bokeh', 'Cinematic', 'Premium'],
  },
  {
    name: 'Vintage Film Memory',
    image: 'https://images.unsplash.com/photo-1658243862459-145b453dd74e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcm9tYW50aWN8ZW58MXx8fHwxNzYzNjAyMjEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Vintage',
    demoUrl: '#/demo/vintage-film',
    package: '299k' as PackageType,
    description: 'Film grain cổ điển',
    features: ['Vintage', 'Film Grain', 'Retro'],
  },
  {
    name: 'Romantic Watercolor',
    image: 'https://images.unsplash.com/photo-1759887244219-17c3d64a7f01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwaW52aXRhdGlvbiUyMGVsZWdhbnR8ZW58MXx8fHwxNzYzNjkyNjE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Romantic',
    demoUrl: '#/demo/romantic-watercolor',
    package: '299k' as PackageType,
    description: 'Màu nước lãng mạn',
    features: ['Watercolor', 'Romantic', 'Soft'],
  },
  {
    name: '3D Bloom Crystal',
    image: 'https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvcmFsJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NjM2NDAxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    style: '3D Effect',
    demoUrl: '#/demo/bloom-crystal-3d',
    package: '399k' as PackageType,
    description: 'Hiệu ứng 3D cao cấp',
    features: ['3D', 'Crystal', '5 Pages'],
  },
  {
    name: 'Art Deco Royal',
    image: 'https://images.unsplash.com/photo-1742240439165-60790db1ee93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwZ29sZHxlbnwxfHx8fDE3NjM2NjUxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Art Deco',
    demoUrl: '#/demo/art-deco-royal',
    package: '399k' as PackageType,
    description: 'Hoàng gia Art Deco',
    features: ['Art Deco', 'Royal', 'Luxury'],
  },
  {
    name: 'Tropical Sunset',
    image: 'https://images.unsplash.com/photo-1627364155535-9ed50e63aece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWRkaW5nJTIwbWluaW1hbHxlbnwxfHx8fDE3NjM2OTI2MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Tropical',
    demoUrl: '#/demo/tropical-sunset',
    package: '399k' as PackageType,
    description: 'Nhiệt đới hoàng hôn',
    features: ['Tropical', 'Vibrant', 'Unique'],
  },
];

export function TemplateGallery() {
  const [activeFilter, setActiveFilter] = useState<PackageType>('all');
  const [highlightPackage, setHighlightPackage] = useState<PackageType | null>(null);

  // Listen for hash changes to auto-filter
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('filter-199k')) {
        setActiveFilter('199k');
        setHighlightPackage('199k');
        setTimeout(() => setHighlightPackage(null), 3000);
      } else if (hash.includes('filter-299k')) {
        setActiveFilter('299k');
        setHighlightPackage('299k');
        setTimeout(() => setHighlightPackage(null), 3000);
      } else if (hash.includes('filter-399k')) {
        setActiveFilter('399k');
        setHighlightPackage('399k');
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
      case '199k': return '#F7DADA';
      case '299k': return '#FFE5B4';
      case '399k': return '#E6D7FF';
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
              { label: 'Gói 199K', value: '199k' as PackageType },
              { label: 'Gói 299K', value: '299k' as PackageType },
              { label: 'Gói 399K', value: '399k' as PackageType },
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
                        onClick={() => window.open(window.location.origin + window.location.pathname + template.demoUrl, '_blank')}
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
              onClick={() => setActiveFilter('all')}
              className="bg-[#1B2A41] hover:bg-[#0F1A2E] text-white px-8 py-6 rounded-full"
            >
              Xem tất cả 45+ mẫu thiệp
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}