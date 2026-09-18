/**
 * Dữ liệu sản phẩm, bộ sưu tập, blog và đánh giá cho Tiệm hoa tươi thủ công "Hoa Nhà Mình"
 * Bản quyền thuộc về Hoa Nhà Mình - Let flowers speak your heart!
 */

const PRODUCTS = [];

const BLOG_POSTS = [
  {
    id: "blog-01",
    title: "Ý nghĩa của hoa hồng trong từng sắc thái và cách chọn hoa cho người thương",
    slug: "y-nghia-cua-hoa-hong-trong-tung-sac-thai",
    category: "Hoa & Cảm xúc",
    categorySlug: "emotion",
    date: "14/09/2026",
    author: "Thu Trang (Florist Hoa Nhà Mình)",
    readTime: "5 phút đọc",
    image: "assets/images/bouquet-pink.png",
    excerpt: "Hoa hồng không chỉ có màu đỏ rực lửa. Mỗi sắc thái từ phớt hồng pastel đến cam ấm áp đều mang một lời nhắn gửi rất riêng...",
    content: `
      <p>Trong thế giới của muôn loài hoa, hoa hồng vẫn luôn giữ một vị trí đặc biệt trong trái tim những người yêu cái đẹp. Nhưng bạn có biết, mỗi gam màu của đóa hồng lại cất giấu một ngôn từ rất đỗi dịu dàng?</p>
      
      <h3>1. Hồng Pastel — Sự dịu dàng và lời thương mộc mạc</h3>
      <p>Không quá mãnh liệt như đỏ tươi, sắc hồng pastel mang lại cảm giác dễ chịu, an yên và gần gũi. Đó là sự khởi đầu ngọt ngào của những rung động trong veo, hoặc lời cảm ơn chân thành gửi đến người bạn trân quý nhất.</p>
      
      <h3>2. Hoa hồng đỏ nhung — Lời thề ước thủy chung</h3>
      <p>Màu đỏ nhung tượng trưng cho tình yêu sâu đậm và sự say đắm vượt qua mọi thử thách của thời gian. Khi bạn muốn người ấy biết rằng vị trí của họ trong tim bạn là duy nhất, một bó hoa hồng đỏ Pháp luôn là lựa chọn trọn vẹn nhất.</p>
      
      <h3>3. Bó hoa đẹp nhất là bó hoa đúng lúc</h3>
      <p>Tại Hoa Nhà Mình, chúng mình luôn tin rằng không cần phải đợi đến một dịp lễ đặc biệt mới tặng hoa. Một nhành hoa tươi bất ngờ vào một chiều thứ Năm bình dị có khi lại là món quà khiến người thương nhớ mãi không nguôi.</p>
    `,
    relatedProducts: ["HNM-HM001", "HNM-HM006"]
  },
  {
    id: "blog-02",
    title: "5 bí quyết giữ hoa tươi lâu tại nhà cực đơn giản từ nghệ nhân cắm hoa",
    slug: "5-bi-quyet-giu-hoa-tuoi-lau-tai-nha",
    category: "Chăm sóc hoa",
    categorySlug: "care",
    date: "10/09/2026",
    author: "Bác Hùng (Chăm sóc vườn hoa)",
    readTime: "4 phút đọc",
    image: "assets/images/florist-workshop.png",
    excerpt: "Làm sao để bó hoa yêu thích vẫn giữ được độ căng tràn sức sống suốt 5-7 ngày? Dưới đây là những mẹo nhỏ từ tiệm...",
    content: `
      <p>Nhận được một bó hoa đẹp là niềm hạnh phúc lớn, nhưng nhìn hoa nhanh tàn lại khiến chúng ta tiếc nuối. Thực tế, chỉ cần vài thao tác nhỏ mỗi sớm mai, bạn hoàn toàn có thể kéo dài tuổi thọ của hoa thêm nhiều ngày.</p>
      
      <h3>1. Cắt gốc vát 45 độ dưới vòi nước</h3>
      <p>Diện tích tiếp xúc của mặt cắt càng lớn, hoa càng hút nước nhanh. Hãy dùng dao hoặc kéo thật sắc để không làm bầm dập mạch dẫn của cành hoa.</p>
      
      <h3>2. Vặt bỏ lá ngập trong nước</h3>
      <p>Lá ngâm trong nước sẽ nhanh chóng bị phân hủy, sinh vi khuẩn gây thối gốc và làm đục nước cắm hoa.</p>
      
      <h3>3. Cho một chút đường và vài giọt chanh</h3>
      <p>Đường cung cấp dưỡng chất nuôi cánh hoa, còn chanh giúp ức chế vi khuẩn phát triển trong nước.</p>
    `,
    relatedProducts: ["HNM-HM002", "HNM-HM005"]
  },
  {
    id: "blog-03",
    title: "Chuyện kể từ ngõ nhỏ: Vì sao chúng mình chọn gói hoa bằng giấy kraft và dây gai?",
    slug: "vi-sao-chung-minh-chon-goi-hoa-bang-giay-kraft-va-day-gai",
    category: "Câu chuyện Hoa Nhà Mình",
    categorySlug: "story",
    date: "02/09/2026",
    author: "Huyền Trang (Founder)",
    readTime: "6 phút đọc",
    image: "assets/images/hero-bouquet.png",
    excerpt: "Giữa những cuộn giấy bóng kính lấp lánh, chúng mình tìm về chất giấy nâu mộc mạc và sợi dây thừng xơ dừa dung dị...",
    content: `
      <p>Khi mở tiệm Hoa Nhà Mình, câu hỏi đầu tiên chúng mình tự hỏi là: 'Làm thế nào để người nhận cảm nhận được sự ấm áp như hoa nhà tự tay trồng, tự tay cắt tặng nhau?'.</p>
      <p>Và câu trả lời chính là sự mộc mạc. Giấy kraft không lấn át màu sắc của cánh hoa; ngược lại, chính sắc nâu trầm ấm của giấy và sợi dây thừng xơ xác lại tôn lên vẻ tươi non, rực rỡ nhất của thiên nhiên.</p>
    `,
    relatedProducts: ["HNM-HM001", "HNM-HM004"]
  }
];

const PROMOTIONS = [];

const REVIEWS = [];

/**
 * _getLocalProducts() – Đọc sản phẩm từ localStorage (đồng bộ, nhanh).
 */
function _getLocalProducts() {
  try {
    const saved = localStorage.getItem("hnm_products_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const products = JSON.parse(JSON.stringify(PRODUCTS));
  if (typeof PRODUCT_IMAGE_OVERRIDES !== "undefined") {
    products.forEach(p => {
      if (PRODUCT_IMAGE_OVERRIDES[p.id]) {
        p.image = PRODUCT_IMAGE_OVERRIDES[p.id];
        p.gallery = [PRODUCT_IMAGE_OVERRIDES[p.id], ...(p.gallery || []).slice(1)];
      }
    });
  }
  return products;
}

/**
 * getProducts() – Trả về danh sách sản phẩm hiện hành (async).
 * Luôn gọi Supabase nếu có → cập nhật localStorage cache.
 * Nếu Supabase lỗi → fallback về localStorage/PRODUCTS.
 */
async function getProducts() {
  if (typeof ProductAPI !== "undefined" && SupabaseClient.isConfigured()) {
    try {
      return await ProductAPI.getProducts();
    } catch (e) {
      console.error("Supabase getProducts error:", e);
    }
  }
  return _getLocalProducts();
}

/**
 * getBlogPosts() – Trả về danh sách bài viết Blog hiện hành.
 * Ưu tiên dữ liệu đã tạo/chỉnh sửa bởi admin (localStorage: hnm_blogs_v1),
 * fallback về mảng BLOG_POSTS tĩnh trong file này.
 */
function getBlogPosts() {
  try {
    const saved = localStorage.getItem("hnm_blogs_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(BLOG_POSTS));
}

