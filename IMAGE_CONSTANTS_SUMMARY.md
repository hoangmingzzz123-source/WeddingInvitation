# Image Constants Refactoring - Summary

## Overview
Tất cả các link ảnh (URLs) trong ứng dụng đã được trích xuất và tập trung vào một file **constants** duy nhất để dễ quản lý và bảo trì.

## File Tạo Mới
📁 **src/utils/imageConstants.ts**

Đây là file chứa tất cả các constants cho link ảnh, được tổ chức theo từng loại:

### Các Nhóm Constants

1. **GALLERY_IMAGES** - Ảnh phòng chụp chính
   - `studio_couple` - Ảnh studio cặp đôi
   - `tuarts_couple_1`, `tuarts_couple_2`, `tuarts_couple_3` - Ảnh từ TUARTS
   - `encrypted_couple` - Ảnh cặp đôi từ Google Images
   - `demxanh_studio` - Ảnh từ DemXanh
   - `tuarts_bride` - Ảnh cô dâu

2. **HERO_IMAGES** - Ảnh hero section trên trang chủ
   - `banner` - Banner chính của website

3. **TEMPLATE_GALLERY_IMAGES** - Ảnh dùng cho template gallery
   - Tất cả ảnh đại diện cho các template cưới

4. **TESTIMONIAL_AVATARS** - Ảnh avatar khách hàng
   - `bride_1`, `groom_1`, `couple_1`

5. **UNSPLASH_IMAGES** - Ảnh từ Unsplash API
   - Story chapters (storyChapter1-4)
   - Gallery images từ Unsplash
   - Wedding venue, decoration, ceremony ảnh

6. **DEMO1_GALLERY_IMAGES** - Ảnh demo chuyên dụng
   - Ảnh dành cho Demo1 gallery

7. **CLASSIC_MINIMALIST_IMAGES** - Ảnh template Classic Minimalist
8. **SPECIAL_TEMPLATE_IMAGES** - Ảnh cho các template đặc biệt

### Helper Functions
- `getGalleryImages(count)` - Lấy N ảnh từ gallery
- `getLoveStoryImages()` - Lấy ảnh cho love story

## Files Được Cập Nhật

### Components (src/components/)
✅ `TemplateGallery.tsx` - 14 ảnh template
✅ `Testimonials.tsx` - 3 ảnh avatar
✅ `HeroSection.tsx` - Banner ảnh
✅ `demos/BloomCrystal3D.tsx` - 7 ảnh gallery
✅ `demos/CinematicLoveStory.tsx` - Story timeline + gallery
✅ `demos/VietnameseTraditional.tsx` - 6 ảnh gallery

### Demo Files (src/Demo/Demo219k/)
✅ `Traditional/components/AlbumSection.tsx` - 6 ảnh album
✅ `Cinema/components/PhotoAlbumSection.tsx` - 8 ảnh album
✅ `Demo1/components/Gallery.tsx` - 9 ảnh gallery

## Cách Sử Dụng

### Import
```typescript
import { GALLERY_IMAGES, UNSPLASH_IMAGES, TEMPLATE_GALLERY_IMAGES } from '../../utils/imageConstants';
```

### Sử dụng trong code
```typescript
const images = [
  GALLERY_IMAGES.studio_couple,
  GALLERY_IMAGES.tuarts_couple_1,
  UNSPLASH_IMAGES.storyChapter1,
];

// Hoặc sử dụng helper function
const galleryPhotos = getGalleryImages(6);
```

## Lợi Ích

1. **Quản lý Tập Trung** - Tất cả link ảnh ở một chỗ, dễ tìm và sửa
2. **Dễ Bảo Trì** - Thay đổi link chỉ cần sửa ở file constants, không cần sửa từng component
3. **Giảm Duplicate Code** - Ảnh được dùng nhiều chỗ chỉ cần định nghĩa một lần
4. **Type Safety** - TypeScript giúp phát hiện lỗi import sớm
5. **Dễ Thêm Mới** - Chỉ cần thêm constant mới vào file

## Ví Dụ Thay Đổi

### Trước
```typescript
const images = [
  'https://2hstudio.vn/wp-content/uploads/2024/11/TL_03683-scaled.webp',
  'https://tuarts.net/wp-content/uploads/2015/12/117937145_4255715104503639_2707126124250519806_o.jpg',
];
```

### Sau
```typescript
import { GALLERY_IMAGES } from '../../utils/imageConstants';

const images = [
  GALLERY_IMAGES.studio_couple,
  GALLERY_IMAGES.tuarts_couple_1,
];
```

## Danh Sách URL Được Quản Lý

Tổng cộng **25+ URL** được tổ chức trong constants, bao gồm:
- 7 ảnh studio từ các nhà chụp ảnh cưới
- 20+ ảnh từ Unsplash
- 3 ảnh avatar
- 1 banner hero

## Ghi Chú
- Tất cả import paths đã được điều chỉnh cho phù hợp với cấp độ thư mục
- Không có file nào bị xóa, chỉ là tách link ra constants
- Tất cả test pass, không có compilation error
