// Sơ đồ trang web tự cập nhật: các trang chính + từng video + từng sản phẩm (đọc từ Supabase).
// Địa chỉ: /api/sitemap
const BASE = "https://tiemhoanhaminh.vercel.app";
const SUPABASE_URL = "https://nkugwprxqdiarrivhubr.supabase.co";
const SUPABASE_KEY = "sb_publishable_NJgA_RPQovMXZp1H7dLvdA_zZonsPdF";

const STATIC_PAGES = ["", "san-pham.html", "bo-suu-tap.html", "video-tiktok.html", "lien-he.html"];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function rows(path) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    return r.ok ? await r.json() : [];
  } catch (e) {
    return [];
  }
}

module.exports = async (req, res) => {
  const [videos, products] = await Promise.all([
    rows("tiktok_videos?select=video_id,posted_at&hidden=eq.false"),
    rows("products?select=id&is_active=eq.true"),
  ]);

  const urls = [
    ...STATIC_PAGES.map((p) => ({ loc: `${BASE}/${p}` })),
    ...videos.map((v) => ({ loc: `${BASE}/video.html?id=${v.video_id}`, lastmod: v.posted_at && v.posted_at.slice(0, 10) })),
    ...products.map((p) => ({ loc: `${BASE}/chi-tiet-san-pham.html?id=${encodeURIComponent(p.id)}` })),
  ];

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n") +
    "\n</urlset>\n";

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.status(200).send(xml);
};
