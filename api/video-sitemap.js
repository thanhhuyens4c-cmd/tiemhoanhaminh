// Sơ đồ video cho Google (video sitemap): mỗi video có trang riêng video.html?id=..., kèm ảnh bìa, tiêu đề, mô tả.
// Địa chỉ: /api/video-sitemap. Chỉ liệt kê video đã có ảnh bìa (Google bắt buộc).
const BASE = "https://tiemhoanhaminh.vercel.app";
const SUPABASE_URL = "https://nkugwprxqdiarrivhubr.supabase.co";
const SUPABASE_KEY = "sb_publishable_NJgA_RPQovMXZp1H7dLvdA_zZonsPdF";

const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

module.exports = async (req, res) => {
  let rows = [];
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/tiktok_videos?select=video_id,caption,description,thumbnail_url,posted_at&hidden=eq.false&thumbnail_url=not.is.null&order=posted_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (r.ok) rows = await r.json();
  } catch (e) {}

  const items = rows.map((v) => {
    const title = (v.caption || "Video bó hoa tươi Hà Nội").slice(0, 100);
    const desc = (v.description || `${title}. Video từ tiệm hoa Hoa Nhà Mình, Hà Nội. Ưng bó hoa nào, đặt ngay qua Zalo, giao tận nơi.`).slice(0, 2000);
    return `  <url>
    <loc>${esc(`${BASE}/video.html?id=${v.video_id}`)}</loc>
    <video:video>
      <video:thumbnail_loc>${esc(v.thumbnail_url)}</video:thumbnail_loc>
      <video:title>${esc(title)}</video:title>
      <video:description>${esc(desc)}</video:description>
      <video:player_loc>${esc(`https://www.tiktok.com/player/v1/${v.video_id}`)}</video:player_loc>${v.posted_at ? `
      <video:publication_date>${esc(new Date(v.posted_at).toISOString())}</video:publication_date>` : ""}
    </video:video>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${items.join("\n")}
</urlset>
`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.status(200).send(xml);
};
