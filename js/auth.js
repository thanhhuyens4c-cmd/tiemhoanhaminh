/**
 * Auth — Hệ thống xác thực & phân quyền cho Hoa Nhà Mình
 * Lưu trữ: localStorage (không cần backend)
 * Hai role: "admin" | "user"
 */

const Auth = (() => {
  const KEYS = {
    USERS:   "hnm_users_v1",
    SESSION: "hnm_session_v1"
  };

  // ─── Seed data: tài khoản mặc định ─────────────────────────────────
  const DEFAULT_USERS = [
    {
      id:        "USR-ADMIN-001",
      role:      "admin",
      name:      "Florist Quản lý",
      email:     "admin@hoanhaminhh.vn",
      password:  "Admin@2026",
      phone:     "094 435 56 45",
      address:   "Tiệm Hoa Nhà Mình, Hà Nội",
      avatar:    "",
      createdAt: "2026-01-01"
    },
    {
      id:        "USR-001",
      role:      "user",
      name:      "Nguyễn Thanh Trúc",
      email:     "truc.nguyen@example.com",
      password:  "User@2026",
      phone:     "094 435 56 45",
      address:   "Số nhà 25, ngõ 225, Nguyễn Đức Cảnh, Hoàng Mai, Hà Nội",
      avatar:    "",
      createdAt: "2026-09-01"
    }
  ];

  // ─── Helpers nội bộ ─────────────────────────────────────────────────

  /** Lấy danh sách users, khởi tạo seed nếu chưa có */
  function _getUsers() {
    try {
      const raw = localStorage.getItem(KEYS.USERS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    // Lần đầu: seed dữ liệu mặc định
    _saveUsers(DEFAULT_USERS);
    return JSON.parse(JSON.stringify(DEFAULT_USERS));
  }

  function _saveUsers(users) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }

  /** Trả về user object không có password */
  function _sanitize(user) {
    if (!user) return null;
    const { password: _pw, ...safe } = user;
    return safe;
  }

  /** Simple hash: chỉ để làm obfuscation nhẹ trên localStorage */
  function _hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return h.toString(16);
  }

  // ─── Public API ──────────────────────────────────────────────────────

  return {

    /** Khởi tạo Auth (gọi khi page load) */
    init() {
      _getUsers(); // Seed nếu cần
    },

    // ── Đăng nhập ────────────────────────────────────────────────────
    /**
     * @param {string} email
     * @param {string} password
     * @returns {{ success: boolean, user?: object, error?: string }}
     */
    login(email, password) {
      if (!email || !password) {
        return { success: false, error: "Vui lòng điền đầy đủ email và mật khẩu." };
      }
      const users = _getUsers();
      const user  = users.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user) {
        return { success: false, error: "Email không tồn tại trong hệ thống." };
      }
      if (user.password !== password) {
        return { success: false, error: "Mật khẩu không chính xác." };
      }

      const session = {
        ..._sanitize(user),
        loginAt:   Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 ngày
      };
      localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
      window.dispatchEvent(new CustomEvent("hnm:auth-changed", { detail: session }));
      return { success: true, user: session };
    },

    // ── Đăng xuất ────────────────────────────────────────────────────
    logout() {
      localStorage.removeItem(KEYS.SESSION);
      window.dispatchEvent(new CustomEvent("hnm:auth-changed", { detail: null }));
    },

    // ── Phiên đăng nhập ──────────────────────────────────────────────
    /** Trả về user đang đăng nhập hoặc null nếu chưa/hết hạn */
    getSession() {
      try {
        const raw = localStorage.getItem(KEYS.SESSION);
        if (!raw) return null;
        const session = JSON.parse(raw);
        if (Date.now() > session.expiresAt) {
          this.logout();
          return null;
        }
        return session;
      } catch (e) {
        return null;
      }
    },

    /** True nếu đã đăng nhập */
    isLoggedIn() {
      return this.getSession() !== null;
    },

    /** True nếu role === "admin" */
    isAdmin() {
      const s = this.getSession();
      return s !== null && s.role === "admin";
    },

    // ── Guards cho trang ─────────────────────────────────────────────
    /**
     * Chỉ cho phép admin vào trang.
     * Gọi ngay đầu <script> của admin.html
     */
    requireAdmin() {
      const session = this.getSession();
      if (!session) {
        // Chưa đăng nhập
        window.location.replace("dang-nhap.html?redirect=admin&reason=login");
        return false;
      }
      if (session.role !== "admin") {
        // Đăng nhập rồi nhưng không phải admin
        sessionStorage.setItem("hnm_access_denied", "1");
        window.location.replace("tai-khoan.html?reason=denied");
        return false;
      }
      return true;
    },

    /**
     * Yêu cầu đăng nhập (user hoặc admin).
     * Gọi ngay đầu <script> của tai-khoan.html
     */
    requireLogin() {
      if (!this.isLoggedIn()) {
        window.location.replace("dang-nhap.html?redirect=account&reason=login");
        return false;
      }
      return true;
    },

    // ── Đăng ký tài khoản mới ────────────────────────────────────────
    /**
     * @param {{ name, email, password, phone }} data
     * @returns {{ success: boolean, user?: object, error?: string }}
     */
    register(data) {
      const { name, email, password, phone } = data;
      if (!name || !email || !password) {
        return { success: false, error: "Vui lòng điền đầy đủ thông tin." };
      }
      if (password.length < 6) {
        return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự." };
      }

      const users = _getUsers();
      const exists = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (exists) {
        return { success: false, error: "Email này đã được đăng ký." };
      }

      const newUser = {
        id:        "USR-" + Date.now(),
        role:      "user",
        name:      name.trim(),
        email:     email.trim().toLowerCase(),
        password:  password,
        phone:     phone || "",
        address:   "",
        avatar:    "",
        createdAt: new Date().toLocaleDateString("vi-VN")
      };

      users.push(newUser);
      _saveUsers(users);

      // Tự đăng nhập luôn sau khi đăng ký
      return this.login(newUser.email, newUser.password);
    },

    // ── Cập nhật thông tin user ───────────────────────────────────────
    /**
     * @param {{ name?, phone?, address?, avatar? }} updates
     */
    updateProfile(updates) {
      const session = this.getSession();
      if (!session) return { success: false, error: "Chưa đăng nhập." };

      const users = _getUsers();
      const idx   = users.findIndex(u => u.id === session.id);
      if (idx === -1) return { success: false, error: "Không tìm thấy tài khoản." };

      // Chỉ cho cập nhật các trường an toàn
      const allowed = ["name", "phone", "address", "avatar"];
      allowed.forEach(k => {
        if (updates[k] !== undefined) users[idx][k] = updates[k];
      });
      _saveUsers(users);

      // Cập nhật lại session
      const newSession = { ...session, ...updates, loginAt: session.loginAt, expiresAt: session.expiresAt };
      localStorage.setItem(KEYS.SESSION, JSON.stringify(newSession));
      window.dispatchEvent(new CustomEvent("hnm:auth-changed", { detail: newSession }));

      return { success: true, user: newSession };
    },

    // ── Đổi mật khẩu ─────────────────────────────────────────────────
    changePassword(oldPassword, newPassword) {
      const session = this.getSession();
      if (!session) return { success: false, error: "Chưa đăng nhập." };
      if (newPassword.length < 6) return { success: false, error: "Mật khẩu mới phải có ít nhất 6 ký tự." };

      const users = _getUsers();
      const idx   = users.findIndex(u => u.id === session.id);
      if (idx === -1) return { success: false, error: "Không tìm thấy tài khoản." };
      if (users[idx].password !== oldPassword) return { success: false, error: "Mật khẩu hiện tại không đúng." };

      users[idx].password = newPassword;
      _saveUsers(users);
      return { success: true };
    },

    // ── Lấy tất cả users (chỉ admin dùng) ───────────────────────────
    getAllUsers() {
      if (!this.isAdmin()) return [];
      return _getUsers().map(_sanitize);
    },

    // ── Initials avatar fallback ─────────────────────────────────────
    getInitials(name) {
      if (!name) return "?";
      const parts = name.trim().split(" ");
      if (parts.length === 1) return parts[0][0].toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  };
})();

// Expose globally
window.Auth = Auth;
Auth.init();
