/**
 * Admin CMS – Hoa Nhà Mình
 * Quản lý sản phẩm, ảnh hoa, giá bán, nội dung text qua localStorage
 */

// ═══════════════════════════════════════════════════════════════════
//  PRODUCT STORE  (localStorage layer on top of static PRODUCTS[])
// ═══════════════════════════════════════════════════════════════════
const AdminCMS = {
  LS_KEY: "hnm_products_v1",

  /** Lấy danh sách sản phẩm (ưu tiên localStorage, fallback về data.js) */
  getProducts() {
    try {
      const saved = localStorage.getItem(this.LS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Deep-clone static data để không mutate gốc
    return JSON.parse(JSON.stringify(PRODUCTS));
  },

  /** Ghi mảng sản phẩm vào localStorage */
  saveProducts(list) {
    try {
      localStorage.setItem(this.LS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("localStorage đầy, thử tối ưu ảnh...", e);
      // Fallback: loại bỏ ảnh base64 của sản phẩm cũ hơn để tiết kiệm dung lượng
      try {
        const optimized = list.map((p, i) => {
          if (i > 0 && p.image && p.image.startsWith("data:")) {
            return { ...p, image: "assets/images/hero-bouquet.png", gallery: ["assets/images/hero-bouquet.png"] };
          }
          return p;
        });
        localStorage.setItem(this.LS_KEY, JSON.stringify(optimized));
        showToast("⚠️ Bộ nhớ gần đầy – ảnh upload của sản phẩm cũ được tối ưu. Hãy dùng URL ảnh!", "warning");
      } catch (e2) {
        showToast("❌ Bộ nhớ trình duyệt đầy! Vui lòng dùng URL ảnh thay vì upload.", "error");
        return;
      }
    }
    // Phát sự kiện để các trang khác reload nếu cần
    window.dispatchEvent(new CustomEvent("hnm:products-updated", { detail: list }));
  },

  /** Thêm sản phẩm mới */
  addProduct(productData) {
    const list = this.getProducts();
    const timestamp = Date.now();
    const slug = this._toSlug(productData.name) + "-" + timestamp;
    // Spread productData trước, sau đó ghi đè các field hệ thống để tránh bị override
    const newProduct = {
      ...productData,
      id: "HNM-CUSTOM-" + timestamp,
      slug,
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0,
      isBestSeller: productData.isBestSeller || false,
      isNew: productData.isNew !== undefined ? productData.isNew : true,
      isFeatured: productData.isFeatured || false,
      tags: productData.tags || ["moi"],
      // gallery luôn đặt sau spread để đảm bảo đúng ảnh chính
      gallery: productData.image ? [productData.image] : []
    };
    list.unshift(newProduct);
    this.saveProducts(list);
    return newProduct;
  },

  /** Cập nhật sản phẩm theo id */
  updateProduct(id, updates) {
    const list = this.getProducts();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    // Lưu ảnh cũ trước khi merge để lọc khỏi gallery
    const oldImage = list[idx].image;
    list[idx] = { ...list[idx], ...updates };
    // Cập nhật gallery[0] khi ảnh chính thay đổi
    if (updates.image) {
      const oldGallery = (list[idx].gallery || []).filter(g => g !== oldImage && g !== updates.image);
      list[idx].gallery = [updates.image, ...oldGallery];
    }
    this.saveProducts(list);
    return list[idx];
  },

  /** Xóa sản phẩm theo id */
  deleteProduct(id) {
    const list = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(list);
  },

  /** Reset về dữ liệu gốc từ data.js */
  resetToDefault() {
    localStorage.removeItem(this.LS_KEY);
  },

  // ── Helper ────────────────────────────────────────────────────────
  _toSlug(str) {
    return (str || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim().replace(/\s+/g, "-");
  }
};

// ═══════════════════════════════════════════════════════════════════
//  UI HELPERS
// ═══════════════════════════════════════════════════════════════════
function fmt(n) {
  return Number(n || 0).toLocaleString("vi-VN");
}

function showToast(msg, type = "success") {
  const t = document.createElement("div");
  const bg = type === "success" ? "#3E9B61" : type === "error" ? "#D95A82" : "#F29A38";
  t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:${bg};color:#fff;
    padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.15);
    transform:translateY(10px);opacity:0;transition:all .3s;max-width:320px;`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.transform = "translateY(0)"; t.style.opacity = "1"; });
  setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3000);
}

// ═══════════════════════════════════════════════════════════════════
//  IMAGE UPLOAD & CANVAS COMPRESSION
//  Tự động nén ảnh xuống dưới 100KB để lưu trữ offline an toàn trong localStorage
// ═══════════════════════════════════════════════════════════════════
function compressImageFile(file, maxWidth = 1200, maxHeight = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = e => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Nén ảnh sang định dạng JPEG nhẹ nhàng
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function setupImageUpload(inputEl, previewEl, hiddenEl) {
  if (!inputEl) return;
  inputEl.addEventListener("change", async () => {
    const file = inputEl.files[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      showToast("Ảnh quá lớn! Vui lòng chọn ảnh dưới 15MB.", "error");
      inputEl.value = "";
      return;
    }

    try {
      if (previewEl) previewEl.style.opacity = "0.5";
      const compressedDataUrl = await compressImageFile(file);
      if (previewEl) {
        previewEl.src = compressedDataUrl;
        previewEl.classList.remove("hidden");
        previewEl.style.opacity = "1";
      }
      if (hiddenEl) hiddenEl.value = compressedDataUrl;
      showToast("📸 Đã nén và tải ảnh thành công!");
    } catch (err) {
      console.error("Lỗi nén ảnh:", err);
      // Fallback nếu canvas lỗi
      const fallbackReader = new FileReader();
      fallbackReader.onload = ev => {
        if (previewEl) {
          previewEl.src = ev.target.result;
          previewEl.classList.remove("hidden");
          previewEl.style.opacity = "1";
        }
        if (hiddenEl) hiddenEl.value = ev.target.result;
      };
      fallbackReader.readAsDataURL(file);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
//  PRODUCT TABLE RENDERER
// ═══════════════════════════════════════════════════════════════════
function renderProductTable() {
  const tbody = document.getElementById("admin-products-table-body");
  if (!tbody) return;
  const products = AdminCMS.getProducts();

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-[#857B76] italic">Chưa có sản phẩm nào.</td></tr>`;
    document.getElementById("product-count").textContent = "0 sản phẩm";
    return;
  }

  document.getElementById("product-count").textContent = `${products.length} sản phẩm`;

  tbody.innerHTML = products.map(p => `
    <tr class="hover:bg-[#FAF7E9]/60 transition-colors group" data-id="${p.id}">
      <td class="p-3">
        <div class="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-[#E5DDCE] group-hover:border-[#3E9B61] transition-colors">
          <img src="${p.image}" alt="${p.name}"
            class="w-full h-full object-cover"
            onerror="this.src='assets/images/hero-bouquet.png'">
        </div>
      </td>
      <td class="p-3">
        <p class="font-bold text-[#211A18] text-sm leading-tight">${p.name}</p>
        <p class="text-[11px] text-[#857B76] mt-0.5 font-mono">${p.id}</p>
      </td>
      <td class="p-3 text-xs text-[#4B4240]">${p.typeName || "—"}</td>
      <td class="p-3 text-xs text-[#4B4240]">${p.colorName || "—"}</td>
      <td class="p-3">
        <p class="font-bold text-[#D95A82] text-sm">${fmt(p.price)}₫</p>
        ${p.originalPrice && p.originalPrice > p.price
          ? `<p class="text-[10px] text-[#857B76] line-through">${fmt(p.originalPrice)}₫</p>` : ""}
      </td>
      <td class="p-3">
        <div class="flex flex-wrap gap-1">
          ${p.isBestSeller ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D95A82]/10 text-[#D95A82]">Bán chạy</span>` : ""}
          ${p.isNew ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#3E9B61]/10 text-[#3E9B61]">Mới</span>` : ""}
          ${p.isFeatured ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F29A38]/15 text-[#B96B00]">Nổi bật</span>` : ""}
        </div>
      </td>
      <td class="p-3 text-right space-x-1">
        <button onclick="openEditModal('${p.id}')"
          class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#3E9B61]/10 text-[#277A4D] rounded-lg text-xs font-semibold hover:bg-[#3E9B61]/20 transition-colors">
          <span class="material-symbols-outlined text-sm">edit</span>Sửa
        </button>
        <button onclick="confirmDelete('${p.id}', '${p.name.replace(/'/g, "\\'")}')"
          class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#D95A82]/10 text-[#D95A82] rounded-lg text-xs font-semibold hover:bg-[#D95A82]/20 transition-colors">
          <span class="material-symbols-outlined text-sm">delete</span>Xóa
        </button>
      </td>
    </tr>
  `).join("");
}

// ═══════════════════════════════════════════════════════════════════
//  MODAL – MỞ/ĐÓNG
// ═══════════════════════════════════════════════════════════════════
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove("hidden");
  m.classList.add("flex");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    m.querySelector(".modal-box")?.classList.add("scale-100", "opacity-100");
    m.querySelector(".modal-box")?.classList.remove("scale-95", "opacity-0");
  });
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  const box = m.querySelector(".modal-box");
  if (box) { box.classList.remove("scale-100", "opacity-100"); box.classList.add("scale-95", "opacity-0"); }
  setTimeout(() => {
    m.classList.add("hidden");
    m.classList.remove("flex");
    document.body.style.overflow = "";
  }, 200);
}

// ═══════════════════════════════════════════════════════════════════
//  MODAL THÊM SẢN PHẨM MỚI
// ═══════════════════════════════════════════════════════════════════
function openAddModal() {
  // Reset form
  document.getElementById("add-form").reset();
  document.getElementById("add-img-preview").classList.add("hidden");
  document.getElementById("add-img-data").value = "";
  openModal("modal-add");
}

document.addEventListener("DOMContentLoaded", () => {
  // ── Setup image uploads ──────────────────────────────────────────
  setupImageUpload(
    document.getElementById("add-img-input"),
    document.getElementById("add-img-preview"),
    document.getElementById("add-img-data")
  );
  setupImageUpload(
    document.getElementById("edit-img-input"),
    document.getElementById("edit-img-preview"),
    document.getElementById("edit-img-data")
  );

  // ── Auto-sync typeName khi chọn loại hoa (form Thêm) ────────────
  const TYPE_NAMES = { "bo-hoa": "Bó hoa tươi", "gio-hoa": "Giỏ hoa thủ công" };
  const addTypeSelect = document.querySelector("#add-form [name=type]");
  const addTypeNameInput = document.querySelector("#add-form [name=typeName]");
  if (addTypeSelect && addTypeNameInput) {
    addTypeSelect.addEventListener("change", () => {
      if (!addTypeNameInput.value || Object.values(TYPE_NAMES).includes(addTypeNameInput.value)) {
        addTypeNameInput.value = TYPE_NAMES[addTypeSelect.value] || "";
      }
    });
  }

  // ── ADD form submit ──────────────────────────────────────────────
  document.getElementById("add-form").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const imgData = document.getElementById("add-img-data").value;
    const imgUrl  = fd.get("imageUrl") || "";
    const name    = (fd.get("name") || "").trim();
    const price   = parseInt(fd.get("price")) || 0;

    if (!name) {
      showToast("Vui lòng nhập tên sản phẩm!", "error");
      e.target.querySelector("[name=name]")?.focus();
      return;
    }
    if (!price) {
      showToast("Vui lòng nhập giá bán sản phẩm!", "error");
      e.target.querySelector("[name=price]")?.focus();
      return;
    }

    const typeVal = fd.get("type") || "bo-hoa";
    const productData = {
      name,
      type:          typeVal,
      typeName:      (fd.get("typeName") || "").trim() || TYPE_NAMES[typeVal] || "Bó hoa tươi",
      color:         (fd.get("color") || "hong").trim(),
      colorName:     (fd.get("colorName") || "Hồng").trim(),
      price,
      originalPrice: parseInt(fd.get("originalPrice")) || price,
      image:         imgData || imgUrl || "assets/images/hero-bouquet.png",
      shortDesc:     (fd.get("shortDesc") || "").trim(),
      description:   (fd.get("description") || "").trim(),
      careInstructions: (fd.get("careInstructions") || "").trim(),
      occasion:      (fd.get("occasion") || "").split(",").map(s => s.trim()).filter(Boolean),
      recipient:     (fd.get("recipient") || "").split(",").map(s => s.trim()).filter(Boolean),
      isBestSeller:  fd.get("isBestSeller") === "on",
      isNew:         fd.get("isNew") === "on",
      isFeatured:    fd.get("isFeatured") === "on"
    };

    AdminCMS.addProduct(productData);
    renderProductTable();
    closeModal("modal-add");
    showToast(`✅ Đã thêm "${productData.name}" thành công!`);
  });

  // ── EDIT form submit ─────────────────────────────────────────────
  document.getElementById("edit-form").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const id  = document.getElementById("edit-product-id").value;
    const imgData = document.getElementById("edit-img-data").value;
    const imgUrl  = fd.get("imageUrl") || "";
    const name    = (fd.get("name") || "").trim();
    const price   = parseInt(fd.get("price")) || 0;

    if (!name) {
      showToast("Vui lòng nhập tên sản phẩm!", "error");
      e.target.querySelector("[name=name]")?.focus();
      return;
    }
    if (!price) {
      showToast("Vui lòng nhập giá bán sản phẩm!", "error");
      e.target.querySelector("[name=price]")?.focus();
      return;
    }

    const typeVal = fd.get("type") || "bo-hoa";
    const updates = {
      name,
      type:          typeVal,
      typeName:      (fd.get("typeName") || "").trim() || TYPE_NAMES[typeVal] || "Bó hoa tươi",
      color:         (fd.get("color") || "").trim(),
      colorName:     (fd.get("colorName") || "").trim(),
      price,
      originalPrice: parseInt(fd.get("originalPrice")) || price,
      shortDesc:     (fd.get("shortDesc") || "").trim(),
      description:   (fd.get("description") || "").trim(),
      careInstructions: (fd.get("careInstructions") || "").trim(),
      occasion:      (fd.get("occasion") || "").split(",").map(s => s.trim()).filter(Boolean),
      recipient:     (fd.get("recipient") || "").split(",").map(s => s.trim()).filter(Boolean),
      isBestSeller:  fd.get("isBestSeller") === "on",
      isNew:         fd.get("isNew") === "on",
      isFeatured:    fd.get("isFeatured") === "on"
    };

    if (imgData) updates.image = imgData;
    else if (imgUrl) updates.image = imgUrl;

    AdminCMS.updateProduct(id, updates);
    renderProductTable();
    closeModal("modal-edit");
    showToast(`✅ Đã cập nhật "${updates.name}" thành công!`);
  });

  // ── Đồng bộ khi tab/cửa sổ khác cập nhật localStorage ──────────
  window.addEventListener("storage", e => {
    if (e.key === AdminCMS.LS_KEY) {
      renderProductTable();
    }
    if (e.key === AdminBlogCMS.LS_KEY) {
      renderBlogTable();
    }
  });

  // ── Initial render ───────────────────────────────────────────────
  renderProductTable();
});

// ═══════════════════════════════════════════════════════════════════
//  MODAL SỬA SẢN PHẨM – điền dữ liệu vào form
// ═══════════════════════════════════════════════════════════════════
function openEditModal(id) {
  const products = AdminCMS.getProducts();
  const p = products.find(x => x.id === id);
  if (!p) { showToast("Không tìm thấy sản phẩm!", "error"); return; }

  const f = document.getElementById("edit-form");
  document.getElementById("edit-product-id").value = p.id;
  f.querySelector("[name=name]").value = p.name || "";
  f.querySelector("[name=type]").value = p.type || "";
  f.querySelector("[name=typeName]").value = p.typeName || "";
  f.querySelector("[name=color]").value = p.color || "";
  f.querySelector("[name=colorName]").value = p.colorName || "";
  f.querySelector("[name=price]").value = p.price || "";
  f.querySelector("[name=originalPrice]").value = p.originalPrice || "";
  f.querySelector("[name=shortDesc]").value = p.shortDesc || "";
  f.querySelector("[name=description]").value = p.description || "";
  f.querySelector("[name=careInstructions]").value = p.careInstructions || "";
  f.querySelector("[name=occasion]").value = (p.occasion || []).join(", ");
  f.querySelector("[name=recipient]").value = (p.recipient || []).join(", ");
  f.querySelector("[name=isBestSeller]").checked = !!p.isBestSeller;
  f.querySelector("[name=isNew]").checked = !!p.isNew;
  f.querySelector("[name=isFeatured]").checked = !!p.isFeatured;

  // Ảnh hiện tại
  const editImgPreview = document.getElementById("edit-img-preview");
  editImgPreview.src = p.image || "";
  editImgPreview.classList.toggle("hidden", !p.image);
  document.getElementById("edit-img-data").value = "";
  f.querySelector("[name=imageUrl]").value = "";

  openModal("modal-edit");
}

// ═══════════════════════════════════════════════════════════════════
//  XÁC NHẬN XÓA
// ═══════════════════════════════════════════════════════════════════
let _pendingDeleteId = null;

function confirmDelete(id, name) {
  _pendingDeleteId = id;
  document.getElementById("delete-product-name").textContent = name;
  openModal("modal-delete");
}

function executeDelete() {
  if (!_pendingDeleteId) return;
  AdminCMS.deleteProduct(_pendingDeleteId);
  _pendingDeleteId = null;
  renderProductTable();
  closeModal("modal-delete");
  showToast("🗑️ Đã xóa sản phẩm thành công.", "warning");
}

// ═══════════════════════════════════════════════════════════════════
//  SEARCH / FILTER
// ═══════════════════════════════════════════════════════════════════
function filterProducts() {
  const q = (document.getElementById("product-search")?.value || "").toLowerCase();
  const typeFilter = (document.getElementById("product-type-filter")?.value || "");

  const rows = document.querySelectorAll("#admin-products-table-body tr[data-id]");
  let visible = 0;
  rows.forEach(row => {
    const products = AdminCMS.getProducts();
    const id = row.getAttribute("data-id");
    const p = products.find(x => x.id === id);
    if (!p) { row.style.display = "none"; return; }

    const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || (p.colorName || "").toLowerCase().includes(q);
    const matchType = !typeFilter || p.type === typeFilter;

    row.style.display = matchQ && matchType ? "" : "none";
    if (matchQ && matchType) visible++;
  });

  const countEl = document.getElementById("product-count");
  if (countEl) countEl.textContent = `${visible} sản phẩm`;
}

// ═══════════════════════════════════════════════════════════════════
//  RESET VỀ DỮ LIỆU GỐC
// ═══════════════════════════════════════════════════════════════════
function resetProductsToDefault() {
  if (!confirm("Bạn có chắc muốn xóa toàn bộ thay đổi và khôi phục dữ liệu gốc không?")) return;
  AdminCMS.resetToDefault();
  renderProductTable();
  showToast("♻️ Đã khôi phục dữ liệu sản phẩm gốc.");
}

window.AdminCMS = AdminCMS;

// ═══════════════════════════════════════════════════════════════════
//  BLOG STORE (localStorage layer on top of static BLOG_POSTS[])
// ═══════════════════════════════════════════════════════════════════
const AdminBlogCMS = {
  LS_KEY: "hnm_blogs_v1",

  getBlogs() {
    try {
      const saved = localStorage.getItem(this.LS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return JSON.parse(JSON.stringify(BLOG_POSTS));
  },

  saveBlogs(list) {
    try {
      localStorage.setItem(this.LS_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("hnm:blogs-updated", { detail: list }));
      return true;
    } catch (e) {
      console.warn("Lưu localStorage bài viết bị giới hạn dung lượng, đang tối ưu:", e);
      try {
        // Tối ưu: Nếu quota đầy do ảnh cũ, chuyển các ảnh cũ về ảnh mẫu để ưu tiên lưu bài mới nhất
        const optimized = list.map((b, idx) => {
          if (idx > 0 && b.image && b.image.startsWith("data:")) {
            return { ...b, image: "assets/images/bouquet-pink.png" };
          }
          return b;
        });
        localStorage.setItem(this.LS_KEY, JSON.stringify(optimized));
        window.dispatchEvent(new CustomEvent("hnm:blogs-updated", { detail: optimized }));
        return true;
      } catch (err2) {
        showToast("⚠️ Bộ nhớ trình duyệt đầy, vui lòng dùng link ảnh URL cho bài viết!", "warning");
        return false;
      }
    }
  },

  addBlog(data) {
    const list = this.getBlogs();
    const timestamp = Date.now();
    const slug = AdminCMS._toSlug(data.title) + "-" + timestamp;
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const newBlog = {
      id: "blog-" + timestamp,
      slug,
      title: data.title,
      category: data.category || "Hoa & Cảm xúc",
      categorySlug: this._toCategorySlug(data.category),
      date: data.date || formattedDate,
      author: data.author || "Thu Trang (Florist Hoa Nhà Mình)",
      readTime: data.readTime || "5 phút đọc",
      image: data.image || "assets/images/bouquet-pink.png",
      excerpt: data.excerpt || "",
      content: data.content || "",
      relatedProducts: data.relatedProducts || []
    };
    list.unshift(newBlog);
    this.saveBlogs(list);
    return newBlog;
  },

  updateBlog(id, updates) {
    const list = this.getBlogs();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    if (updates.category) {
      list[idx].categorySlug = this._toCategorySlug(updates.category);
    }
    this.saveBlogs(list);
    return list[idx];
  },

  deleteBlog(id) {
    const list = this.getBlogs().filter(b => b.id !== id);
    this.saveBlogs(list);
  },

  resetToDefault() {
    localStorage.removeItem(this.LS_KEY);
  },

  _toCategorySlug(cat) {
    const c = (cat || "").toLowerCase();
    if (c.includes("cảm xúc") || c.includes("emotion")) return "emotion";
    if (c.includes("chăm sóc") || c.includes("care")) return "care";
    if (c.includes("câu chuyện") || c.includes("story")) return "story";
    return AdminCMS._toSlug(cat);
  }
};

// ═══════════════════════════════════════════════════════════════════
//  BLOG TABLE RENDERER
// ═══════════════════════════════════════════════════════════════════
function renderBlogTable() {
  const tbody = document.getElementById("admin-blogs-table-body");
  if (!tbody) return;
  const blogs = AdminBlogCMS.getBlogs();

  // Update counters
  const totalCountEl = document.getElementById("blog-total-count");
  const countEmotionEl = document.getElementById("blog-count-emotion");
  const countCareEl = document.getElementById("blog-count-care");
  const countStoryEl = document.getElementById("blog-count-story");
  const countDisplay = document.getElementById("blog-count-display");

  if (totalCountEl) totalCountEl.textContent = blogs.length;
  if (countEmotionEl) countEmotionEl.textContent = blogs.filter(b => b.categorySlug === 'emotion').length;
  if (countCareEl) countCareEl.textContent = blogs.filter(b => b.categorySlug === 'care').length;
  if (countStoryEl) countStoryEl.textContent = blogs.filter(b => b.categorySlug === 'story').length;
  if (countDisplay) countDisplay.textContent = `${blogs.length} bài viết`;

  if (blogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-[#857B76] italic">Chưa có bài viết nào. Hãy bấm "+ Đăng bài viết mới" để tạo bài đầu tiên.</td></tr>`;
    return;
  }

  const categoryBadges = {
    emotion: "bg-[#D95A82]/10 text-[#D95A82] border-[#D95A82]/20",
    care: "bg-[#3E9B61]/10 text-[#277A4D] border-[#3E9B61]/20",
    story: "bg-[#F29A38]/15 text-[#B96B00] border-[#F29A38]/30"
  };

  tbody.innerHTML = blogs.map(b => {
    const badgeClass = categoryBadges[b.categorySlug] || "bg-[#E5DDCE]/50 text-[#4B4240] border-[#E5DDCE]";
    const relCount = (b.relatedProducts || []).length;

    return `
      <tr class="hover:bg-[#FAF7E9]/60 transition-colors group" data-id="${b.id}">
        <td class="p-3">
          <div class="relative w-16 h-12 rounded-xl overflow-hidden border-2 border-[#E5DDCE] group-hover:border-[#3E9B61] transition-colors bg-[#FAF7E9] flex-shrink-0">
            <img src="${b.image}" alt="${b.title}" class="w-full h-full object-cover" onerror="this.src='assets/images/bouquet-pink.png'">
          </div>
        </td>
        <td class="p-3 max-w-sm">
          <p class="font-bold text-[#211A18] text-sm leading-snug line-clamp-1 group-hover:text-[#D95A82] transition-colors">${b.title}</p>
          <p class="text-[11px] text-[#857B76] line-clamp-1 mt-0.5">${b.excerpt || "Chưa có mô tả ngắn"}</p>
          <p class="text-[10px] text-[#857B76] font-mono mt-0.5">ID: ${b.id}</p>
        </td>
        <td class="p-3">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeClass}">
            ${b.category}
          </span>
        </td>
        <td class="p-3 text-xs">
          <p class="font-semibold text-[#211A18]">${b.author}</p>
          <p class="text-[11px] text-[#857B76]">${b.date}</p>
        </td>
        <td class="p-3 text-xs text-[#857B76] whitespace-nowrap">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">schedule</span>${b.readTime || '5 phút đọc'}
          </span>
        </td>
        <td class="p-3 text-xs">
          <span class="px-2 py-0.5 rounded-lg bg-[#FAF7E9] text-[#277A4D] font-semibold border border-[#E5DDCE] text-[11px]">
            🌸 ${relCount} hoa
          </span>
        </td>
        <td class="p-3 text-right space-x-1 whitespace-nowrap">
          <a href="bai-viet.html?id=${b.id}" target="_blank"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FAF7E9] text-[#277A4D] border border-[#E5DDCE] rounded-lg text-xs font-semibold hover:bg-[#3E9B61] hover:text-white transition-colors" title="Xem trên web">
            <span class="material-symbols-outlined text-sm">open_in_new</span><span class="hidden xl:inline">Xem</span>
          </a>
          <button onclick="openEditBlogModal('${b.id}')"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#3E9B61]/10 text-[#277A4D] rounded-lg text-xs font-semibold hover:bg-[#3E9B61]/20 transition-colors">
            <span class="material-symbols-outlined text-sm">edit</span>Sửa
          </button>
          <button onclick="confirmDeleteBlog('${b.id}', '${b.title.replace(/'/g, "\\'")}')"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#D95A82]/10 text-[#D95A82] rounded-lg text-xs font-semibold hover:bg-[#D95A82]/20 transition-colors">
            <span class="material-symbols-outlined text-sm">delete</span>Xóa
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// ═══════════════════════════════════════════════════════════════════
//  BLOG MODAL LOGIC (ADD / EDIT)
// ═══════════════════════════════════════════════════════════════════
function populateRelatedProductsCheckboxes(selectedIds = []) {
  const container = document.getElementById("blog-related-products-list");
  if (!container) return;
  const products = AdminCMS.getProducts();

  container.innerHTML = products.map(p => {
    const isChecked = selectedIds.includes(p.id);
    return `
      <label class="flex items-center gap-2.5 p-2 rounded-xl border border-[#E5DDCE] hover:bg-[#FAF7E9] cursor-pointer transition-colors text-xs">
        <input type="checkbox" name="blogRelated" value="${p.id}" ${isChecked ? 'checked' : ''} class="rounded text-[#3E9B61] focus:ring-[#3E9B61]">
        <img src="${p.image}" alt="${p.name}" class="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-[#E5DDCE]">
        <div class="flex-1 min-w-0">
          <p class="font-bold text-[#211A18] truncate">${p.name}</p>
          <p class="text-[10px] text-[#D95A82] font-semibold">${fmt(p.price)}₫</p>
        </div>
      </label>
    `;
  }).join("");
}

function openAddBlogModal() {
  const f = document.getElementById("blog-form");
  if (!f) return;
  f.reset();
  document.getElementById("blog-modal-title").textContent = "Đăng bài viết Blog mới";
  document.getElementById("blog-form-id").value = "";

  // Set default date
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  document.getElementById("blog-form-date").value = `${day}/${month}/${year}`;
  document.getElementById("blog-form-author").value = "Thu Trang (Florist Hoa Nhà Mình)";
  document.getElementById("blog-form-readtime").value = "5 phút đọc";

  // Reset image
  const preview = document.getElementById("blog-img-preview");
  preview.src = "assets/images/bouquet-pink.png";
  document.getElementById("blog-img-data").value = "";
  document.getElementById("blog-form-image-url").value = "";

  // Content template
  document.getElementById("blog-form-content").value = `<p>Nhập lời tựa ngọt ngào mở đầu bài viết ở đây...</p>\n\n<h3>1. Tiêu đề phần chia sẻ thứ nhất</h3>\n<p>Nội dung câu chuyện hoặc mẹo chăm sóc hoa chi tiết...</p>\n\n<h3>2. Góc cảm xúc tiệm Hoa Nhà Mình</h3>\n<p>Lời kết gửi gắm yêu thương đến bạn đọc...</p>`;

  populateRelatedProductsCheckboxes(["HNM-HM001", "HNM-HM002"]);
  openModal("modal-blog");
}

function openEditBlogModal(id) {
  const blogs = AdminBlogCMS.getBlogs();
  const b = blogs.find(x => x.id === id);
  if (!b) return;

  const f = document.getElementById("blog-form");
  if (!f) return;
  f.reset();

  document.getElementById("blog-modal-title").textContent = "Chỉnh sửa bài viết Blog";
  document.getElementById("blog-form-id").value = b.id;
  document.getElementById("blog-form-title").value = b.title;
  document.getElementById("blog-form-category").value = b.category;
  document.getElementById("blog-form-author").value = b.author;
  document.getElementById("blog-form-date").value = b.date;
  document.getElementById("blog-form-readtime").value = b.readTime || "5 phút đọc";
  document.getElementById("blog-form-excerpt").value = b.excerpt || "";
  document.getElementById("blog-form-content").value = b.content || "";

  // Image preview
  const preview = document.getElementById("blog-img-preview");
  preview.src = b.image || "assets/images/bouquet-pink.png";
  document.getElementById("blog-img-data").value = "";
  document.getElementById("blog-form-image-url").value = b.image && b.image.startsWith("data:") ? "" : (b.image || "");

  populateRelatedProductsCheckboxes(b.relatedProducts || []);
  openModal("modal-blog");
}

function saveBlogSubmit(e) {
  if (e && typeof e.preventDefault === "function") {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  const idEl = document.getElementById("blog-form-id");
  const id = idEl ? idEl.value : "";
  const title = (document.getElementById("blog-form-title")?.value || "").trim();
  const category = document.getElementById("blog-form-category")?.value || "Hoa & Cảm xúc";
  const author = (document.getElementById("blog-form-author")?.value || "").trim() || "Thu Trang (Florist Hoa Nhà Mình)";
  const date = (document.getElementById("blog-form-date")?.value || "").trim();
  const readTime = (document.getElementById("blog-form-readtime")?.value || "").trim() || "5 phút đọc";
  let excerpt = (document.getElementById("blog-form-excerpt")?.value || "").trim();
  let content = (document.getElementById("blog-form-content")?.value || "").trim();

  // Image handling
  const uploadedImg = document.getElementById("blog-img-data")?.value || "";
  const urlImg = (document.getElementById("blog-form-image-url")?.value || "").trim();
  const previewEl = document.getElementById("blog-img-preview");
  const currentPreview = previewEl?.getAttribute("src") || previewEl?.src || "assets/images/bouquet-pink.png";
  const image = uploadedImg || urlImg || currentPreview;

  // Related products
  const relatedProducts = Array.from(document.querySelectorAll("input[name='blogRelated']:checked")).map(cb => cb.value);

  if (!title) {
    showToast("Vui lòng nhập tiêu đề bài viết!", "error");
    document.getElementById("blog-form-title")?.focus();
    return false;
  }

  if (!content) {
    content = "<p>Nội dung câu chuyện và kinh nghiệm từ tiệm Hoa Nhà Mình...</p>";
  }

  if (!excerpt) {
    // Tự động trích xuất tóm tắt ngắn từ nội dung không chứa thẻ HTML
    const plain = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    excerpt = plain.length > 140 ? plain.substring(0, 137) + "..." : (plain || "Bài viết chia sẻ từ Hoa Nhà Mình.");
  }

  const blogData = {
    title,
    category,
    author,
    date,
    readTime,
    excerpt,
    content,
    image,
    relatedProducts
  };

  try {
    if (id) {
      AdminBlogCMS.updateBlog(id, blogData);
      showToast("✅ Đã cập nhật bài viết thành công!");
    } else {
      AdminBlogCMS.addBlog(blogData);
      showToast("🎉 Đã xuất bản bài viết Blog mới thành công!");
    }

    closeModal("modal-blog");
    renderBlogTable();
  } catch (err) {
    console.error("Lỗi khi lưu bài viết blog:", err);
    showToast("Có lỗi xảy ra: " + err.message, "error");
  }

  return false;
}

// ═══════════════════════════════════════════════════════════════════
//  DELETE BLOG
// ═══════════════════════════════════════════════════════════════════
let _pendingDeleteBlogId = null;

function confirmDeleteBlog(id, title) {
  _pendingDeleteBlogId = id;
  document.getElementById("delete-blog-title").textContent = `"${title}"`;
  openModal("modal-delete-blog");
}

function executeDeleteBlog() {
  if (!_pendingDeleteBlogId) return;
  AdminBlogCMS.deleteBlog(_pendingDeleteBlogId);
  _pendingDeleteBlogId = null;
  renderBlogTable();
  closeModal("modal-delete-blog");
  showToast("🗑️ Đã xóa bài viết blog thành công.", "warning");
}

function resetBlogsToDefault() {
  if (!confirm("Bạn có chắc muốn khôi phục danh sách blog về 3 bài viết mẫu ban đầu không? Mọi bài viết tự đăng sẽ bị xóa.")) return;
  AdminBlogCMS.resetToDefault();
  renderBlogTable();
  showToast("♻️ Đã khôi phục blog về các bài mẫu mặc định.");
}

// ═══════════════════════════════════════════════════════════════════
//  SEARCH & FILTER BLOGS
// ═══════════════════════════════════════════════════════════════════
function filterBlogs() {
  const q = (document.getElementById("blog-search")?.value || "").toLowerCase();
  const catFilter = (document.getElementById("blog-category-filter")?.value || "");

  const rows = document.querySelectorAll("#admin-blogs-table-body tr[data-id]");
  const blogs = AdminBlogCMS.getBlogs();
  let visible = 0;

  rows.forEach(row => {
    const id = row.getAttribute("data-id");
    const b = blogs.find(x => x.id === id);
    if (!b) { row.style.display = "none"; return; }

    const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.excerpt || "").toLowerCase().includes(q);
    const matchCat = !catFilter || b.category === catFilter || b.categorySlug === catFilter;

    row.style.display = matchQ && matchCat ? "" : "none";
    if (matchQ && matchCat) visible++;
  });

  const countDisplay = document.getElementById("blog-count-display");
  if (countDisplay) countDisplay.textContent = `${visible} bài viết`;
}

// Helper insert formatting tags into blog content textarea
function insertBlogTag(openTag, closeTag = "") {
  const textarea = document.getElementById("blog-form-content");
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  const replacement = openTag + selected + closeTag;
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  textarea.focus();
  textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
}

// Quick image select for blog
function selectBlogSampleImage(src) {
  const preview = document.getElementById("blog-img-preview");
  const urlInput = document.getElementById("blog-form-image-url");
  const hiddenData = document.getElementById("blog-img-data");
  if (preview) preview.src = src;
  if (urlInput) urlInput.value = src;
  if (hiddenData) hiddenData.value = "";
}

window.AdminBlogCMS = AdminBlogCMS;

