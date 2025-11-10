// src/api/portfolio.js
const BASE = "http://localhost:3000";

/** สร้างพอร์ต (submit/draft ดูที่ body.submit) */
export async function createPortfolio(formData, token) {
  const res = await fetch(`${BASE}/api/portfolio`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Create portfolio failed");
  return data;
}

/** ดึงพอร์ตของตัวเอง */
export async function getMyPortfolios(token) {
  const res = await fetch(`${BASE}/api/portfolio/mine`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Get my portfolios failed");
  return Array.isArray(data) ? data : (data.items || []);
}

/** เปลี่ยน public/private (เฉพาะ approved) */
export async function updateVisibility(id, toPublic, token) {
  const res = await fetch(`${BASE}/api/portfolio/${id}/visibility`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ visibility: toPublic ? "public" : "private" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Update visibility failed");
  return data;
}

export async function getPublicById(id) {
  const res = await fetch(`${BASE}/api/portfolio/public`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Get public list failed (${res.status}). ${text.slice(0,160)}`);
  }
  const list = await res.json();
  const item = (Array.isArray(list) ? list : []).find(
    (p) => String(p._id || p.id) === String(id)
  );

  if (!item) {
    throw new Error("Portfolio not found or not public");
  }
  return item;
}

/** ⬅️ ใหม่: ดึงพอร์ต 1 ชิ้น (ใช้ในหน้าแก้ไข/รีซับมิต/รีวิว) */
export async function getPortfolio(id, token) {
  const res = await fetch(`${BASE}/api/portfolio/${id}`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Get portfolio failed");
  return data;
}




