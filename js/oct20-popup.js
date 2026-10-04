/**
 * Pop-up thông báo Hoa mừng lễ 20/10 — hiện 1 lần mỗi phiên truy cập,
 * có nút điều hướng sang hoa-20-10.html. Không hiện ở admin, giỏ hàng, thanh toán.
 */
(function () {
  const path = location.pathname.toLowerCase();
  if (/admin|hoa-20-10|gio-hang|thanh-toan|dat-hang/.test(path)) return;
  const KEY = "hnm_oct20_popup_seen";
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

  const css = `
    .oct-pop-overlay{position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(138,44,75,.35);backdrop-filter:blur(4px);opacity:0;transition:opacity .35s}
    .oct-pop-overlay.show{opacity:1}
    .oct-pop{position:relative;width:100%;max-width:400px;border-radius:28px;overflow:hidden;background:linear-gradient(160deg,#FFF0F5 0%,#FFE4EE 60%,#FAF7E9 100%);box-shadow:0 24px 60px rgba(217,90,130,.35);border:4px solid #fff;transform:translateY(24px) scale(.94);transition:transform .45s cubic-bezier(.2,.9,.3,1.2);text-align:center}
    .oct-pop-overlay.show .oct-pop{transform:none}
    .oct-pop-img{height:170px;background-size:cover;background-position:center;position:relative}
    .oct-pop-img:after{content:"";position:absolute;inset:0;background:linear-gradient(to top,#FFF0F5 2%,transparent 70%)}
    .oct-pop-body{padding:4px 26px 26px;position:relative}
    .oct-pop-tag{display:inline-block;padding:5px 14px;border-radius:999px;background:#fff;border:1px solid #F3A8C0;color:#D95A82;font:700 10px/1 'Be Vietnam Pro',sans-serif;letter-spacing:.12em;text-transform:uppercase}
    .oct-pop-title{font-family:'Pacifico',cursive;font-size:32px;line-height:1.25;color:#D95A82;margin:12px 0 6px}
    .oct-pop-text{font:400 13px/1.6 'Be Vietnam Pro',sans-serif;color:#6B4A55;margin:0 0 18px}
    .oct-pop-cta{box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px 20px;border-radius:999px;background:#D95A82;color:#fff!important;font:600 14px 'Be Vietnam Pro',sans-serif;text-decoration:none;box-shadow:0 8px 20px rgba(217,90,130,.35);transition:background .2s,transform .2s}
    .oct-pop-cta:hover{background:#C83F70;transform:translateY(-1px)}
    .oct-pop-later{margin-top:10px;background:none;border:0;color:#9A7B86;font:500 12px 'Be Vietnam Pro',sans-serif;cursor:pointer}
    .oct-pop-later:hover{color:#D95A82}
    .oct-pop-close{position:absolute;top:10px;right:10px;z-index:2;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.9);color:#8A2C4B;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.12)}
    .oct-pop-petal{position:absolute;top:-20px;width:12px;height:12px;border-radius:100% 0 100% 0;background:#F8B8CD;opacity:.7;pointer-events:none;animation:oct-pop-fall linear infinite;z-index:1}
    @keyframes oct-pop-fall{from{transform:translateY(0) rotate(0)}to{transform:translateY(520px) rotate(360deg)}}
    .oct-pop{max-height:calc(100vh - 32px);overflow-y:auto;overscroll-behavior:contain}
    @media (max-width:480px){
      .oct-pop-overlay{padding:12px}
      .oct-pop{border-radius:24px;border-width:3px}
      .oct-pop-img{height:130px}
      .oct-pop-body{padding:2px 18px 20px}
      .oct-pop-tag{font-size:9px;padding:5px 11px}
      .oct-pop-title{font-size:26px;margin:10px 0 4px}
      .oct-pop-text{font-size:12.5px;margin-bottom:14px}
      .oct-pop-cta{padding:12px 16px;font-size:13.5px}
    }
    @media (max-width:767px) and (max-height:640px){.oct-pop-img{height:100px}}
    @media (max-width:767px) and (max-height:520px){.oct-pop-img{height:70px}}
    @media (min-width:768px){
      .oct-pop{max-width:780px;display:grid;grid-template-columns:1fr 1fr;align-items:stretch;border-radius:32px;overflow:hidden}
      .oct-pop-img{height:auto;min-height:420px}
      .oct-pop-img:after{background:linear-gradient(to right,transparent 55%,#FFF0F5 98%)}
      .oct-pop-body{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px 40px}
      .oct-pop-title{font-size:40px}
      .oct-pop-text{font-size:14px}
      .oct-pop-petal{display:none}
    }
  `;

  function show() {
    if (document.getElementById("oct-pop-overlay")) return;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    let img = "assets/images/bouquet-pink.jpg";
    try { if (window.SiteSettings) img = SiteSettings.get("oct20_hero") || img; } catch (e) {}

    const petals = Array.from({ length: 9 }, () =>
      `<span class="oct-pop-petal" style="left:${Math.round(Math.random() * 95)}%;animation-duration:${6 + Math.random() * 6}s;animation-delay:-${(Math.random() * 8).toFixed(1)}s"></span>`
    ).join("");

    const overlay = document.createElement("div");
    overlay.id = "oct-pop-overlay";
    overlay.className = "oct-pop-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Hoa mừng lễ 20/10");
    overlay.innerHTML = `
      <div class="oct-pop">
        ${petals}
        <button type="button" class="oct-pop-close" aria-label="Đóng"><span class="material-symbols-outlined" style="font-size:20px">close</span></button>
        <div class="oct-pop-img" style="background-image:url('${img}')"></div>
        <div class="oct-pop-body">
          <span class="oct-pop-tag">20 tháng 10 · Ngày Phụ nữ Việt Nam</span>
          <h2 class="oct-pop-title">Hoa mừng lễ 20/10</h2>
          <p class="oct-pop-text">Trao tặng hoa tươi, gửi trọn yêu thương đến mẹ, bà, chị em và người thương.</p>
          <a href="hoa-20-10.html" class="oct-pop-cta"><span class="material-symbols-outlined" style="font-size:20px">local_florist</span>Xem hoa 20/10</a>
          <button type="button" class="oct-pop-later">Để sau</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("show")));

    const close = () => {
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 350);
      document.removeEventListener("keydown", onKey);
    };
    const onKey = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
    overlay.querySelector(".oct-pop-close").addEventListener("click", close);
    overlay.querySelector(".oct-pop-later").addEventListener("click", close);
    overlay.querySelector(".oct-pop-cta").addEventListener("click", () => {
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(show, 1500));
  } else {
    setTimeout(show, 1500);
  }
})();
