# AI tự đăng bài Facebook mỗi ngày

Mỗi ngày lúc **11:00 (giờ Việt Nam)**, Vercel gọi `/api/fb-autopost`. Hàm này:

1. Lấy các sản phẩm đang bán có ảnh trên Supabase Storage (bảng `products`).
2. Chọn một mẫu **chưa đăng bao giờ**, hoặc mẫu lâu nhất chưa đăng (tra bảng `fb_posts`).
3. Gửi ảnh và thông tin mẫu cho **Gemini** để viết bài theo giọng "chúng mình" của tiệm.
4. Đăng ảnh kèm bài lên Facebook Page, cuối bài có link đặt hoa của đúng mẫu đó.
5. Ghi lại vào bảng `fb_posts` (đăng thành công, lỗi hay chạy thử đều được ghi).

Mã nguồn: [api/fb-autopost.js](api/fb-autopost.js) · Lịch chạy: [vercel.json](vercel.json)

---

## Bước 1. Tạo bảng nhật ký trên Supabase

Supabase → **SQL Editor** → dán nội dung file [supabase-fb-posts.sql](supabase-fb-posts.sql) → **Run**.

## Bước 2. Lấy Gemini API key

1. Vào https://aistudio.google.com/apikey → **Create API key**.
2. Giữ key này để dán vào Vercel ở Bước 5.

## Bước 3. Lấy Supabase service_role key

Supabase → **Project Settings → API Keys** → mục **service_role** (hoặc *Secret key*) → Copy.
Key này có toàn quyền với cơ sở dữ liệu: **chỉ dán vào Vercel**, không dán vào file HTML/JS nào.

## Bước 4. Lấy Facebook Page ID và Page Access Token dài hạn

Cần là **quản trị viên** của Page.

1. Vào https://developers.facebook.com → **My Apps → Create App**.
   - Chọn loại **Other → Business** (hoặc use case "Manage everything on your Page").
2. Trong app vừa tạo, mở **App settings → Basic**, ghi lại **App ID** và **App Secret**.
3. Mở **Graph API Explorer**: https://developers.facebook.com/tools/explorer
   - Chọn app vừa tạo ở góc phải.
   - **User or Page** → *Get User Access Token*, tích các quyền:
     `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`.
   - Bấm **Generate Access Token** và đồng ý cho Page của tiệm.
4. Đổi sang token dài hạn (60 ngày): mở **Access Token Debugger**
   https://developers.facebook.com/tools/debug/accesstoken → dán token → **Debug** → **Extend Access Token**.
5. Lấy Page token **không hết hạn**: quay lại Graph API Explorer, dán token dài hạn vào ô Access Token, gọi:
   ```
   GET me/accounts
   ```
   Kết quả có từng Page với `id` (đây là **FB_PAGE_ID**) và `access_token` (đây là **FB_PAGE_TOKEN**).
   Dán token này vào Access Token Debugger để kiểm tra: dòng *Expires* phải là **Never**.

> Nếu app đang ở chế độ **Development**, bài vẫn đăng được lên Page mà bạn là quản trị viên. Không cần gửi app cho Meta duyệt khi chỉ dùng cho Page của chính mình.

## Bước 5. Đặt biến môi trường trên Vercel

Vercel → project → **Settings → Environment Variables**, thêm (môi trường *Production*):

| Tên | Giá trị |
|-----|---------|
| `CRON_SECRET` | chuỗi ngẫu nhiên dài, tự đặt (vd 32 ký tự) |
| `SUPABASE_SERVICE_ROLE_KEY` | key ở Bước 3 |
| `GEMINI_API_KEY` | key ở Bước 2 |
| `FB_PAGE_ID` | id Page ở Bước 4 |
| `FB_PAGE_TOKEN` | Page token ở Bước 4 |
| `GEMINI_MODEL` *(tuỳ chọn)* | mặc định `gemini-2.5-flash` |

Sau khi thêm biến, vào **Deployments → Redeploy** để bản đang chạy nhận biến mới.

## Bước 6. Chạy thử trước khi để tự đăng

Chạy thử (AI viết bài nhưng **không đăng** lên Facebook), thay `<CRON_SECRET>`:

```powershell
curl.exe -H "Authorization: Bearer <CRON_SECRET>" "https://tiemhoanhaminh.vercel.app/api/fb-autopost?dry_run=1"
```

Đọc nội dung trong `caption`. Nếu ổn, đăng thật một bài ngay (không cần chờ tới 11h):

```powershell
curl.exe -H "Authorization: Bearer <CRON_SECRET>" "https://tiemhoanhaminh.vercel.app/api/fb-autopost"
```

Muốn đăng một mẫu cụ thể: thêm `?product=<mã sản phẩm>`.

---

## Đổi giờ đăng / số bài mỗi ngày

Sửa `schedule` trong [vercel.json](vercel.json). Giờ tính theo **UTC** (giờ Việt Nam trừ 7):

- `0 4 * * *` → 11:00 mỗi ngày (mặc định)
- `0 13 * * *` → 20:00 mỗi ngày
- Gói Vercel **Hobby** (miễn phí) chỉ cho cron chạy **1 lần/ngày** và có thể lệch trong vòng 1 tiếng. Muốn 2 bài/ngày cần gói Pro.

## Xem lại bài đã đăng / lỗi

Supabase → **Table Editor → fb_posts**. Cột `status`: `posted` (đã đăng), `failed` (lỗi, xem cột `error`), `dry_run` (chạy thử).
Log chi tiết: Vercel → project → **Logs**, lọc theo `/api/fb-autopost`.

Lỗi hay gặp:
- **Facebook 190 / token expired**: token hết hạn, làm lại Bước 4 và cập nhật `FB_PAGE_TOKEN`.
- **Facebook 200 / permission**: token thiếu quyền `pages_manage_posts`.
- **Không có sản phẩm nào có ảnh trên Supabase Storage**: ảnh sản phẩm còn dạng base64, vào admin bấm chuyển ảnh sang Supabase Storage.

## Muốn ngừng tự đăng

Xoá biến `FB_PAGE_TOKEN` trên Vercel (hàm sẽ báo thiếu biến và không đăng), hoặc xoá mục `crons` trong `vercel.json`.
