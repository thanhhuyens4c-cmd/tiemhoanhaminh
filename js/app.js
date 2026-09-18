/**
 * Tiện ích tương tác giao diện toàn cục cho Website Hoa Nhà Mình
 */

const App = {
  init() {
    this.initHeaderBadges();
    this.initMobileMenu();
    this.initSearchModal();
    this.initQuickViewModal();
    this.initGlobalListeners();
    this.highlightActiveNav();
  },

  // Cập nhật số lượng hiển thị trên icon Giỏ hàng và Yêu thích
  initHeaderBadges() {
    const updateBadges = () => {
      const cartCount = Store.getCartCount();
      const wishlistCount = Store.getWishlistCount();

      document.querySelectorAll(".cart-count-badge").forEach(el => {
        el.textContent = cartCount;
        el.style.display = cartCount > 0 ? "flex" : "none";
      });

      document.querySelectorAll(".wishlist-count-badge").forEach(el => {
        el.textContent = wishlistCount;
        el.style.display = wishlistCount > 0 ? "flex" : "none";
      });
    };

    updateBadges();
    window.addEventListener("hnm:cart-updated", updateBadges);
    window.addEventListener("hnm:wishlist-updated", updateBadges);
  },

  // Highlight menu item theo trang hiện tại
  highlightActiveNav() {
    const path = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll("header nav a[data-path], #mobile-menu a[data-path]");
    
    navLinks.forEach(link => {
      const target = link.getAttribute("data-path");
      let isActive = false;
      if ((path.endsWith("index.html") || path.endsWith("/") || path === "") && target === "trang-chu") {
        isActive = true;
      } else if (path.includes(target)) {
        isActive = true;
      }

      if (isActive) {
        link.classList.add("text-primary", "font-semibold");
        link.classList.remove("text-on-surface-variant");
      }
    });
  },

  // Toast thông báo thanh lịch
  showToast(title, message = "", type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `hnm-toast ${type === 'pink' ? 'pink' : type === 'error' ? 'error' : ''}`;
    
    let icon = "check_circle";
    let iconColor = "text-[#3E9B61]";
    if (type === "pink") {
      icon = "favorite";
      iconColor = "text-[#D95A82]";
    } else if (type === "error") {
      icon = "error";
      iconColor = "text-[#BA1A1A]";
    }

    toast.innerHTML = `
      <span class="material-symbols-outlined ${iconColor} text-2xl flex-shrink-0">${icon}</span>
      <div class="flex-1 min-w-0">
        <p class="text-xs sm:text-sm font-semibold text-[#211A18] leading-tight">${title}</p>
        ${message ? `<p class="text-xs text-[#857B76] mt-0.5">${message}</p>` : ''}
      </div>
      <button class="text-[#857B76] hover:text-[#211A18] text-sm p-1" onclick="this.parentElement.remove()">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Xử lý Mobile Menu Drawer
  initMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    if (!btn) return;

    let drawer = document.getElementById("mobile-drawer");
    let overlay = document.getElementById("mobile-drawer-overlay");

    if (!drawer) {
      const drawerHtml = `
        <div id="mobile-drawer-overlay" class="fixed inset-0 bg-black/40 z-[150] hidden backdrop-blur-sm transition-opacity"></div>
        <div id="mobile-drawer" class="fixed top-0 right-0 w-[280px] max-w-[85vw] h-full bg-[#FAF7E9] z-[151] p-6 flex flex-col justify-between shadow-2xl transform translate-x-full invisible transition-transform duration-300">
          <div>
            <div class="flex items-center justify-between pb-6 border-b border-[#E5DDCE]">
              <div class="flex items-center gap-2.5">
                <img src="assets/images/logo.png" alt="Logo" class="w-8 h-8 rounded-full object-cover">
                <span class="font-brand text-xl text-[#D95A82]">Hoa Nhà Mình</span>
              </div>
              <button id="mobile-drawer-close" class="text-[#4B4240] hover:text-black p-1">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <nav id="mobile-menu" class="flex flex-col gap-4 py-6 text-sm">
              <a href="index.html" class="text-[#4B4240] hover:text-[#D95A82] font-medium py-1">Trang chủ</a>
              <a href="san-pham.html" class="text-[#4B4240] hover:text-[#D95A82] font-medium py-1">Tất cả sản phẩm</a>
              <div class="mobile-submenu">
                <a href="san-pham.html?type=bo-hoa">↳ Bó hoa</a>
                <a href="san-pham.html?type=gio-hoa">↳ Giỏ hoa</a>
              </div>
              <a href="bo-suu-tap.html" class="text-[#4B4240] hover:text-[#D95A82] font-medium py-1">Bộ sưu tập</a>
              <a href="blog.html" class="text-[#4B4240] hover:text-[#D95A82] font-medium py-1">Blog cảm xúc</a>
              <a href="gioi-thieu.html" class="text-[#4B4240] hover:text-[#D95A82] font-medium py-1">Giới thiệu tiệm</a>
              <a href="lien-he.html" class="text-[#4B4240] hover:text-[#D95A82] font-medium py-1">Liên hệ & Cửa hàng</a>
              <a href="tai-khoan.html" class="text-[#4B4240] hover:text-[#D95A82] font-medium py-1">Tài khoản cá nhân</a>
            </nav>
          </div>
          <div class="text-xs text-[#857B76] border-t border-[#E5DDCE] pt-4">
            <p class="font-medium text-[#211A18]">Tiệm hoa thủ công Hoa Nhà Mình</p>
            <p class="mt-1">Hotline: <a href="tel:0944355645" class="text-[#277A4D] font-semibold">094 435 56 45</a></p>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', drawerHtml);
      drawer = document.getElementById("mobile-drawer");
      overlay = document.getElementById("mobile-drawer-overlay");
    }

    const closeBtn = document.getElementById("mobile-drawer-close");

    const open = () => {
      drawer.classList.remove("translate-x-full", "invisible");
      if (overlay) overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      drawer.classList.add("translate-x-full", "invisible");
      if (overlay) overlay.classList.add("hidden");
      document.body.style.overflow = "";
    };

    btn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);
  },

  // Quick View Modal
  initQuickViewModal() {
    let modal = document.getElementById("quick-view-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "quick-view-modal";
      modal.className = "fixed inset-0 z-[200] hidden items-center justify-center p-4 modal-backdrop";
      modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-in border border-[#E5DDCE]">
          <button id="quick-view-close" class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF7E9] text-[#4B4240] hover:text-black flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
          <div id="quick-view-content" class="p-6 sm:p-8">
            <!-- Nội dung nạp động -->
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.closest("#quick-view-close")) {
          modal.classList.add("hidden");
          modal.classList.remove("flex");
          document.body.style.overflow = "";
        }
      });
    }
  },

  async openQuickView(productId) {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("quick-view-modal");
    const content = document.getElementById("quick-view-content");
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        <div class="aspect-square rounded-xl overflow-hidden bg-[#FAF7E9]">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="space-y-4">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF7E9] text-[#D95A82] text-xs font-semibold">
            <span class="material-symbols-outlined text-sm">local_florist</span>
            ${product.typeName}
          </div>
          <h2 class="text-xl font-bold text-[#211A18] leading-snug">${product.name}</h2>
          <div class="flex items-center gap-3">
            <span class="text-xl font-bold text-[#D95A82]">${product.price.toLocaleString('vi-VN')}₫</span>
            ${product.originalPrice ? `<span class="text-sm text-[#857B76] line-through">${product.originalPrice.toLocaleString('vi-VN')}₫</span>` : ''}
          </div>
          <p class="text-xs sm:text-sm text-[#857B76] line-clamp-3">${product.shortDesc}</p>
          
          <div class="flex items-center gap-3 pt-3">
            <div class="flex items-center border border-[#E5DDCE] rounded-lg bg-[#FAF7E9] h-10">
              <button class="px-3 text-[#4B4240] hover:text-black" onclick="const input = document.getElementById('qv-qty'); input.value = Math.max(1, parseInt(input.value) - 1);">-</button>
              <input id="qv-qty" type="number" value="1" min="1" class="w-10 text-center text-sm font-semibold bg-transparent focus:outline-none" readonly>
              <button class="px-3 text-[#4B4240] hover:text-black" onclick="const input = document.getElementById('qv-qty'); input.value = parseInt(input.value) + 1;">+</button>
            </div>
            <button id="qv-add-btn" class="flex-1 h-10 bg-[#3E9B61] hover:bg-[#277A4D] text-white rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm">
              <span class="material-symbols-outlined text-base">shopping_bag</span>
              Thêm vào giỏ
            </button>
          </div>

          <div class="pt-2 text-center">
            <a href="chi-tiet-san-pham.html?id=${product.id}" class="text-xs text-[#277A4D] hover:underline font-medium">
              Xem toàn bộ thông tin chi tiết &rarr;
            </a>
          </div>
        </div>
      </div>
    `;

    document.getElementById("qv-add-btn").addEventListener("click", () => {
      const qty = parseInt(document.getElementById("qv-qty").value) || 1;

      Store.addToCart(product, {
        price: product.price,
        quantity: qty
      });

      this.showToast("Đã thêm vào giỏ hàng!", `${product.name} (x${qty})`);
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
    });

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  },

  // Search Modal
  initSearchModal() {
    let modal = document.getElementById("search-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "search-modal";
      modal.className = "fixed inset-0 z-[200] hidden items-start justify-center pt-16 sm:pt-20 px-4 modal-backdrop";
      modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-xl w-full shadow-2xl p-6 relative animate-fade-in border border-[#E5DDCE]">
          <div class="flex items-center justify-between pb-4 border-b border-[#E5DDCE]">
            <div class="flex items-center gap-2.5 flex-1 mr-4">
              <span class="material-symbols-outlined text-[#3E9B61] text-2xl">search</span>
              <input id="search-input" type="text" placeholder="Tìm hoa theo tên (hồng pastel, cúc tana, tulip...)" class="w-full text-sm sm:text-base text-[#211A18] placeholder-[#857B76] focus:outline-none bg-transparent">
            </div>
            <button id="search-close" class="text-[#857B76] hover:text-[#211A18]">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <div id="search-results" class="mt-4 max-h-[60vh] overflow-y-auto space-y-2">
            <p class="text-xs text-[#857B76] py-2">Gợi ý từ khóa: <em>Hoa hồng, Sinh nhật, Tốt nghiệp, Cúc tana, Hộp hoa</em></p>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeSearch = () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.style.overflow = "";
      };

      document.querySelectorAll("[data-action='open-search']").forEach(btn => {
        btn.addEventListener("click", () => {
          modal.classList.remove("hidden");
          modal.classList.add("flex");
          document.body.style.overflow = "hidden";
          setTimeout(() => document.getElementById("search-input").focus(), 100);
        });
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.closest("#search-close")) {
          closeSearch();
        }
      });

      const input = document.getElementById("search-input");
      const resultsContainer = document.getElementById("search-results");

      input.addEventListener("input", async (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          resultsContainer.innerHTML = `<p class="text-xs text-[#857B76] py-2">Gợi ý từ khóa: <em>Hoa hồng, Sinh nhật, Tốt nghiệp, Cúc tana, Hộp hoa</em></p>`;
          return;
        }

        const allProducts = await getProducts();
        const matched = allProducts.filter(p =>
          p.name.toLowerCase().includes(query) ||
          (p.shortDesc || "").toLowerCase().includes(query) ||
          (p.colorName || "").toLowerCase().includes(query)
        );

        if (matched.length === 0) {
          resultsContainer.innerHTML = `<p class="text-xs text-[#857B76] py-6 text-center">Không tìm thấy nhành hoa nào phù hợp với từ khóa "${query}".</p>`;
          return;
        }

        resultsContainer.innerHTML = matched.map(p => `
          <a href="chi-tiet-san-pham.html?id=${p.id}" class="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF7E9] transition-colors group">
            <img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded-lg object-cover flex-shrink-0">
            <div class="flex-1 min-w-0">
              <h4 class="text-xs sm:text-sm font-semibold text-[#211A18] group-hover:text-[#D95A82] truncate">${p.name}</h4>
              <p class="text-xs text-[#857B76]">${p.typeName} • ${p.colorName}</p>
            </div>
            <span class="text-xs font-bold text-[#3E9B61] flex-shrink-0">${p.price.toLocaleString('vi-VN')}₫</span>
          </a>
        `).join('');
      });
    }
  },

  // Helper render Product Card
  renderProductCard(product) {
    const isWishlisted = Store.isWishlisted(product.id);
    return `
      <div class="group relative bg-white rounded-2xl border border-[#E5DDCE] overflow-hidden card-lift flex flex-col justify-between" data-product-id="${product.id}">
        <div>
          <!-- Thumbnail Stage -->
          <div class="relative w-full aspect-square bg-[#FAF7E9] overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
            
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              ${product.isBestSeller ? `<span class="bg-[#D95A82] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">Bán chạy</span>` : ''}
              ${product.isNew ? `<span class="bg-[#3E9B61] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">Mới sớm mai</span>` : ''}
            </div>

            <!-- Wishlist Button -->
            <button aria-label="Thêm vào danh sách yêu thích" class="wishlist-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#4B4240] hover:text-[#D95A82] shadow-sm flex items-center justify-center transition-colors" data-id="${product.id}">
              <span class="material-symbols-outlined text-[18px] ${isWishlisted ? 'text-[#D95A82]' : ''}" style="${isWishlisted ? 'font-variation-settings: \"FILL\" 1;' : ''}">favorite</span>
            </button>

            <!-- Quick View Overlay Button -->
            <button class="quick-view-btn absolute bottom-3 inset-x-3 h-8 bg-white/95 hover:bg-white text-[#4B4240] text-xs font-semibold rounded-lg shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1" data-id="${product.id}">
              <span class="material-symbols-outlined text-sm">visibility</span>
              Xem nhanh
            </button>
          </div>

          <!-- Product Details -->
          <div class="p-4 space-y-2">
            <div class="flex items-center justify-between text-xs text-[#857B76]">
              <span>${product.typeName}</span>
              <div class="flex items-center gap-1 text-[#F4C52D]">
                <span class="material-symbols-outlined text-xs" style="font-variation-settings: 'FILL' 1;">star</span>
                <span class="font-semibold text-[#4B4240]">${product.rating}</span>
                <span class="text-[#857B76]">(${product.reviewsCount})</span>
              </div>
            </div>

            <h3 class="text-sm font-semibold text-[#211A18] hover:text-[#D95A82] transition-colors leading-snug line-clamp-2">
              <a href="chi-tiet-san-pham.html?id=${product.id}">${product.name}</a>
            </h3>

            <div class="flex items-baseline gap-2 pt-1">
              <span class="text-base font-bold text-[#D95A82]">${product.price.toLocaleString('vi-VN')}₫</span>
              ${product.originalPrice ? `<span class="text-xs text-[#857B76] line-through">${product.originalPrice.toLocaleString('vi-VN')}₫</span>` : ''}
            </div>
          </div>
        </div>

        <!-- Add to cart CTA -->
        <div class="p-4 pt-0">
          <button class="add-to-cart-btn w-full h-9 bg-[#FAF7E9] hover:bg-[#3E9B61] text-[#277A4D] hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all" data-id="${product.id}">
            <span class="material-symbols-outlined text-sm">shopping_bag</span>
            Thêm vào giỏ
          </button>
        </div>
      </div>
    `;
  },

  // Event delegation cho Wishlist, Quick View, Add to Cart
  initGlobalListeners() {
    document.addEventListener("click", async (e) => {
      // Wishlist Button
      const wishlistBtn = e.target.closest(".wishlist-btn");
      if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = wishlistBtn.getAttribute("data-id");
        const products = await getProducts();
        const product = products.find(p => p.id === id);
        const isAdded = Store.toggleWishlist(id);
        const icon = wishlistBtn.querySelector(".material-symbols-outlined");

        if (isAdded) {
          if (icon) {
            icon.classList.add("text-[#D95A82]");
            icon.style.fontVariationSettings = '"FILL" 1';
          }
          this.showToast("Đã lưu vào danh sách yêu thích!", product ? product.name : "", "pink");
        } else {
          if (icon) {
            icon.classList.remove("text-[#D95A82]");
            icon.style.fontVariationSettings = '';
          }
          this.showToast("Đã bỏ khỏi danh sách yêu thích", product ? product.name : "");
        }
        return;
      }

      // Quick View Button
      const quickViewBtn = e.target.closest(".quick-view-btn");
      if (quickViewBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = quickViewBtn.getAttribute("data-id");
        this.openQuickView(id);
        return;
      }

      // Add to Cart Button
      const addCartBtn = e.target.closest(".add-to-cart-btn");
      if (addCartBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = addCartBtn.getAttribute("data-id");
        const allProducts = await getProducts();
        const product = allProducts.find(p => p.id === id);
        if (product) {
          Store.addToCart(product);
          this.showToast("Đã thêm vào giỏ hàng!", `${product.name} (x1)`);
        }
        return;
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

window.App = App;
