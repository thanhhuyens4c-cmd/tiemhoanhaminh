/**
 * Quản lý trạng thái lưu trữ cục bộ (LocalStorage) cho Website Hoa Nhà Mình
 * Quản lý Giỏ hàng, Danh sách yêu thích, Đơn hàng và Thông tin người dùng
 */

const Store = {
  KEYS: {
    CART: "hnm_cart_v1",
    WISHLIST: "hnm_wishlist_v1",
    ORDERS: "hnm_orders_v1",
    USER: "hnm_user_v1",
    APPLIED_COUPON: "hnm_coupon_v1"
  },

  // ===== GIỎ HÀNG (CART) =====
  getCart() {
    try {
      const data = localStorage.getItem(this.KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Lỗi đọc giỏ hàng:", e);
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent("hnm:cart-updated", { detail: { cart } }));
    } catch (e) {
      console.error("Lỗi lưu giỏ hàng:", e);
    }
  },

  addToCart(product, options = {}) {
    const cart = this.getCart();
    const price = options.price || product.price;
    const quantity = options.quantity || 1;
    const color = options.color || product.colorName || "Mặc định";
    const cardMessage = options.cardMessage || "";

    // Kiểm tra xem sản phẩm cùng ID đã có trong giỏ chưa
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
      if (cardMessage) cart[existingIndex].cardMessage = cardMessage;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: price,
        originalPrice: product.originalPrice || price,
        color: color,
        image: product.image,
        quantity: quantity,
        cardMessage: cardMessage
      });
    }

    this.saveCart(cart);
    return cart;
  },

  updateCartQuantity(index, quantity) {
    const cart = this.getCart();
    if (index >= 0 && index < cart.length) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
      this.saveCart(cart);
    }
    return cart;
  },

  removeCartItem(index) {
    const cart = this.getCart();
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      this.saveCart(cart);
    }
    return cart;
  },

  updateCartCardMessage(index, message) {
    const cart = this.getCart();
    if (index >= 0 && index < cart.length) {
      cart[index].cardMessage = message;
      this.saveCart(cart);
    }
  },

  clearCart() {
    this.saveCart([]);
    this.removeCoupon();
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  getCartSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  },

  // ===== COUPON / MÃ GIẢM GIÁ =====
  getAppliedCoupon() {
    try {
      const c = localStorage.getItem(this.KEYS.APPLIED_COUPON);
      return c ? JSON.parse(c) : null;
    } catch {
      return null;
    }
  },

  applyCoupon(code) {
    const promo = PROMOTIONS.find(p => p.code.toUpperCase() === code.trim().toUpperCase());
    if (!promo) return { success: false, message: "Mã giảm giá không hợp lệ." };

    const subtotal = this.getCartSubtotal();
    if (promo.minOrder && subtotal < promo.minOrder) {
      return { 
        success: false, 
        message: `Mã này chỉ áp dụng cho đơn hàng từ ${promo.minOrder.toLocaleString('vi-VN')}₫.` 
      };
    }

    localStorage.setItem(this.KEYS.APPLIED_COUPON, JSON.stringify(promo));
    window.dispatchEvent(new CustomEvent("hnm:cart-updated"));
    return { success: true, coupon: promo, message: "Áp dụng mã giảm giá thành công!" };
  },

  removeCoupon() {
    localStorage.removeItem(this.KEYS.APPLIED_COUPON);
    window.dispatchEvent(new CustomEvent("hnm:cart-updated"));
  },

  // Tính toán tổng đơn (gồm ship, giảm giá, tiền cọc)
  getOrderTotals(depositPercent) {
    const subtotal = this.getCartSubtotal();
    const coupon = this.getAppliedCoupon();
    let shippingFee = subtotal >= 1000000 || (coupon && coupon.freeShip) ? 0 : 35000;
    if (subtotal === 0) shippingFee = 0;

    let discount = 0;
    if (coupon) {
      if (coupon.discountPercent) {
        discount = Math.round(subtotal * (coupon.discountPercent / 100));
      } else if (coupon.discountAmount) {
        discount = coupon.discountAmount;
      }
    }

    const flowerSubtotal = Math.max(0, subtotal - discount);
    const depPct = Math.max(50, Math.min(100, depositPercent || 50));
    const depositAmount = Math.round(flowerSubtotal * (depPct / 100));
    const initialPayment = depositAmount + shippingFee;
    const remainingPayment = flowerSubtotal - depositAmount;
    const total = flowerSubtotal + shippingFee;

    return {
      subtotal,
      shippingFee,
      discount,
      flowerSubtotal,
      depositPercentage: depPct,
      depositAmount,
      initialPayment,
      remainingPayment,
      total,
      isFreeShip: shippingFee === 0 && subtotal > 0,
      freeShipProgress: Math.min(100, Math.round((subtotal / 1000000) * 100)),
      amountLeftForFreeShip: Math.max(0, 1000000 - subtotal)
    };
  },

  // ===== DANH SÁCH YÊU THÍCH (WISHLIST) =====
  getWishlist() {
    try {
      const data = localStorage.getItem(this.KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isWishlisted(productId) {
    const list = this.getWishlist();
    return list.includes(productId);
  },

  toggleWishlist(productId) {
    let list = this.getWishlist();
    let isAdded = false;
    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
    } else {
      list.push(productId);
      isAdded = true;
    }
    localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("hnm:wishlist-updated", { detail: { wishlist: list, isAdded, productId } }));
    return isAdded;
  },

  getWishlistCount() {
    return this.getWishlist().length;
  },

  // ===== ĐƠN HÀNG (ORDERS) =====
  getOrders() {
    try {
      const data = localStorage.getItem(this.KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveOrder(orderData) {
    const orders = this.getOrders();
    const orderId = "HM" + String(Math.floor(10000 + Math.random() * 90000));
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth()+1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder = {
      id: orderId,
      date: dateFormatted,
      created_at: now.toISOString(),
      orderStatus: "PENDING",
      paymentStatus: "DEPOSIT_PENDING",
      amountPaid: 0,
      ...orderData
    };

    orders.unshift(newOrder);
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
    this.clearCart();
    return newOrder;
  },

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  // ===== NGƯỜI DÙNG (USER / AUTH) =====
  /**
   * Lấy thông tin user từ session Auth (nếu Auth được load)
   * Fallback về localStorage legacy nếu Auth chưa sẵn sàng
   */
  getUser() {
    // Ưu tiên dùng Auth session
    if (window.Auth) {
      const session = Auth.getSession();
      if (session) return { ...session, isLoggedIn: true };
      return null;
    }
    // Fallback legacy
    try {
      const u = localStorage.getItem(this.KEYS.USER);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  /**
   * Lưu thông tin user — delegate sang Auth.updateProfile nếu có
   */
  saveUser(userData) {
    if (window.Auth && Auth.isLoggedIn()) {
      Auth.updateProfile(userData);
    } else {
      localStorage.setItem(this.KEYS.USER, JSON.stringify(userData));
    }
  }
};

window.Store = Store;
