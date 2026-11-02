"""Gắn nhãn ảnh sản phẩm bằng Claude để tính năng "Quét hoa" so khớp được.

Chạy trên máy bạn (cần Python 3, không cần cài thêm thư viện):
  set ANTHROPIC_API_KEY=...        (key Anthropic)
  set SUPABASE_SERVICE_KEY=...     (service_role / secret key của Supabase)
  python scripts/tag_products.py

Chỉ gắn nhãn sản phẩm chưa có nhãn. Muốn gắn lại tất cả: thêm tham số --all.
Chạy lại mỗi khi thêm sản phẩm mới.
"""
import base64
import json
import os
import re
import sys
import time
import urllib.request

SUPABASE_URL = "https://nkugwprxqdiarrivhubr.supabase.co"
MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-haiku-5-5")
ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

PROMPT = (
    "Đây là ảnh một sản phẩm của tiệm hoa. Mô tả bó hoa/giỏ hoa chính trong ảnh để so khớp với ảnh khách chụp. "
    "Chỉ trả về MỘT đối tượng JSON, không thêm chữ nào khác, đúng dạng:\n"
    '{"colors":["tối đa 3 màu chủ đạo, tiếng Việt"],'
    '"flowers":["loại hoa nhìn thấy rõ, tiếng Việt, bỏ qua nếu không chắc"],'
    '"style":"một trong: bó tròn | bó dài | giỏ hoa | hoa lụa | khác",'
    '"wrapping":"giấy/ren/nơ gói, kèm màu, ngắn gọn",'
    '"vibe":"cảm giác chung, tối đa 12 từ"}'
)


def http(url, data=None, headers=None, method=None):
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(), r.headers


def sb(path, data=None, extra=None, method=None):
    headers = {"apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY}
    headers.update(extra or {})
    body, _ = http(SUPABASE_URL + "/rest/v1/" + path, data, headers, method)
    return json.loads(body) if body else None


def describe(image_bytes, media_type):
    payload = {
        "model": MODEL,
        "max_tokens": 400,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": media_type,
                                              "data": base64.b64encode(image_bytes).decode()}},
                {"type": "text", "text": PROMPT},
            ],
        }],
    }
    body, _ = http(
        "https://api.anthropic.com/v1/messages",
        json.dumps(payload).encode(),
        {"x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
    )
    text = json.loads(body)["content"][0]["text"]
    m = re.search(r"\{[\s\S]*\}", text)
    return json.loads(m.group(0))


def main():
    if not ANTHROPIC_KEY or not SUPABASE_KEY:
        sys.exit("Thiếu ANTHROPIC_API_KEY hoặc SUPABASE_SERVICE_KEY (đặt bằng lệnh set trước khi chạy).")
    redo = "--all" in sys.argv
    products = sb("products?select=id,name,image_url&is_active=eq.true")
    done = set() if redo else {r["product_id"] for r in sb("product_ai_tags?select=product_id")}
    todo = [p for p in products if p["id"] not in done and p.get("image_url")]
    print(f"{len(todo)} sản phẩm cần gắn nhãn (tổng {len(products)}).")
    for i, p in enumerate(todo, 1):
        try:
            img, headers = http(p["image_url"])
            if len(img) > 4_500_000:
                print(f"[{i}/{len(todo)}] {p['id']}: ảnh quá lớn, bỏ qua")
                continue
            media = headers.get_content_type()
            if media not in ("image/jpeg", "image/png", "image/webp", "image/gif"):
                media = "image/jpeg"
            tags = describe(img, media)
            sb("product_ai_tags?on_conflict=product_id",
               json.dumps({"product_id": p["id"], "tags": tags}).encode(),
               {"Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal"},
               "POST")
            print(f"[{i}/{len(todo)}] {p['id']} {p['name']}: {', '.join(tags.get('colors', []))} | {', '.join(tags.get('flowers', []))}")
        except Exception as e:
            print(f"[{i}/{len(todo)}] {p['id']}: LỖI {e}")
        time.sleep(0.3)


main()
