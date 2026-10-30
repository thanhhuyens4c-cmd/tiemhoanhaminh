/**
 * Danh sách video TikTok hiển thị ở trang video-tiktok.html.
 * Thêm video mới: dán link video vào `url`, ghi chú ngắn vào `caption`,
 * và điền mã sản phẩm (xem ở trang Admin) vào `productIds` để gắn sản phẩm hoa tương ứng.
 * Video mới nhất đặt lên đầu danh sách.
 */
const TIKTOK_CHANNEL_URL = "https://www.tiktok.com/@hoanhaminh.htl";
const _tt = (id) => `${TIKTOK_CHANNEL_URL}/video/${id}`;

const TIKTOK_VIDEOS = [
  { url: _tt("7702421977960746247"), caption: "Ly thơm và xinh 💕", productIds: [] },
  { url: _tt("7702099380123225351"), caption: "Có người mua hoa vì đẹp, có người mua hoa vì nhớ có một người đẹp thích hoa", productIds: [] },
  { url: _tt("7701972983119695111"), caption: "Anh thấy em cũng phải thấy ✨", productIds: ["HNM-D002F6"] },
  { url: _tt("7701279554081475858"), caption: "Khách bảo nhảy đi rồi anh mua hoa cho 😳", productIds: [] },
  { url: _tt("7697207494141070608"), caption: "POV: Bạn đang cầm trên tay bó hoa vừa đăng lại vài ngày trước", productIds: [] },
  { url: _tt("7696919861498236176"), caption: "Dễ tính như 4, khách hàng là thượng đế 😘💕", productIds: [] },
  { url: _tt("7696834222786415879"), caption: "20/10 đặt ngay bó hoa này cho người phụ nữ bạn yêu", productIds: [] },
  { url: _tt("7696450413209472274"), caption: "Em muốn được tặng 1 bó hoa xinh thế này...", productIds: [] },
  { url: _tt("7695739152234482951"), caption: "Cổ re-up rồi anh lưu chưa 😝", productIds: [] },
  { url: _tt("7695346133886962965"), caption: "Cổ re-up và đây là thứ nhận lại", productIds: [] },
  { url: _tt("7694995268487384327"), caption: "20/10 chưa biết tặng hoa gì!!?", productIds: [] },
  { url: _tt("7694134258515873042"), caption: "20/10 đến nơi rồi! Công chúa đăng lại, Hoàng tử chốt đơn thôi nhỉ?", productIds: [] },
  { url: _tt("7693475743921212678"), caption: "Tình yêu là khi nhìn thấy một điều xinh đẹp là nghĩ ngay đến một người", productIds: [] },
  { url: _tt("7692709993010760967"), caption: "Manifest 20/10 này anh ấy sẽ mua bó hoa này tặng bạn", productIds: [] },
  { url: _tt("7691677872238775559"), caption: "You did it 🏆 Một chiếc cúp hoa dành cho người mà bạn muốn nói “cậu giỏi lắm”", productIds: [] },
  { url: _tt("7691505946555600146"), caption: "Một bó hoa cho những ngày Hà Nội vào thu", productIds: [] },
  { url: _tt("7690860353290292498"), caption: "Tone hoa mọi cô gái đều muốn được nhận!", productIds: [] },
];
