---
name: hnm-vietnamese-content
description: Giọng văn, ngôn ngữ và cách trình bày nội dung tiếng Việt cho web Hoa Nhà Mình (tên sản phẩm, mô tả, nút, thông báo, giá). Dùng khi viết hoặc sửa chữ hiển thị trên web.
---

# Nội dung tiếng Việt

- Thương hiệu: **Hoa Nhà Mình**, tagline giữ nguyên tiếng Anh: *Let flowers speak your heart!*
- Giọng văn: ấm áp, gần gũi, kể chuyện, xưng "mình"/"tiệm" với khách. Không dùng văn quảng cáo quá đà hoặc từ sáo rỗng.
- Toàn bộ chữ hiển thị là tiếng Việt có dấu. Chỉ dùng tiếng Anh cho tagline và các từ đã quen (ví dụ "Zalo").
- Giá: số nguyên VND, ngăn cách hàng nghìn bằng dấu chấm, đơn vị `₫` (ví dụ `450.000₫`), tạo bằng `Number(price).toLocaleString("vi-VN")` như `js/app.js`.
- Ngày: `dd/mm/yyyy`. Số điện thoại hiển thị liền hoặc nhóm nhất quán với các trang hiện có.
- Nút/hành động ngắn gọn, động từ ở đầu: "Thêm vào giỏ", "Đặt hàng", "Xem chi tiết".
- Lời nhắn thiệp, tên người nhận là dữ liệu do khách nhập: khi chèn vào HTML phải escape để tránh XSS.
- Lưu file ở UTF-8 để không lỗi dấu tiếng Việt.
