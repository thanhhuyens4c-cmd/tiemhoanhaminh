/**
 * AI Helper - Hoa Nha Minh Admin CMS
 * Tich hop Google Gemini Vision API de phan tich anh hoa
 * va tu dong goi y mo ta san pham bang tieng Viet
 */

const AdminAI = {
  LS_KEY:   "hnm_gemini_api_key",
  MODEL:    "gemini-2.0-flash",
  API_BASE: "https://generativelanguage.googleapis.com/v1beta/models",

  getApiKey()  { return localStorage.getItem(this.LS_KEY) || ""; },
  hasApiKey()  { return !!this.getApiKey(); },

  saveApiKey(key) {
    const k = (key || "").trim();
    k ? localStorage.setItem(this.LS_KEY, k) : localStorage.removeItem(this.LS_KEY);
    return k;
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

    const endpoint = `${this.API_BASE}/${this.MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: base64Data } }
        ]}],
        generationConfig: { temperature: 0.75, maxOutputTokens: 1024 }
      })
    });

    if (!response.ok) {
      let errMsg = `Loi API Gemini: ${response.status}`;
      try { const e = await response.json(); errMsg = e?.error?.message || errMsg; } catch (_) {}
      throw new Error(errMsg);
    }

    const data    = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const match   = rawText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI tra ve dinh dang khong hop le. Vui long thu lai.");
    return JSON.parse(match[0]);
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
