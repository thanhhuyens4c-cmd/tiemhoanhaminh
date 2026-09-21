/**
 * Dữ liệu sản phẩm, bộ sưu tập, blog và đánh giá cho Tiệm hoa tươi thủ công "Hoa Nhà Mình"
 * Bản quyền thuộc về Hoa Nhà Mình - Let flowers speak your heart!
 */

const PRODUCTS = [];

const BLOG_POSTS = [
  {
    id: "blog-01",
    title: "Câu chuyện hoa cẩm tú cầu: Loài hoa của sự chân thành và thấu hiểu",
    slug: "cau-chuyen-hoa-cam-tu-cau-loai-hoa-cua-su-chan-thanh-va-thau-hieu",
    category: "Hoa & Cảm xúc",
    categorySlug: "emotion",
    date: "13/08/2026",
    author: "Hoa Nhà Mình",
    readTime: "7 phút đọc",
    image: "assets/images/bouquet-pink.png",
    excerpt: "Cẩm tú cầu không chỉ đẹp bởi những chùm hoa tròn đầy mà còn ẩn chứa câu chuyện về lời xin lỗi, lòng biết ơn và mong muốn được thấu hiểu...",
    content: `
      <h3>Cẩm tú cầu — loài hoa của những xúc cảm chân thành</h3>
      <p>Cẩm tú cầu có tên tiếng Anh là Hydrangea, thuộc chi Hydrangea trong họ Hydrangeaceae. Loài này có nguồn gốc tự nhiên tại Nhật Bản và từ lâu đã hiện diện trong cảnh quan cũng như văn hóa thưởng hoa của người Nhật.</p>
      <p>Điều khiến cẩm tú cầu dễ nhận biết nằm ở cấu trúc đặc biệt của chùm hoa. Thứ ta nhìn thấy không đơn thuần là một bông hoa lớn, mà là rất nhiều hoa nhỏ cùng tụ lại thành một cụm tròn hoặc một mặt hoa rộng.</p>
      <p>Có lẽ cũng vì thế, cẩm tú cầu luôn gợi cảm giác về một thứ tình cảm không đến từ một khoảnh khắc duy nhất. Nó giống như nhiều suy nghĩ, nhiều điều chưa nói, nhiều ngày tháng được gom lại — cho đến khi đủ đầy để trở thành một lời gửi trao.</p>

      <h3>Câu chuyện về lời xin lỗi đến muộn</h3>
      <p>Trong một truyền thuyết được lưu truyền rộng rãi, người ta kể rằng tại Nhật Bản từng có một vị hoàng đế đem lòng yêu một thiếu nữ. Nhưng trách nhiệm và những công việc nơi hoàng cung khiến chàng ngày một vắng mặt. Những cuộc gặp thưa dần, người con gái cứ thế chờ đợi, còn khoảng cách giữa hai người lớn lên theo thời gian.</p>
      <p>Đến khi nhận ra sự vô tâm của mình đã khiến người thương tổn thương, vị hoàng đế muốn gửi đi một lời xin lỗi. Thay vì vàng bạc hay lễ vật quý giá, chàng lựa chọn những đóa cẩm tú cầu như một cách bày tỏ sự hối tiếc, lòng biết ơn và tình cảm chân thành vẫn còn nguyên vẹn.</p>
      <p>Từ câu chuyện ấy, cẩm tú cầu dần được nhắc đến như một loài hoa gắn với lời xin lỗi, lòng biết ơn và những xúc cảm chân thành.</p>

      <h3>Vì sao cẩm tú cầu lại phù hợp với câu chuyện ấy?</h3>
      <p>Một chùm cẩm tú cầu được tạo nên từ rất nhiều thành phần nhỏ cùng hiện diện bên nhau. Khi đứng riêng, mỗi phần dường như rất mong manh; nhưng khi kết lại, chúng tạo thành một hình khối tròn đầy, mềm mại và có sức hiện diện rất riêng.</p>
      <p>Một lời xin lỗi hiếm khi chỉ có hai chữ "xin lỗi". Đằng sau nó có thể là sự hối tiếc, nhớ nhung, biết ơn, mong được tha thứ và cả những điều đã quá lâu không thể nói ra. Cũng như cẩm tú cầu, từng cảm xúc nhỏ bé khi tụ lại mới tạo thành một lời đủ đầy.</p>

      <h3>Cẩm tú cầu và mùa mưa Nhật Bản</h3>
      <p>Trong văn hóa Nhật Bản, cẩm tú cầu được gọi là Ajisai (紫陽花) và là một trong những hình ảnh đặc trưng của mùa mưa. Hoa thường nở nhiều vào khoảng tháng Sáu và tháng Bảy, đúng thời điểm tsuyu — mùa mưa đầu hè tại Nhật Bản.</p>
      <p>Cẩm tú cầu vì thế mang một vẻ đẹp rất riêng: không cần chờ trời trong hay nắng đẹp mới rực rỡ. Trái lại, hoa dường như càng trở nên sâu lắng giữa màn mưa và không khí ẩm của đầu hè.</p>

      <h3>Ý nghĩa của hoa cẩm tú cầu</h3>
      <p>Qua nhiều cách diễn giải trong ngôn ngữ hoa, cẩm tú cầu có thể mang những tầng ý nghĩa khác nhau tùy văn hóa và thời kỳ. Những ý nghĩa nổi bật nhất là sự chân thành, lòng biết ơn, lời xin lỗi và mong muốn được thấu hiểu.</p>
      <p>Hoa có thể được gửi đi thay một lời cảm ơn, một lời xin lỗi chưa từng biết bắt đầu từ đâu, một sự trân trọng dành cho người đã luôn thấu hiểu, hay đơn giản là một cách để nói rằng: "Có những điều tôi vẫn luôn giữ trong lòng."</p>
      <p>Bởi đôi khi, ý nghĩa của một đóa hoa không nằm ở việc nó nói thay ta bao nhiêu lời, mà ở việc nó giúp ta nói được điều quan trọng nhất.</p>
    `,
    relatedProducts: ["HNM-HM001", "HNM-HM006"]
  },
  {
    id: "blog-02",
    title: "Câu chuyện hoa chuông: Khi những mảnh vỡ hóa thành vẻ đẹp",
    slug: "cau-chuyen-hoa-chuong-khi-nhung-manh-vo-hoa-thanh-ve-dep",
    category: "Câu chuyện Hoa Nhà Mình",
    categorySlug: "story",
    date: "31/08/2026",
    author: "Hoa Nhà Mình",
    readTime: "6 phút đọc",
    image: "assets/images/florist-workshop.png",
    excerpt: "Mỗi loài hoa đều giữ riêng cho mình một câu chuyện. Với hoa chuông, câu chuyện ấy bắt đầu từ Venus — nữ thần của tình yêu và sắc đẹp...",
    content: `
      <h3>Truyền thuyết về chiếc gương của Venus</h3>
      <p>Mỗi loài hoa đều giữ riêng cho mình một câu chuyện. Với hoa chuông, câu chuyện ấy bắt đầu từ Venus — nữ thần của tình yêu và sắc đẹp.</p>
      <p>Người ta kể rằng Venus từng sở hữu một chiếc gương kỳ diệu. Đó không chỉ là chiếc gương phản chiếu hình ảnh của người soi, mà còn giúp nàng nhìn thấy vẻ đẹp ẩn giấu trong mọi điều trên thế gian.</p>
      <p>Một ngày, chiếc gương vô tình bị thất lạc và rơi vào tay một người chăn cừu. Bị mê hoặc bởi những hình ảnh hiện lên bên trong, người ấy không muốn rời bỏ món đồ kỳ diệu vừa tìm thấy.</p>
      <p>Venus vì thế sai Cupid xuống trần gian để mang chiếc gương trở về. Nhưng trong lúc giằng lại món báu vật, Cupid vô tình khiến chiếc gương rơi xuống đất và vỡ thành vô số mảnh.</p>
      <p>Câu chuyện tưởng như sẽ kết thúc ở một điều quý giá đã không còn nguyên vẹn. Thế nhưng, nơi những mảnh gương chạm xuống mặt đất, những bông hoa nhỏ bắt đầu nở lên.</p>
      <p>Đó có lẽ cũng là tầng nghĩa đẹp nhất của câu chuyện về hoa chuông: một chiếc gương có thể vỡ, nhưng vẻ đẹp mà nó từng phản chiếu thì không nhất thiết phải biến mất.</p>

      <h3>Hoa chuông và vẻ đẹp của những điều không còn nguyên vẹn</h3>
      <p>Có những điều khi còn nguyên vẹn chỉ thuộc về một người. Nhưng khi vỡ ra, đôi khi chúng lại tìm được một cách khác để trở thành vẻ đẹp của rất nhiều người.</p>
      <p>Bởi vậy, câu chuyện về hoa chuông không chỉ nói về một món đồ quý giá bị đánh mất. Nó còn gợi nhắc đến những đổi thay mà ta không thể lựa chọn — một kế hoạch không còn như ban đầu, một chương cũ khép lại hay một điều từng quen thuộc nay đã mang một hình hài khác.</p>
      <p>Ta thường nghĩ cái đẹp phải đi cùng sự hoàn hảo. Nhưng hoa chuông kể một câu chuyện khác: đôi khi, chính sau những đổi thay ngoài ý muốn, ta mới học được cách nhìn thấy vẻ đẹp ở những nơi mình chưa từng nghĩ tới.</p>

      <h3>Ý nghĩa hoa chuông và những dịp phù hợp để trao tặng</h3>
      <p>Từ câu chuyện về chiếc gương của Venus, hoa chuông có thể được xem như biểu tượng của vẻ đẹp sau đổi thay, sự hồi sinh, hy vọng và khả năng tìm thấy điều tốt đẹp trong những điều chưa trọn vẹn.</p>
      <p>Đây cũng là loài hoa phù hợp để gửi đến một người đang bước qua một giai đoạn chuyển mình: bắt đầu công việc mới, chuyển đến một nơi ở mới, khép lại một hành trình cũ hay đơn giản là đang học cách làm quen với những thay đổi trong cuộc sống.</p>
      <p>Hoa chuông đặc biệt phù hợp để trao trong những dịp như chúc mừng khởi đầu mới, động viên sau một giai đoạn khó khăn, sinh nhật, tốt nghiệp hoặc đơn giản là một món quà không cần lý do.</p>
      <p>Bởi đôi khi, điều dịu dàng nhất ta có thể gửi đến một người không phải là lời chúc mọi thứ luôn nguyên vẹn — mà là lời nhắn rằng dù cuộc sống có đổi thay, vẻ đẹp vẫn luôn có một cách khác để tiếp tục hiện diện.</p>
    `,
    relatedProducts: ["HNM-HM002", "HNM-HM005"]
  },
  {
    id: "blog-03",
    title: "Số lượng hoa hồng và ý nghĩa của chúng khi tặng hoa",
    slug: "so-luong-hoa-hong-va-y-nghia-cua-chung-khi-tang-hoa",
    category: "Hoa & Cảm xúc",
    categorySlug: "emotion",
    date: "11/12/2025",
    author: "Hoa Nhà Mình",
    readTime: "5 phút đọc",
    image: "assets/images/hero-bouquet.png",
    excerpt: "Hoa hồng luôn được mệnh danh là biểu tượng của tình yêu. Cùng tìm hiểu ý nghĩa riêng biệt của từng số lượng hoa hồng trong các bó hoa...",
    content: `
      <p>Hoa hồng luôn được mệnh danh là biểu tượng của tình yêu và thường được các cặp đôi tặng cho nhau. Cùng tìm hiểu ý nghĩa riêng biệt của số lượng hoa hồng trong các bó hoa:</p>

      <h3>1. Từ 1–10 bông</h3>
      <p><strong>1 bông hồng:</strong> "Tình yêu ngay từ cái nhìn đầu tiên" hay "Em là duy nhất"</p>
      <p><strong>2 bông hồng:</strong> "Tình yêu dành cho em vô cùng sâu đậm"</p>
      <p><strong>3 bông hồng:</strong> "Anh yêu em"</p>
      <p><strong>4 bông hồng:</strong> "Không có gì có thể ngăn cản được tình yêu của chúng ta"</p>
      <p><strong>5 bông hồng:</strong> "Anh yêu em rất rất nhiều" hoặc thể hiện sự ngưỡng mộ với vẻ đẹp của các cô gái</p>
      <p><strong>6 bông hồng:</strong> "Anh muốn được là người yêu của em"</p>
      <p><strong>7 bông hồng:</strong> "Anh yêu em hơn bất cứ điều gì (si mê/cuồng dại)"</p>
      <p><strong>8 bông hồng:</strong> Thể hiện sự biết ơn và gửi lời cảm ơn những người đã giúp đỡ và ủng hộ bạn</p>
      <p><strong>9 bông hồng:</strong> "Tình yêu bất diệt"</p>
      <p><strong>10 bông hồng:</strong> "Em thật hoàn hảo"</p>

      <h3>2. Từ 11–50 bông</h3>
      <p><strong>11 bông hồng:</strong> "Em là tất cả những gì quý giá nhất với Anh"</p>
      <p><strong>12 bông hồng:</strong> "Làm người yêu anh nhé" hoặc "Tình yêu của chúng ta kéo dài theo năm tháng"</p>
      <p><strong>13 bông hồng:</strong> "Mãi luôn là những người bạn tốt"</p>
      <p><strong>15 bông hồng:</strong> "Anh biết lỗi rồi. Hãy tha thứ cho Anh"</p>
      <p><strong>17 bông hồng:</strong> "Làm vợ anh em nhé" hoặc thường để tặng vợ trong những sự kiện đặc biệt</p>
      <p><strong>18 bông hồng:</strong> "Chúc em mãi trẻ đẹp và hạnh phúc"</p>
      <p><strong>19 bông hồng:</strong> "Forever Love" / "Anh sẽ chờ đợi cho đến khi em đồng ý"</p>
      <p><strong>20 bông hồng:</strong> "Tình yêu chân thành" / "Hãy tin Anh"</p>
      <p><strong>21 bông hồng:</strong> "Anh hứa sẽ yêu em đến hết cuộc đời"</p>
      <p><strong>22 bông hồng:</strong> "Dù thế nào cũng luôn ở bên nhau" / "Chúc bạn may mắn"</p>
      <p><strong>33 bông hồng:</strong> "Anh yêu em" (với tất cả những gì tuyệt vời nhất)</p>
      <p><strong>36 bông hồng:</strong> Gợi nhắc về những phút giây lãng mạn và hạnh phúc mà hai người đã dành cho nhau</p>
      <p><strong>50 bông hồng:</strong> "Anh yêu em vô điều kiện và không bao giờ hối hận"</p>

      <h3>3. Từ 51–100 bông</h3>
      <p><strong>51 bông hồng:</strong> "Trong tâm trí anh luôn chỉ có em"</p>
      <p><strong>66 bông hồng:</strong> "Không gì có thể thay đổi tình yêu của anh dành cho em"</p>
      <p><strong>77 bông hồng:</strong> "Anh tin rằng việc anh và em gặp nhau là định mệnh"</p>
      <p><strong>88 bông hồng:</strong> "Lời xin lỗi từ tận đáy lòng"</p>
      <p><strong>99 bông hồng:</strong> "Anh yêu em cho đến chết"</p>
      <p><strong>100 bông hồng:</strong> "Trăm năm hạnh phúc"</p>

      <h3>4. Từ 101–1001 bông</h3>
      <p><strong>101 bông hồng:</strong> "Em là người yêu duy nhất của Anh"</p>
      <p><strong>108 bông hồng:</strong> "Làm vợ anh nhé"</p>
      <p><strong>111 bông hồng:</strong> "Tình yêu vĩnh cửu"</p>
      <p><strong>365 bông hồng:</strong> "Anh yêu em tất cả các ngày trong năm"</p>
      <p><strong>999 bông hồng:</strong> "Mãi mãi 1 tình yêu"</p>
      <p><strong>1001 bông hồng:</strong> "Tình yêu vô bờ bến và sẽ tồn tại mãi mãi với thời gian"</p>

      <p>Hoa Nhà Mình hi vọng với những thông tin bổ ích này, các bạn sẽ chọn được cho mình những thiết kế hoa hồng tuyệt vời và ý nghĩa.</p>
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
  let products;
  if (typeof ProductAPI !== "undefined" && SupabaseClient.isConfigured()) {
    try {
      products = await ProductAPI.getProducts();
    } catch (e) {
      console.error("Supabase getProducts error:", e);
    }
  }
  if (!products) products = _getLocalProducts();
  products.sort((a, b) => {
    const orderDiff = (a.sortOrder || 0) - (b.sortOrder || 0);
    if (orderDiff !== 0) return orderDiff;
    return (a.name || "").localeCompare(b.name || "", "vi");
  });
  return products;
}

/**
 * getBlogPosts() – Trả về danh sách bài viết Blog hiện hành.
 * Ưu tiên dữ liệu đã tạo/chỉnh sửa bởi admin (localStorage: hnm_blogs_v2),
 * fallback về mảng BLOG_POSTS tĩnh trong file này.
 */
function getBlogPosts() {
  try {
    const saved = localStorage.getItem("hnm_blogs_v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(BLOG_POSTS));
}

