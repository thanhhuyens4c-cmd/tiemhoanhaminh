/**
 * AI Helper - Hoa Nha Minh Admin CMS
 * Tich hop Google Gemini Vision API de phan tich anh hoa
 * va tu dong goi y mo ta san pham bang tieng Viet
 */

const AdminAI = {
  LS_KEY:   "hnm_gemini_api_key",
  MODEL:    "gemini-3.6-flash",
  CANDIDATE_MODELS: ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash"],
  API_BASE: "https://generativelanguage.googleapis.com/v1beta/models",

  getApiKey()  { return localStorage.getItem(this.LS_KEY) || ""; },
  hasApiKey()  { return !!this.getApiKey(); },

  saveApiKey(key) {
    const k = (key || "").trim();
    k ? localStorage.setItem(this.LS_KEY, k) : localStorage.removeItem(this.LS_KEY);
    return k;
  },

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
            contents: [{ parts: [{ text: "ping" }] }],
            generationConfig: { maxOutputTokens: 5 }
          })
        });

        if (res.ok) {
          this.MODEL = model;
          return { success: true, model };
        }

        const errData = await res.json().catch(() => ({}));
        const msg = errData?.error?.message || `HTTP ${res.status}`;

        // Nếu API key không hợp lệ từ Google
        if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID") || (res.status === 400 && msg.toLowerCase().includes("key"))) {
          throw new Error("API Key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại key tại Google AI Studio.");
        }

        lastErr = new Error(msg);
      } catch (e) {
        if (e.message && e.message.includes("API Key không hợp lệ")) throw e;
        lastErr = e;
      }
    }

    throw lastErr || new Error("Không thể kết nối đến Gemini API. Vui lòng kiểm tra mạng hoặc thử lại.");
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

    const modelsToTry = [this.MODEL, ...this.CANDIDATE_MODELS.filter(m => m !== this.MODEL)];
    let lastErr = null;

    for (const model of modelsToTry) {
      try {
        const endpoint = `${this.API_BASE}/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody
        });

        if (!response.ok) {
          let errMsg = `Lỗi API Gemini (${model}): ${response.status}`;
          try { const e = await response.json(); errMsg = e?.error?.message || errMsg; } catch (_) {}
          lastErr = new Error(errMsg);
          if (errMsg.includes("no longer available") || errMsg.includes("not found") || response.status === 404) {
            continue;
          }
          throw lastErr;
        }

        this.MODEL = model;
        const data    = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const match   = rawText.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("AI trả về định dạng không hợp lệ. Vui lòng thử lại.");
        return JSON.parse(match[0]);
      } catch (err) {
        lastErr = err;
        if (err.message && (err.message.includes("no longer available") || err.message.includes("not found"))) {
          continue;
        }
        throw err;
      }
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
