/**
 * Dữ liệu sản phẩm, bộ sưu tập, blog và đánh giá cho Tiệm hoa tươi thủ công "Hoa Nhà Mình"
 * Bản quyền thuộc về Hoa Nhà Mình - Let flowers speak your heart!
 */

const PRODUCTS = [
  {
    id: "HNM-HM001",
    name: "Bó Hoa Hồng Pastel 'Mộng Mơ'",
    slug: "bo-hoa-hong-pastel-mong-mo",
    type: "bo-hoa",
    typeName: "Bó hoa tươi",
    color: "pastel",
    colorName: "Pastel dịu ngọt",
    price: 450000,
    originalPrice: 500000,
    rating: 5.0,
    reviewsCount: 38,
    isBestSeller: true,
    isNew: true,
    isFeatured: true,
    occasion: ["sinh-nhat", "valentine"],
    recipient: ["nguoi-yeu", "ban-than"],
    tags: ["ban-chay", "moi"],
    image: "assets/images/bouquet-pink.png",
    gallery: [
      "assets/images/bouquet-pink.png",
      "assets/images/hero-bouquet.png",
      "assets/images/florist-workshop.png"
    ],
    shortDesc: "Hoa hồng Ohara kết hợp cúc tana trắng tinh khôi và lá khuynh diệp thơm dịu, gói giấy kraft mộc.",
    description: "Bó hoa 'Mộng Mơ' là tác phẩm được cắm tỉ mỉ nương theo vẻ đẹp nguyên bản của từng đóa hồng Ohara màu pastel. Từng nhành hoa được florists tiệm Hoa Nhà Mình cắt gốc và tạo dáng trong buổi sớm tinh mơ, điểm xuyết những nhánh cúc tana nhỏ nhắn và lá bạch đàn thơm ngát. Gói ghém bằng giấy kraft thô mộc, buộc dây gai tự nhiên và tặng kèm thiệp viết tay nắn nót.",
    careInstructions: "Cắt vát gốc 45 độ, thay nước sạch mỗi ngày một lần và cho gói dưỡng hoa tặng kèm. Đặt nơi thoáng mát, tránh ánh nắng trực tiếp hoặc hướng gió điều hòa.",
    sizes: [
      { name: "S - Nhỏ nhắn", price: 350000, desc: "Khoảng 10-12 bông" },
      { name: "M - Tiêu chuẩn", price: 450000, desc: "Khoảng 18-20 bông (Khuyên dùng)" },
      { name: "L - Đặc biệt", price: 620000, desc: "Khoảng 28-30 bông xum xuê" }
    ]
  },
  {
    id: "HNM-HM002",
    name: "Bó Hoa Cúc Tana 'Bình Yên Sớm Mai'",
    slug: "bo-hoa-cuc-tana-binh-yen-som-mai",
    type: "bo-hoa",
    typeName: "Bó hoa tươi",
    color: "trang",
    colorName: "Trắng thuần khiết",
    price: 280000,
    originalPrice: 320000,
    rating: 4.9,
    reviewsCount: 45,
    isBestSeller: true,
    isNew: false,
    isFeatured: true,
    occasion: ["tot-nghiep", "sinh-nhat", "khac"],
    recipient: ["ban-be", "ban-than"],
    tags: ["ban-chay", "yeu-thich"],
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
      "assets/images/florist-workshop.png"
    ],
    shortDesc: "Hàng trăm bông cúc tana trắng muốt như những vì sao nhỏ giữa đồng cỏ sớm, gói giấy báo cổ điển.",
    description: "Tana là loài hoa mang vẻ đẹp dung dị mà làm say đắm lòng người. Từng cánh hoa trắng ngần ôm lấy nhụy vàng rực rỡ, thoảng nhẹ hương thơm đồng nội mát lành. Rất thích hợp để tự thưởng cho góc làm việc của chính mình hoặc gửi tặng bạn thân.",
    careInstructions: "Cúc tana rất ưa nước sạch, nên tỉa bớt lá ngập trong bình và đặt bàn làm việc nhiều ánh sáng tự nhiên.",
    sizes: [
      { name: "S - Nhỏ nhắn", price: 220000, desc: "Bó cầm tay nhẹ nhàng" },
      { name: "M - Tiêu chuẩn", price: 280000, desc: "Bó đầy đặn cắm bình vừa" },
      { name: "L - Đặc biệt", price: 390000, desc: "Bó to ôm trọn vòng tay" }
    ]
  },
  {
    id: "HNM-HM003",
    name: "Hộp Hoa Gỗ 'Ấm Áp Gia Đình'",
    slug: "hop-hoa-go-am-ap-gia-dinh",
    type: "hop-hoa",
    typeName: "Hộp hoa thiết kế",
    color: "hong",
    colorName: "Hồng ấm áp",
    price: 650000,
    originalPrice: 720000,
    rating: 5.0,
    reviewsCount: 29,
    isBestSeller: false,
    isNew: true,
    isFeatured: true,
    occasion: ["sinh-nhat", "khac"],
    recipient: ["gia-dinh"],
    tags: ["moi", "yeu-thich"],
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80"
    ],
    shortDesc: "Hộp gỗ thông mộc mạc cắm hoa hồng phớt, cẩm chướng và hoa baby trắng, bền hoa 4-5 ngày.",
    description: "Được sắp xếp trang nhã trong hộp gỗ tự nhiên khắc laser chữ 'Gia Đình Yêu Thương'. Bông hoa được cắm trên xốp giữ ẩm cao cấp nhập khẩu, giúp hoa giữ được độ tươi lâu mà không cần tốn công thay nước mỗi ngày.",
    careInstructions: "Châm thêm nửa chén nước sạch vào gốc xốp cắm hoa mỗi buổi sáng. Tránh luồng gió quạt mạnh.",
    sizes: [
      { name: "M - Tiêu chuẩn", price: 650000, desc: "Kích thước 22 x 22 cm" },
      { name: "L - Trang trọng", price: 850000, desc: "Kích thước 28 x 28 cm" }
    ]
  },
  {
    id: "HNM-HM004",
    name: "Giỏ Hoa Mây 'Vạt Nắng Mùa Thu'",
    slug: "gio-hoa-may-vat-nang-mua-thu",
    type: "gio-hoa",
    typeName: "Giỏ hoa thủ công",
    color: "pastel",
    colorName: "Pastel cam đào",
    price: 780000,
    originalPrice: 850000,
    rating: 4.8,
    reviewsCount: 22,
    isBestSeller: true,
    isNew: false,
    isFeatured: true,
    occasion: ["sinh-nhat", "tot-nghiep"],
    recipient: ["nguoi-yeu", "gia-dinh"],
    tags: ["ban-chay"],
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80"
    ],
    shortDesc: "Giỏ mây đan tay truyền thống phối hoa hồng cam spirit, đồng tiền nhí và hoa lá cỏ mùa thu.",
    description: "Một làn gió nhẹ nhàng của mùa thu Hà Nội thu nhỏ lại trong chiếc giỏ mây đan mộc. Sắc hoa cam ấm áp hòa quyện cùng gam màu pastel tạo nên cảm giác dễ chịu, an yên.",
    careInstructions: "Tưới nhẹ một lượng nước nhỏ vào giữa giỏ hoa mỗi ngày để xốp luôn đủ độ ẩm.",
    sizes: [
      { name: "M - Tiêu chuẩn", price: 780000, desc: "Giỏ mây quai tròn cỡ vừa" },
      { name: "L - Sung túc", price: 980000, desc: "Giỏ mây đại phối hoa nhập khẩu" }
    ]
  },
  {
    id: "HNM-HM005",
    name: "Bó Hoa Cẩm Tú Cầu Xanh 'Biển Trời Dịu Êm'",
    slug: "bo-hoa-cam-tu-cau-xanh-bien-troi-diu-em",
    type: "bo-hoa",
    typeName: "Bó hoa tươi",
    color: "xanh",
    colorName: "Xanh dương thanh mát",
    price: 390000,
    originalPrice: 430000,
    rating: 4.9,
    reviewsCount: 31,
    isBestSeller: false,
    isNew: true,
    isFeatured: true,
    occasion: ["tot-nghiep", "khac"],
    recipient: ["ban-be", "ban-than"],
    tags: ["moi"],
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80"
    ],
    shortDesc: "Cẩm tú cầu xanh biếc phối cúc họa mi và lá bạc, mang hơi thở trong trẻo mát lành.",
    description: "Cẩm tú cầu Đà Lạt bông to tròn trĩnh với màu xanh biển hiếm có. Bó hoa như lời chúc cho những bước khởi đầu thuận buồm xuôi gió và tâm hồn luôn nhẹ nhõm.",
    careInstructions: "Cẩm tú cầu là loài háo nước, có thể phun sương nhẹ trực tiếp lên cánh hoa để hoa tươi căng tràn sức sống.",
    sizes: [
      { name: "S - 1 Bông lớn", price: 290000, desc: "Bó gọn ghẽ đáng yêu" },
      { name: "M - 2 Bông lớn", price: 390000, desc: "Bó tiêu chuẩn xum xuê" },
      { name: "L - 3 Bông lớn", price: 550000, desc: "Bó đại phối hoa phụ" }
    ]
  },
  {
    id: "HNM-HM006",
    name: "Bó Hoa Hồng Đỏ 'Tình Nồng Cháy'",
    slug: "bo-hoa-hong-do-tinh-nong-chay",
    type: "bo-hoa",
    typeName: "Bó hoa tươi",
    color: "do",
    colorName: "Đỏ nhung kiêu sa",
    price: 520000,
    originalPrice: 580000,
    rating: 5.0,
    reviewsCount: 52,
    isBestSeller: true,
    isNew: false,
    isFeatured: true,
    occasion: ["valentine", "sinh-nhat"],
    recipient: ["nguoi-yeu"],
    tags: ["ban-chay"],
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80"
    ],
    shortDesc: "Hoa hồng đỏ nhung Pháp nồng nàn, gói giấy kraft đen mộc mạc cá tính.",
    description: "Không bao giờ lỗi mốt, hoa hồng đỏ luôn là tuyên ngôn vĩnh cửu của tình yêu chân thành và say đắm. Từng cánh hoa dày dặn, tỏa hương ngát thơm dịu dàng.",
    careInstructions: "Thay nước mỗi ngày một lần, tỉa bỏ bớt lá dưới gốc.",
    sizes: [
      { name: "S - 11 Bông", price: 380000, desc: "11 Bông - Chỉ có mình em" },
      { name: "M - 19 Bông", price: 520000, desc: "19 Bông - Mãi mãi bên nhau" },
      { name: "L - 33 Bông", price: 890000, desc: "33 Bông - Tình yêu bất diệt" }
    ]
  },
  {
    id: "HNM-HM007",
    name: "Hộp Hoa Mica 'Tím Thủy Chung'",
    slug: "hop-hoa-mica-tim-thuy-chung",
    type: "hop-hoa",
    typeName: "Hộp hoa thiết kế",
    color: "tim",
    colorName: "Tím mộng mơ",
    price: 590000,
    originalPrice: 650000,
    rating: 4.8,
    reviewsCount: 19,
    isBestSeller: false,
    isNew: true,
    isFeatured: false,
    occasion: ["sinh-nhat", "khac"],
    recipient: ["nguoi-yeu", "gia-dinh"],
    tags: ["moi"],
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"
    ],
    shortDesc: "Hộp trong suốt cắm hoa cát tường tím, hoa phi yến và thạch thảo lãng mạn.",
    description: "Sắc tím thủy chung và tao nhã của hoa cát tường phối cùng phi yến trong hộp mica trong suốt, thắt ruy băng lụa tiệp màu trang trọng.",
    careInstructions: "Châm nước vào miếng xốp cách ngày một lần.",
    sizes: [
      { name: "M - Tiêu chuẩn", price: 590000, desc: "Kích thước 20 x 20 cm" },
      { name: "L - Cao cấp", price: 790000, desc: "Kích thước 25 x 25 cm" }
    ]
  },
  {
    id: "HNM-HM008",
    name: "Giỏ Hoa Mây 'Khu Vườn Bí Mật'",
    slug: "gio-hoa-may-khu-vuon-bi-mat",
    type: "gio-hoa",
    typeName: "Giỏ hoa thủ công",
    color: "pastel",
    colorName: "Pastel đa sắc",
    price: 890000,
    originalPrice: 990000,
    rating: 5.0,
    reviewsCount: 41,
    isBestSeller: true,
    isNew: false,
    isFeatured: true,
    occasion: ["sinh-nhat", "khac"],
    recipient: ["gia-dinh", "ban-be"],
    tags: ["ban-chay", "yeu-thich"],
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=800&q=80"
    ],
    shortDesc: "Tuyệt phẩm giỏ hoa phối 12 loại hoa lá vườn nhà, tạo hình tự nhiên nương tựa vào nhau.",
    description: "Giống như một mảnh vườn nhỏ đầy sắc hương sớm mai, giỏ hoa mang đến cảm giác thư thái và ngập tràn nhựa sống của cỏ cây.",
    careInstructions: "Tưới nhẹ một cốc nước nhỏ vào trung tâm mỗi sáng.",
    sizes: [
      { name: "L - Tiêu chuẩn", price: 890000, desc: "Cỡ giỏ xum xuê 35cm" },
      { name: "XL - Sang trọng", price: 1250000, desc: "Cỡ giỏ đại phong phú 45cm" }
    ]
  },
  {
    id: "HNM-HM009",
    name: "Bó Hoa Tulip Trắng 'Thanh Khiết'",
    slug: "bo-hoa-tulip-trang-thanh-khiet",
    type: "bo-hoa",
    typeName: "Bó hoa tươi",
    color: "trang",
    colorName: "Trắng tinh khôi",
    price: 620000,
    originalPrice: 690000,
    rating: 4.9,
    reviewsCount: 26,
    isBestSeller: false,
    isNew: true,
    isFeatured: true,
    occasion: ["tot-nghiep", "sinh-nhat"],
    recipient: ["ban-than", "nguoi-yeu"],
    tags: ["moi"],
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80"
    ],
    shortDesc: "10 cành tulip Hà Lan nhập khẩu trắng ngần, thanh lịch tuyệt đối.",
    description: "Tulip trắng tinh khôi tượng trưng cho tình yêu chân thành và khởi đầu mới trọn vẹn, được bó thon gọn theo form châu Âu tối giản.",
    careInstructions: "Tulip ưa nước thật lạnh, có thể thả vài viên đá lạnh nhỏ vào bình nước cắm hoa.",
    sizes: [
      { name: "M - 10 cành", price: 620000, desc: "Bó chuẩn 10 cành tươi" },
      { name: "L - 20 cành", price: 1100000, desc: "Bó xum xuê 20 cành" }
    ]
  }
];

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

const PROMOTIONS = [
  { code: "HOANHAMINH10", discountPercent: 10, minOrder: 300000, desc: "Giảm 10% cho mọi đơn hàng từ 300.000₫" },
  { code: "FREESHIP", freeShip: true, minOrder: 500000, desc: "Miễn phí vận chuyển nội thành Hà Nội cho đơn từ 500.000₫" },
  { code: "BANMOI", discountAmount: 50000, minOrder: 400000, desc: "Giảm 50.000₫ cho khách hàng đặt hoa lần đầu" }
];

const REVIEWS = [
  {
    name: "Chị Minh Anh",
    role: "Khách hàng thân thiết tại Đống Đa",
    avatar: "assets/images/avatar-user.png",
    content: "Bó hoa pastel ở ngoài còn xinh hơn trong ảnh! Tiệm chụp ảnh gửi mình duyệt trước khi giao làm mình cực kỳ yên tâm. Thiệp viết tay chữ nắn nót rất có tâm.",
    rating: 5,
    product: "Bó hoa hồng pastel 'Mộng Mơ'"
  },
  {
    name: "Anh Hoàng Dũng",
    role: "Khách đặt hoa tặng sinh nhật người yêu",
    avatar: "assets/images/avatar-artisan.png",
    content: "Giao đúng giờ hẹn dù mình đặt gấp lúc trưa. Bạn gái mình khen hoa thơm và tươi suốt 4 ngày liền. Cảm ơn tiệm nhiều!",
    rating: 5,
    product: "Hộp Hoa Gỗ 'Ấm Áp Gia Đình'"
  },
  {
    name: "Bạn Lan Chi",
    role: "Khách hàng sinh viên tốt nghiệp",
    avatar: "assets/images/avatar-user.png",
    content: "Cúc tana ở đây bông to và tươi lắm, gói giấy báo cổ điển chụp ảnh tốt nghiệp lên hình cực thơ. Giá lại rất hợp túi tiền.",
    rating: 5,
    product: "Bó Hoa Cúc Tana 'Bình Yên Sớm Mai'"
  }
];

/**
 * getProducts() – Trả về danh sách sản phẩm hiện hành.
 * Ưu tiên dữ liệu đã chỉnh sửa bởi admin (localStorage),
 * fallback về mảng PRODUCTS tĩnh trong file này.
 * Dùng hàm này thay cho PRODUCTS[] trực tiếp ở mọi trang.
 */
function getProducts() {
  try {
    const saved = localStorage.getItem("hnm_products_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(PRODUCTS));
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

