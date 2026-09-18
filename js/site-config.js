/**
 * Site Config – Cấu hình ảnh đồng bộ giữa các thiết bị
 * File này chứa ảnh mặc định mới nhất, được chia sẻ giữa desktop và mobile.
 * Khi admin thay đổi ảnh qua Admin Panel, nhấn "Xuất cấu hình" để cập nhật file này.
 *
 * Ưu tiên: site-config.js → localStorage → defaultSrc trong site-settings.js
 */
const SITE_IMAGE_CONFIG = {
  // Để trống = dùng ảnh mặc định từ site-settings.js
  // Khi admin xuất cấu hình, các giá trị sẽ được điền tự động ở đây.
  // Ví dụ:
  // "index_hero": "assets/images/hero-bouquet.png",
  // "logo": "assets/images/logo.png",
};
