---
name: hnm-blog-supabase
description: Cách blog của web Hoa Nhà Mình lưu và hiển thị bài viết bằng Supabase. Dùng khi thêm, sửa, đăng bài blog hoặc sửa blog.html, bai-viet.html, phần blog trong admin.
---

# Blog trên Supabase

- Bài viết lưu trong bảng `blogs` của Supabase (`supabase-blogs.sql`): cột `id`, `data` (JSONB), `sort_order`, `updated_at`. **Không lưu bằng localStorage**, để mọi thiết bị thấy cùng dữ liệu.
- `BLOG_POSTS` trong `js/data.js` chỉ là dữ liệu mẫu ban đầu. Bài thật được admin tạo qua `hoanhaminh-admin.html`.
- Trang đọc: `blog.html` (danh sách), `bai-viet.html` (chi tiết, định danh theo `slug`).
- Trường của một bài: `id`, `title`, `slug`, `category`, `categorySlug`, `date` (dd/mm/yyyy), `author`, `readTime`, `image`, `excerpt`, `content` (HTML).

## Lưu ý
- Slug tiếng Việt không dấu, chữ thường, nối bằng `-`.
- Nội dung `content` là HTML: giữ nguyên xuống dòng và đừng chèn script.
- Blog đang bị **tạm ẩn** bằng `js/hide-pages.js`. Muốn hiện lại, xem skill `hnm-toggle-pages`.
