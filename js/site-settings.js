/**
 * SiteSettings – Quản lý ảnh hero, banner và logo toàn site
 * Lưu trữ qua localStorage, áp dụng tự động khi page load
 * Hoa Nhà Mình v2.5
 */

const SiteSettings = {
  LS_KEY: "hnm_site_settings_v1",

  /**
   * Danh sách tất cả các slot ảnh có thể chỉnh sửa.
   * key: unique identifier
   * label: tên hiển thị trong admin
   * page: trang áp dụng
   * selector: CSS selector của <img> cần cập nhật
   * defaultSrc: ảnh mặc định từ file gốc
   */
  SLOTS: [
    {
      key: "logo",
      label: "Logo tiệm hoa",
      page: "Tất cả các trang",
      pageIcon: "public",
      selector: "img[alt='Logo Hoa Nhà Mình'], img[alt='Logo']",
      defaultSrc: "assets/images/logo.png",
      aspect: "1:1",
      hint: "Logo hình tròn, nên dùng ảnh vuông (1:1)"
    },
    {
      key: "index_hero",
      label: "Ảnh Hero trang chủ",
      page: "Trang chủ (index.html)",
      pageIcon: "home",
      selector: "#hero-banner-img",
      defaultSrc: "assets/images/hero-bouquet.jpg",
      aspect: "1:1",
      hint: "Ảnh chính trang chủ, hiển thị nổi bật. Nên dùng ảnh hoa đẹp."
    },
    {
      key: "index_about",
      label: "Ảnh Câu chuyện tiệm hoa (Trang chủ)",
      page: "Trang chủ (index.html)",
      pageIcon: "home",
      selector: "#index-about-img",
      defaultSrc: "assets/images/florist-workshop.jpg",
      aspect: "4:3",
      hint: "Ảnh giới thiệu xưởng hoa, florist làm việc"
    },
    {
      key: "index_gallery_1",
      label: "Ảnh Gallery 1 (Trang chủ)",
      page: "Trang chủ (index.html)",
      pageIcon: "home",
      selector: "#index-gallery-img-1",
      defaultSrc: "assets/images/bouquet-pink.jpg",
      aspect: "4:3",
      hint: "Ô ảnh thứ nhất trong bộ 3 ảnh gallery"
    },
    {
      key: "index_gallery_2",
      label: "Ảnh Gallery 2 (Trang chủ)",
      page: "Trang chủ (index.html)",
      pageIcon: "home",
      selector: "#index-gallery-img-2",
      defaultSrc: "assets/images/florist-workshop.jpg",
      aspect: "4:3",
      hint: "Ô ảnh thứ hai trong bộ 3 ảnh gallery"
    },
    {
      key: "index_gallery_3",
      label: "Ảnh Gallery 3 (Trang chủ)",
      page: "Trang chủ (index.html)",
      pageIcon: "home",
      selector: "#index-gallery-img-3",
      defaultSrc: "assets/images/hero-bouquet.jpg",
      aspect: "4:3",
      hint: "Ô ảnh thứ ba trong bộ 3 ảnh gallery"
    },
    {
      key: "collection_hero",
      label: "Ảnh Banner trang Bộ sưu tập",
      page: "Bộ sưu tập (bo-suu-tap.html)",
      pageIcon: "collections",
      selector: "#collection-hero-img",
      defaultSrc: "assets/images/hero-bouquet.jpg",
      aspect: "4:3",
      hint: "Banner chính trang bộ sưu tập"
    },
    {
      key: "oct20_hero",
      label: "Ảnh Hero trang Hoa 20/10",
      page: "Hoa 20/10 (hoa-20-10.html)",
      pageIcon: "local_florist",
      selector: "#oct20-hero-img",
      defaultSrc: "assets/images/bouquet-pink.jpg",
      aspect: "4:3",
      hint: "Ảnh lớn đầu trang Hoa 20/10"
    },
    {
      key: "oct20_banner_1",
      label: "Banner 20/10 số 1 (Tặng mẹ yêu)",
      page: "Hoa 20/10 (hoa-20-10.html)",
      pageIcon: "local_florist",
      selector: "#oct20-banner-1",
      defaultSrc: "assets/images/hero-bouquet.jpg",
      aspect: "4:3",
      hint: "Banner thứ nhất trong hàng 3 banner của trang Hoa 20/10"
    },
    {
      key: "oct20_banner_2",
      label: "Banner 20/10 số 2 (Gửi người thương)",
      page: "Hoa 20/10 (hoa-20-10.html)",
      pageIcon: "local_florist",
      selector: "#oct20-banner-2",
      defaultSrc: "assets/images/bouquet-pink.jpg",
      aspect: "4:3",
      hint: "Banner thứ hai trong hàng 3 banner của trang Hoa 20/10"
    },
    {
      key: "oct20_banner_3",
      label: "Banner 20/10 số 3 (Tri ân cô giáo, chị gái, bạn gái)",
      page: "Hoa 20/10 (hoa-20-10.html)",
      pageIcon: "local_florist",
      selector: "#oct20-banner-3",
      defaultSrc: "assets/images/florist-workshop.jpg",
      aspect: "4:3",
      hint: "Banner thứ ba trong hàng 3 banner của trang Hoa 20/10"
    },
    {
      key: "about_hero",
      label: "Ảnh Hero trang Giới thiệu",
      page: "Giới thiệu (gioi-thieu.html)",
      pageIcon: "info",
      selector: "#about-hero-img",
      defaultSrc: "assets/images/florist-workshop.jpg",
      aspect: "4:5",
      hint: "Ảnh nghệ nhân tiệm hoa, florist workshop"
    },
    {
      key: "blog_featured",
      label: "Ảnh bài viết nổi bật (Blog)",
      page: "Blog (blog.html)",
      pageIcon: "article",
      selector: "#blog-featured-img",
      defaultSrc: "assets/images/blog-featured.jpg",
      aspect: "16:9",
      hint: "Ảnh hiển thị cho bài viết nổi bật đầu trang blog"
    },
    {
      key: "contact_banner",
      label: "Ảnh banner đặt hoa (Liên hệ)",
      page: "Liên hệ (lien-he.html)",
      pageIcon: "contact_mail",
      selector: "#contact-banner-img",
      defaultSrc: "assets/images/hero-bouquet.jpg",
      aspect: "4:3",
      hint: "Ảnh banner phần đặt hoa theo yêu cầu trên trang liên hệ"
    }
  ],

  // ── CRUD ──────────────────────────────────────────────────────────

  /** Lấy tất cả settings đã lưu */
  getAll() {
    try {
      const s = localStorage.getItem(this.LS_KEY);
      return s ? JSON.parse(s) : {};
    } catch (e) { return {}; }
  },

  /** Lấy src của một slot (ưu tiên: localStorage → site-config → defaultSrc) */
  get(key) {
    const all = this.getAll();
    if (all[key] && all[key].src) return all[key].src;
    if (typeof SITE_IMAGE_CONFIG !== "undefined" && SITE_IMAGE_CONFIG[key]) return SITE_IMAGE_CONFIG[key];
    const slot = this.SLOTS.find(s => s.key === key);
    return slot ? slot.defaultSrc : "";
  },

  /** Lưu một slot (lưu máy ngay, rồi đăng lên Supabase để mọi người cùng thấy) */
  set(key, src) {
    const all = this.getAll();
    all[key] = { src, updatedAt: new Date().toISOString() };
    this._saveLocal(all);
    window.dispatchEvent(new CustomEvent("hnm:site-settings-updated", { detail: { key, src } }));
    return this._track(this._pushRemote(key, src));
  },

  /** Reset một slot về mặc định */
  reset(key) {
    const all = this.getAll();
    delete all[key];
    this._saveLocal(all);
    window.dispatchEvent(new CustomEvent("hnm:site-settings-updated", { detail: { key, src: null } }));
    return this._track(this._deleteRemote(key));
  },

  /** Reset tất cả về mặc định */
  resetAll() {
    try { localStorage.removeItem(this.LS_KEY); } catch (e) {}
    window.dispatchEvent(new CustomEvent("hnm:site-settings-updated", { detail: { key: "all" } }));
    return this._track(this._deleteRemote(null));
  },

  _saveLocal(all) {
    try { localStorage.setItem(this.LS_KEY, JSON.stringify(all)); } catch (e) {
      console.warn("Không lưu được cài đặt ảnh vào trình duyệt:", e.message || e);
    }
  },

  // ── ĐỒNG BỘ SUPABASE (bảng site_settings, xem supabase-site-settings.sql) ──

  _client() {
    return (typeof SupabaseClient !== "undefined" && SupabaseClient.getClient) ? SupabaseClient.getClient() : null;
  },

  /** Promise của lần đồng bộ gần nhất: true = đã đăng lên website, false = chưa được */
  lastSync: null,
  _track(p) { this.lastSync = p; return p; },

  async _pushRemote(key, src) {
    const client = this._client();
    if (!client) return false;
    try {
      let url = src;
      if (typeof ProductAPI !== "undefined" && typeof src === "string" && src.startsWith("data:")) {
        url = await ProductAPI.uploadImage(src);
        if (url !== src) {
          const all = this.getAll();
          if (all[key]) { all[key].src = url; this._saveLocal(all); }
        }
      }
      const { error } = await client.from("site_settings")
        .upsert({ key, src: url, updated_at: new Date().toISOString() });
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn("Không đăng được ảnh lên Supabase:", err.message || err);
      return false;
    }
  },

  async _deleteRemote(key) {
    const client = this._client();
    if (!client) return false;
    try {
      const q = client.from("site_settings").delete();
      const { error } = key ? await q.eq("key", key) : await q.neq("key", "");
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn("Không xóa được ảnh trên Supabase:", err.message || err);
      return false;
    }
  },

  /**
   * Tải ảnh đã đăng từ Supabase, gộp vào cài đặt máy rồi áp dụng lên trang.
   * Khách xem web: dữ liệu máy được thay hẳn bằng dữ liệu máy chủ.
   * Admin: giữ thay đổi chưa đăng và tự đăng nốt lên máy chủ.
   */
  async loadRemote() {
    const client = this._client();
    if (!client) return;
    try {
      const { data, error } = await client.from("site_settings").select("key,src,updated_at");
      if (error) throw error;
      const remote = {};
      (data || []).forEach(r => { remote[r.key] = { src: r.src, updatedAt: r.updated_at }; });
      const isAdmin = typeof AdminCMS !== "undefined";
      let merged = remote;
      if (isAdmin) {
        const local = this.getAll();
        merged = { ...local, ...remote };
        Object.keys(local).forEach(k => {
          if (!remote[k] && local[k] && local[k].src) this._pushRemote(k, local[k].src);
        });
      }
      this._saveLocal(merged);
      this.applyToPage();
    } catch (err) {
      console.warn("Không tải được cài đặt ảnh từ Supabase:", err.message || err);
    }
  },

  /** Có bất kỳ customization nào không */
  hasCustom(key) {
    const all = this.getAll();
    return !!(all[key] && all[key].src);
  },

  // ── APPLY TO PAGE ─────────────────────────────────────────────────

  /**
   * Áp dụng tất cả ảnh đã cấu hình lên trang hiện tại.
   * Được gọi tự động khi DOM sẵn sàng.
   */
  applyToPage() {
    const all = this.getAll();
    const config = (typeof SITE_IMAGE_CONFIG !== "undefined") ? SITE_IMAGE_CONFIG : {};
    this.SLOTS.forEach(slot => {
      const src = (all[slot.key] && all[slot.key].src) ? all[slot.key].src : config[slot.key];
      if (!src) return;
      const elements = document.querySelectorAll(slot.selector);
      elements.forEach(el => {
        el.src = src;
      });
    });
  }
};

// Tự động áp dụng khi DOM load xong
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { SiteSettings.applyToPage(); SiteSettings.loadRemote(); });
} else {
  SiteSettings.applyToPage();
  SiteSettings.loadRemote();
}

// Live-fetch đã tắt: site-config.js quá lớn (~1.8MB), tải lại mỗi lần gây chậm trang.
// Config đã được load qua <script> tag, không cần fetch lại.

window.SiteSettings = SiteSettings;
