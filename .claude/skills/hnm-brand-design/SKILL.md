---
name: hnm-brand-design
description: Quy tắc thương hiệu và giao diện của web Hoa Nhà Mình (màu, font, phong cách). Dùng khi thêm hoặc sửa giao diện, CSS, section, nút, card sản phẩm.
---

# Thương hiệu & giao diện Hoa Nhà Mình

Nguồn chi tiết: `PRD.md` (mục 01–04). Phong cách: handmade, ấm áp, tự nhiên, clean editorial, nhiều khoảng trắng, hình ảnh là trọng tâm. Không làm kiểu luxury đen/vàng, không 3D, không glassmorphism.

## Màu
| Token | Hex | Dùng cho |
|---|---|---|
| Brand Pink | `#D95A82` | màu nhận diện, CTA chính |
| Deep Pink | `#C83F70` | hover/active |
| Soft Pink | `#F3A8C0` | badge, nền phụ |
| Paper Cream | `#F3EED8` | nền thương hiệu |
| Warm Cream | `#FAF7E9` | nền section/card |
| Leaf Green | `#3E9B61` / Deep Leaf `#277A4D` | điều hướng, CTA phụ |
| Blue `#43B7D0`, Purple `#A45AA7`, Yellow `#F4C52D`, Orange `#F29A38` | chỉ làm điểm nhấn hoa |
| Text `#4B4240`, Muted `#857B76`, Border `#E5DDCE` | chữ, viền |

- Không dùng đen thuần `#000000`; tránh gradient mạnh.
- Nền ưu tiên cream/trắng để sản phẩm nổi bật.

## Font và kỹ thuật
- Tiêu đề viết tay: `Pacifico`. Nội dung: `Be Vietnam Pro` (xem `css/custom.css`).
- Dự án dùng Tailwind qua CDN (`https://cdn.tailwindcss.com`) cộng `css/custom.css`. Không thêm bước build.
- Ảnh sản phẩm cùng tỷ lệ; họa tiết crayon chỉ ở Hero/About/Collection.
- Luôn kiểm tra giao diện mobile (web chủ yếu được xem trên điện thoại).
