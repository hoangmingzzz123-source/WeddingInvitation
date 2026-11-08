export type TemplateTier = '109k' | '159k' | '199k';

export const templateStyleCategories = [
  { id: 'vietnamese', label: 'Truyền thống Việt', pattern: /sen-ngoc|hy-su|hy-sac|pho-hoi|song-hy|vietnamese|lotus|traditional|heritage|hoi an/i },
  { id: 'minimal', label: 'Tối giản', pattern: /minimal|clean|eternelle|editorial/i },
  { id: 'garden', label: 'Sân vườn & hoa lá', pattern: /verdant|botanical|garden|floral|green|bloom|olive|sen-ngoc|jardin/i },
  { id: 'cinematic', label: 'Điện ảnh & vintage', pattern: /cinema|cinematic|film|vintage|dark|luxury gold|premiere/i },
  { id: 'destination', label: 'Destination', pattern: /riviera|postcard|tropical|summer|coast|azur/i },
  { id: 'illustrated', label: 'Màu nước & minh họa', pattern: /watercolor|storybook|handdrawn|playful|crystal|soft fade|love-out-loud|retro/i },
] as const;

export type TemplateStyleCategory = typeof templateStyleCategories[number]['id'];

export const REAL_WEDDING_TEMPLATE_ID = 'ha-phuong-hoang-minh-2026';
export const REAL_WEDDING_URL = 'https://mp-wedding-2026.vercel.app/';

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
  homepageFeatured?: boolean;
  realWedding?: boolean;
}

type TemplateDetails = Omit<WeddingTemplate, 'thumbnail' | 'thumbnailSrcSet'> & {
  thumbnailId?: string;
};

const templateDetails: TemplateDetails[] = [
  { id: 'sen-ngoc', name: 'Sen Ngọc', style: 'Vietnamese Lotus', description: 'Sắc ngọc bích, nét sen thanh nhã và ảnh cưới áo dài trên nền giấy ngà.', route: '/demo/sen-ngoc', thumbnailId: 'sen-ngoc', tier: '159k', features: ['Ảnh cưới Việt Nam', 'Câu chuyện', 'Album', 'RSVP'], featured: true },
  { id: 'hy-su-do-son', name: 'Hỷ Sự Đỏ Son', style: 'Vietnamese Ceremony', description: 'Thiệp hồng đỏ son, khung thiếp truyền thống và lời mời hai nhà sum họp.', route: '/demo/hy-su-do-son', thumbnailId: 'hy-su-do-son', tier: '159k', features: ['Ảnh cưới Việt Nam', 'Câu chuyện', 'Album', 'RSVP'], featured: true },
  { id: 'pho-hoi', name: 'Thương Nhau Phố Hội', style: 'Hoi An Nostalgia', description: 'Sắc vàng phố cổ, ảnh cưới hoài niệm và bố cục bưu thiếp thân tình.', route: '/demo/pho-hoi', thumbnailId: 'pho-hoi', tier: '159k', features: ['Ảnh cưới Việt Nam', 'Câu chuyện', 'Album', 'RSVP'], featured: true },
  { id: 'hy-sac-dong-phuong', name: 'Hỷ Sắc Đông Phương', style: 'Vietnamese Heritage Luxury', description: 'Phong thư đỏ son, triện Song Hỷ ánh champagne và các nghi lễ hai nhà được trình bày trang trọng.', route: '/demo/hy-sac-dong-phuong', tier: '199k', features: ['Mở phong thư tương tác', 'Lễ nghi hai nhà', 'Album', 'RSVP'], featured: true, homepageFeatured: true },
  { id: 'eternelle', name: 'Éternelle — Tình Yêu Vĩnh Cửu', style: 'Timeless Editorial', description: 'Một tạp chí cưới tối giản với ảnh đen trắng toàn khung, typography thanh mảnh và chuyển cảnh dịu nhẹ.', route: '/demo/eternelle', tier: '199k', features: ['Ảnh editorial', 'Album toàn màn hình', 'Câu chuyện', 'RSVP'], featured: true, homepageFeatured: true },
  { id: 'jardin-amour', name: "Jardin d'Amour — Khu Vườn Tình Yêu", style: 'Botanical Romance', description: 'Khu vườn vòm ivory với nhánh hoa, timeline dây leo và câu chuyện ảnh kiểu scrapbook.', route: '/demo/jardin-amour', tier: '159k', features: ['Vườn hoa tương tác', 'Timeline tình yêu', 'Album scrapbook', 'RSVP'], featured: true, homepageFeatured: true },
  { id: 'grand-premiere', name: 'The Grand Premiere', style: 'Cinematic Black Tie', description: 'Lời mời như buổi công chiếu: poster điện ảnh, các chương tình yêu và RSVP dạng vé VIP.', route: '/demo/grand-premiere', tier: '199k', features: ['Mở màn sân khấu', 'Các chương phim', 'Video', 'Vé RSVP'], featured: true, homepageFeatured: true },
  { id: 'love-out-loud', name: 'Love Out Loud — Yêu Là Phải Chất', style: 'Playful Retro Modern', description: 'Poster retro-pop sắc coral, photobooth, sticker tương tác và trò vui dành cho cặp đôi cá tính.', route: '/demo/love-out-loud', tier: '199k', features: ['Collage photobooth', 'Quiz về cặp đôi', 'Sticker tương tác', 'Vé RSVP'], featured: true, homepageFeatured: true },

  {
    id: 'verdant-veil',
    name: 'Verdant Veil',
    style: 'Verdant Veil Editorial',
    description: 'Màn xanh điện ảnh và typography thanh lịch cho một buổi hẹn giữa khu vườn. Mẫu demo riêng có thể cá nhân hóa trong Studio.',
    route: '/demo/verdant-veil',
    tier: '199k',
    features: ['Mở thiệp điện ảnh', 'Album', 'RSVP nâng cao', 'Âm nhạc'],
    featured: true,
  },
  {
    id: 'tui-minh-cuoi-roi',
    name: 'Tụi Mình Cưới Rồi!',
    style: 'Playful Hand-drawn',
    description: 'Thiệp vẽ tay trẻ trung với timeline buổi tiệc, dress code, thực đơn và hồi âm vui nhộn.',
    route: '/demo/tui-minh-cuoi-roi',
    tier: '199k',
    features: ['Minh họa vẽ tay', 'Timeline', 'Dress code', 'RSVP nâng cao'],
    featured: true,
    homepageFeatured: true,
  },
  {
    id: 'luxury-gold-cinematic',
    name: 'Luxury Gold Cinematic',
    style: 'Cinematic Luxury',
    route: '/demo/luxury-gold-cinematic',
    tier: '159k',
    features: ['Câu chuyện', 'Album', 'Bản đồ', 'RSVP'],
    description: 'Bố cục điện ảnh trên nền tối, điểm ánh vàng và hình ảnh giàu cảm xúc.',
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
    homepageFeatured: true,
  },
  {
    id: 'art-deco-royal',
    name: 'Olive Garden Editorial',
    style: 'Botanical Editorial',
    route: '/demo/art-deco-royal',
    tier: '199k',
    features: ['Ảnh cưới làm trọng tâm', 'Câu chuyện', 'Video & lưu bút', 'RSVP'],
    description: 'Chủ đề vườn olive với ảnh vòm, bảng màu ivory–sage và tiện ích Diamond.',
    featured: true,
    homepageFeatured: true,
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
    homepageFeatured: true,
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
    id: 'song-hy-contemporary',
    name: 'Song Hỷ Đương Đại',
    style: 'Vietnamese Contemporary',
    route: '/demo/song-hy-contemporary',
    tier: '159k',
    features: ['Dấu ấn Song Hỷ', 'Câu chuyện', 'Album', 'RSVP nâng cao'],
    description: 'Giấy ngà, sắc đỏ son và biểu tượng Song Hỷ được tiết chế theo phong cách hiện đại.',
    featured: true,
    homepageFeatured: true,
  },
  {
    id: 'riviera-blue',
    name: 'Riviera Blue',
    style: 'Mediterranean Editorial',
    route: '/demo/riviera-blue',
    tier: '109k',
    features: ['Xanh Riviera', 'Thông tin lễ cưới', 'Album cơ bản', 'RSVP'],
    description: 'Thiệp xanh biển thanh thoát, gợi không khí tiệc cưới bên bờ Địa Trung Hải.',
    featured: true,
  },
  {
    id: 'hoa-moc-editorial',
    name: 'Hoa Mộc Editorial',
    style: 'Soft Botanical',
    route: '/demo/hoa-moc-editorial',
    tier: '159k',
    features: ['Hoa lá tối giản', 'Câu chuyện', 'Album', 'RSVP nâng cao'],
    description: 'Sắc đào phấn và xanh lá dịu, kết hợp bố cục tạp chí dành cho tiệc cưới sân vườn.',
    featured: true,
  },
  {
    id: 'summer-postcard',
    name: 'Summer Postcard',
    style: 'Destination Postcard',
    route: '/demo/summer-postcard',
    tier: '199k',
    features: ['Thiệp phong cách postcard', 'Album & video', 'Mừng cưới demo', 'Sổ lưu bút'],
    description: 'Một tấm bưu thiếp mùa hè kể chuyện ngày cưới bằng ảnh, video và lời chúc.',
    featured: true,
  },
  {
    id: 'bloom-crystal-3d',
    name: 'Bloom Crystal 3D',
    style: '3D Crystal',
    route: '/demo/bloom-crystal-3d',
    tier: '199k',
    features: ['Album', 'Video cưới', 'Mừng cưới demo', 'Sổ lưu bút'],
    description: 'Khung ảnh vòm, sắc tím pha lê và các tiện ích tương tác của gói Diamond.',
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
    features: ['Navy', 'Album cơ bản', 'Bản đồ', 'RSVP'],
    description: 'Tông xanh navy hiện đại, mạnh mẽ nhưng vẫn thanh lịch.',
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    style: 'Luxury Minimal',
    route: '/demo/minimal-elegant',
    tier: '199k',
    features: ['Tối giản', 'Video cưới', 'Album', 'Sổ lưu bút'],
    description: 'Khoảng trắng rộng, typography editorial và trải nghiệm Diamond đầy đủ.',
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
    name: 'Olive Garden Editorial · Essential',
    style: 'Botanical Editorial',
    route: '/demo/art-deco-royal-basic',
    tier: '159k',
    features: ['Ảnh cưới làm trọng tâm', 'Câu chuyện', 'Album', 'RSVP nâng cao'],
    description: 'Phiên bản tinh gọn theo phong cách vườn olive, có chuyện tình yêu và album.',
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

function modernPreviewFor(template: TemplateDetails) {
  const normalized = template.id.toLocaleLowerCase('vi');
  const showcasePreviews: Record<string, string> = {
    'hy-sac-dong-phuong': 'ao-dai-00',
    eternelle: 'atelier-01',
    'jardin-amour': 'coast-02',
    'grand-premiere': 'city-03',
    'love-out-loud': 'coast-00',
  };
  if (showcasePreviews[normalized]) {
    return `/images/vietnam-modern/${showcasePreviews[normalized]}.webp`;
  }
  const story = /(traditional|song-hy|hy-su|sen-ngoc|pho-hoi|hy-sac)/.test(normalized)
    ? 'ao-dai'
    : /(riviera|summer|tropical|azur|jardin)/.test(normalized)
      ? 'coast'
      : /(cinema|cinematic|dark|gold|vintage|premiere)/.test(normalized)
        ? 'city'
        : 'atelier';
  const index = [...template.id].reduce((total, character) => total + character.charCodeAt(0), 0) % 4;
  return `/images/vietnam-modern/${story}-${String(index).padStart(2, '0')}.webp`;
}

const dedicatedTemplateThumbnailIds = new Set([
  'art-deco-royal', 'art-deco-royal-basic', 'bloom-crystal-3d', 'bloom-crystal-3d-basic',
  'blush-floral', 'burgundy-cinema-219k', 'cinematic-love-story', 'classic-minimalist',
  'green-elegance', 'ha-phuong-hoang-minh-2026', 'hoa-moc-editorial', 'hy-su-do-son',
  'luxury-gold-cinematic', 'luxury-gold-frame', 'minimal-elegant', 'minimal-elegant-basic',
  'minimal-slide-clean', 'modern-dark-blue', 'pho-hoi', 'riviera-blue', 'romantic-watercolor',
  'rose-storybook-219k', 'sen-ngoc', 'soft-fade-floral', 'song-hy-contemporary',
  'summer-postcard', 'tropical-sunset', 'vietnamese-traditional', 'vietnamese-traditional-219k',
  'vintage-film', 'vintage-grain',
]);

export const weddingTemplates: WeddingTemplate[] = templateDetails.map((template) => {
  const { thumbnailId = template.id, ...details } = template;
  if (template.route && dedicatedTemplateThumbnailIds.has(thumbnailId)) {
    return {
      ...details,
      thumbnail: `/images/templates/${thumbnailId}-800.webp`,
      thumbnailSrcSet: `/images/templates/${thumbnailId}-480.webp 480w, /images/templates/${thumbnailId}-800.webp 800w`,
    };
  }
  if (template.route) {
    return {
      ...details,
      thumbnail: modernPreviewFor(template),
    };
  }
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

export function templateStyleCategoryIds(template: WeddingTemplate): TemplateStyleCategory[] {
  const searchText = [template.id, template.name, template.style, template.description, ...template.features].join(' ');
  return templateStyleCategories
    .filter((category) => category.pattern.test(searchText))
    .map((category) => category.id);
}

export const isExternalTemplate = (template: WeddingTemplate) => Boolean(template.externalUrl);
