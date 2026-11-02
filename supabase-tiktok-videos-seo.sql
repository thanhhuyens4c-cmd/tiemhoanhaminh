-- Bổ sung cho trang riêng của từng video (SEO). Chạy trong Supabase → SQL Editor, SAU supabase-tiktok-videos.sql.

-- Ảnh bìa lưu trên Supabase (link ảnh của TikTok hết hạn) và mô tả riêng của video
ALTER TABLE tiktok_videos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE tiktok_videos ADD COLUMN IF NOT EXISTS description   TEXT;

-- Thùng chứa ảnh bìa, công khai để trang web và Google đọc được. n8n ghi bằng service_role key.
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-covers', 'video-covers', true)
ON CONFLICT (id) DO NOTHING;
-- Đưa 16 video cũ (trước đây nằm trong js/tiktok-videos.js) vào bảng, để trang riêng và sitemap thấy được.
-- posted_at đặt ngày cũ để không chen lên đầu trang; video đã có sẽ được bỏ qua.
INSERT INTO tiktok_videos (video_id, url, caption, posted_at) VALUES
  ('7702421977960746247', 'https://www.tiktok.com/@hoanhaminh.htl/video/7702421977960746247', 'Ly thơm và xinh 💕', '2026-01-01'),
  ('7702099380123225351', 'https://www.tiktok.com/@hoanhaminh.htl/video/7702099380123225351', 'Có người mua hoa vì đẹp, có người mua hoa vì nhớ có một người đẹp thích hoa', '2026-01-01'),
  ('7701972983119695111', 'https://www.tiktok.com/@hoanhaminh.htl/video/7701972983119695111', 'Anh thấy em cũng phải thấy ✨', '2026-01-01'),
  ('7697207494141070608', 'https://www.tiktok.com/@hoanhaminh.htl/video/7697207494141070608', 'POV: Bạn đang cầm trên tay bó hoa vừa đăng lại vài ngày trước', '2026-01-01'),
  ('7696919861498236176', 'https://www.tiktok.com/@hoanhaminh.htl/video/7696919861498236176', 'Dễ tính như 4, khách hàng là thượng đế 😘💕', '2026-01-01'),
  ('7696834222786415879', 'https://www.tiktok.com/@hoanhaminh.htl/video/7696834222786415879', '20/10 đặt ngay bó hoa này cho người phụ nữ bạn yêu', '2026-01-01'),
  ('7696450413209472274', 'https://www.tiktok.com/@hoanhaminh.htl/video/7696450413209472274', 'Em muốn được tặng 1 bó hoa xinh thế này...', '2026-01-01'),
  ('7695739152234482951', 'https://www.tiktok.com/@hoanhaminh.htl/video/7695739152234482951', 'Cổ re-up rồi anh lưu chưa 😝', '2026-01-01'),
  ('7695346133886962965', 'https://www.tiktok.com/@hoanhaminh.htl/video/7695346133886962965', 'Cổ re-up và đây là thứ nhận lại', '2026-01-01'),
  ('7694995268487384327', 'https://www.tiktok.com/@hoanhaminh.htl/video/7694995268487384327', '20/10 chưa biết tặng hoa gì!!?', '2026-01-01'),
  ('7694134258515873042', 'https://www.tiktok.com/@hoanhaminh.htl/video/7694134258515873042', '20/10 đến nơi rồi! Công chúa đăng lại, Hoàng tử chốt đơn thôi nhỉ?', '2026-01-01'),
  ('7693475743921212678', 'https://www.tiktok.com/@hoanhaminh.htl/video/7693475743921212678', 'Tình yêu là khi nhìn thấy một điều xinh đẹp là nghĩ ngay đến một người', '2026-01-01'),
  ('7692709993010760967', 'https://www.tiktok.com/@hoanhaminh.htl/video/7692709993010760967', 'Manifest 20/10 này anh ấy sẽ mua bó hoa này tặng bạn', '2026-01-01'),
  ('7691677872238775559', 'https://www.tiktok.com/@hoanhaminh.htl/video/7691677872238775559', 'You did it 🏆 Một chiếc cúp hoa dành cho người mà bạn muốn nói “cậu giỏi lắm”', '2026-01-01'),
  ('7691505946555600146', 'https://www.tiktok.com/@hoanhaminh.htl/video/7691505946555600146', 'Một bó hoa cho những ngày Hà Nội vào thu', '2026-01-01'),
  ('7690860353290292498', 'https://www.tiktok.com/@hoanhaminh.htl/video/7690860353290292498', 'Tone hoa mọi cô gái đều muốn được nhận!', '2026-01-01')
ON CONFLICT (video_id) DO NOTHING;
