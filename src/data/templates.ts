export type TemplateTier = '109k' | '159k' | '199k';

export interface WeddingTemplate {
  id: string;
  name: string;
  style: string;
  description: string;
  thumbnail: string;
  thumbnailSrcSet?: string;
  tier: TemplateTier;
  features: string[];
  route?: string;
  externalUrl?: string;
  featured?: boolean;
  realWedding?: boolean;
}

type TemplateDetails = Omit<WeddingTemplate, 'thumbnail' | 'thumbnailSrcSet'> & {
  thumbnailId?: string;
};

const templateDetails: TemplateDetails[] = [
  {
    id: 'ha-phuong-hoang-minh-2026',
    name: 'Hà Phương & Hoàng Minh 2026',
    style: 'Cinematic Vietnamese',
    description: 'Mẫu thiệp thực tế với trải nghiệm mở thiệp, album, RSVP và âm nhạc.',
    externalUrl: 'https://mp-wedding-2026.vercel.app/',
    tier: '199k',
    features: ['Mở thiệp tương tác', 'Album', 'RSVP', 'Âm nhạc'],
    featured: true,
    realWedding: true,
  },
  {
    id: 'luxury-gold-cinematic',
    name: 'Luxury Gold Cinematic',
    style: 'Cinematic Luxury',
    route: '/demo/luxury-gold-cinematic',
    tier: '159k',
    features: ['7 trang', 'RSVP', 'QR Code', 'Âm nhạc'],
    description: 'Thiết kế điện ảnh với ánh vàng tinh tế và chuyển động cao cấp.',
    featured: true,
  },
  {
    id: 'luxury-gold-frame',
    name: 'Luxury Gold Frame',
    style: 'Editorial Luxury',
    route: '/demo/luxury-gold-frame',
    tier: '159k',
    features: ['Timeline', 'Album', 'Bản đồ', 'RSVP'],
    description: 'Bố cục tạp chí cùng khung viền vàng sang trọng.',
    featured: true,
  },
  {
    id: 'vintage-film',
    name: 'Vintage Film Cinematic',
    style: 'Vintage Film',
    route: '/demo/vintage-film',
    tier: '159k',
    features: ['Film grain', 'Typewriter', 'Album', 'Âm nhạc'],
    description: 'Không khí phim hoài niệm dành cho một câu chuyện tình yêu có chiều sâu.',
    featured: true,
  },
  {
    id: 'art-deco-royal',
    name: 'Art Deco Royal',
    style: 'Art Deco',
    route: '/demo/art-deco-royal',
    tier: '199k',
    features: ['Art Deco', 'RSVP', 'Âm nhạc', 'Hiệu ứng'],
    description: 'Họa tiết hình học và sắc vàng hoàng gia đầy ấn tượng.',
    featured: true,
  },
  {
    id: 'romantic-watercolor',
    name: 'Romantic Watercolor',
    style: 'Vietnamese Watercolor',
    route: '/demo/romantic-watercolor',
    tier: '159k',
    features: ['Màu nước', 'Truyền thống', 'Album'],
    description: 'Chất liệu màu nước dịu dàng hòa cùng tinh thần cưới Việt.',
    featured: true,
  },
  {
    id: 'cinematic-love-story',
    name: 'Cinematic Love Story',
    style: 'Cinematic Film',
    route: '/demo/cinematic-love-story',
    tier: '199k',
    features: ['Love story', 'Scroll animation', 'Video'],
    description: 'Kể chuyện tình yêu theo từng chương với hiệu ứng điện ảnh.',
    featured: true,
  },
  {
    id: 'bloom-crystal-3d',
    name: 'Bloom Crystal 3D',
    style: '3D Crystal',
    route: '/demo/bloom-crystal-3d',
    tier: '199k',
    features: ['3D', 'Parallax', 'Album'],
    description: 'Hoa pha lê và hiệu ứng chiều sâu tạo nên trải nghiệm thị giác nổi bật.',
  },
  {
    id: 'bloom-crystal-3d-basic',
    name: 'Bloom Crystal 3D Basic',
    style: '3D Minimal',
    route: '/demo/bloom-crystal-3d-basic',
    tier: '159k',
    features: ['3D', 'Album'],
    description: 'Phiên bản gọn nhẹ của Bloom Crystal với hiệu ứng 3D vừa đủ.',
  },
  {
    id: 'modern-dark-blue',
    name: 'Modern Dark Blue',
    style: 'Modern Dark',
    route: '/demo/modern-dark-blue',
    tier: '109k',
    features: ['Dark theme', 'Hiện đại', 'Responsive'],
    description: 'Tông xanh navy hiện đại, mạnh mẽ nhưng vẫn thanh lịch.',
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    style: 'Luxury Minimal',
    route: '/demo/minimal-elegant',
    tier: '199k',
    features: ['Tối giản', 'Album', 'Chuyển động'],
    description: 'Khoảng trắng rộng và typography tinh tế theo phong cách editorial.',
  },
  {
    id: 'minimal-elegant-basic',
    name: 'Minimal Elegant Basic',
    style: 'Clean Minimal',
    route: '/demo/minimal-elegant-basic',
    tier: '159k',
    features: ['Tối giản', 'Album'],
    description: 'Thiết kế sạch, dễ đọc và phù hợp nhiều phong cách ảnh cưới.',
  },
  {
    id: 'minimal-slide-clean',
    name: 'Minimal Slide Clean',
    style: 'Modern Clean',
    route: '/demo/minimal-slide-clean',
    tier: '109k',
    features: ['Slide', 'Clean UI', 'Tải nhanh'],
    description: 'Trải nghiệm dạng slide gọn gàng, trực quan trên điện thoại.',
  },
  {
    id: 'tropical-sunset',
    name: 'Tropical Sunset',
    style: 'Tropical',
    route: '/demo/tropical-sunset',
    tier: '199k',
    features: ['Nhiệt đới', 'Sắc màu', 'Tương tác'],
    description: 'Bảng màu hoàng hôn rực rỡ cho lễ cưới trẻ trung và phóng khoáng.',
  },
  {
    id: 'classic-minimalist',
    name: 'Classic Minimalist',
    style: 'Classic Minimal',
    route: '/demo/classic-minimalist',
    tier: '109k',
    features: ['Cổ điển', 'Đơn giản', 'Responsive'],
    description: 'Bố cục cổ điển, tối giản và bền vững theo thời gian.',
  },
  {
    id: 'blush-floral',
    name: 'Blush Floral',
    style: 'Floral Pastel',
    route: '/demo/blush-floral',
    tier: '109k',
    features: ['Hoa lá', 'Pastel', 'Album'],
    description: 'Hoa văn mềm mại với sắc hồng pastel lãng mạn.',
  },
  {
    id: 'soft-fade-floral',
    name: 'Soft Fade Floral',
    style: 'Soft Watercolor',
    route: '/demo/soft-fade-floral',
    tier: '109k',
    features: ['Fade', 'Hoa lá', 'Âm nhạc'],
    description: 'Chuyển màu nhẹ và hoa văn tinh tế cho cảm giác trong trẻo.',
  },
  {
    id: 'vietnamese-traditional',
    name: 'Vietnamese Traditional',
    style: 'Traditional Luxury',
    route: '/demo/vietnamese-traditional',
    tier: '199k',
    features: ['Song Hỷ', 'Gia đình hai bên', 'Đỏ vàng'],
    description: 'Tinh thần truyền thống Việt được thể hiện theo ngôn ngữ hiện đại.',
  },
  {
    id: 'vintage-grain',
    name: 'Vintage Grain',
    style: 'Retro Film',
    route: '/demo/vintage-grain',
    tier: '109k',
    features: ['Vintage', 'Film grain', 'Retro'],
    description: 'Hiệu ứng hạt phim tạo cảm giác gần gũi như một thước phim cũ.',
  },
  {
    id: 'green-elegance',
    name: 'Green Elegance',
    style: 'Botanical',
    route: '/demo/green-elegance',
    tier: '109k',
    features: ['Xanh lá', 'Thiên nhiên', 'Tối giản'],
    description: 'Sắc xanh tự nhiên dành cho tiệc cưới sân vườn thanh lịch.',
  },
  {
    id: 'art-deco-royal-basic',
    name: 'Art Deco Royal Basic',
    style: 'Art Deco',
    route: '/demo/art-deco-royal-basic',
    tier: '159k',
    features: ['Art Deco', 'Trang nhã'],
    description: 'Phiên bản tinh gọn của phong cách Art Deco hoàng gia.',
  },
  {
    id: 'rose-storybook-219k',
    name: 'Rose Storybook',
    style: 'Romantic Rose',
    route: '/demo/rose-storybook-219k',
    thumbnailId: 'blush-floral',
    tier: '199k',
    features: ['Câu chuyện tình yêu', 'Album', 'Video cưới', 'RSVP'],
    description: 'Thiệp tông hồng kể câu chuyện tình yêu qua album, video và lời mời dự tiệc.',
  },
  {
    id: 'vietnamese-traditional-219k',
    name: 'Nét Việt Truyền Thống',
    style: 'Vietnamese Heritage',
    route: '/demo/vietnamese-traditional-219k',
    thumbnailId: 'vietnamese-traditional',
    tier: '199k',
    features: ['Song Hỷ', 'Bản đồ', 'Mừng cưới QR', 'Lời chúc'],
    description: 'Sắc đỏ và vàng trang trọng, kết hợp nghi thức cưới Việt cùng tiện ích khách mời.',
  },
  {
    id: 'burgundy-cinema-219k',
    name: 'Burgundy Cinema',
    style: 'Cinematic Romance',
    route: '/demo/burgundy-cinema-219k',
    thumbnailId: 'luxury-gold-cinematic',
    tier: '199k',
    features: ['Mở thiệp điện ảnh', 'Album & video', 'Guestbook', 'RSVP'],
    description: 'Trải nghiệm màu đỏ burgundy như một thước phim, với album, guestbook và RSVP.',
  },
];

export const weddingTemplates: WeddingTemplate[] = templateDetails.map((template) => {
  const { thumbnailId = template.id, ...details } = template;
  return {
    ...details,
    thumbnail: `/images/templates/${thumbnailId}-800.webp`,
    thumbnailSrcSet: `/images/templates/${thumbnailId}-480.webp 480w, /images/templates/${thumbnailId}-800.webp 800w`,
  };
});

export const templateTierLabels: Record<TemplateTier, string> = {
  '109k': 'Gói 109K',
  '159k': 'Gói 159K',
  '199k': 'Gói 199K',
};

export const isExternalTemplate = (template: WeddingTemplate) => Boolean(template.externalUrl);
