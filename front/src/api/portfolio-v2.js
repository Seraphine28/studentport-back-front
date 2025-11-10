// front/src/api/portfolio-v2.js

// --- นี่คือ "ตัวช่วย" ที่ Error ฟ้องหาครับ ---
const BASE_URL = "http://localhost:3000"; // (ถ้า API อยู่ที่เดียวกับเว็บ ไม่ต้องใส่อะไร)

// --- นี่คือ "ตัวช่วย" ที่จะไปดึง Token มาให้ ---
const getAuthHeader = () => {
  const token = localStorage.getItem('token'); // (หรือชื่อ Key ที่คุณใช้เก็บ)
  if (!token) {
    return {};
  }
  return { 'Authorization': `Bearer ${token}` };
}
// -------------------------------------------

/**
 * 🚨 ดึง Portfolio ของตัวเอง (สำหรับ Status/Profile Page)
 * GET /api/portfolio/mine
 */
export async function getMyPortfolios() {
  try {
    const headers = getAuthHeader();
    const res = await fetch(`${BASE_URL}/api/portfolio/mine`, { headers });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || "Failed to fetch user portfolios.");
    }
    return await res.json();
  } catch (error) {
    console.error("API Error: getMyPortfolios", error);
    throw error;
  }
}

/**
 * 🚨 อัปเดต Visibility (Public/Private)
 * PUT /api/portfolio/:id/visibility
 */
export async function updateVisibility(id, isPublic) {
  try {
    const headers = getAuthHeader();
    headers['Content-Type'] = 'application/json'; // เพิ่ม header นี้ด้วย

    const res = await fetch(`${BASE_URL}/api/portfolio/${id}/visibility`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ visibility: isPublic ? 'public' : 'private' })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || "Failed to update visibility.");
    }
    return await res.json();
  } catch (error) {
    console.error("API Error: updateVisibility", error);
    throw error;
  }
}