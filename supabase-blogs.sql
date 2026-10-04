-- Bảng lưu bài viết blog để mọi thiết bị cùng thấy một dữ liệu.
-- Chạy trong Supabase → SQL Editor.
CREATE TABLE IF NOT EXISTS blogs (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blogs"   ON blogs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blogs" ON blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update blogs" ON blogs FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete blogs" ON blogs FOR DELETE USING (true);
