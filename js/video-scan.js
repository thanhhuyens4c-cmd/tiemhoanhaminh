/**
 * "Quét hoa" ở Góc video: chụp khung hình đang xem (hoặc ảnh bìa / ảnh khách chọn) rồi tìm sản phẩm giống trong web.
 * AI chạy ngay trong trình duyệt của khách (mô hình DINOv2 nhỏ ~25 MB, tải một lần): không cần key, không tốn phí.
 * Dấu vân tay ảnh của sản phẩm lấy từ data/product-embeddings.json; sản phẩm mới chưa có thì tính tại chỗ.
 */
(function () {
  const LIB_URL = "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";
  const MODEL_ID = "Xenova/dinov2-small";
  const INDEX_URL = "data/product-embeddings.json";
  const DIM = 384;
  const MAX_RESULTS = 6;
  const MIN_SCORE = 0.62;   // dưới mức này coi là chưa có sản phẩm giống
  const NO_FLOWER = 0.5;    // top dưới mức này gần như chắc chắn ảnh không có hoa
  const MAX_LAZY = 12;      // số sản phẩm mới (chưa có trong file) tính tại chỗ mỗi lần quét

  const isMobile = /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let root, body, fileInput, lastToken = 0;

  // ---------- AI trong trình duyệt ----------
  let aiPromise = null, onProgress = null;
  function loadAI() {
    if (!aiPromise) {
      aiPromise = (async () => {
        const T = await import(LIB_URL);
        T.env.allowLocalModels = false;
        const processor = await T.AutoProcessor.from_pretrained(MODEL_ID);
        const model = await T.AutoModel.from_pretrained(MODEL_ID, {
          progress_callback: (p) => {
            if (p.status === "progress" && p.file && p.file.endsWith(".onnx") && onProgress) onProgress(Math.round(p.progress || 0));
          },
        });
        return { T, processor, model };
      })().catch((e) => { aiPromise = null; throw e; });
    }
    return aiPromise;
  }

  const normalize = (v) => {
    let s = 0;
    for (let i = 0; i < v.length; i++) s += v[i] * v[i];
    s = Math.sqrt(s) || 1;
    return v.map((x) => x / s);
  };

  // dấu vân tay ảnh: token tổng quát + trung bình các mảng ảnh, mỗi phần chuẩn hóa rồi ghép lại
  async function embed(src) {
    const { T, processor, model } = await loadAI();
    const img = await T.RawImage.read(src);
    const out = await model(await processor(img));
    const d = out.last_hidden_state.data, tokens = d.length / DIM;
    const cls = Array.from(d.slice(0, DIM));
    const mean = new Array(DIM).fill(0);
    for (let t = 1; t < tokens; t++) for (let k = 0; k < DIM; k++) mean[k] += d[t * DIM + k] / (tokens - 1);
    return normalize([...normalize(cls), ...normalize(mean)]);
  }

  const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
  const b64ToVec = (b64) => { const bin = atob(b64), out = new Float32Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = (bin.charCodeAt(i) << 24 >> 24) / 127; return out; };
  const vecToB64 = (v) => { let s = ""; for (let i = 0; i < v.length; i++) s += String.fromCharCode(Math.max(-127, Math.min(127, Math.round(v[i] * 127))) & 255); return btoa(s); };

  // ---------- danh mục sản phẩm + dấu vân tay ----------
  let indexPromise = null;
  const vectors = new Map();
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = (async () => {
        const [products, file] = await Promise.all([
          typeof getProducts === "function" ? getProducts() : [],
          fetch(INDEX_URL, { cache: "no-cache" }).then((r) => (r.ok ? r.json() : { items: {} })).catch(() => ({ items: {} })),
        ]);
        Object.entries(file.items || {}).forEach(([id, b64]) => vectors.set(id, b64ToVec(b64)));
        return products.filter((p) => p.image);
      })();
    }
    return indexPromise;
  }

  async function findSimilar(imageSrc) {
    const products = await loadIndex();
    const q = await embed(imageSrc);
    // sản phẩm mới chưa có dấu vân tay: tính tại chỗ (có giới hạn)
    let lazy = 0;
    for (const p of products) {
      if (vectors.has(p.id) || lazy >= MAX_LAZY) continue;
      lazy++;
      try { vectors.set(p.id, Float32Array.from(await embed(p.image))); } catch (e) { vectors.set(p.id, null); }
    }
    const scored = products
      .filter((p) => vectors.get(p.id))
      .map((p) => ({ p, s: dot(q, vectors.get(p.id)) }))
      .sort((a, b) => b.s - a.s);
    const top = scored.length ? scored[0].s : 0;
    return {
      has_flower: top >= NO_FLOWER,
      products: scored.filter((x) => x.s >= MIN_SCORE && x.s >= top - 0.15).slice(0, MAX_RESULTS).map((x) => x.p),
    };
  }

  // ---------- giao diện ----------
  function ensureModal() {
    if (root) return;
    root = document.createElement("div");
    root.className = "fixed inset-0 z-[100] hidden";
    root.innerHTML = `
      <div data-close class="absolute inset-0 bg-black/60"></div>
      <div class="absolute inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[560px] max-h-[88vh] overflow-y-auto bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-brand text-xl text-[#D95A82]">Quét hoa trong video</h3>
          <button type="button" data-close aria-label="Đóng" class="p-1 text-[#4B4240] hover:text-[#D95A82]"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div data-body></div>
        <label class="mt-4 flex items-center justify-center gap-1 text-xs text-[#277A4D] hover:underline cursor-pointer">
          <span class="material-symbols-outlined text-base">add_a_photo</span> Chụp hoặc chọn ảnh khác để tìm
          <input data-file type="file" accept="image/*" class="hidden">
        </label>
      </div>`;
    document.body.appendChild(root);
    body = root.querySelector("[data-body]");
    fileInput = root.querySelector("[data-file]");
    root.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !root.classList.contains("hidden")) close(); });
    fileInput.addEventListener("change", async () => {
      const f = fileInput.files && fileInput.files[0];
      fileInput.value = "";
      if (!f) return;
      try { const image = await fileToDataURL(f); run(image, image); } catch (e) { showError("Không đọc được ảnh này, bạn thử ảnh khác nhé."); }
    });
  }
  function open() { ensureModal(); root.classList.remove("hidden"); document.body.style.overflow = "hidden"; }
  function close() { lastToken++; onProgress = null; if (root) root.classList.add("hidden"); document.body.style.overflow = ""; }

  const previewHTML = (preview, cls) => (preview ? `<img src="${esc(preview)}" alt="Ảnh đang quét" class="mx-auto ${cls} rounded-2xl mb-4 object-contain">` : "");
  function setStatus(text) { const el = body && body.querySelector("[data-status]"); if (el) el.textContent = text; }

  function showLoading(preview) {
    open();
    body.innerHTML = `${previewHTML(preview, "max-h-56")}
      <div class="flex items-center justify-center gap-2 py-6 text-sm text-[#4B4240]">
        <span class="material-symbols-outlined animate-spin">progress_activity</span><span data-status>Đang tìm hoa giống trong tiệm...</span>
      </div>`;
  }
  function showError(msg) {
    open();
    body.innerHTML = `<p class="py-6 text-center text-sm text-[#4B4240]">${esc(msg)}</p>`;
  }
  function showResults(preview, data) {
    open();
    const head = previewHTML(preview, "max-h-44");
    if (!data.has_flower || !data.products.length) {
      body.innerHTML = `${head}<p class="py-4 text-center text-sm text-[#4B4240]">${data.has_flower ? "Chưa thấy sản phẩm nào thật giống." : "Ảnh này chưa thấy bó hoa nào."} Bạn thử quét lúc bó hoa hiện rõ hơn, hoặc xem tất cả sản phẩm của tiệm.</p>
        <a href="san-pham.html" class="block text-center text-sm font-semibold text-[#D95A82] hover:underline">Xem tất cả sản phẩm &rarr;</a>`;
      return;
    }
    body.innerHTML = `${head}
      <p class="text-xs font-bold text-[#D95A82] uppercase tracking-wider mb-2">Sản phẩm tương tự trong tiệm</p>
      <div class="grid grid-cols-2 gap-3">
        ${data.products.map((p, i) => `
          <a href="chi-tiet-san-pham.html?id=${encodeURIComponent(p.id)}" class="relative block rounded-2xl border border-[#E5DDCE] bg-white overflow-hidden hover:shadow-md transition-shadow">
            ${i === 0 ? '<span class="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#D95A82] text-white text-[10px] font-bold">Giống nhất</span>' : ""}
            <img src="${esc(p.image)}" alt="${esc(p.name)}" class="w-full aspect-square object-cover" loading="lazy">
            <div class="p-2.5">
              <div class="text-sm font-semibold text-[#211A18] line-clamp-2">${esc(p.name)}</div>
              <div class="text-sm font-bold text-[#D95A82]">${Number(p.price || 0).toLocaleString("vi-VN")}₫</div>
            </div>
          </a>`).join("")}
      </div>`;
  }

  // ảnh → JPEG tối đa 1024px
  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1024 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("img")); };
      img.src = url;
    });
  }

  // Chụp đúng khung hình đang hiện trên màn hình (chỉ máy tính; trình duyệt sẽ hỏi quyền chia sẻ thẻ)
  async function captureTab(frameEl) {
    frameEl.scrollIntoView({ block: "nearest" });
    await new Promise((r) => setTimeout(r, 150));
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" }, audio: false,
      preferCurrentTab: true, selfBrowserSurface: "include", surfaceSwitching: "exclude",
    });
    try {
      const v = document.createElement("video");
      v.muted = true;
      v.srcObject = stream;
      await v.play();
      await new Promise((r) => setTimeout(r, 300));
      const rect = frameEl.getBoundingClientRect();
      const sx = v.videoWidth / window.innerWidth, sy = v.videoHeight / window.innerHeight;
      const cw = Math.round(rect.width * sx), ch = Math.round(rect.height * sy);
      const k = Math.min(1, 1024 / Math.max(cw, ch));
      const c = document.createElement("canvas");
      c.width = Math.round(cw * k);
      c.height = Math.round(ch * k);
      c.getContext("2d").drawImage(v, rect.left * sx, rect.top * sy, cw, ch, 0, 0, c.width, c.height);
      return c.toDataURL("image/jpeg", 0.85);
    } finally {
      stream.getTracks().forEach((t) => t.stop());
    }
  }

  async function run(imageSrc, preview) {
    const token = ++lastToken;
    showLoading(preview);
    onProgress = (pct) => { if (token === lastToken) setStatus(`Đang tải AI lần đầu (${pct}%)... lần sau sẽ nhanh hơn`); };
    try {
      const data = await findSimilar(imageSrc);
      if (token !== lastToken) return;
      showResults(preview, data);
    } catch (e) {
      if (token === lastToken) showError("Chưa quét được lúc này (trình duyệt chưa tải được AI hoặc không đọc được ảnh). Bạn thử lại hoặc chọn ảnh khác nhé.");
    } finally {
      onProgress = null;
    }
  }

  /**
   * frameEl: khung chứa video đang xem; live: trình phát TikTok đã được tải chưa; coverUrl: ảnh bìa của video (nếu có)
   */
  async function scan({ frameEl, live, coverUrl }) {
    if (live && !isMobile && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      try {
        const image = await captureTab(frameEl);
        return run(image, image);
      } catch (e) { /* khách từ chối chia sẻ hoặc trình duyệt không hỗ trợ → dùng ảnh bìa */ }
    }
    if (coverUrl) return run(coverUrl, coverUrl);
    open();
    body.innerHTML = `<p class="py-6 text-center text-sm text-[#4B4240]">Video này chưa có ảnh để quét. Bạn chụp màn hình video rồi chọn ảnh bên dưới nhé.</p>`;
  }

  // embedUrl / vecToB64 dùng để tạo file data/product-embeddings.json
  window.VideoScan = { scan, embed, vecToB64, loadIndex };
})();
