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
    color: '#EDF1E8',
    summary: 'Lời mời tinh gọn, dễ đọc và tiện chia sẻ trên điện thoại.',
    features: [
      '01 trang cuộn, tối ưu điện thoại',
      'Album cơ bản · tối đa 10 ảnh',
      'RSVP Có / Không & bản đồ Google Maps',
      'Nhạc nền có sẵn',
      '3 bảng màu & ảnh bìa riêng',
      'Link thiệp chung · QR khi xuất bản',
    ],
  },
  {
    id: '159k',
    name: 'Premium Interactive',
    price: '159.000đ',
    color: '#E9EDF2',
    summary: 'Kể câu chuyện của hai bạn với album phong phú và RSVP chi tiết.',
    features: [
      'Nhiều phần nội dung & chuyện tình yêu',
      'Album mở rộng · tối đa 30 ảnh',
      'Link riêng từng khách · lời chào cá nhân hóa',
      'RSVP số khách · xe đưa đón · chế độ ăn',
      'Tải nhạc riêng & chọn kiểu chữ',
      'Album phóng to & chuyển động tinh tế',
      'Bảng theo dõi phản hồi khách mời',
    ],
    popular: true,
  },
  {
    id: '199k',
    name: 'Diamond Premium',
    price: '199.000đ',
    color: '#F3EDE2',
    summary: 'Một trải nghiệm giàu cảm xúc với video, lưu bút và quà mừng online.',
    features: [
      'Trải nghiệm nhiều lớp theo concept riêng',
      'Album ảnh không giới hạn',
      'Video cưới & sổ lưu bút có sticker',
      'QR mừng cưới online',
      'Xuất danh sách khách mời CSV',
      'Tổng hợp số khách và phản hồi RSVP',
      'Chuyển động nâng cao',
      'Cá nhân hóa thiết kế',
    ],
  },
];

export const getWeddingPackage = (tier: TemplateTier) =>
  weddingPackages.find((item) => item.id === tier)!;
