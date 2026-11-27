-- Nhật ký bài đã tự đăng lên Facebook Page (dùng cho /api/fb-autopost).
-- Chạy trong Supabase → SQL Editor.
-- Hàm /api/fb-autopost ghi bằng service_role key (bỏ qua RLS), nên không cần policy ghi.
-- Mục đích: không đăng lặp lại cùng một mẫu hoa, và để xem lại AI đã viết gì.
CREATE TABLE IF NOT EXISTS fb_posts (
  id          BIGSERIAL PRIMARY KEY,
  product_id  TEXT NOT NULL,
  image_url   TEXT NOT NULL,
  caption     TEXT NOT NULL,
  fb_post_id  TEXT,                               -- id bài trên Facebook (null nếu đăng lỗi)
  status      TEXT NOT NULL DEFAULT 'posted' CHECK (status IN ('posted', 'failed', 'dry_run')),
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fb_posts_product ON fb_posts (product_id, created_at DESC);

-- Bật RLS và KHÔNG tạo policy nào: khách (anon key) không đọc/ghi được bảng này.
ALTER TABLE fb_posts ENABLE ROW LEVEL SECURITY;
