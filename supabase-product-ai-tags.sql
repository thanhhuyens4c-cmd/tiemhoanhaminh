-- Nhãn mô tả ảnh sản phẩm (màu, loại hoa, kiểu gói) để tính năng "Quét hoa" ở Góc video so khớp ảnh khách quét.
-- Chạy trong Supabase → SQL Editor. Dữ liệu do scripts/tag_products.py ghi bằng service_role key.
CREATE TABLE IF NOT EXISTS product_ai_tags (
  product_id TEXT PRIMARY KEY,
  tags       JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE product_ai_tags ENABLE ROW LEVEL SECURITY;

-- Khách (trang web) chỉ được đọc; không có policy ghi, nên chỉ service_role ghi được.
CREATE POLICY "Anyone can read product_ai_tags" ON product_ai_tags FOR SELECT USING (true);
