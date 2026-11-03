# Wedding Invitation MP — Admin setup

## 1. Tạo Supabase project

1. Tạo project trong Supabase.
2. Mở **SQL Editor** và chạy file `supabase/migrations/202610060001_admin_crm.sql`.
3. Vào **Authentication → Users**, tạo tài khoản admin bằng email và mật khẩu riêng.
4. Chạy câu SQL sau, thay email bằng tài khoản vừa tạo:

```sql
insert into public.admin_users (user_id, email, display_name)
select id, email, 'Hoàng Minh'
from auth.users
where email = 'YOUR_ADMIN_EMAIL';
```

Không mở đăng ký công khai. Chỉ tạo tài khoản quản trị trong Dashboard.

## 2. Cấu hình local

Sao chép `.env.example` thành `.env.local`, sau đó điền Project URL và publishable key.

```bash
cp .env.example .env.local
npm run dev
```

Trang đăng nhập quản trị: `/admin/login`.

## 3. Cấu hình Vercel

Thêm các biến môi trường cho Production và Preview:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

`SUPABASE_SECRET_KEY` chỉ được dùng ở server Vercel và tuyệt đối không được thêm tiền tố `VITE_`.

## 4. Luồng vận hành

1. Khách gửi `/yeu-cau-thiep` hoặc admin tạo hồ sơ thủ công.
2. Admin chọn mẫu, rà soát dữ liệu và tạo link preview.
3. Khách mở `/preview/:token`, xác nhận popup demo rồi xem thiệp.
4. Admin nhấn **Xác nhận khách đặt mẫu**.
5. Nút **Xuất code ZIP** được mở; server xác minh lại JWT, quyền admin và trạng thái đơn trước khi sinh file.

## 5. Kiểm tra bảo mật

- `/admin` không được liên kết từ website công khai, nhưng bảo mật thật nằm ở Auth + RLS.
- Bảng khách hàng và demo không cấp quyền trực tiếp cho `anon`.
- Preview công khai chỉ đọc qua RPC bằng token và chỉ khi còn hiệu lực.
- Secret key chỉ tồn tại ở Vercel.

## 6. Triển khai upload ảnh bằng Supabase

1. Áp dụng `202611030001_customer_photos_drive.sql` và `202611030002_customer_photo_abuse_limits.sql` sau migration CRM. Kiểm tra giới hạn Storage toàn dự án đủ cho ảnh gốc 15 MiB và ZIP tối đa 32 MiB.
2. Cấu hình các biến Supabase theo `.env.example` trên Vercel. Bật `PUBLIC_UPLOAD_ENABLED=true` và `VITE_PUBLIC_UPLOAD_ENABLED=true`, rồi deploy lại để Vite đọc biến mới. Giữ `GOOGLE_DRIVE_ENABLED=false` nếu chỉ lưu trên Supabase.
3. Server cấp mã xác minh có chữ ký, dùng trong 5 phút và có thể gửi sau 1,5 giây. Server kiểm tra nguồn gửi từ trình duyệt và trường bẫy bot. PostgreSQL giới hạn 8 phiên mới mỗi IP và 4 phiên mới mỗi số điện thoại chuẩn hóa trong một giờ. Giới hạn toàn site mặc định 60 phiên mỗi giờ, chỉnh bằng `UPLOAD_LIMIT_PER_HOUR` (1–500). Thử lại phiên đã tạo dùng cùng mã phiên. Tùy chọn đặt `UPLOAD_ABUSE_SECRET` ổn định ở server để giữ các bộ đếm qua lần đổi khóa Supabase.
4. Chạy thử 5 ảnh, có một ảnh trên 6 MiB. Kiểm tra mã yêu cầu, chọn cover/album, link đã hết hạn và ZIP mở offline.
5. Khi bật upload bắt buộc ở production, thu hồi quyền gọi trực tiếp RPC form cũ từ khách bằng lệnh dưới đây. Khi rollback, tắt hai cờ upload, deploy lại frontend, rồi cấp lại `EXECUTE` cho hai role này.

```sql
revoke execute on function public.submit_customer_request(text,text,text,text,text,date,time,text,text,text,text,text)
  from anon, authenticated;
```

### Tùy chọn đồng bộ Drive hoặc thu gom phiên bỏ dở

Bật Drive API, cấu hình OAuth offline với scope `drive.file` và đặt `GOOGLE_DRIVE_ENABLED=true` nếu cần đồng bộ. Cấu hình `CRON_SECRET` và lịch worker nếu cần chạy đồng bộ hoặc thu gom ảnh phiên bỏ dở. Có thể chạy lịch với Drive tắt để chỉ thu gom.

Bật `pg_cron`, `pg_net` và Vault trên Supabase. Trong Vault, đặt `wedding_media_worker_url` là URL đầy đủ của `/api/customer-media?action=worker` và `wedding_media_worker_secret` trùng `CRON_SECRET`.

```sql
select cron.schedule('wedding-drive-sync', '* * * * *', $job$
  select net.http_get(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'wedding_media_worker_url'),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' ||
      (select decrypted_secret from vault.decrypted_secrets where name = 'wedding_media_worker_secret')
    ),
    timeout_milliseconds := 290000
  );
$job$);
```

Worker lấy một hồ sơ mỗi lượt, sử dụng lease và ID Drive được giữ trong DB khi retry. Ảnh gốc đã nhận được giữ nguyên để đối chiếu. Phiên bỏ dở hết hạn sau 24 giờ. Tệp đã tải một phần chỉ được thu gom khi worker chạy, sau thời gian chờ để token upload hết hạn. Với yêu cầu xóa dữ liệu, xác minh mã yêu cầu, thu hồi link demo, xóa bản gốc, bản web và ZIP theo tiền tố UUID trong ba bucket, xóa folder Drive theo ID, rồi xóa hồ sơ theo quy trình của chủ website. Link ảnh đã ký chỉ có hiệu lực ngắn và hết hạn theo thời hạn của demo.

