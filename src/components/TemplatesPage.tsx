import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Filter, Star, Clock, Zap, Eye, Music, MapPin, Smartphone, ArrowUp } from 'lucide-react';
import { Button } from './ui/button';
import { navigateTo } from '../Router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PREMIUM_GALLERY_IMAGES } from '../utils/imageConstants';

type PackageType = 'free' | 'basic' | 'premium';
type TierType = 'all' | '109k' | '159k' | '199k';

interface Template {
  id: string;
  name: string;
  route: string;
  thumbnail: string;
  package: 'free' | 'basic' | 'premium';
  tier: '109k' | '159k' | '199k';
  features: string[];
  description: string;
}

export function TemplatesPage() {
  const [selectedTier, setSelectedTier] = useState<TierType>('all');

  const templates: Template[] = [
    {
      id: 'luxury-gold-cinematic',
      name: 'Luxury Gold Cinematic',
      route: '/demo/luxury-gold-cinematic',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_1,
      package: 'premium',
      tier: '159k',
      features: ['7 Pages', 'RSVP Form', 'QR Code', 'Music Player', 'Custom Music'],
      description: 'Thiết kế sang trọng với hiệu ứng vàng ánh kim cao cấp'
    },
    {
      id: 'luxury-gold-frame',
      name: 'Luxury Gold Frame',
      route: '/demo/luxury-gold-frame',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_2,
      package: 'premium',
      tier: '159k',
      features: ['6 Pages', 'Timeline', 'Gallery', 'Map', 'RSVP', 'QR'],
      description: 'Template vàng gold với khung viền sang trọng'
    },
    {
      id: 'vintage-film',
      name: 'Vintage Film Cinematic',
      route: '/demo/vintage-film',
      thumbnail: PREMIUM_GALLERY_IMAGES.xanhwedding_studio,
      package: 'premium',
      tier: '159k',
      features: ['Film Effect', 'Typewriter', 'Gallery', 'Music'],
      description: 'Phong cách điện ảnh cổ điển với hiệu ứng film vintage'
    },
    {
      id: 'art-deco-royal',
      name: 'Art Deco Royal (Premium)',
      route: '/demo/art-deco-royal',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_3,
      package: 'premium',
      tier: '199k',
      features: ['Art Deco Design', 'Elegant', 'RSVP', 'Music'],
      description: 'Thiết kế Art Deco hoàng gia sang trọng'
    },
    {
      id: 'romantic-watercolor',
      name: 'Romantic Watercolor',
      route: '/demo/romantic-watercolor',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_4,
      package: 'premium',
      tier: '159k',
      features: ['Traditional', 'Watercolor', 'Vietnamese Style'],
      description: 'Phong cách truyền thống Việt Nam với hiệu ứng màu nước'
    },
    {
      id: 'cinematic-love-story',
      name: 'Cinematic Love Story',
      route: '/demo/cinematic-love-story',
      thumbnail: PREMIUM_GALLERY_IMAGES.afamilycdn_1,
      package: 'premium',
      tier: '199k',
      features: ['Cinematic', 'Animation', 'Video'],
      description: 'Câu chuyện tình yêu với hiệu ứng điện ảnh chuyên nghiệp'
    },
    {
      id: 'bloom-crystal-3d',
      name: 'Bloom Crystal 3D (Enhanced)',
      route: '/demo/bloom-crystal-3d',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_5,
      package: 'basic',
      tier: '199k',
      features: ['3D Effects', 'Parallax', 'Gallery'],
      description: 'Hiệu ứng 3D pha lê với animation đẹp mắt'
    },
    {
      id: 'bloom-crystal-3d-basic',
      name: 'Bloom Crystal 3D (Basic)',
      route: '/demo/bloom-crystal-3d-basic',
      thumbnail: PREMIUM_GALLERY_IMAGES.tuart_studio,
      package: 'basic',
      tier: '159k',
      features: ['3D Effects', 'Gallery'],
      description: 'Phiên bản cơ bản của Bloom Crystal với hiệu ứng 3D'
    },
    {
      id: 'modern-dark-blue',
      name: 'Modern Dark Blue',
      route: '/demo/modern-dark-blue',
      thumbnail: PREMIUM_GALLERY_IMAGES.noah_wedding_concept,
      package: 'basic',
      tier: '109k',
      features: ['Modern', 'Dark Theme', 'Elegant'],
      description: 'Thiết kế hiện đại với tông màu xanh đậm sang trọng'
    },
    {
      id: 'minimal-elegant',
      name: 'Minimal Elegant (Enhanced)',
      route: '/demo/minimal-elegant',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_6,
      package: 'basic',
      tier: '199k',
      features: ['Minimalist', 'Clean', 'Simple'],
      description: 'Phong cách tối giản thanh lịch'
    },
    {
      id: 'minimal-elegant-basic',
      name: 'Minimal Elegant (Basic)',
      route: '/demo/minimal-elegant-basic',
      thumbnail: PREMIUM_GALLERY_IMAGES.mimosa_wedding,
      package: 'basic',
      tier: '159k',
      features: ['Minimalist', 'Clean'],
      description: 'Phiên bản cơ bản của Minimal Elegant'
    },
    {
      id: 'minimal-slide-clean',
      name: 'Minimal Slide Clean',
      route: '/demo/minimal-slide-clean',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_7,
      package: 'basic',
      tier: '109k',
      features: ['Slide Show', 'Minimal', 'Clean'],
      description: 'Bố cục slide sạch sẽ với thiết kế tối giản'
    },
    {
      id: 'tropical-sunset',
      name: 'Tropical Sunset',
      route: '/demo/tropical-sunset',
      thumbnail: PREMIUM_GALLERY_IMAGES.calibridal_wedding,
      package: 'free',
      tier: '109k',
      features: ['Beach Theme', 'Colorful', 'Fun'],
      description: 'Chủ đề nhiệt đới với hoàng hôn rực rỡ'
    },
    {
      id: 'classic-minimalist',
      name: 'Classic Minimalist',
      route: '/demo/classic-minimalist',
      thumbnail: PREMIUM_GALLERY_IMAGES.googleusercontent_concept,
      package: 'free',
      tier: '109k',
      features: ['Classic', 'Simple', 'Timeless'],
      description: 'Thiết kế cổ điển tối giản vượt thời gian'
    },
    {
      id: 'blush-floral',
      name: 'Blush Floral',
      route: '/demo/blush-floral',
      thumbnail: PREMIUM_GALLERY_IMAGES.hstudio_aodai,
      package: 'free',
      tier: '109k',
      features: ['Floral', 'Romantic', 'Soft Colors'],
      description: 'Hoa văn lãng mạn với tông màu hồng nhẹ nhàng'
    },
    {
      id: 'soft-fade-floral',
      name: 'Soft Fade Floral',
      route: '/demo/soft-fade-floral',
      thumbnail: PREMIUM_GALLERY_IMAGES.anhvien_mimosa_korea,
      package: 'free',
      tier: '109k',
      features: ['Soft', 'Fade Effect', 'Elegant'],
      description: 'Hiệu ứng mờ dần nhẹ nhàng với hoa văn thanh lịch'
    },
    {
      id: 'vietnamese-traditional',
      name: 'Vietnamese Traditional',
      route: '/demo/vietnamese-traditional',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_8,
      package: 'free',
      tier: '199k',
      features: ['Traditional', 'Vietnamese', 'Cultural'],
      description: 'Phong cách truyền thống Việt Nam với yếu tố văn hóa'
    },
    {
      id: 'vintage-grain',
      name: 'Vintage Grain',
      route: '/demo/vintage-grain',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_9,
      package: 'free',
      tier: '109k',
      features: ['Vintage', 'Grain Effect', 'Retro'],
      description: 'Phong cách vintage với hiệu ứng hạt phim cổ điển'
    },
    {
      id: 'green-elegance',
      name: 'Green Elegance',
      route: '/demo/green-elegance',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_10,
      package: 'free',
      tier: '109k',
      features: ['Green Theme', 'Nature', 'Elegant'],
      description: 'Thiết kế thanh lịch với tông màu xanh tự nhiên'
    },
    {
      id: 'art-deco-royal-basic',
      name: 'Art Deco Royal (Basic)',
      route: '/demo/art-deco-royal-basic',
      thumbnail: PREMIUM_GALLERY_IMAGES.pinimg_11,
      package: 'free',
      tier: '159k',
      features: ['Art Deco', 'Elegant'],
      description: 'Phiên bản cơ bản của Art Deco Royal'
    },
  ];

  const filters = [
    { id: 'all' as const, label: 'Tất cả', icon: Filter, count: templates.length },
    { id: '109k' as const, label: 'Gói 109K', icon: Zap, count: templates.filter(t => t.tier === '109k').length },
    { id: '159k' as const, label: 'Gói 159K', icon: Clock, count: templates.filter(t => t.tier === '159k').length },
    { id: '199k' as const, label: 'Gói 199K', icon: Star, count: templates.filter(t => t.tier === '199k').length },
  ];

  const filteredTemplates = selectedTier === 'all' 
    ? templates 
    : templates.filter(t => t.tier === selectedTier);

  const getPackageBadgeColor = (pkg: string) => {
    switch (pkg) {
      case 'premium':
        return 'from-[#FFD700] to-[#FFA500]';
      case 'basic':
        return 'from-[#3B82F6] to-[#1D4ED8]';
      case 'free':
        return 'from-[#22C55E] to-[#16A34A]';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getPackageBadgeBg = (pkg: string) => {
    switch (pkg) {
      case 'premium':
        return '#FFD700';
      case 'basic':
        return '#3B82F6';
      case 'free':
        return '#22C55E';
      default:
        return '#D1D5DB';
    }
  };

  const getTierColor = (tier: TierType) => {
    switch (tier) {
      case '109k': return '#F7DADA';
      case '159k': return '#FFE5B4';
      case '199k': return '#E6D7FF';
      default: return '#FAF7F2';
    }
  };

  const getPackageLabel = (pkg: string) => {
    switch (pkg) {
      case 'premium':
        return '199k';
      case 'basic':
        return '159k';
      case 'free':
        return '109k';
      default:
        return pkg;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FAF7F2]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigateTo('/')}
              variant="ghost"
              className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Button>
            <h2
            className="text-2xl md:text-5xl text-[#C29B43]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Tất Cả Mẫu Thiệp
          </h2>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>


        {/* Filters - styled like TemplateGallery */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-white/90 backdrop-blur-md rounded-full py-4 px-6 shadow-lg"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((flt) => {
              const Icon = flt.icon;
              const isActive = selectedTier === flt.id;
              return (
                <motion.button
                  key={flt.id}
                  onClick={() => setSelectedTier(flt.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C29B43] to-[#FFD700] text-white shadow-lg'
                      : 'bg-white text-[#666] hover:shadow-md border border-[#C29B43]/20'
                  }`}
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: '16px',
                    backgroundColor: isActive && flt.id !== 'all' ? getTierColor(flt.id as TierType) : undefined,
                    outline: isActive ? '2px solid #C29B43' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{flt.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                      {flt.count}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Templates Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTemplates.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => navigateTo(template.route)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#C29B43]/10 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.4 }} className="w-full h-full">
                    <ImageWithFallback src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                  </motion.div>

                  {/* Hover Overlay with Demo Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Button
                      onClick={(e) => { e.stopPropagation(); navigateTo(template.route); }}
                      className="bg-[#C29B43] hover:bg-[#A88434] text-white rounded-full px-6 py-3 shadow-xl"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem Demo
                    </Button>
                  </motion.div>

                  {/* Package Badge */}
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm backdrop-blur-sm shadow"
                    style={{ backgroundColor: getPackageBadgeBg(template.package), color: '#1B2A41' }}
                  >
                    {getPackageLabel(template.package)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-2">
                  <h3 className="text-2xl text-[#C29B43]" style={{ fontFamily: '"Dancing Script", cursive' }}>
                    {template.name}
                  </h3>
                  <p className="text-xs text-[#999]">{template.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-[#FAF7F2] rounded-full text-xs text-[#666]">
                        {feature.includes('Nhạc') || feature.includes('Music') ? (
                          <Music className="w-3 h-3" />
                        ) : feature.includes('Bản đồ') || feature.includes('Map') ? (
                          <MapPin className="w-3 h-3" />
                        ) : (
                          <Smartphone className="w-3 h-3" />
                        )}
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FAF7F2] rounded-full text-xs text-[#666]">
                        +{template.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-gray-400">Không tìm thấy mẫu thiệp nào</p>
          </motion.div>
        )}
      </div>

      {/* Floating Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#C29B43] hover:bg-[#A88434] text-white rounded-full shadow-lg flex items-center justify-center"
        title="Quay lại đầu trang"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

