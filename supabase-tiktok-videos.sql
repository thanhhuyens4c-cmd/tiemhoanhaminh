-- Bảng video TikTok cho trang Góc video (video-tiktok.html).
-- Chạy trong Supabase → SQL Editor.
-- Khách chỉ được ĐỌC. n8n ghi dữ liệu bằng service_role key (bỏ qua RLS), không cần policy ghi.
CREATE TABLE IF NOT EXISTS tiktok_videos (
  video_id    TEXT PRIMARY KEY,                 -- dãy số cuối link .../video/<video_id>
  url         TEXT NOT NULL,
  caption     TEXT NOT NULL DEFAULT '',
  product_ids TEXT[] NOT NULL DEFAULT '{}',     -- mã sản phẩm gắn với video (để trống nếu chưa gắn)
  posted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  hidden      BOOLEAN NOT NULL DEFAULT false    -- đặt true để ẩn video khỏi trang
);

ALTER TABLE tiktok_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tiktok_videos" ON tiktok_videos FOR SELECT USING (true);
