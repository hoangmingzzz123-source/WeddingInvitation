# Wedding Invitation MP

Website giới thiệu dịch vụ và thư viện mẫu thiệp cưới online, xây dựng bằng React, TypeScript và Vite.

## Tính năng chính

- Trang giới thiệu dịch vụ, bảng giá và CTA liên hệ.
- Thư viện mẫu có tìm kiếm, lọc theo gói và responsive trên mobile/desktop.
- Hơn 20 demo thiệp với nhiều phong cách: tối giản, điện ảnh, truyền thống, Art Deco, 3D.
- Hỗ trợ cả demo nội bộ và sample website bên ngoài.
- Lazy-load từng demo để giảm bundle tải ban đầu.
- Tôn trọng thiết lập `prefers-reduced-motion` của người dùng.

## Chạy dự án

Yêu cầu Node.js 18+.

```bash
npm ci
npm run dev
```

Kiểm tra trước khi deploy:

```bash
npm run typecheck
npm run build
```

Thư mục build là `build/` và được tạo tự động, không commit vào Git.

## Cấu trúc quan trọng

```text
src/
├── components/
│   ├── demos/              # Các mẫu thiệp nội bộ
│   ├── TemplateCard.tsx    # Card dùng chung cho catalog
│   ├── TemplateGallery.tsx # Danh sách nổi bật ở trang chủ
│   └── TemplatesPage.tsx   # Toàn bộ thư viện mẫu
├── data/templates.ts       # Nguồn dữ liệu duy nhất của catalog
├── styles/site.css         # UI/UX cho trang chủ và catalog
└── Router.tsx              # Router và lazy-load demo
```

## Thêm một mẫu mới

Khai báo mẫu trong `src/data/templates.ts`.

Mẫu nội bộ dùng `route`:

```ts
{
  id: 'new-template',
  name: 'New Template',
  route: '/demo/new-template',
  // ...
}
```

Sau đó thêm lazy import và route tương ứng trong `src/Router.tsx`.

Sample đã deploy ở nơi khác dùng `externalUrl`:

```ts
{
  id: 'real-wedding',
  name: 'Real Wedding',
  externalUrl: 'https://example.com/',
  realWedding: true,
  // ...
}
```

Liên kết ngoài tự mở trong tab mới với `noopener noreferrer`.

## Deploy

Repository đã có `vercel.json` để mọi route SPA được rewrite về `index.html`. Kết nối repository với Vercel và sử dụng:

- Build command: `npm run build`
- Output directory: `build`
