// "Quét hoa" ở Góc video: nhận ảnh khung hình, nhờ Claude chọn sản phẩm giống nhất trong web.
// Cần biến môi trường ANTHROPIC_API_KEY trên Vercel. Nhãn sản phẩm lấy từ bảng product_ai_tags (scripts/tag_products.py).
const SUPABASE_URL = "https://nkugwprxqdiarrivhubr.supabase.co";
const SUPABASE_KEY = "sb_publishable_NJgA_RPQovMXZp1H7dLvdA_zZonsPdF";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";
const COVER_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/video-covers/`;
const MAX_IMAGE_BYTES = 4_000_000;
const MAX_PER_HOUR = 10;

const hits = new Map(); // giới hạn tạm theo IP (chỉ có tác dụng trong một lần chạy của hàm)

function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 3_600_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_HOUR;
}

async function sb(path) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  return r.ok ? r.json() : [];
}

// Trả về { media_type, data } từ ảnh dạng data URL hoặc từ link ảnh bìa của video trên Supabase
async function loadImage(body) {
  if (typeof body.image === "string") {
    const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(body.image);
    if (!m || m[2].length * 0.75 > MAX_IMAGE_BYTES) return null;
    return { media_type: m[1], data: m[2] };
  }
  if (typeof body.coverUrl === "string" && body.coverUrl.startsWith(COVER_PREFIX)) {
    const r = await fetch(body.coverUrl);
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > MAX_IMAGE_BYTES) return null;
    const type = (r.headers.get("content-type") || "image/jpeg").split(";")[0];
    return { media_type: /^image\/(jpeg|png|webp|gif)$/.test(type) ? type : "image/jpeg", data: buf.toString("base64") };
  }
  return null;
}

const list = (v) => (Array.isArray(v) ? v.join(", ") : v || "");

module.exports = async (req, res) => {
  const send = (code, obj) => res.status(code).json(obj);
  if (req.method !== "POST") return send(405, { error: "method" });

  // chỉ nhận lời gọi từ chính trang web này
  try {
    if (new URL(req.headers.origin || "").host !== req.headers.host) return send(403, { error: "origin" });
  } catch (e) {
    return send(403, { error: "origin" });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return send(503, { error: "not_configured" });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return send(429, { error: "rate_limited" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const image = await loadImage(body || {});
  if (!image) return send(400, { error: "bad_image" });

  const [products, tagRows] = await Promise.all([
    sb("products?select=id,name,price,image_url&is_active=eq.true"),
    sb("product_ai_tags?select=product_id,tags"),
  ]);
  const tagsById = new Map(tagRows.map((r) => [r.product_id, r.tags || {}]));
  const catalog = products.filter((p) => tagsById.has(p.id));
  if (catalog.length < 5) return send(503, { error: "no_tags" });

  const lines = catalog.map((p) => {
    const t = tagsById.get(p.id);
    return `${p.id} | ${p.name} | màu: ${list(t.colors)} | hoa: ${list(t.flowers)} | kiểu: ${t.style || ""} | gói: ${t.wrapping || ""} | ${t.vibe || ""}`;
  });

  const prompt =
    "Đây là ảnh khách quét từ video của tiệm hoa. Hãy chọn tối đa 6 sản phẩm trong DANH MỤC bên dưới giống nhất với bó hoa/giỏ hoa trong ảnh. " +
    "Ưu tiên theo thứ tự: màu chủ đạo, loại hoa, kiểu bó và cách gói. Bỏ qua người, tay, nền và chữ trong ảnh. " +
    "Chỉ dùng mã (id) có trong danh mục, không bịa. Nếu ảnh không có hoa, trả has_flower=false và matches rỗng. " +
    'Chỉ trả về MỘT đối tượng JSON: {"has_flower":true,"matches":[{"id":"mã","reason":"vì sao giống, tối đa 15 từ, tiếng Việt"}]}\n\n' +
    "DANH MỤC (id | tên | màu | hoa | kiểu | gói | cảm giác):\n" +
    lines.join("\n");

  let text;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: image.media_type, data: image.data } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });
    if (!r.ok) return send(502, { error: "ai_failed" });
    const j = await r.json();
    text = (j.content && j.content[0] && j.content[0].text) || "";
  } catch (e) {
    return send(502, { error: "ai_failed" });
  }

  let parsed;
  try {
    parsed = JSON.parse((/\{[\s\S]*\}/.exec(text) || [""])[0]);
  } catch (e) {
    return send(502, { error: "ai_failed" });
  }

  const byId = new Map(catalog.map((p) => [p.id, p]));
  const out = (parsed.matches || [])
    .filter((m) => byId.has(m.id))
    .slice(0, 6)
    .map((m) => {
      const p = byId.get(m.id);
      return { id: p.id, name: p.name, price: Number(p.price) || 0, image: p.image_url || "", reason: String(m.reason || "").slice(0, 120) };
    });

  return send(200, { has_flower: parsed.has_flower !== false, products: out });
};
