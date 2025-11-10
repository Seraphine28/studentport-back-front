// src/api/edit.js
const BASE = "http://localhost:3000"; // ใช้ CRA proxy (setupProxy ชี้ไป :3000 อยู่แล้ว)

export async function editPortfolio(id, formData, token) {
  const res = await fetch(`${BASE}/api/portfolio/${id}/edit`, {
    method: "PUT",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined, // ถ้ามี token ก็แนบได้
    body: formData, // อย่าใส่ Content-Type เอง ให้ browser จัดให้
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Update failed");
  return data;
}

