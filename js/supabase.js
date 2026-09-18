/**
 * Supabase Client & Product API cho Hoa Nhà Mình
 * Quản lý kết nối Supabase và CRUD sản phẩm
 */

const SupabaseConfig = {
  url: "",
  anonKey: ""
};

(function initSupabaseConfig() {
  const metaUrl = document.querySelector('meta[name="supabase-url"]');
  const metaKey = document.querySelector('meta[name="supabase-anon-key"]');
  if (metaUrl) SupabaseConfig.url = metaUrl.content;
  if (metaKey) SupabaseConfig.anonKey = metaKey.content;
})();

const SupabaseClient = {
  _client: null,

  getClient() {
    if (this._client) return this._client;
    if (!SupabaseConfig.url || !SupabaseConfig.anonKey) {
      console.warn("Supabase chưa được cấu hình. Thêm meta tags supabase-url và supabase-anon-key.");
      return null;
    }
    if (typeof supabase === "undefined" || !supabase.createClient) {
      console.warn("Supabase JS library chưa được tải.");
      return null;
    }
    this._client = supabase.createClient(SupabaseConfig.url, SupabaseConfig.anonKey);
    return this._client;
  },

  isConfigured() {
    return !!(SupabaseConfig.url && SupabaseConfig.anonKey);
  }
};

/**
 * ProductAPI — CRUD sản phẩm qua Supabase
 * Tất cả methods đều async, trả về data hoặc throw error
 */
const ProductAPI = {
  _cache: null,
  _cacheTime: 0,
  CACHE_TTL: 30000, // 30 giây

  _clearCache() {
    this._cache = null;
    this._cacheTime = 0;
  },

  /**
   * Lấy danh sách sản phẩm từ Supabase
   * Có cache ngắn hạn (30s) để tránh gọi API quá nhiều
   */
  async getProducts(forceRefresh = false) {
    if (!forceRefresh && this._cache && (Date.now() - this._cacheTime < this.CACHE_TTL)) {
      return this._cache;
    }

    const client = SupabaseClient.getClient();
    if (!client) {
      return this._fallbackGetProducts();
    }

    try {
      const { data, error } = await client
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;

      const products = (data || []).map(row => this._mapFromDB(row));
      this._cache = products;
      this._cacheTime = Date.now();
      return products;
    } catch (err) {
      console.error("Lỗi tải sản phẩm từ Supabase:", err);
      return this._fallbackGetProducts();
    }
  },

  /**
   * Lấy tất cả sản phẩm (bao gồm cả inactive) — dùng cho admin
   */
  async getAllProducts() {
    const client = SupabaseClient.getClient();
    if (!client) return this._fallbackGetProducts();

    try {
      const { data, error } = await client
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(row => this._mapFromDB(row));
    } catch (err) {
      console.error("Lỗi tải sản phẩm (admin):", err);
      return this._fallbackGetProducts();
    }
  },

  async addProduct(productData) {
    const client = SupabaseClient.getClient();
    if (!client) throw new Error("Supabase chưa được cấu hình");

    const row = this._mapToDB(productData);
    delete row.id;

    const { data, error } = await client
      .from("products")
      .insert(row)
      .select()
      .single();

    if (error) throw error;
    this._clearCache();
    return this._mapFromDB(data);
  },

  async updateProduct(id, updates) {
    const client = SupabaseClient.getClient();
    if (!client) throw new Error("Supabase chưa được cấu hình");

    const row = this._mapToDB(updates);
    delete row.id;
    row.updated_at = new Date().toISOString();

    const { data, error } = await client
      .from("products")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    this._clearCache();
    return this._mapFromDB(data);
  },

  async deleteProduct(id) {
    const client = SupabaseClient.getClient();
    if (!client) throw new Error("Supabase chưa được cấu hình");

    const { error } = await client
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    this._clearCache();
  },

  /**
   * Fallback: đọc từ localStorage khi Supabase không khả dụng
   */
  _fallbackGetProducts() {
    console.warn("Sử dụng dữ liệu localStorage (fallback)");
    try {
      const saved = localStorage.getItem("hnm_products_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(typeof PRODUCTS !== "undefined" ? PRODUCTS : []));
  },

  /**
   * Mapping: DB row → frontend product object
   * Giữ compatibility với code frontend hiện tại
   */
  _mapFromDB(row) {
    return {
      id: row.id,
      name: row.name || "",
      slug: row.slug || "",
      type: row.type || "bo-hoa",
      typeName: row.type_name || "Bó hoa tươi",
      color: row.color || "",
      colorName: row.color_name || "",
      price: Number(row.price) || 0,
      originalPrice: Number(row.original_price) || 0,
      image: row.image_url || "",
      gallery: row.gallery || [],
      shortDesc: row.short_desc || "",
      description: row.description || "",
      careInstructions: row.care_instructions || "",
      occasion: row.occasion || [],
      recipient: row.recipient || [],
      rating: Number(row.rating) || 5.0,
      reviewsCount: Number(row.reviews_count) || 0,
      isBestSeller: !!row.is_best_seller,
      isNew: !!row.is_new,
      isFeatured: !!row.is_featured,
      tags: row.tags || [],
      isActive: row.is_active !== false,
      sortOrder: row.sort_order || 0
    };
  },

  /**
   * Mapping: frontend product object → DB row
   */
  _mapToDB(product) {
    const row = {};
    if (product.id !== undefined) row.id = product.id;
    if (product.name !== undefined) row.name = product.name;
    if (product.slug !== undefined) row.slug = product.slug;
    if (product.type !== undefined) row.type = product.type;
    if (product.typeName !== undefined) row.type_name = product.typeName;
    if (product.color !== undefined) row.color = product.color;
    if (product.colorName !== undefined) row.color_name = product.colorName;
    if (product.price !== undefined) row.price = product.price;
    if (product.originalPrice !== undefined) row.original_price = product.originalPrice;
    if (product.image !== undefined) row.image_url = product.image;
    if (product.gallery !== undefined) row.gallery = product.gallery;
    if (product.shortDesc !== undefined) row.short_desc = product.shortDesc;
    if (product.description !== undefined) row.description = product.description;
    if (product.careInstructions !== undefined) row.care_instructions = product.careInstructions;
    if (product.occasion !== undefined) row.occasion = product.occasion;
    if (product.recipient !== undefined) row.recipient = product.recipient;
    if (product.rating !== undefined) row.rating = product.rating;
    if (product.reviewsCount !== undefined) row.reviews_count = product.reviewsCount;
    if (product.isBestSeller !== undefined) row.is_best_seller = product.isBestSeller;
    if (product.isNew !== undefined) row.is_new = product.isNew;
    if (product.isFeatured !== undefined) row.is_featured = product.isFeatured;
    if (product.tags !== undefined) row.tags = product.tags;
    if (product.isActive !== undefined) row.is_active = product.isActive;
    if (product.sortOrder !== undefined) row.sort_order = product.sortOrder;
    return row;
  }
};

window.SupabaseClient = SupabaseClient;
window.SupabaseConfig = SupabaseConfig;
window.ProductAPI = ProductAPI;
