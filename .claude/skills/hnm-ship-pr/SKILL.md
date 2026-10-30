---
name: hnm-ship-pr
description: Quy trình đưa thay đổi lên web Hoa Nhà Mình, gồm commit, tạo PR và merge vào main để web cập nhật. Dùng khi một thay đổi đã xong và cần lên web.
---

# Đưa thay đổi lên web

Quy ước của dự án: **mọi PR được merge vào `main` luôn** để thay đổi lên web ngay (web phát hành từ `main`).

## Các bước
1. Làm việc trên nhánh `claude/...`, không commit thẳng vào `main`.
2. Trước khi commit, kiểm tra nhanh: mở trang bị ảnh hưởng, xem console không lỗi, thử mobile.
3. Commit với thông điệp tiếng Việt ngắn, nói rõ việc đã đổi (ví dụ "Trang chủ: bỏ mục ...").
4. Đẩy nhánh, mở PR vào `main` bằng `gh pr create`, mô tả ngắn gọn thay đổi và cách đã kiểm tra.
5. Merge PR vào `main` (không cần hỏi lại, đây là quy ước đã được chủ dự án đồng ý), rồi báo lại cho người dùng rằng thay đổi đã lên.

## Ngoại lệ phải hỏi trước
- Thay đổi kèm SQL phải chạy trong Supabase: nói rõ câu lệnh cần chạy **trước/sau** khi merge.
- Thay đổi xoá dữ liệu hoặc làm hỏng đơn hàng đang có.
