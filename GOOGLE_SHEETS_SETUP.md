# 📊 Hướng Dẫn Setup Google Sheets để Nhận RSVP

## Bước 1: Tạo Google Sheets

1. Mở [Google Sheets](https://sheets.google.com)
2. Tạo một spreadsheet mới
3. Đặt tên cho sheet (ví dụ: "Wedding RSVP Responses")

## Bước 2: Thêm Apps Script

1. Trong Google Sheets, chọn **Extensions** > **Apps Script**
2. Xóa code mặc định
3. Copy toàn bộ code từ file `src/utils/googleSheetsScript.gs`
4. Paste vào Apps Script editor
5. Lưu project (Ctrl+S hoặc File > Save)
6. Đặt tên cho project (ví dụ: "RSVP Handler")

## Bước 3: Deploy Web App

1. Trong Apps Script editor, click **Deploy** > **New deployment**
2. Click icon ⚙️ bên cạnh "Select type"
3. Chọn **Web app**
4. Điền thông tin:
   - **Description**: "RSVP Form Handler"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. **Authorize access**:
   - Click "Authorize access"
   - Chọn tài khoản Google của bạn
   - Click "Advanced" > "Go to [Project Name] (unsafe)"
   - Click "Allow"
7. **Copy Web App URL** (có dạng: `https://script.google.com/macros/s/...../exec`)

## Bước 4: Cập Nhật Code

1. Mở file `src/utils/rsvpSubmission.ts`
2. Tìm dòng:
   ```typescript
   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
3. Thay `YOUR_DEPLOYMENT_ID` bằng URL bạn vừa copy ở bước 3

## Bước 5: Test

1. Chạy ứng dụng: `npm run dev`
2. Mở một template bất kỳ
3. Điền form RSVP và submit
4. Kiểm tra Google Sheets - dữ liệu sẽ xuất hiện!

## 📋 Cấu Trúc Dữ Liệu

Google Sheets sẽ tự động tạo các cột:

| Timestamp | Name | Email | Attending | Guest Count | Message | Template |
|-----------|------|-------|-----------|-------------|---------|----------|
| 2025-03-15 10:30:00 | Nguyễn Văn A | email@example.com | yes | 2 | Chúc mừng! | Cinematic Love Story |

## 🔧 Troubleshooting

### Lỗi: "Script function not found"
- Đảm bảo function trong Apps Script có tên là `doPost`
- Deploy lại web app

### Lỗi: "Authorization required"
- Chạy lại bước 3, mục 6 (Authorize access)
- Đảm bảo chọn "Anyone" cho "Who has access"

### Data không xuất hiện trong Sheets
1. Mở Apps Script > Executions (bên trái)
2. Xem logs để debug
3. Hoặc chạy function `testDoPost()` để test

### CORS Error
- Đây là lỗi bình thường khi dùng Google Sheets Web App
- Code đã xử lý bằng `mode: 'no-cors'`
- Data vẫn được gửi thành công

## 💾 Backup với Local Storage

Nếu Google Sheets API fails, dữ liệu sẽ tự động được lưu vào localStorage của browser:
- Key format: `rsvp_[timestamp]`
- Có thể xem trong DevTools > Application > Local Storage

Để export data từ localStorage:
```javascript
// Chạy trong browser console
const rsvps = Object.keys(localStorage)
  .filter(key => key.startsWith('rsvp_'))
  .map(key => JSON.parse(localStorage.getItem(key)));
console.table(rsvps);
```

## 🎨 Tùy Chỉnh

### Thêm cột mới
1. Sửa file `src/utils/rsvpSubmission.ts` để thêm field
2. Sửa `googleSheetsScript.gs` để thêm header và giá trị tương ứng
3. Deploy lại web app

### Thay đổi định dạng
Trong Apps Script, sau dòng `sheet.appendRow([...])`, thêm:
```javascript
var lastRow = sheet.getLastRow();
var range = sheet.getRange(lastRow, 1, 1, 7);
range.setBackground('#FFF8DC'); // Màu nền
range.setFontSize(11); // Cỡ chữ
```

## 📧 Email Notification (Optional)

Để nhận email mỗi khi có RSVP mới, thêm vào cuối function `doPost`:

```javascript
// Send email notification
MailApp.sendEmail({
  to: 'your-email@example.com',
  subject: 'New RSVP: ' + data.name,
  body: 'Name: ' + data.name + '\n' +
        'Email: ' + data.email + '\n' +
        'Attending: ' + data.attending + '\n' +
        'Guests: ' + data.guestCount + '\n' +
        'Message: ' + data.message
});
```

## 🔐 Bảo Mật

⚠️ **Lưu ý**: Web app được set "Anyone" có thể truy cập
- Bất kỳ ai có URL đều có thể submit data
- Không lưu thông tin nhạy cảm (số điện thoại, địa chỉ nhà...)
- Xem xét thêm authentication nếu cần

## ✅ Done!

Bây giờ bạn có một hệ thống thu thập RSVP tự động với Google Sheets! 🎉
