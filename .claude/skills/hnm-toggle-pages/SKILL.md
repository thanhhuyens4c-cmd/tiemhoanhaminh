---
name: hnm-toggle-pages
description: Cách ẩn hoặc hiện lại các trang (Blog, Giới thiệu, Hoa 20/10) trên web Hoa Nhà Mình bằng js/hide-pages.js. Dùng khi chủ shop muốn tạm ẩn/hiện một trang hoặc mục trên trang chủ.
---

# Ẩn / hiện trang

`js/hide-pages.js` được nạp ở đầu mọi trang. Khi cờ `HIDE_BLOG_AND_ABOUT = true`:
- Truy cập `blog`, `gioi-thieu`, `bai-viet`, `hoa-20-10` sẽ chuyển về `index.html`.
- Các liên kết/`li` trỏ tới những trang đó, `#home-blog` và `section#hoa-20-10` bị ẩn bằng CSS.
- Đặt `window.HNM_HIDE_OCT20` để các script khác (ví dụ `js/oct20-popup.js`) biết trạng thái.

## Thao tác
- **Hiện lại**: đổi `HIDE_BLOG_AND_ABOUT` thành `false`. Sau đó kiểm tra menu, footer và trang chủ đã hiện đúng.
- **Ẩn thêm trang**: thêm tên trang vào regex `(blog|gioi-thieu|...)` và thêm selector tương ứng vào biến `links`/`sel`.
- Ẩn trang chỉ là che ở phía trình duyệt, **không bảo mật**. Ai biết đường dẫn vẫn tải được file HTML nên đừng để thông tin nhạy cảm trong trang bị ẩn.
- Mục "Bạn muốn gửi tặng hoa đến ai?" đã được gỡ khỏi trang chủ, đừng thêm lại khi chưa được yêu cầu.
