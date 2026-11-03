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
- Nên bổ sung Cloudflare Turnstile cho form công khai khi traffic tăng.

## 6. Triển khai upload ảnh và đồng bộ Drive

1. Áp dụng migration `202611030001_customer_photos_drive.sql` sau migration CRM. Migration tạo ba bucket private. Kiểm tra giới hạn Storage toàn dự án đủ cho ảnh gốc 15 MiB và ZIP tối đa 32 MiB.
2. Bật Drive API trong Google Cloud, cấp quyền OAuth offline cho tài khoản chủ website với scope `drive.file`. Tạo thư mục gốc bằng ứng dụng đã được cấp quyền hoặc chọn thư mục qua Google Picker. Giữ thư mục ở chế độ chia sẻ giới hạn.
3. Cấu hình các biến server `GOOGLE_OAUTH_*`, `GOOGLE_DRIVE_ROOT_FOLDER_ID`, `CRON_SECRET`, `TURNSTILE_SECRET_KEY` và các biến Supabase theo `.env.example` trên Vercel. Cấu hình Turnstile cho hostname của môi trường thử nghiệm hoặc production. Chỉ site key và publishable key dùng ở trình duyệt.
4. Bật `pg_cron`, `pg_net` và Vault trên Supabase. Trong Vault tạo hai secret `wedding_media_worker_url` là URL đầy đủ của `/api/customer-media?action=worker` và `wedding_media_worker_secret` trùng `CRON_SECRET`. Tạo lịch mỗi phút bằng SQL sau.

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

5. Đặt `GOOGLE_DRIVE_ENABLED=true`, `PUBLIC_UPLOAD_ENABLED=true` và `VITE_PUBLIC_UPLOAD_ENABLED=true` ở môi trường thử nghiệm. Deploy lại frontend để Vite đọc biến `VITE_`. Chạy thử 5 ảnh, có một ảnh trên 6 MiB. Kiểm tra mã yêu cầu, Drive, cover/album, link bị khóa và ZIP mở offline.
6. Khi bật upload bắt buộc ở production, chặn gọi trực tiếp RPC form cũ từ khách bằng lệnh dưới đây. Khi rollback, tắt hai cờ upload, deploy lại frontend, rồi cấp lại `EXECUTE` cho hai role này.

```sql
revoke execute on function public.submit_customer_request(text,text,text,text,text,date,time,text,text,text,text,text)
  from anon, authenticated;
```

Worker lấy một hồ sơ mỗi lượt, sử dụng lease và ID Drive được giữ trong DB khi retry. Ảnh gốc đã nhận được giữ nguyên để đối chiếu. Job thu gom ảnh ở phiên bỏ dở sau khi phiên và token upload hết hạn. Với yêu cầu xóa dữ liệu, xác minh mã yêu cầu, thu hồi link demo, xóa bản gốc, bản web và ZIP theo tiền tố UUID trong ba bucket, xóa folder Drive theo ID, rồi xóa hồ sơ theo quy trình của chủ website. Link ảnh đã ký chỉ có hiệu lực ngắn và hết hạn theo thời hạn của demo.

