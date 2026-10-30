---
name: hnm-site-images
description: Cách quản lý ảnh banner/hero và ảnh giao diện của web Hoa Nhà Mình (site_settings, site-config.js). Dùng khi đổi ảnh trang chủ, bộ sưu tập, giới thiệu, hoặc thêm vị trí ảnh mới.
---

# Ảnh giao diện

- Các vị trí ảnh có khoá cố định: `index_hero`, `index_about`, `index_gallery_1..3`, `collection_hero`, `collection_autumn`, `collection_winter`, `about_hero`, `blog_featured`.
- Giá trị mặc định nằm trong `SITE_IMAGE_CONFIG` ở `js/site-config.js` (file do trang admin sinh ra, có dấu thời gian ở đầu). Ảnh do admin chỉnh được lưu ở bảng Supabase `site_settings` (`key`, `src`) và nạp bởi `js/site-settings.js`, nên khách ở mọi thiết bị đều thấy.
- File ảnh nằm ở `assets/images/` (ảnh do admin tải lên ở `assets/images/site/`, tên có hậu tố mã băm).

## Thêm vị trí ảnh mới
1. Đặt một khoá mới có ý nghĩa, theo mẫu `<trang>_<vị trí>`.
2. Thêm vào `SITE_IMAGE_CONFIG` và khai báo ở trang admin để chỉnh được.
3. Trong `js/site-settings.js`, thêm một "slot" cho khoá đó với `selector` là CSS selector của thẻ `<img>` (ví dụ `#hero-banner-img`), rồi đặt đúng `id` đó cho thẻ `<img>` trong HTML. Đọc các slot có sẵn trước khi sửa.
4. Tối ưu ảnh (khoảng dưới 300 KB, dùng JPG/WebP), có thuộc tính `alt` tiếng Việt, và `loading="lazy"` cho ảnh dưới màn hình đầu.
