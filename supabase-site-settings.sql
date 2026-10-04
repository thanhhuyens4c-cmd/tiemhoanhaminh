-- Bảng lưu ảnh banner/hero do admin chỉnh, để mọi thiết bị (khách xem web) cùng thấy.
-- Chạy trong Supabase → SQL Editor.
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  src         TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_settings"   ON site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert site_settings" ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update site_settings" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete site_settings" ON site_settings FOR DELETE USING (true);
