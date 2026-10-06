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

`SUPABASE_SECRET_KEY` chỉ được dùng trong Vercel Function `/api/export-invitation` và tuyệt đối không được thêm tiền tố `VITE_`.

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

