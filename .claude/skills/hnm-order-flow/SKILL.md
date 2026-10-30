---
name: hnm-order-flow
description: Luồng giỏ hàng, thanh toán, đặt cọc và trạng thái đơn hàng của web Hoa Nhà Mình. Dùng khi sửa gio-hang, thanh-toan, dat-hang-thanh-cong, bảng orders hoặc phần đơn hàng trong admin.
---

# Luồng đặt hàng

Các trang: `gio-hang.html` → `thanh-toan.html` → `dat-hang-thanh-cong.html`. Giỏ hàng, wishlist, mã giảm giá lưu trong `localStorage` (khoá nằm trong `Store.KEYS` ở `js/store.js`); đơn hàng ghi vào bảng `orders` của Supabase (`supabase-setup.sql`).

## Dữ liệu đơn
- Người đặt: `sender_name`, `sender_phone`, `sender_email`, `customer_zalo`. Người nhận: `receiver_name`, `receiver_phone`, `address`. Thêm `delivery_time`, `card_message`.
- `items` là JSONB. Tiền tách từng trường: `subtotal`, `discount`, `flower_subtotal`, `shipping_fee`, `deposit_percentage`, `deposit_amount`, `initial_payment`, `remaining_payment`, `total`, `amount_paid`.
- **Đặt cọc tối thiểu 50%** (`deposit_percentage` có CHECK từ 50 đến 100). Không được cho phép dưới mức này ở giao diện.

## Trạng thái
- `payment_status`: `UNPAID` → `DEPOSIT_PENDING` → `DEPOSIT_PAID` → `PARTIALLY_PAID` → `FULLY_PAID`.
- `order_status`: `PENDING` → `CONFIRMED` → `PREPARING` → `READY_TO_DELIVER` → `DELIVERING` → `DELIVERED` → `COMPLETED` (hoặc `CANCELLED`).
- Thêm trạng thái mới phải sửa cả CHECK trong SQL (skill `hnm-supabase-sql`), `js/admin.js` và nhãn tiếng Việt hiển thị.

## Kiểm tra khi sửa
Tổng tiền = tiền hoa (sau giảm) + phí ship; `initial_payment + remaining_payment = total`. Thử giỏ trống, mã giảm giá, và chế độ không kết nối được Supabase.
