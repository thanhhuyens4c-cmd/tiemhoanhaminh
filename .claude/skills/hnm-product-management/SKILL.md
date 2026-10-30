---
name: hnm-product-management
description: Cách quản lý sản phẩm hoa (thêm, sửa, ẩn, giá, ảnh, danh mục) trên web Hoa Nhà Mình. Dùng khi làm việc với sản phẩm, trang san-pham, chi-tiet-san-pham, hoặc admin sản phẩm.
---

# Quản lý sản phẩm

- Danh sách sản phẩm **không** nằm cứng trong code: `const PRODUCTS = [];` ở `js/data.js` luôn rỗng và được nạp từ Supabase qua `js/supabase.js` (API CRUD sản phẩm).
- Việc thêm/sửa/xoá sản phẩm làm ở trang admin (`hoanhaminh-admin.html`, logic trong `js/admin.js`), không sửa tay `data.js`.
- Ghi đè ảnh sản phẩm nằm trong `PRODUCT_IMAGE_OVERRIDES` của `js/site-config.js` (file này được trang admin tự sinh, đừng sửa tay trừ khi bắt buộc).
- Trang hiển thị: `san-pham.html` (danh sách, lọc), `chi-tiet-san-pham.html` (chi tiết), `bo-suu-tap.html` (bộ sưu tập).

## Lưu ý khi sửa
- Giá là số nguyên VND, hiển thị có dấu chấm ngăn cách và hậu tố `₫`, dùng `toLocaleString("vi-VN")` như `js/app.js`.
- Mô tả sản phẩm có thể có xuống dòng: luôn giữ xuống dòng khi hiển thị (đã từng có lỗi mất line break ở PR #98).
- Sau khi đổi cấu trúc dữ liệu sản phẩm, kiểm tra cả giỏ hàng (`gio-hang.html`), thanh toán (`thanh-toan.html`) và admin.
