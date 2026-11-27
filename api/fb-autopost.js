// AI agent tự đăng bài lên Facebook Page mỗi ngày.
// Địa chỉ: /api/fb-autopost  (Vercel Cron gọi theo lịch trong vercel.json)
//
// Các bước:
//   1. Lấy sản phẩm đang bán có ảnh trên Supabase (bảng products, ảnh ở bucket product-images).
//   2. Chọn mẫu chưa đăng hoặc đã lâu chưa đăng nhất (tra bảng fb_posts).
//   3. Gửi ảnh + thông tin sản phẩm cho Gemini để viết nội dung theo giọng thương hiệu.
//   4. Đăng ảnh kèm nội dung lên Page qua Facebook Graph API.
//   5. Ghi nhật ký vào bảng fb_posts.
//
// Biến môi trường cần đặt trên Vercel (Settings → Environment Variables):
//   CRON_SECRET                 chuỗi bí mật bất kỳ; Vercel Cron tự gửi kèm, người ngoài không gọi được
//   SUPABASE_SERVICE_ROLE_KEY   Supabase → Project Settings → API → service_role (để đọc/ghi fb_posts)
//   GEMINI_API_KEY              Google AI Studio → Get API key
//   FB_PAGE_ID                  id của Facebook Page
//   FB_PAGE_TOKEN               Page Access Token dài hạn, có quyền pages_manage_posts
// Tuỳ chọn:
//   GEMINI_MODEL      mặc định "gemini-2.5-flash"
//   FB_GRAPH_VERSION  mặc định "v23.0"
//
// Gọi tay để thử (thay <CRON_SECRET>):
//   curl -H "Authorization: Bearer <CRON_SECRET>" "https://tiemhoanhaminh.vercel.app/api/fb-autopost?dry_run=1"
//   ?dry_run=1        chỉ cho AI viết bài, KHÔNG đăng lên Facebook
//   ?product=<id>     chỉ định sản phẩm muốn đăng

const BASE = "https://tiemhoanhaminh.vercel.app";
const SUPABASE_URL = "https://nkugwprxqdiarrivhubr.supabase.co";

const env = (k, d = "") => (process.env[k] || d).trim();

// ── Supabase ────────────────────────────────────────────────
async function sb(path, init = {}) {
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!r.ok) throw new Error(`Supabase ${path.split("?")[0]}: ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}

const PRODUCT_COLUMNS =
  "id,name,type_name,color_name,price,original_price,short_desc,description,occasion,recipient,tags,image_url,is_best_seller,is_new";

async function pickProduct(forcedId) {
  if (forcedId) {
    const rows = await sb(`products?select=${PRODUCT_COLUMNS}&id=eq.${encodeURIComponent(forcedId)}`);
    if (!rows.length) throw new Error(`Không tìm thấy sản phẩm ${forcedId}`);
    return rows[0];
  }

  const [products, posts] = await Promise.all([
    sb(`products?select=${PRODUCT_COLUMNS}&is_active=eq.true&image_url=like.http*`),
    sb(`fb_posts?select=product_id,created_at&status=eq.posted&order=created_at.desc&limit=1000`),
  ]);
  if (!products.length) throw new Error("Không có sản phẩm nào đang bán có ảnh trên Supabase Storage");

  const lastPosted = {};
  for (const p of posts) if (!lastPosted[p.product_id]) lastPosted[p.product_id] = Date.parse(p.created_at);

  // Ưu tiên mẫu chưa đăng bao giờ; sau đó mẫu đã lâu chưa đăng nhất. Bốc ngẫu nhiên trong nhóm ít nhất 3 mẫu để bài không đều đều.
  products.sort((a, b) => (lastPosted[a.id] || 0) - (lastPosted[b.id] || 0));
  const never = products.filter((p) => !lastPosted[p.id]);
  const pool = never.length ? never : products.slice(0, Math.min(3, products.length));
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Gemini ──────────────────────────────────────────────────
const vnd = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "₫";
const list = (a) => (Array.isArray(a) ? a.filter(Boolean).join(", ") : "");

function buildPrompt(p) {
  const info = [
    `Tên mẫu: ${p.name}`,
    p.type_name && `Loại: ${p.type_name}`,
    p.color_name && `Tông màu: ${p.color_name}`,
    p.price && `Giá: ${vnd(p.price)}` + (p.original_price > p.price ? ` (giá gốc ${vnd(p.original_price)})` : ""),
    list(p.occasion) && `Dịp tặng phù hợp: ${list(p.occasion)}`,
    list(p.recipient) && `Người nhận phù hợp: ${list(p.recipient)}`,
    p.short_desc && `Mô tả ngắn: ${p.short_desc}`,
    p.description && `Mô tả: ${String(p.description).slice(0, 1200)}`,
    p.is_best_seller && "Đây là mẫu bán chạy.",
    p.is_new && "Đây là mẫu mới.",
  ]
    .filter(Boolean)
    .join("\n");

  return `Bạn là người viết nội dung Facebook cho "Hoa Nhà Mình", tiệm hoa tươi handmade ở Hoàng Mai, Hà Nội.
Hãy nhìn ảnh bó hoa đính kèm và viết MỘT bài đăng Facebook giới thiệu mẫu hoa này.

THÔNG TIN SẢN PHẨM (chỉ dùng đúng các thông tin này, không tự thêm):
${info}

THÔNG TIN TIỆM:
- Nhận đơn 08:00–21:30 mỗi ngày, nên đặt trước 1–2 ngày. Giao nội thành Hà Nội.
- Nhận làm hoa theo yêu cầu riêng (màu, ngân sách, kiểu gói) qua Zalo hoặc inbox Page.
- Khẩu hiệu: "Let flowers speak your heart!"

GIỌNG VĂN:
- Xưng "chúng mình", ấm áp, gần gũi, kể chuyện nhẹ nhàng; gắn bó hoa với cảm xúc người tặng.
- Mô tả đúng những gì thấy trong ảnh (loài hoa, màu, kiểu gói) – không đoán bừa loài hoa nếu không chắc.
- Nên dùng các từ: gửi gắm, trân quý, tươi mỗi sáng, chỉn chu, nhành hoa.

QUY TẮC BẮT BUỘC:
- Độ dài 60–130 chữ, chia 2–4 đoạn ngắn, có thể dùng 2–4 emoji hợp cảnh (🌷💐✨🤍).
- Câu đầu phải gây chú ý trong 1 dòng.
- Nếu có giá thì ghi đúng giá ở trên; KHÔNG bịa khuyến mãi, freeship, số liệu, đánh giá hay lời khen của khách.
- KHÔNG dùng cụm "giờ mở cửa", không dùng giọng sang chảnh/luxury, không thúc ép mua.
- KHÔNG chèn đường link (hệ thống sẽ tự thêm link đặt hoa ở cuối).
- Kết bằng một lời mời nhẹ nhàng (nhắn tin cho chúng mình / đặt trước để có hoa đúng ngày), rồi xuống dòng 3–5 hashtag, trong đó có #HoaNhaMinh.
- Chỉ trả về nội dung bài đăng dạng văn bản thường, không markdown, không dấu ** hay #tiêu đề, không giải thích gì thêm.`;
}

async function fetchImageBase64(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Không tải được ảnh ${url}: ${r.status}`);
  const mime = (r.headers.get("content-type") || "image/jpeg").split(";")[0];
  const buf = Buffer.from(await r.arrayBuffer());
  return { mime, data: buf.toString("base64") };
}

async function writeCaption(product) {
  const model = env("GEMINI_MODEL", "gemini-2.5-flash");
  const img = await fetchImageBase64(product.image_url);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env("GEMINI_API_KEY") },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ inline_data: { mime_type: img.mime, data: img.data } }, { text: buildPrompt(product) }],
        },
      ],
      generationConfig: { temperature: 0.9, maxOutputTokens: 2048 },
    }),
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${JSON.stringify(json.error || json)}`);

  const text = (json.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || "")
    .join("")
    .replace(/\*\*/g, "")
    .trim();
  if (!text) throw new Error(`Gemini không trả về nội dung: ${JSON.stringify(json.promptFeedback || json.candidates?.[0]?.finishReason)}`);

  const link = `${BASE}/chi-tiet-san-pham.html?id=${encodeURIComponent(product.id)}`;
  return `${text}\n\n👉 Xem mẫu & đặt hoa: ${link}`;
}

// ── Facebook ────────────────────────────────────────────────
async function postToFacebook(imageUrl, caption) {
  const version = env("FB_GRAPH_VERSION", "v23.0");
  const body = new URLSearchParams({
    url: imageUrl,
    message: caption,
    published: "true",
    access_token: env("FB_PAGE_TOKEN"),
  });
  const r = await fetch(`https://graph.facebook.com/${version}/${env("FB_PAGE_ID")}/photos`, { method: "POST", body });
  const json = await r.json().catch(() => ({}));
  if (!r.ok || json.error) throw new Error(`Facebook ${r.status}: ${json.error?.message || JSON.stringify(json)}`);
  return json.post_id || json.id;
}

async function log(row) {
  try {
    await sb("fb_posts", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row) });
  } catch (e) {
    console.error("Không ghi được nhật ký fb_posts:", e.message);
  }
}

// ── Handler ─────────────────────────────────────────────────
module.exports = async (req, res) => {
  const secret = env("CRON_SECRET");
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const dryRun = req.query.dry_run === "1";
  const required = ["SUPABASE_SERVICE_ROLE_KEY", "GEMINI_API_KEY", ...(dryRun ? [] : ["FB_PAGE_ID", "FB_PAGE_TOKEN"])];
  const missing = required.filter((k) => !env(k));
  if (missing.length) return res.status(500).json({ ok: false, error: `Thiếu biến môi trường: ${missing.join(", ")}` });

  let product, caption;
  try {
    product = await pickProduct(req.query.product);
    caption = await writeCaption(product);

    if (dryRun) {
      await log({ product_id: product.id, image_url: product.image_url, caption, status: "dry_run" });
      return res.status(200).json({ ok: true, dry_run: true, product: product.id, image: product.image_url, caption });
    }

    const fbPostId = await postToFacebook(product.image_url, caption);
    await log({ product_id: product.id, image_url: product.image_url, caption, fb_post_id: fbPostId, status: "posted" });
    return res.status(200).json({ ok: true, product: product.id, fb_post_id: fbPostId, caption });
  } catch (e) {
    console.error("fb-autopost lỗi:", e);
    if (product) {
      await log({ product_id: product.id, image_url: product.image_url, caption: caption || "", status: "failed", error: String(e.message).slice(0, 2000) });
    }
    return res.status(500).json({ ok: false, product: product?.id, error: e.message });
  }
};
