# WeddingInvitation MP - Agent Context

Tài liệu này là bản đồ làm việc nhanh cho coding agent. Ưu tiên đọc mục liên quan thay vì quét toàn repo. Hướng dẫn vận hành chi tiết nằm trong `README.md`, `ADMIN_SETUP.md`, `CUSTOM_TEMPLATE_GUIDE.md` và `GOOGLE_SHEETS_SETUP.md`.

## Tổng quan

- Ứng dụng thiệp cưới chạy trên React 18 + TypeScript + Vite; frontend là SPA, deploy trên Vercel.
- Dữ liệu quản trị, xác thực, ảnh và thiệp đã xuất bản dùng Supabase (Postgres, Auth, Storage, RLS).
- `api/` chứa Vercel Functions; `server/` chứa helper server-only dùng chung. Không có server Node chạy thường trực.
- Mẫu thiệp nội bộ chủ yếu dùng `SignatureDemo`; một số luồng preview dùng renderer riêng hoặc HTML/CSS từ gói ZIP.
- Không có script test trong `package.json`. Kiểm tra chuẩn hiện tại là `npm run typecheck` và `npm run build`.

## Lệnh

```bash
npm ci
npm run dev
npm run typecheck
npm run build
```

Build output là `build/`; đây là thư mục sinh tự động, không sửa tay. Cấu hình Vite nằm trong `vite.config.ts`; SPA fallback nằm trong `vercel.json`.

## Bản đồ mã nguồn

| Khu vực | Trách nhiệm |
| --- | --- |
| `src/Router.tsx` | Route SPA, lazy imports, slug thiệp theo domain, metadata và route 404. Thêm demo nội bộ phải thêm route/data tương ứng. |
| `src/components/HomePage.tsx`, `src/components/TemplatesPage.tsx` | Trang chủ và thư viện mẫu. |
| `src/components/demos/SignatureDemos.tsx` | Renderer chính cho demo nội bộ; package tier quyết định các section Story, RSVP nâng cao và Diamond. |
| `src/data/templates.ts` | Catalog mẫu, route, tier, thumbnail và metadata mẫu. Đây là nguồn danh sách mẫu dùng chung. |
| `src/data/packages.ts` | Quyền lợi/tên/giá của ba package: `109k`, `159k`, `199k`. |
| `src/components/InvitationCreator.tsx` | Studio demo tự tạo ở public; draft/RSVP localStorage, nén ảnh và payload chia sẻ. |
| `src/components/admin/AdminPages.tsx` | Admin login/dashboard, CRM, cấu hình Studio, demo, publish, export/import ZIP và thao tác xóa. |
| `src/components/admin/CustomerPhotoLibrary.tsx` | Thư viện ảnh theo khách, lựa chọn cover/album, focal point và upload ảnh bổ sung. |
| `src/components/CustomerInvitationPreview.tsx` | Preview rút gọn theo payload; không thay thế renderer thiệp đầy đủ. |
| `src/components/PublishedInvitationPage.tsx`, `src/components/PublicDemoPage.tsx` | Nạp thiệp chính thức và preview token công khai. |
| `src/components/CustomTemplateRenderer.tsx` | Render HTML mẫu tùy chỉnh trong iframe sandbox/CSP. |
| `src/lib/supabaseRest.ts` | Supabase REST/Auth phía browser; thao tác admin gửi access token và phải được bảo vệ bởi RLS. |
| `src/lib/customerPhotoUpload.ts` | Client helper cho signed uploads, ảnh và ZIP; không đưa secret key vào đây. |
| `src/types/admin.ts` | Hợp đồng payload/record giữa admin, preview và API. |
| `src/utils/imageConstants.ts`, `src/data/vietnamWeddingPhotos.ts` | Mapping và nguồn ảnh dùng ở frontend. |
| `api/customer-media.ts` | Vercel Function cho workflow ảnh, public demo/live, admin media, ZIP revision, cleanup và Drive worker. |
| `api/export-invitation.ts` | Xác thực admin, tạo ZIP thiệp, lưu ZIP lớn vào Storage và ghi export event. |
| `server/customerMedia.ts` | Bucket names, Supabase service-role helper, DB/storage helpers, `PhotoRow` và `selectedPhotos`. |
| `server/driveSync.ts` | Đồng bộ/xóa ảnh trên Google Drive và dọn upload bỏ dở. |
| `supabase/migrations/*.sql` | Schema, RLS, RPC, trigger và bucket. Migration mới phải được áp dụng trước khi deploy code phụ thuộc vào nó. |
| `public/images/`, `public/fonts/`, `public/custom-template-starter/` | Asset tĩnh, font và starter ZIP mẫu. |

## Route chính

- `/`, `/templates`: marketing và catalog.
- `/demo/:id`: demo nội bộ; route được tạo từ `weddingTemplates` trong `src/Router.tsx`.
- `/tao-thiep`, `/tao-thiep/preview`, `/tao-thiep/live`: public invitation creator.
- `/yeu-cau-thiep`: gửi yêu cầu khách; ảnh upload qua workflow có challenge/signed upload.
- `/admin/login`, `/admin/setup-password`, `/admin`: khu vực nội bộ.
- `/preview/:token`: preview demo khách bằng public token.
- `/invite/:slug` hoặc `slug.<VITE_PUBLIC_INVITATION_DOMAIN>`: thiệp đã publish.
- Một số mẫu dùng `externalUrl`; mẫu thực Hà Phương & Hoàng Minh redirect sang site riêng, không sửa như demo nội bộ.

## Luồng dữ liệu cần giữ đúng

### Admin CRM và thiệp

`customers` -> `invitation_demos` -> `published_invitations`. Public preview/live đọc payload của demo; không tạo bản sao dữ liệu độc lập khi chỉ cần cập nhật thiệp. `published_invitations` trỏ `customer_id` và `demo_id`; xóa demo/khách phải dọn Storage rõ ràng trước khi xóa record vì FK cascade không xóa object trong Storage.

`InvitationPayload` trong `src/types/admin.ts` là hợp đồng chính: thông tin đôi bạn, `photos`, `studio`, `customTemplateId`. Khi đổi payload, kiểm tra đồng thời admin save, public preview, published page và export.

### Ảnh khách

- Upload gốc đi thẳng browser -> Supabase Storage bằng signed token; server xác thực MIME/nội dung, dùng `sharp` tạo WebP rồi ghi `customer_photos`.
- Public request ban đầu nhận 5-7 ảnh; admin có thể bổ sung để thư viện đạt tối đa 30 ảnh. Giới hạn này nằm trong migration customer media và endpoint admin.
- Mỗi demo hiện chọn tối đa 7 ảnh: cover + gallery. Giới hạn được kiểm tra trong `server/customerMedia.ts`, trigger `guard_demo_photos` và UI; nếu thay đổi phải cập nhật cả ba.
- `sort_order` của bảng ảnh có giới hạn database; không thêm ảnh chỉ ở UI mà quên migration/schema.
- Ảnh gốc và WebP nằm ở buckets `customer-photos-original` và `customer-demo-assets`; tên bucket/path tập trung ở `server/customerMedia.ts`.

### Export và ZIP chỉnh sửa

- `api/export-invitation.ts` tạo `index.html`/`styles.css`/`script.js` hoặc lấy file từ custom template, kèm asset và metadata `mp-invitation-export.json`.
- ZIP import admin chỉ nhận ZIP mới được xuất từ đúng customer/demo. Không bỏ metadata marker hoặc bỏ kiểm tra ownership; file tối đa 32 MiB, archive/file paths/type/expanded size được giới hạn ở `api/customer-media.ts`.
- ZIP được lưu thành customer-owned revision trong `custom_invitation_templates`; demo payload trỏ bằng `customTemplateId`. `CustomTemplateRenderer` đọc revision từ public Storage trong sandbox.
- Mẫu custom tải lên thông thường là thư viện dùng chung; ZIP revision đã chỉnh sửa là riêng theo customer/demo. Giữ ranh giới này khi list, update, replace hoặc delete.
- Bảng/database deletion không tự xóa Storage; cleanup ảnh, ZIP và template revision phải đi cùng endpoint xóa khách/demo.

### Package

- `109k`: RSVP Có/Không; không bật guest list/câu hỏi nâng cao/kiểu chữ Premium.
- `159k`: Story, album mở rộng, guest links và RSVP nâng cao.
- `199k`: phần Diamond như video/guestbook/QR minh họa.
- Package features hiện có ở `src/data/packages.ts`; renderer thực tế ở `SignatureDemos.tsx`. Đừng chỉ đổi nhãn Studio mà quên cách public renderer/export áp dụng tier.

## Bảo mật và dữ liệu

- Không commit `.env.local`, token, service-role key, OAuth secret, dữ liệu khách thật hoặc ảnh riêng.
- `VITE_*` được bundle ra browser; chỉ chứa URL/publishable key. `SUPABASE_SECRET_KEY`, `GOOGLE_OAUTH_*`, `CRON_SECRET` chỉ ở server.
- Admin API dùng `requireAdmin()`/Supabase Auth. Không tin `customerId`, `demoId`, path, MIME, ZIP metadata hoặc photo IDs từ browser; xác thực quyền sở hữu server-side trước khi đọc/sửa/xóa.
- Storage path phải được tạo từ UUID đã validate, không dùng path do người dùng tùy ý cung cấp. ZIP phải kiểm tra traversal, số file, kích thước giải nén và HTML nguy hiểm.
- Giữ RLS; không mở bảng/bucket riêng tư để né lỗi quyền. Public handlers chỉ trả fields cần cho khách.
- Đọc `supabase/migrations/` trước khi thay đổi schema/RPC/trigger. Không sửa migration đã deploy để thay lịch sử; thêm migration mới.

## Cấu hình và triển khai

- Biến môi trường mẫu nằm trong `.env.example`. Copy values vào môi trường local/Vercel, không điền secrets vào tài liệu này.
- Admin yêu cầu Supabase Auth, bảng `admin_users`, RLS và migrations đã áp dụng; nếu local không có env, `/admin` sẽ quay về màn login cấu hình lỗi.
- Ảnh upload cần Supabase buckets và server secret; Drive cần `GOOGLE_DRIVE_ENABLED=true`, OAuth credentials, root folder riêng tư và worker cron.
- Khi thêm migration, nêu rõ cần apply migration trước deploy API/frontend. Tham khảo `ADMIN_SETUP.md` và `GOOGLE_SHEETS_SETUP.md` cho cấu hình vận hành.

## Cách làm thay đổi an toàn

1. Tìm owner trực tiếp của hành vi; tránh sửa renderer preview rút gọn nếu bug nằm ở public renderer hoặc export.
2. Với payload/schema, rà các consumer liên quan: admin editor, public demo/live, export ZIP, DB trigger/API validation.
3. Với xóa dữ liệu, xử lý cả Postgres và Storage/Drive; database cascade chưa đủ.
4. Với ảnh/template/ZIP, giữ giới hạn và kiểm tra server-side; không chỉ dựa vào UI.
5. Sau sửa chạy `npm run typecheck`, rồi `npm run build`. Không có automated test script hiện tại; nếu thay API/storage, ghi rõ runtime Supabase/Vercel nào chưa được kiểm chứng.
