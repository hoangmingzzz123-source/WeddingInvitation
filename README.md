# Wedding Invitation MP

Website giới thiệu dịch vụ và thư viện mẫu thiệp cưới online, xây dựng bằng React, TypeScript và Vite.

## Tính năng chính

- Trang giới thiệu dịch vụ, bảng giá và CTA liên hệ.
- Thư viện mẫu có tìm kiếm, lọc theo gói và responsive trên mobile/desktop.
- Hơn 20 demo thiệp với nhiều phong cách: tối giản, điện ảnh, truyền thống, Art Deco, 3D.
- Hỗ trợ cả demo nội bộ và sample website bên ngoài.
- CTA tạo thiệp có hai luồng: gửi yêu cầu vào hệ thống quản trị hoặc tự tạo demo online.
- Studio demo online hỗ trợ xem trước trực tiếp, 3 theme, ảnh cover tuyển chọn, danh sách khách và link mời cá nhân hóa.
- RSVP demo có câu hỏi xe đưa đón/chế độ ăn, bảng phản hồi và xuất CSV ở gói Diamond.
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
│   ├── TemplatesPage.tsx   # Toàn bộ thư viện mẫu
│   ├── InvitationCreator.tsx       # Form tạo demo và trang preview chia sẻ
│   └── InvitationCreationDialog.tsx # Hộp chọn luồng tạo thiệp
├── data/templates.ts       # Nguồn dữ liệu duy nhất của catalog
├── styles/site.css         # UI/UX cho trang chủ và catalog
└── Router.tsx              # Router và lazy-load demo
```

## Luồng tạo demo online

- `/tao-thiep`: nhập thông tin, chọn phong cách và xem trước theo thời gian thực.
- `/tao-thiep/preview?data=...`: bản demo có thể chia sẻ bằng link, không cần backend.
- Link riêng có `guestId` và tên người nhận; dữ liệu danh sách khách không được nhúng vào link của khách.
- Bản nháp, danh sách khách và RSVP được lưu trong `localStorage` trên trình duyệt hiện tại. RSVP từ thiết bị khác chưa đồng bộ; cần kết nối API/cơ sở dữ liệu trước khi dùng như dịch vụ thực tế.
- Gói 159K mở link khách riêng, số người và câu hỏi RSVP thêm. Gói 199K có thêm xuất CSV.

## Quản trị khách hàng và demo riêng

Hệ thống có khu vực quản trị nội bộ tại `/admin/login`, dùng Supabase Auth + PostgreSQL RLS để:

- Quản lý khách hàng nhận từ form website hoặc nhập thủ công.
- Chọn mẫu và tạo link preview riêng có token/hạn dùng.
- Hiển thị popup xác nhận đây là bản demo trước khi khách xem.
- Xác nhận khách đặt mẫu và xuất source code thiệp thành file ZIP qua Vercel Function.

Xem hướng dẫn cấu hình tại [`ADMIN_SETUP.md`](./ADMIN_SETUP.md). Không commit `.env.local` hoặc Supabase secret key.

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

## Mẫu thực tế Hà Phương & Hoàng Minh 2026

- Card ở trang chủ và thư viện mở https://mp-wedding-2026.vercel.app/.
- Đường dẫn cũ `/demo/ha-phuong-hoang-minh-2026` và link tạo mẫu cũ chuyển về website thật.
- Thiết kế vườn xanh đã dựng trong Studio có tên riêng **Verdant Veil**, tại `/demo/verdant-veil`. Các bản nháp cũ của thiết kế này được chuyển sang ID `verdant-veil` để giữ nội dung.
- Mã nguồn tham chiếu do chủ dự án cung cấp: https://github.com/weddinginvitationmp-art/mp, nhánh `master`, commit đã kiểm tra `8d2689b0466698531138c4d9725aee10163eec2a`.

Mã nguồn thật dùng Vite/React, cấu hình nội dung tại `src/config/wedding.ts`, màn mở thiệp tại `src/components/opening/opening-overlay.tsx` và các section trong `src/sections/`. RSVP, lời chúc và sơ đồ bàn sử dụng Supabase. Story chỉ bật khi `story=show`; game hiện bị tắt trong `src/App.tsx`.

Renderer từ repository này **chưa được tích hợp vào Studio**. Khi tích hợp, cần ánh xạ dữ liệu Studio vào cấu hình nguồn và dùng dữ liệu demo riêng cho RSVP/lời chúc/sơ đồ bàn; không kết nối bản demo với dữ liệu khách mời hoặc thông tin mừng cưới của thiệp thật.

## Deploy

Repository đã có `vercel.json` để mọi route SPA được rewrite về `index.html`. Kết nối repository với Vercel và sử dụng:

- Build command: `npm run build`
- Output directory: `build`
