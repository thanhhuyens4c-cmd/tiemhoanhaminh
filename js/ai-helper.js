/**
 * AI Helper - Hoa Nha Minh Admin CMS
 * Tich hop Google Gemini Vision API de phan tich anh hoa
 * va tu dong goi y mo ta san pham bang tieng Viet
 */

const AdminAI = {
  LS_KEY:   "hnm_gemini_api_key",
  MODEL:    "gemini-2.5-flash",
  // Thứ tự ưu tiên: thử từng model khi model trước bị lỗi/quá tải
  CANDIDATE_MODELS: ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-3.6-flash"],
  API_BASE: "https://generativelanguage.googleapis.com/v1beta/models",

  getApiKey()  { return localStorage.getItem(this.LS_KEY) || ""; },
  hasApiKey()  { return !!this.getApiKey(); },

  saveApiKey(key) {
    const k = (key || "").trim();
    k ? localStorage.setItem(this.LS_KEY, k) : localStorage.removeItem(this.LS_KEY);
    return k;
  },

  /** Trả về true nếu lỗi là tạm thời (quá tải, rate limit) → nên thử model khác */
  _isRetryableError(msg, status) {
    if (!msg) return false;
    const m = msg.toLowerCase();
    return (
      status === 429 || status === 503 || status === 429 ||
      m.includes("high demand") ||
      m.includes("resource_exhausted") ||
      m.includes("quota") ||
      m.includes("rate limit") ||
      m.includes("try again") ||
      m.includes("overloaded") ||
      m.includes("no longer available") ||
      m.includes("not found") ||
      m.includes("deprecated")
    );
  },

  /** Chờ một khoảng ms */
  _wait(ms) { return new Promise(r => setTimeout(r, ms)); },

  /** Kiểm tra tính hợp lệ của API Key với danh sách model hỗ trợ */
  async testKey(key) {
    const k = (key || "").trim();
    if (!k) throw new Error("Chưa nhập API Key");

    const modelsToTry = [this.MODEL, ...this.CANDIDATE_MODELS.filter(m => m !== this.MODEL)];
    let lastErr = null;

    for (const model of modelsToTry) {
      try {
        const endpoint = `${this.API_BASE}/${model}:generateContent?key=${k}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hi" }] }],
            generationConfig: { maxOutputTokens: 5 }
          })
        });

        if (res.ok) {
          this.MODEL = model;
          return { success: true, model };
        }

        const errData = await res.json().catch(() => ({}));
        const msg = errData?.error?.message || `HTTP ${res.status}`;

        // API key sai thật sự → dừng ngay, không thử tiếp
        if (res.status === 400 || msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
          throw new Error("API Key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại tại Google AI Studio.");
        }

        // Lỗi tạm thời hoặc model không có → thử model tiếp theo
        lastErr = new Error(msg);
        continue;

      } catch (e) {
        if (e.message && e.message.includes("API Key không hợp lệ")) throw e;
        lastErr = e;
      }
    }

    throw lastErr || new Error("Không thể kết nối đến Gemini API. Vui lòng kiểm tra lại kết nối mạng.");
  },

  async analyzeFlowerImage(imageDataUrl, productName = "") {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("NO_API_KEY");

    const commaIdx   = imageDataUrl.indexOf(",");
    const base64Data = commaIdx !== -1 ? imageDataUrl.slice(commaIdx + 1) : imageDataUrl;
    const mimeMatch  = imageDataUrl.match(/data:([^;]+);/);
    const mimeType   = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const prompt = `Ban la chuyen gia noi dung cho tiem hoa boutique cao cap "Hoa Nha Minh" tai Ha Noi, chuyen hoa Da Lat tuoi moi ngay. Phong cach viet: lang man, am ap, chan that khong sao rong.

Hay phan tich buc anh san pham hoa nay${productName ? ` (ten san pham: "${productName}")` : ""} va tra ve JSON THUAN (khong co markdown) voi cau truc chinh xac sau:

{
  "shortDesc": "1-2 cau mo ta ngan gon, goi cam xuc, dung cho the san pham (toi da 90 ky tu), VIET TIENG VIET CO DAU",
  "description": "Doan mo ta day du 3-5 cau: ke cau chuyen ve bo hoa, mau sac, mui huong, cam giac khi nhan, dung cho trang chi tiet san pham, VIET TIENG VIET CO DAU",
  "careInstructions": "Huong dan cham soc hoa tuoi 2-3 buoc ngan gon thuc te, VIET TIENG VIET CO DAU",
  "suggestedName": "Ten san pham tho mong bang tieng Viet co dau neu chua dat ten (VD: Bo Hoa Hong Pastel Mo Mong)",
  "suggestedColorName": "Mo ta mau sac chu dao bang tieng Viet co dau (VD: Hong pastel diu dang, Do nhung kieu sa)",
  "suggestedOccasion": "Cac dip phu hop, cach nhau dau phay, dung slug khong dau (VD: sinh-nhat,valentine,ky-niem)"
}

Chi tra ve JSON, khong them bat ky text nao khac.`;

    const requestBody = JSON.stringify({
      contents: [{ parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: base64Data } }
      ]}],
      generationConfig: { temperature: 0.75, maxOutputTokens: 1024 }
    });

    // Thử từng model, mỗi model thử tối đa 2 lần (delay giữa các lần)
    const modelsToTry = [this.MODEL, ...this.CANDIDATE_MODELS.filter(m => m !== this.MODEL)];
    let lastErr = null;

    for (let mi = 0; mi < modelsToTry.length; mi++) {
      const model = modelsToTry[mi];
      const maxRetries = 2;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Delay nhẹ trước lần thử lại (không delay lần đầu)
          if (attempt > 0) await this._wait(1500);

          const endpoint = `${this.API_BASE}/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(endpoint, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: requestBody
          });

          if (!response.ok) {
            let errMsg = "";
            try { const e = await response.json(); errMsg = e?.error?.message || ""; } catch (_) {}
            errMsg = errMsg || `HTTP ${response.status}`;
            lastErr = new Error(errMsg);

            if (this._isRetryableError(errMsg, response.status)) {
              // Thử lại hoặc chuyển sang model kế nếu hết lượt retry
              if (attempt < maxRetries - 1) continue;
              else break; // chuyển sang model tiếp
            }
            // Lỗi không phải tạm thời (VD: API key sai) → ném ngay
            throw lastErr;
          }

          // Thành công
          this.MODEL = model;
          const data    = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const match   = rawText.match(/\{[\s\S]*\}/);
          if (!match) throw new Error("AI trả về định dạng không hợp lệ. Vui lòng thử lại.");
          return JSON.parse(match[0]);

        } catch (err) {
          lastErr = err;
          // Lỗi mạng hoặc không phải retryable → chuyển model tiếp ngay
          if (!this._isRetryableError(err.message, 0)) {
            mi = modelsToTry.length; // thoát vòng ngoài
            break;
          }
          if (attempt < maxRetries - 1) continue;
          // Hết retry, chuyển model tiếp
        }
      }
    }

    // Thông báo lỗi thân thiện
    const msg = (lastErr?.message || "").toLowerCase();
    if (msg.includes("high demand") || msg.includes("overloaded") || msg.includes("try again") || msg.includes("resource_exhausted")) {
      throw new Error("Gemini đang bận, vui lòng thử lại sau vài giây ⏳");
    }
    throw lastErr || new Error("Không thể phân tích ảnh hoa bằng AI. Vui lòng thử lại.");
  },

  fillFormWithAISuggestions(formEl, suggestions, overwrite = false) {
    if (!formEl || !suggestions) return;
    const set = (sel, val) => {
      const el = formEl.querySelector(sel);
      if (!el || !val) return;
      if (overwrite || !el.value.trim()) {
        el.value = val;
        el.classList.add("ai-filled");
        setTimeout(() => el.classList.remove("ai-filled"), 2000);
      }
    };
    set("[name=shortDesc]",       suggestions.shortDesc);
    set("[name=description]",     suggestions.description);
    set("[name=careInstructions]",suggestions.careInstructions);
    set("[name=name]",            suggestions.suggestedName);
    set("[name=colorName]",       suggestions.suggestedColorName);
    set("[name=occasion]",        suggestions.suggestedOccasion);
  }
};

window.AdminAI = AdminAI;
