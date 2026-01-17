import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Filter, Star, Clock, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { navigateTo } from '../Router';

type PackageType = 'all' | 'free' | 'basic' | 'premium';

interface Template {
  id: string;
  name: string;
  route: string;
  thumbnail: string;
  package: 'free' | 'basic' | 'premium';
  features: string[];
  description: string;
}

export function TemplatesPage() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('all');

  const templates: Template[] = [
    {
      id: 'luxury-gold-cinematic',
      name: 'Luxury Gold Cinematic',
      route: '/demo/luxury-gold-cinematic',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      package: 'premium',
      features: ['7 Pages', 'RSVP Form', 'QR Code', 'Music Player', 'Custom Music'],
      description: 'Thiết kế sang trọng với hiệu ứng vàng ánh kim cao cấp'
    },
    {
      id: 'luxury-gold-frame',
      name: 'Luxury Gold Frame',
      route: '/demo/luxury-gold-frame',
      thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      package: 'premium',
      features: ['6 Pages', 'Timeline', 'Gallery', 'Map', 'RSVP', 'QR'],
      description: 'Template vàng gold với khung viền sang trọng'
    },
    {
      id: 'vintage-film',
      name: 'Vintage Film Cinematic',
      route: '/demo/vintage-film',
      thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      package: 'premium',
      features: ['Film Effect', 'Typewriter', 'Gallery', 'Music'],
      description: 'Phong cách điện ảnh cổ điển với hiệu ứng film vintage'
    },
    {
      id: 'art-deco-royal',
      name: 'Art Deco Royal',
      route: '/demo/art-deco-royal',
      thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
      package: 'premium',
      features: ['Art Deco Design', 'Elegant', 'RSVP', 'Music'],
      description: 'Thiết kế Art Deco hoàng gia sang trọng'
    },
    {
      id: 'romantic-watercolor',
      name: 'Romantic Watercolor',
      route: '/demo/romantic-watercolor',
      thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
      package: 'premium',
      features: ['Traditional', 'Watercolor', 'Vietnamese Style'],
      description: 'Phong cách truyền thống Việt Nam với hiệu ứng màu nước'
    },
    {
      id: 'bloom-crystal-3d',
      name: 'Bloom Crystal 3D',
      route: '/demo/bloom-crystal-3d',
      thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
      package: 'basic',
      features: ['3D Effects', 'Parallax', 'Gallery'],
      description: 'Hiệu ứng 3D pha lê với animation đẹp mắt'
    },
    {
      id: 'modern-dark-blue',
      name: 'Modern Dark Blue',
      route: '/demo/modern-dark-blue',
      thumbnail: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800',
      package: 'basic',
      features: ['Modern', 'Dark Theme', 'Elegant'],
      description: 'Thiết kế hiện đại với tông màu xanh đậm sang trọng'
    },
    {
      id: 'minimal-elegant',
      name: 'Minimal Elegant',
      route: '/demo/minimal-elegant',
      thumbnail: 'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=800',
      package: 'basic',
      features: ['Minimalist', 'Clean', 'Simple'],
      description: 'Phong cách tối giản thanh lịch'
    },
    {
      id: 'tropical-sunset',
      name: 'Tropical Sunset',
      route: '/demo/tropical-sunset',
      thumbnail: 'https://images.unsplash.com/photo-1519167758481-83f29da8c796?w=800',
      package: 'free',
      features: ['Beach Theme', 'Colorful', 'Fun'],
      description: 'Chủ đề nhiệt đới với hoàng hôn rực rỡ'
    },
    {
      id: 'classic-minimalist',
      name: 'Classic Minimalist',
      route: '/demo/classic-minimalist',
      thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      package: 'free',
      features: ['Classic', 'Simple', 'Timeless'],
      description: 'Thiết kế cổ điển tối giản vượt thời gian'
    },
    {
      id: 'blush-floral',
      name: 'Blush Floral',
      route: '/demo/blush-floral',
      thumbnail: 'https://images.unsplash.com/photo-1525258409922-4ab6903f0a47?w=800',
      package: 'free',
      features: ['Floral', 'Romantic', 'Soft Colors'],
      description: 'Hoa văn lãng mạn với tông màu hồng nhẹ nhàng'
    },
    {
      id: 'soft-fade-floral',
      name: 'Soft Fade Floral',
      route: '/demo/soft-fade-floral',
      thumbnail: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',
      package: 'free',
      features: ['Soft', 'Fade Effect', 'Elegant'],
      description: 'Hiệu ứng mờ dần nhẹ nhàng với hoa văn thanh lịch'
    },
  ];

  const packages = [
    { 
      id: 'all' as const, 
      label: 'Tất Cả', 
      icon: Filter,
      count: templates.length 
    },
    { 
      id: 'free' as const, 
      label: 'Miễn Phí', 
      icon: Zap,
      count: templates.filter(t => t.package === 'free').length 
    },
    { 
      id: 'basic' as const, 
      label: 'Cơ Bản', 
      icon: Clock,
      count: templates.filter(t => t.package === 'basic').length 
    },
    { 
      id: 'premium' as const, 
      label: 'Cao Cấp', 
      icon: Star,
      count: templates.filter(t => t.package === 'premium').length 
    },
  ];

  const filteredTemplates = selectedPackage === 'all' 
    ? templates 
    : templates.filter(t => t.package === selectedPackage);

  const getPackageBadgeColor = (pkg: string) => {
    switch (pkg) {
      case 'premium':
        return 'from-[#FFD700] to-[#FFA500]';
      case 'basic':
        return 'from-[#4A90E2] to-[#357ABD]';
      case 'free':
        return 'from-[#6B7280] to-[#4B5563]';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getPackageLabel = (pkg: string) => {
    switch (pkg) {
      case 'premium':
        return 'Cao Cấp';
      case 'basic':
        return 'Cơ Bản';
      case 'free':
        return 'Miễn Phí';
      default:
        return pkg;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-white to-[#FFF0F5]">
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
            <h1 className="text-2xl font-bold text-pink-600">
              Tất Cả Mẫu Thiệp
            </h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <motion.button
                key={pkg.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`
                  relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all
                  ${selectedPackage === pkg.id
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-300'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{pkg.label}</span>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-bold
                    ${selectedPackage === pkg.id ? 'bg-white/20' : 'bg-gray-100'}
                  `}>
                    {pkg.count}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Templates Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPackage}
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
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-pink-300"
              >
                {/* Package Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`
                    px-4 py-2 rounded-full text-white font-bold text-sm
                    bg-gradient-to-r ${getPackageBadgeColor(template.package)}
                    shadow-lg
                  `}>
                    {getPackageLabel(template.package)}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/20 transition-all duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
                    {template.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{template.features.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => navigateTo(template.route)}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Xem Demo
                  </Button>
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
    </div>
  );
}
