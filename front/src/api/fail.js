// src/api/fail.js
const BASE = "http://localhost:3000";

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getFailPortfolio(id, token) {
  try {
    const res = await fetch(`${BASE}/api/portfolio/detail/${id}`, {
      headers: { ...authHeader(token) },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Get fail portfolio failed");
    return data; // ✅ backend คืนข้อมูลครบ (title, files, feedback)
  } catch (err) {
    console.error("getFailPortfolio error:", err);
    throw err;
  }
}
