-- ╔════════════════════════════════════════════════════════════╗
-- ║  Hoa Nhà Mình — Supabase Orders Table                    ║
-- ╚════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS orders (
  id              TEXT PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Khách hàng (người đặt)
  sender_name     TEXT NOT NULL,
  sender_phone    TEXT NOT NULL,
  sender_email    TEXT,
  customer_zalo   TEXT,

  -- Người nhận
  receiver_name   TEXT NOT NULL,
  receiver_phone  TEXT NOT NULL,
  address         TEXT NOT NULL,

  -- Thời gian giao
  delivery_time   TEXT,

  -- Thiệp / lời nhắn
  card_message    TEXT,

  -- Sản phẩm (JSON array)
  items           JSONB NOT NULL DEFAULT '[]',

  -- Tài chính — tách riêng từng trường
  subtotal            BIGINT NOT NULL DEFAULT 0,
  discount            BIGINT NOT NULL DEFAULT 0,
  flower_subtotal     BIGINT NOT NULL DEFAULT 0,
  shipping_fee        BIGINT NOT NULL DEFAULT 0,
  deposit_percentage  INT NOT NULL DEFAULT 50 CHECK (deposit_percentage >= 50 AND deposit_percentage <= 100),
  deposit_amount      BIGINT NOT NULL DEFAULT 0,
  initial_payment     BIGINT NOT NULL DEFAULT 0,
  remaining_payment   BIGINT NOT NULL DEFAULT 0,
  total               BIGINT NOT NULL DEFAULT 0,
  amount_paid         BIGINT NOT NULL DEFAULT 0,

  -- Trạng thái thanh toán
  -- UNPAID → DEPOSIT_PENDING → DEPOSIT_PAID → PARTIALLY_PAID → FULLY_PAID
  payment_status  TEXT NOT NULL DEFAULT 'DEPOSIT_PENDING'
    CHECK (payment_status IN ('UNPAID','DEPOSIT_PENDING','DEPOSIT_PAID','PARTIALLY_PAID','FULLY_PAID')),

  -- Trạng thái đơn hàng
  -- PENDING → CONFIRMED → PREPARING → READY_TO_DELIVER → DELIVERING → DELIVERED → COMPLETED | CANCELLED
  order_status    TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (order_status IN ('PENDING','CONFIRMED','PREPARING','READY_TO_DELIVER','DELIVERING','DELIVERED','COMPLETED','CANCELLED')),

  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Index cho tra cứu nhanh
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at DESC);

-- RLS: cho phép anonymous insert (khách đặt hoa không cần login)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Admin can update orders" ON orders
  FOR UPDATE USING (true);
