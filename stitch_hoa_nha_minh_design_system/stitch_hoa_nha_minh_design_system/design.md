# DESIGN.md — WEBSITE TIỆM HOA "HOA NHÀ MÌNH"

> **Design direction được điều chỉnh theo wireframe website tiệm hoa đã cung cấp.**
>
> Thương hiệu sử dụng logo **HOA NHÀ MÌNH** trong file logo gốc; wireframe tham chiếu có cấu trúc website desktop theo hướng editorial/e-commerce, nhiều khoảng trắng, bố cục gọn và ưu tiên khả năng mua hàng.

---

## 01. BRAND FOUNDATION

### Brand

**Tên:** Hoa Nhà Mình  
**Tagline:** `Let flowers speak your heart!`

### Tinh thần thương hiệu

- Handmade
- Ấm áp
- Tự nhiên
- Trẻ trung
- Gần gũi
- Có tính kể chuyện
- Không quá luxury

### Logo

Sử dụng logo **Hoa Nhà Mình** đã cung cấp làm logo chính thức.

Logo gốc có:
- Chữ script màu hồng/magenta.
- Tagline `Let flowers speak your heart!`
- Họa tiết hoa, lá, mặt trời theo nét vẽ tay/crayon.
- Nền kem/giấy thủ công.

**Lưu ý:** Logo không đặt lại ở cuối footer dưới dạng một logo riêng. Footer chỉ cần tên thương hiệu dạng text nếu cần.

---

# 02. VISUAL DIRECTION THEO WIREFRAME

Wireframe cho thấy giao diện cần đi theo hướng **clean editorial + flower shop**, thay vì scrapbook quá nhiều chi tiết.

### Tỷ lệ visual

- Khoảng trắng lớn.
- Nội dung nằm trong container trung tâm.
- Card sản phẩm rõ ràng.
- Hình ảnh là thành phần thị giác chính.
- Decorative floral illustration chỉ dùng ở Hero, About, Collection hoặc các section cần tạo điểm nhấn.
- Không để họa tiết crayon phủ quá nhiều lên UI.

### Phong cách hình ảnh

Ưu tiên:
- Hoa thật.
- Ánh sáng tự nhiên.
- Background trắng/kem.
- Ảnh sản phẩm có cùng tỷ lệ.
- Ảnh lifestyle ở Hero/Collection/Blog.
- Ảnh khách hàng ở Community/Review.

Không ưu tiên:
- Ảnh hoa quá tối.
- Background quá nhiều màu.
- Hiệu ứng 3D/glassmorphism.
- Giao diện luxury florist màu đen/gold.

---

# 03. COLOR SYSTEM — BÁM TRỰC TIẾP THEO LOGO

Bảng màu được lấy cảm hứng từ **các màu xuất hiện trực tiếp trong logo Hoa Nhà Mình**: nền giấy kem, chữ hồng, lá xanh, hoa xanh/tím/hồng và điểm nhấn vàng/cam.

| Token | Hex | Sử dụng |
|---|---|---|
| **Brand Pink** | `#D95A82` | Màu chữ logo, heading cảm xúc, CTA thương hiệu |
| Deep Pink | `#C83F70` | Hover, active, emphasis |
| Soft Pink | `#F3A8C0` | Badge, background phụ, illustration |
| **Paper Cream** | `#F3EED8` | Background thương hiệu chính |
| Warm Cream | `#FAF7E9` | Background section/card |
| **Leaf Green** | `#3E9B61` | Lá, icon, floral accent |
| Deep Leaf | `#277A4D` | Heading/CTA phụ, navigation |
| **Flower Blue** | `#43B7D0` | Hoa xanh, link/accent |
| **Flower Purple** | `#A45AA7` | Hoa tím, accent |
| **Sun Yellow** | `#F4C52D` | Điểm nhấn hoa/mặt trời |
| **Flower Orange** | `#F29A38` | Nhụy hoa, accent |
| Text | `#4B4240` | Body text |
| Muted Text | `#857B76` | Secondary text |
| Border | `#E5DDCE` | Input, divider, card |

### Tỷ lệ sử dụng màu

```text
Paper Cream / White       60%
Dark/Leaf Green           15%
Brand Pink                12%
Soft Pink                 5%
Blue + Purple             4%
Yellow + Orange           4%
```

Đây là tỷ lệ định hướng, không phải quy định cứng cho từng page.

### Nguyên tắc quan trọng

1. **Brand Pink `#D95A82` là màu nhận diện chính**, vì đây là màu nổi bật nhất của chữ "Hoa nhà mình".
2. **Cream `#F3EED8` là nền cảm xúc**, mô phỏng nền giấy trong logo.
3. **Green `#3E9B61` là màu cân bằng**, lấy từ nét lá và thân cây trong logo.
4. Blue, purple, yellow và orange chỉ dùng như các **floral accents**, không dùng đồng thời với cường độ cao.
5. Không dùng black thuần `#000000`.
6. Không dùng dark green làm màu chủ đạo toàn bộ UI; dark green chỉ là màu phụ để giữ độ tương phản.
7. Tránh gradient mạnh. Nếu cần gradient, chỉ sử dụng gradient rất nhẹ giữa cream và soft pink.
8. Background website ưu tiên **cream/white**, để sản phẩm hoa trở thành điểm tập trung thị giác.

### Color hierarchy

```text
LOGO / BRAND
    ↓
Brand Pink

BACKGROUND
    ↓
Paper Cream / Warm Cream

NAVIGATION / SECONDARY CTA
    ↓
Deep Leaf Green

FLORAL ACCENTS
    ↓
Pink · Blue · Purple · Yellow · Orange
```

---

# 04. TYPOGRAPHY — THEO LOGO HOA NHÀ MÌNH

Typography phải tạo cảm giác **viết tay, mềm, vui và thân thiện** giống chữ "Hoa nhà mình" trong logo.

### 04.1. Display / Brand Font

**Font ưu tiên: `Pacifico`**

Dùng cho:
- Hero heading.
- Heading thương hiệu.
- Một số câu quote/callout.
- Tên thương hiệu khi cần thể hiện bằng text.

Đặc điểm cần giữ:
- Handwritten/script.
- Nét tròn.
- Độ dày tương đối đồng đều.
- Có cảm giác tự nhiên, không quá formal.
- Chữ có độ bay giống lettering trong logo.

**Fallback:**
```text
Pacifico,
"Brush Script MT",
"Segoe Script",
cursive
```

> Nếu logo được dùng dưới dạng image/SVG thì **không cần thay logo bằng font**. Font trên chỉ dùng để đồng bộ các heading mang tính thương hiệu.

### 04.2. Heading phụ

Ưu tiên `Nunito Sans` hoặc `Be Vietnam Pro` SemiBold.

Không dùng serif editorial làm font chính nữa, vì serif sẽ tạo cảm giác cao cấp/truyền thống khác với tính handmade của logo.

### 04.3. Body Font

Ưu tiên:

**`Be Vietnam Pro`**

Fallback:

```text
Be Vietnam Pro,
Inter,
Arial,
sans-serif
```

Lý do:
- Hỗ trợ tiếng Việt tốt.
- Hình dáng tròn, hiện đại.
- Phù hợp với handwritten display font.
- Dễ đọc trên mobile.

### 04.4. Typography hierarchy

```text
Brand / Hero:
Pacifico — 48–64px desktop / 34–42px mobile

H1:
Be Vietnam Pro — 36–48px / 30–36px

H2:
Be Vietnam Pro — 28–36px / 24–30px

H3:
Be Vietnam Pro — 20–26px / 18–22px

Body:
Be Vietnam Pro — 15–17px

Caption:
Be Vietnam Pro — 12–14px

Button:
Be Vietnam Pro Medium/SemiBold — 13–15px
```

### 04.5. Quy tắc dùng font

**Không dùng Pacifico cho:**
- Paragraph.
- Product description dài.
- Form.
- Navigation.
- Bảng thông tin.
- Giá sản phẩm.

**Dùng Pacifico cho:**
- Hero headline.
- Brand statement.
- Section title có tính cảm xúc.
- Quote.
- Một số decorative text.

Mục tiêu là để typography có **70–80% khả năng đọc bằng sans-serif và 20–30% điểm nhấn handwritten**, thay vì biến toàn bộ website thành chữ viết tay.

---

# 05. GLOBAL HEADER

Theo wireframe, header cần rất gọn.

```text
[ HOA NHÀ MÌNH ]

Trang chủ   Sản phẩm   Hoa theo dịp   Bộ sưu tập   Blog   Giới thiệu   Liên hệ

                                              ♡   👤   🛒
```

### Header behavior

- Desktop: navigation ngang.
- Sticky khi scroll.
- Logo bên trái.
- Navigation ở trung tâm.
- Utility icons bên phải.
- Mobile: logo + search/cart + hamburger.
- Cart icon có badge số lượng.

### Navigation chính

1. Trang chủ
2. Sản phẩm
3. Hoa theo dịp
4. Bộ sưu tập
5. Blog
6. Giới thiệu
7. Liên hệ

---

# 06. SITEMAP / INFORMATION ARCHITECTURE

```text
TRANG CHỦ
│
├── SẢN PHẨM
│   ├── Tất cả sản phẩm
│   ├── Bó hoa
│   ├── Hộp hoa
│   └── Giỏ hoa
│
├── HOA THEO DỊP
│   ├── Lễ tốt nghiệp
│   ├── Sinh nhật
│   ├── Valentine
│   └── Khác
│
├── BỘ SƯU TẬP
│   ├── Bộ sưu tập mới
│   ├── Bộ sưu tập theo chủ đề
│   ├── Bộ sưu tập theo màu
│   └── Bộ sưu tập theo mùa
│
├── BLOG
│   ├── Danh sách bài viết
│   └── Chi tiết bài viết
│
├── GIỚI THIỆU
│   ├── Câu chuyện thương hiệu
│   ├── Triết lý thương hiệu
│   ├── Giá trị thương hiệu
│   └── Cam kết chất lượng
│
├── LIÊN HỆ
│   ├── Thông tin cửa hàng
│   ├── Bản đồ
│   ├── Form liên hệ
│   └── Mạng xã hội
│
├── TÀI KHOẢN
│   ├── Đăng nhập
│   ├── Đăng ký
│   ├── Quên mật khẩu
│   └── Tài khoản cá nhân
│
├── YÊU THÍCH
│
├── GIỎ HÀNG
│
├── THANH TOÁN
│
└── ĐẶT HÀNG THÀNH CÔNG
```

---

# 07. SCREEN 01 — TRANG CHỦ

Wireframe cho thấy Home gồm các block chính:

### Hero

Bố cục 2 cột:

```text
┌───────────────────────────────┬──────────────────────┐
│                               │                      │
│ HOA ĐẸP HƠN                   │                      │
│ KHI ĐƯỢC GỬI GẮM             │      ẢNH HOA        │
│ CẢM XÚC                       │                      │
│                               │                      │
│ Mô tả ngắn                    │                      │
│                               │                      │
│ [ KHÁM PHÁ HOA ]              │                      │
└───────────────────────────────┴──────────────────────┘
```

Có thể dùng floral illustration ở phía ảnh như wireframe.

### Danh mục "Dành cho ai"

4 category card:

- Bản thân
- Người yêu
- Gia đình
- Bạn bè

### Sản phẩm nổi bật

Tab:

- Mới
- Bán chạy
- Được yêu thích

Product grid 4 cards.

### Section tiếp theo

Một block editorial gồm:

- Hình ảnh hoa
- Heading
- Mô tả
- CTA

Mục đích: chuyển từ browsing sang storytelling.

### CTA

CTA chính dùng:

`KHÁM PHÁ HOA`

CTA phụ:

`XEM TẤT CẢ`

---

# 08. SCREEN 02 — TRANG SẢN PHẨM

Theo wireframe: layout gồm **sidebar filter + product grid**.

```text
┌─────────────────┬──────────────────────────────────────┐
│ BỘ LỌC          │ Tất cả sản phẩm                      │
│                 │                                      │
│ LOẠI HOA        │ [card] [card] [card]                │
│ □ Bó hoa        │ [card] [card] [card]                │
│ □ Hộp hoa       │ [card] [card] [card]                │
│ □ Giỏ hoa       │                                      │
│                 │                                      │
│ MÀU SẮC         │                                      │
│ □ Trắng         │                                      │
│ □ Hồng          │                                      │
│ □ Xanh          │                                      │
│ □ Đỏ            │                                      │
│ □ Tím           │                                      │
│ □ Pastel        │                                      │
│                 │                                      │
│ MỨC GIÁ         │                                      │
│ □ < 300K        │                                      │
│ □ 300–500K      │                                      │
│ □ 500–800K      │                                      │
│ □ > 800K        │                                      │
└─────────────────┴──────────────────────────────────────┘
```

### Bộ lọc bắt buộc

**Theo loại:**
- Bó hoa
- Hộp hoa
- Giỏ hoa

**Theo màu:**
- Trắng
- Hồng
- Xanh
- Đỏ
- Tím
- Pastel

**Theo mức giá:**
- Dưới 300.000đ
- 300.000–500.000đ
- 500.000–800.000đ
- Trên 800.000đ

> Không sử dụng filter "Theo phong cách". Đã thay bằng "Theo mức giá".

### Product Card

```text
[ ẢNH ]

Tên sản phẩm
★★★★★
450.000đ

♡
```

Hover:
- Zoom ảnh rất nhẹ.
- Hiện Quick View.
- Wishlist icon.

---

# 09. SCREEN 03 — CHI TIẾT SẢN PHẨM

Wireframe sử dụng bố cục **gallery bên trái + thông tin bên phải**.

```text
┌──────────────────────┬────────────────────────────┐
│                      │ Bó hoa hồng pastel         │
│                      │ ★★★★★                      │
│    ẢNH CHÍNH         │ 450.000đ                   │
│                      │                            │
│                      │ Màu: ○ ○ ○ ○               │
│                      │ Kích thước: S M L           │
│                      │ Số lượng: [-] 1 [+]         │
│                      │                            │
│                      │ [ THÊM VÀO GIỎ HÀNG ]      │
│                      │ [ MUA NGAY ]               │
└──────────────────────┴────────────────────────────┘
```

### Thông tin

- Tên sản phẩm
- Rating
- Giá
- Mã sản phẩm
- Màu sắc
- Kích thước
- Số lượng
- CTA

### Nội dung phía dưới

Tabs:

- Mô tả
- Hướng dẫn bảo quản
- Chính sách giao hàng
- Đánh giá

### Sản phẩm liên quan

4 cards.

---

# 10. SCREEN 04 — TRANG BỘ SƯU TẬP

Wireframe có hero editorial riêng.

### Hero

```text
BỘ SƯU TẬP
Nơi mỗi bó hoa kể một câu chuyện riêng

[ KHÁM PHÁ ]
```

Có floral illustration ở bên phải.

### Bộ sưu tập mới

Grid 4 card.

### Bộ sưu tập theo chủ đề

Chip:

- Romantic
- Birthday
- Graduation
- Thank You
- Family

### Theo màu

Chip:

- Trắng
- Hồng
- Xanh
- Đỏ
- Tím
- Pastel

### Theo mùa

Grid hình ảnh.

---

# 11. SCREEN 05 — TRANG BLOG

Wireframe sử dụng bố cục editorial:

```text
Những điều thú vị
về thế giới hoa

[ Bài nổi bật ]

[card] [card] [card]
[card] [card] [card]
```

### Category

- Hoa & cảm xúc
- Chăm sóc hoa
- Kiến thức về hoa
- Quà tặng
- Câu chuyện Hoa Nhà Mình

### Featured article

Ảnh lớn + title + excerpt + CTA.

### Article cards

Mỗi card:

- Image
- Category
- Title
- Date
- Read more

---

# 12. SCREEN 06 — CHI TIẾT BÀI VIẾT

Layout:

```text
Category
# Ý nghĩa của hoa hồng trong từng màu sắc

Ngày đăng · Tác giả

[ HERO IMAGE ]

Nội dung bài viết...

[ Sản phẩm liên quan ]
```

### Sidebar desktop

- Mục lục
- Bài viết liên quan
- Sản phẩm liên quan

### Cuối bài

`Bạn đang tìm một bó hoa phù hợp?`

[ KHÁM PHÁ SẢN PHẨM ]

---

# 13. SCREEN 07 — GIỚI THIỆU

Wireframe dùng cấu trúc storytelling.

### Hero

```text
Về Hoa Nhà Mình

Một bó hoa đẹp không chỉ
để ngắm — mà để gửi một điều
khó nói thành lời.
```

### 4 giá trị

Icon + text:

1. Hoa tươi mỗi ngày
2. Chọn hoa bằng sự tinh tế
3. Gói ghém theo từng câu chuyện
4. Giao hàng chỉn chu

### Triết lý

Một block ảnh + text.

### Cam kết chất lượng

Checklist:

- Hoa được chọn mới.
- Kiểm tra trước khi giao.
- Đóng gói cẩn thận.
- Hỗ trợ khách hàng.

---

# 14. SCREEN 08 — LIÊN HỆ

Theo wireframe, **Map phải nằm trong block Thông tin cửa hàng**.

```text
┌──────────────────────────────────────────────────────┐
│ Liên hệ với chúng tôi                               │
│                                                      │
│ THÔNG TIN CỬA HÀNG       BẢN ĐỒ       FORM          │
│                                                      │
│ Địa chỉ                 [ MAP ]      Họ và tên       │
│ Hotline                              Email           │
│ Email                                SĐT             │
│ Giờ nhận đơn                         Nội dung        │
│                                                      │
│                                      [ GỬI LIÊN HỆ ]│
└──────────────────────────────────────────────────────┘
```

### Thông tin cửa hàng

- Địa chỉ
- Hotline
- Email
- **Giờ nhận đơn**
- Bản đồ

> Không sử dụng cụm "Giờ mở cửa".

### Form

- Họ tên *
- Email
- Số điện thoại *
- Nội dung *

CTA:

`GỬI LIÊN HỆ`

### Social

Chỉ cần icon/link:

- Facebook
- Instagram
- Threads
- TikTok

Không đặt logo ở cuối footer.

---

# 15. SCREEN 09 — ĐĂNG NHẬP / ĐĂNG KÝ

Wireframe sử dụng form 2 cột trên desktop.

### Đăng nhập

```text
ĐĂNG NHẬP

Email
Mật khẩu

[ ĐĂNG NHẬP ]

Quên mật khẩu?

Chưa có tài khoản?
[ ĐĂNG KÝ ]
```

### Đăng ký

```text
ĐĂNG KÝ

Họ tên
Email
Số điện thoại
Mật khẩu
Xác nhận mật khẩu

[ TẠO TÀI KHOẢN ]
```

---

# 16. SCREEN 10 — TÀI KHOẢN CÁ NHÂN

Theo wireframe: sidebar navigation + content.

```text
TÀI KHOẢN
├── Thông tin cá nhân
├── Địa chỉ giao hàng
├── Lịch sử đơn hàng
├── Sản phẩm yêu thích
└── Đăng xuất
```

### Thông tin cá nhân

- Họ tên
- Email
- Số điện thoại
- [LƯU THAY ĐỔI]

### Địa chỉ

- Địa chỉ mặc định
- Thêm địa chỉ
- Sửa/Xóa

### Lịch sử đơn hàng

Table/card:

- Mã đơn
- Ngày đặt
- Tổng tiền
- Trạng thái
- Xem chi tiết

---

# 17. SCREEN 11 — SẢN PHẨM YÊU THÍCH

Grid product cards.

```text
SẢN PHẨM YÊU THÍCH

[card] [card] [card] [card]
[card] [card] [card] [card]
```

Mỗi card có:
- Ảnh
- Tên
- Giá
- Wishlist toggle
- Thêm vào giỏ

Empty state:

```text
Bạn chưa lưu sản phẩm nào.

[ KHÁM PHÁ HOA ]
```

---

# 18. SCREEN 12 — GIỎ HÀNG

Theo wireframe:

```text
GIỎ HÀNG

┌───────────────────────────────────────┬──────────────┐
│ SẢN PHẨM                              │ TỔNG ĐƠN     │
│                                       │              │
│ [img] Bó hoa pastel                  │ Tạm tính     │
│       450.000đ   [-] 1 [+]           │ Phí giao hàng│
│                                       │              │
│ [img] Hộp hoa                         │ TỔNG         │
│       550.000đ   [-] 1 [+]           │              │
│                                       │ [ THANH TOÁN]│
└───────────────────────────────────────┴──────────────┘
```

### Cart item

- Image
- Product name
- Unit price
- Quantity
- Total
- Delete

### Summary

- Tạm tính
- Phí giao hàng
- Tổng tiền

CTA:

`TIẾN HÀNH THANH TOÁN`

---

# 19. SCREEN 13 — THANH TOÁN

Wireframe sử dụng checkout 2 cột.

### Cột trái

**Thông tin nhận hàng**

- Họ tên
- Số điện thoại
- Email
- Địa chỉ
- Thời gian nhận hàng
- Lời nhắn

### Cột phải

**Đơn hàng**

- Sản phẩm
- Số lượng
- Giá
- Phí giao hàng
- Tổng tiền

### Thanh toán

- COD
- Chuyển khoản
- Thanh toán online

CTA:

`ĐẶT HÀNG`

---

# 20. SCREEN 14 — ĐẶT HÀNG THÀNH CÔNG

Theo wireframe, confirmation card ở trung tâm.

```text
✓

ĐẶT HÀNG THÀNH CÔNG

Cảm ơn bạn đã đặt hoa tại
Hoa Nhà Mình.

Mã đơn hàng: #HM00001

Thông tin đơn hàng
Thông tin giao hàng

[ THEO DÕI ĐƠN HÀNG ]
[ TIẾP TỤC MUA HÀNG ]
```

Có thể thêm floral illustration nhỏ phía trên card.

---

# 21. FOOTER

Footer theo wireframe cần **gọn**, không tạo thêm logo riêng.

```text
HOA NHÀ MÌNH

Sản phẩm
Hoa theo dịp
Bộ sưu tập
Blog
Giới thiệu
Liên hệ

Facebook   Instagram   Threads   TikTok

© Hoa Nhà Mình
```

### Quy tắc

- Không đặt logo hình ảnh ở footer.
- 4 mạng xã hội chỉ là icon/link.
- Không tạo thêm social wall lớn ở footer.
- Footer dùng nền dark green hoặc cream tùy section tổng thể.

---

# 22. PRODUCT / E-COMMERCE COMPONENTS

Các component cần thiết:

- Header
- Search
- Product Card
- Product Grid
- Filter Sidebar
- Filter Chip
- Color Filter
- Price Filter
- Product Gallery
- Quantity Selector
- Rating
- Wishlist
- Quick View
- Cart Item
- Order Summary
- Checkout Form
- Review Card
- Category Card
- Collection Card
- Blog Card
- Social Link
- Breadcrumb
- Pagination
- Toast
- Modal
- Empty State

---

# 23. BUTTON SYSTEM

### Primary

```text
background: #3E9B61
text: #FFFFFF
```

Dùng cho các action UI chính như:
- Thêm vào giỏ hàng
- Tiến hành thanh toán
- Gửi form

### Brand CTA

```text
background: #D95A82
text: #FFFFFF
```

Dùng cho:
- Mua ngay
- Khám phá hoa
- CTA hero
- CTA mang tính cảm xúc/thương hiệu

Dùng cho:
- Mua ngay
- CTA thương hiệu
- CTA cần nhấn mạnh

### Secondary

```text
background: transparent
border: #29483C
text: #29483C
```

### Shape

- Radius: 8–12px.
- Không dùng button quá pill ở toàn bộ website.
- Hover transition: 180–250ms.

---

# 24. CARD SYSTEM

### Product Card

- Background: `#FFFFFF`
- Border: `#E5DED5`
- Radius: 10–14px
- Image ratio: 1:1
- Product name: 14–16px
- Price: 14–16px, semibold
- Wishlist: top-right

### Editorial Card

Có thể không cần border.

- Image lớn.
- Heading serif/script.
- Metadata nhỏ.
- Nhiều whitespace.

---

# 25. GRID & LAYOUT

### Desktop

Container:

```text
max-width: 1200–1280px
margin: auto
```

Product:

```text
4 columns
gap: 20–24px
```

### Tablet

```text
2–3 columns
```

### Mobile

```text
2 columns product
1 column editorial
```

### Section spacing

Desktop:

```text
80–100px
```

Mobile:

```text
48–64px
```

---

# 26. RESPONSIVE

### Desktop ≥ 1200px

- Full navigation.
- Filter sidebar.
- Product grid 4 columns.
- Checkout 2 columns.
- Contact 3-column layout.

### Tablet 768–1199px

- Navigation rút gọn.
- Filter có thể chuyển thành drawer.
- Product grid 2–3 columns.

### Mobile < 768px

- Header hamburger.
- Product grid 2 columns.
- Filter mở bằng drawer/bottom sheet.
- Product detail 1 column.
- Cart 1 column.
- Checkout 1 column.
- Contact 1 column.
- CTA full width.

---

# 27. UX FLOW

### Mua sản phẩm

```text
Trang chủ
   ↓
Sản phẩm
   ↓
Filter / Search
   ↓
Product Detail
   ↓
Thêm vào giỏ
   ↓
Giỏ hàng
   ↓
Thanh toán
   ↓
Đặt hàng thành công
```

### Khám phá theo cảm xúc

```text
Trang chủ
   ↓
Hoa theo dịp
   ↓
Lễ tốt nghiệp / Sinh nhật / Valentine / Khác
   ↓
Danh sách sản phẩm
   ↓
Chi tiết sản phẩm
```

### Storytelling

```text
Trang chủ
   ↓
Bộ sưu tập
   ↓
Blog
   ↓
Chi tiết bài viết
   ↓
Sản phẩm liên quan
```

---

# 28. ACCESSIBILITY

- Contrast text/background rõ ràng.
- Có alt text cho ảnh.
- Form có label.
- Button có focus state.
- Không dùng màu sắc là tín hiệu duy nhất.
- Font hỗ trợ tiếng Việt.
- Touch target mobile tối thiểu khoảng 44px.
- Không để decorative illustration ảnh hưởng đến khả năng đọc.

---

# 29. FINAL DESIGN RULES

### BẮT BUỘC

1. Logo chính là **Hoa Nhà Mình**.
2. Visual bám tinh thần logo: handmade, floral, warm, friendly.
3. Bố cục website bám wireframe: **clean, nhiều whitespace, editorial + e-commerce**.
4. Trang sản phẩm có **sidebar filter + product grid** trên desktop.
5. Màu hoa:
   - Trắng
   - Hồng
   - Xanh
   - Đỏ
   - Tím
   - Pastel
6. Filter giá:
   - Dưới 300.000đ
   - 300.000–500.000đ
   - 500.000–800.000đ
   - Trên 800.000đ
7. Không có filter "Phong cách".
8. Trang Contact dùng **Giờ nhận đơn**, không dùng "Giờ mở cửa".
9. Map nằm trong khu vực **Thông tin cửa hàng**.
10. Footer **không có logo hình ảnh**.
11. Footer/social chỉ giữ:
    - Facebook
    - Instagram
    - Threads
    - TikTok
12. Website phải có đầy đủ flow:
    **Product → Detail → Cart → Checkout → Success**.
13. Bổ sung **Bộ sưu tập + Blog + Chi tiết bài viết** theo đúng các màn hình trong wireframe.
14. Decorative floral elements chỉ là điểm nhấn, không lấn át UI.

---

# 30. DESIGN KEYWORD

```text
HOA NHÀ MÌNH
     ↓
WARM
     ↓
HANDMADE
     ↓
FLORAL
     ↓
EDITORIAL
     ↓
CLEAN E-COMMERCE
     ↓
EMOTIONAL STORYTELLING
```

**Mục tiêu cuối:** Website phải giống một **tiệm hoa có cá tính và câu chuyện riêng**, nhưng trải nghiệm mua hàng vẫn rõ ràng, trực quan và đủ chặt chẽ như một website thương mại điện tử.
