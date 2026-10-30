---
name: hnm-supabase-sql
description: Quy ước viết và thay đổi cấu trúc bảng Supabase (SQL, RLS, migration) cho web Hoa Nhà Mình. Dùng khi thêm bảng, thêm cột, đổi chính sách truy cập hoặc đổi CHECK trạng thái.
---

# Supabase SQL

Các file SQL ở thư mục gốc: `supabase-setup.sql` (bảng `orders`), `supabase-blogs.sql` (bảng `blogs`), `supabase-site-settings.sql` (bảng `site_settings`). Chủ shop chạy chúng thủ công trong Supabase → SQL Editor, nên mỗi file phải **chạy lại được nhiều lần** (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`).

## Quy ước
- Mỗi bảng mới là một file `supabase-<tên>.sql`, có comment tiếng Việt đầu file nói rõ bảng để làm gì.
- Luôn bật RLS: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` rồi tạo từng policy.
- Đổi cấu trúc bảng đã có thì viết câu lệnh `ALTER` riêng, đừng sửa `CREATE TABLE` rồi mong bảng cũ tự đổi. Nói rõ cho người dùng phải chạy câu lệnh nào trong SQL Editor.
- Tiền dùng `BIGINT` (VND, không số thập phân). Thời gian dùng `TIMESTAMPTZ DEFAULT now()`.

## Cảnh báo bảo mật hiện tại
Nhiều policy đang là `USING (true)` cho cả ghi/xoá bằng khoá anon (ví dụ `blogs`, `site_settings`, cập nhật `orders`), nghĩa là ai có anon key đều sửa được. Khi làm tính năng mới, hãy nhắc người dùng điều này và đề xuất siết lại (Supabase Auth hoặc RPC) thay vì sao chép mẫu đó cho dữ liệu nhạy cảm.
