import type { TemplateTier } from './templates';

export interface WeddingPackage {
  id: TemplateTier;
  name: string;
  price: string;
  color: string;
  summary: string;
  features: string[];
  popular?: boolean;
}

export const weddingPackages: WeddingPackage[] = [
  {
    id: '109k',
    name: 'Basic Elegant',
    price: '109.000đ',
    color: '#F8E7EA',
    summary: 'Đủ đầy những thông tin cần thiết trong một thiết kế trang nhã.',
    features: [
      '01 trang thiệp đơn giản',
      'Tối đa 10 hình ảnh',
      'Form xác nhận khách mời cơ bản',
      'Bản đồ Google Maps',
      'Hiệu ứng nhẹ nhàng',
      'Nhạc nền có sẵn',
      'Tùy chỉnh màu sắc cơ bản',
      'Chia sẻ qua link & QR',
    ],
  },
  {
    id: '159k',
    name: 'Premium Interactive',
    price: '159.000đ',
    color: '#E7EDF7',
    summary: 'Thêm không gian kể chuyện, album lớn hơn và phản hồi tiện lợi.',
    features: [
      '03 trang thiệp đầy đủ',
      'Tối đa 30 hình ảnh',
      'Form xác nhận khách mời nâng cao + Email',
      'Hiệu ứng hoạt hình nâng cao',
      'Upload nhạc nền riêng',
      'Nút chia sẻ Zalo/Messenger',
      'Thiết kế theo chủ đề',
      'Tùy chỉnh font chữ',
    ],
    popular: true,
  },
  {
    id: '199k',
    name: 'Diamond Premium',
    price: '199.000đ',
    color: '#FFF4D3',
    summary: 'Một trải nghiệm nhiều lớp với video, lời chúc và quà mừng online.',
    features: [
      '05 trang thiệp cao cấp',
      'Album ảnh không giới hạn',
      'Video cưới nhúng',
      'Mừng cưới online - QR Banking',
      'Guestbook với sticker',
      'Hiệu ứng 3D & Animation',
      'Thiết kế concept riêng',
      'Cá nhân hóa hoàn toàn',
    ],
  },
];

export const getWeddingPackage = (tier: TemplateTier) =>
  weddingPackages.find((item) => item.id === tier)!;
