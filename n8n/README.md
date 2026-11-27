# Workflow n8n: AI đăng bài Facebook mỗi ngày

File workflow: [fb-autopost-workflow.json](fb-autopost-workflow.json). Workflow làm cùng việc với `/api/fb-autopost` trên Vercel, nhưng chạy trong n8n.

```
Mỗi ngày 11h / Chạy tay
  → Cấu hình → Lấy sản phẩm (Supabase) → Lấy lịch sử đăng (fb_posts)
  → Chọn mẫu hoa → Tải ảnh → Gói ảnh cho Gemini → Gemini viết bài → Ghép nội dung
  → Chạy thử?  ├─ đúng → Ghi nhật ký (chạy thử)
               └─ sai  → Đăng lên Facebook → Ghi nhật ký (đã đăng)
```

## Cài đặt

1. **Import:** n8n → **Workflows** → **⋯ / Add workflow → Import from File** → chọn `fb-autopost-workflow.json`.
   (Trên máy của tiệm, workflow đã được import sẵn với tên *Hoa Nhà Mình – AI đăng bài Facebook*.)
2. **Tạo bảng nhật ký:** chạy [../supabase-fb-posts.sql](../supabase-fb-posts.sql) trong Supabase → SQL Editor.
3. **Điền key:** mở node **Cấu hình**, thay các chỗ `DÁN_..._VÀO_ĐÂY`:
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase → Project Settings → API Keys → service_role
   - `GEMINI_API_KEY`: https://aistudio.google.com/apikey
   - `FB_PAGE_ID`, `FB_PAGE_TOKEN`: xem mục *Bước 4* trong [../FACEBOOK-AUTOPOST.md](../FACEBOOK-AUTOPOST.md)
4. **Chạy thử:** để `DRY_RUN: true`, bấm **Execute workflow** (đi qua node *Chạy tay*). Bấm vào node **Ghép nội dung** để đọc bài AI viết. Lần chạy thử này chưa đăng gì lên Facebook.
5. **Đăng thật:** đổi `DRY_RUN` thành `false`, chạy lại một lần để kiểm tra bài lên Page.
6. **Bật tự động:** gạt công tắc **Active** ở góc trên. Từ đó mỗi ngày 11:00 (giờ Việt Nam) workflow tự đăng một bài.

Muốn đăng một mẫu cụ thể thì điền mã sản phẩm vào `FORCE_PRODUCT_ID`. Để trống thì workflow tự chọn mẫu chưa đăng, hoặc mẫu lâu nhất chưa đăng.
Muốn đổi giờ đăng thì mở node **Mỗi ngày 11h** và sửa giờ.

## Lưu ý

- **n8n chạy trên máy tính** (`localhost:5678`) thì máy phải bật và n8n phải đang chạy lúc 11h, nếu không hôm đó sẽ không có bài. Muốn chạy ổn định cả khi tắt máy thì dùng bản Vercel ([../FACEBOOK-AUTOPOST.md](../FACEBOOK-AUTOPOST.md)) hoặc n8n Cloud.
- **Chỉ bật một trong hai**: n8n *hoặc* Vercel. Nếu đặt đủ biến môi trường trên Vercel và bật workflow n8n cùng lúc, mỗi ngày sẽ có 2 bài.
- Key nằm trong node *Cấu hình*: **đừng gửi file workflow đã điền key cho người khác**, và đừng export rồi commit lên GitHub.
- Xem lại bài đã đăng và các lần lỗi: Supabase → Table Editor → `fb_posts`, hoặc mục **Executions** trong n8n.
