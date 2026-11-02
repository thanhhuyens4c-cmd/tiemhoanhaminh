/**
 * "Quét hoa" ở Góc video: chụp khung hình đang xem (hoặc ảnh bìa / ảnh khách chọn),
 * gửi tới /api/find-similar và hiện các sản phẩm giống trong web.
 */
(function () {
  const API = "/api/find-similar";
  const isMobile = /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let root, body, fileInput, lastToken = 0;

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
      try { run({ image: await fileToDataURL(f) }, null); } catch (e) { showError("Không đọc được ảnh này, bạn thử ảnh khác nhé."); }
    });
  }
  function open() { ensureModal(); root.classList.remove("hidden"); document.body.style.overflow = "hidden"; }
  function close() { lastToken++; if (root) root.classList.add("hidden"); document.body.style.overflow = ""; }

  function showLoading(preview) {
    open();
    body.innerHTML = `
      ${preview ? `<img src="${preview}" alt="Ảnh đang quét" class="mx-auto max-h-56 rounded-2xl mb-4 object-contain">` : ""}
      <div class="flex items-center justify-center gap-2 py-6 text-sm text-[#4B4240]">
        <span class="material-symbols-outlined animate-spin">progress_activity</span> Đang tìm hoa giống trong tiệm...
      </div>`;
  }
  function showError(msg) {
    open();
    body.innerHTML = `<p class="py-6 text-center text-sm text-[#4B4240]">${esc(msg)}</p>`;
  }
  function showResults(preview, data) {
    open();
    const head = preview ? `<img src="${preview}" alt="Ảnh đã quét" class="mx-auto max-h-44 rounded-2xl mb-4 object-contain">` : "";
    if (!data.has_flower || !data.products.length) {
      body.innerHTML = `${head}<p class="py-4 text-center text-sm text-[#4B4240]">${data.has_flower ? "Chưa thấy sản phẩm nào thật giống." : "Ảnh này chưa thấy bó hoa nào."} Bạn thử quét lúc bó hoa hiện rõ hơn, hoặc xem tất cả sản phẩm của tiệm.</p>
        <a href="san-pham.html" class="block text-center text-sm font-semibold text-[#D95A82] hover:underline">Xem tất cả sản phẩm &rarr;</a>`;
      return;
    }
    body.innerHTML = `${head}
      <p class="text-xs font-bold text-[#D95A82] uppercase tracking-wider mb-2">Sản phẩm tương tự trong tiệm</p>
      <div class="grid grid-cols-2 gap-3">
        ${data.products.map((p) => `
          <a href="chi-tiet-san-pham.html?id=${encodeURIComponent(p.id)}" class="block rounded-2xl border border-[#E5DDCE] bg-white overflow-hidden hover:shadow-md transition-shadow">
            <img src="${esc(p.image)}" alt="${esc(p.name)}" class="w-full aspect-square object-cover" loading="lazy">
            <div class="p-2.5">
              <div class="text-sm font-semibold text-[#211A18] line-clamp-2">${esc(p.name)}</div>
              <div class="text-sm font-bold text-[#D95A82]">${p.price.toLocaleString("vi-VN")}₫</div>
              ${p.reason ? `<div class="mt-1 text-[11px] text-[#857B76] line-clamp-2">${esc(p.reason)}</div>` : ""}
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

  const ERRORS = {
    not_configured: "Tính năng quét hoa đang được cài đặt, bạn quay lại sau nhé.",
    no_tags: "Tính năng quét hoa đang được cài đặt, bạn quay lại sau nhé.",
    rate_limited: "Bạn quét hơi nhiều lần rồi, vui lòng thử lại sau ít phút.",
    bad_image: "Ảnh này chưa dùng được, bạn thử ảnh khác nhé.",
  };

  async function run(payload, preview) {
    const token = ++lastToken;
    showLoading(preview || payload.image || null);
    try {
      const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await r.json().catch(() => ({}));
      if (token !== lastToken) return;
      if (!r.ok) { showError(ERRORS[data.error] || "Chưa quét được lúc này, bạn thử lại sau nhé."); return; }
      showResults(preview || payload.image || null, data);
    } catch (e) {
      if (token === lastToken) showError("Chưa kết nối được, bạn kiểm tra mạng rồi thử lại nhé.");
    }
  }

  /**
   * frameEl: khung chứa video đang xem; live: trình phát TikTok đã được tải chưa; coverUrl: ảnh bìa của video (nếu có)
   */
  async function scan({ frameEl, live, coverUrl }) {
    if (live && !isMobile && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      try {
        const image = await captureTab(frameEl);
        return run({ image }, image);
      } catch (e) { /* khách từ chối chia sẻ hoặc trình duyệt không hỗ trợ → dùng ảnh bìa */ }
    }
    if (coverUrl) return run({ coverUrl }, coverUrl);
    open();
    body.innerHTML = `<p class="py-6 text-center text-sm text-[#4B4240]">Video này chưa có ảnh để quét. Bạn chụp màn hình video rồi chọn ảnh bên dưới nhé.</p>`;
  }

  window.VideoScan = { scan };
})();
