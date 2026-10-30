---
name: hnm-add-page
description: Cách thêm một trang HTML mới vào web Hoa Nhà Mình đúng cấu trúc (head, thứ tự script, menu, footer). Dùng khi tạo trang mới hoặc sao chép một trang có sẵn.
---

# Thêm trang mới

Web là HTML tĩnh ở thư mục gốc, không có framework hay bước build. Tên file dùng tiếng Việt không dấu, nối bằng dấu gạch ngang (ví dụ `gio-hang.html`).

## Các bước
1. Sao chép trang gần nhất với trang cần làm (ví dụ `lien-he.html` cho trang nội dung đơn giản, `san-pham.html` cho trang danh sách).
2. Giữ nguyên phần `<head>`: meta Supabase (`supabase-url`, `supabase-anon-key`), Tailwind CDN, `css/custom.css`, Google Analytics.
3. Giữ đúng thứ tự script, vì các file phụ thuộc nhau:
   `js/hide-pages.js` → supabase-js (CDN) → `js/supabase.js` → `js/data.js` → `js/site-config.js` → `js/site-settings.js` → `js/store.js` → `js/app.js`.
4. Header, menu và footer phải khớp các trang khác. Thêm liên kết mới vào menu desktop, menu mobile và footer ở **mọi** trang.
5. Nếu trang chưa muốn công khai, thêm vào regex trong `js/hide-pages.js` (xem skill `hnm-toggle-pages`).
6. Kiểm tra: mở trang bằng trình duyệt, xem console không lỗi, thử cả mobile.

Không đưa key bí mật vào code. `anonKey` của Supabase là khoá công khai nên được phép nằm trong meta tag.
