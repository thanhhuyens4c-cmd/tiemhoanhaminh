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
      defaultSrc: "assets/images/hero-bouquet.png",
      aspect: "1:1",
      hint: "Ảnh chính trang chủ, hiển thị nổi bật. Nên dùng ảnh hoa đẹp."
    },
    {
      key: "index_about",
      label: "Ảnh Câu chuyện tiệm hoa (Trang chủ)",
      page: "Trang chủ (index.html)",
      pageIcon: "home",
      selector: "#index-about-img",
      defaultSrc: "assets/images/florist-workshop.png",
      aspect: "4:3",
      hint: "Ảnh giới thiệu xưởng hoa, florist làm việc"
    },
    {
      key: "index_gallery_1",
      label: "Ảnh Gallery 1 (Trang chủ)",
      page: "Trang chủ (index.html)",
      pageIcon: "home",
      selector: "#index-gallery-img-1",
      defaultSrc: "assets/images/bouquet-pink.png",
      aspect: "4:3",
      hint: "Ô ảnh thứ nhất trong bộ 3 ảnh gallery"
    },
    {
      key: "index_gallery_2",
      label: "Ảnh Gallery 2 (Trang chủ)",
      page: "Trang chủ (index.html)",
      pageIcon: "home",
      selector: "#index-gallery-img-2",
      defaultSrc: "assets/images/florist-workshop.png",
      aspect: "4:3",
      hint: "Ô ảnh thứ hai trong bộ 3 ảnh gallery"
    },
    {
      key: "index_gallery_3",
      label: "Ảnh Gallery 3 (Trang chủ)",
      page: "Trang chủ (index.html)",
      pageIcon: "home",
      selector: "#index-gallery-img-3",
      defaultSrc: "assets/images/hero-bouquet.png",
      aspect: "4:3",
      hint: "Ô ảnh thứ ba trong bộ 3 ảnh gallery"
    },
    {
      key: "collection_hero",
      label: "Ảnh Banner trang Bộ sưu tập",
      page: "Bộ sưu tập (bo-suu-tap.html)",
      pageIcon: "collections",
      selector: "#collection-hero-img",
      defaultSrc: "assets/images/hero-bouquet.png",
      aspect: "4:3",
      hint: "Banner chính trang bộ sưu tập"
    },
    {
      key: "about_hero",
      label: "Ảnh Hero trang Giới thiệu",
      page: "Giới thiệu (gioi-thieu.html)",
      pageIcon: "info",
      selector: "#about-hero-img",
      defaultSrc: "assets/images/florist-workshop.png",
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

  /** Lưu một slot */
  set(key, src) {
    const all = this.getAll();
    all[key] = { src, updatedAt: new Date().toISOString() };
    localStorage.setItem(this.LS_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("hnm:site-settings-updated", { detail: { key, src } }));
  },

  /** Reset một slot về mặc định */
  reset(key) {
    const all = this.getAll();
    delete all[key];
    localStorage.setItem(this.LS_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("hnm:site-settings-updated", { detail: { key, src: null } }));
  },

  /** Reset tất cả về mặc định */
  resetAll() {
    localStorage.removeItem(this.LS_KEY);
    window.dispatchEvent(new CustomEvent("hnm:site-settings-updated", { detail: { key: "all" } }));
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
  document.addEventListener("DOMContentLoaded", () => SiteSettings.applyToPage());
} else {
  SiteSettings.applyToPage();
}

// Live-fetch đã tắt: site-config.js quá lớn (~1.8MB), tải lại mỗi lần gây chậm trang.
// Config đã được load qua <script> tag, không cần fetch lại.

window.SiteSettings = SiteSettings;
