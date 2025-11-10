// front/src/api/user.js

const BASE_URL = "http://localhost:3000";;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {};
  }
  return { 'Authorization': `Bearer ${token}` };
}

/**
 * 🚨 ดึงข้อมูล User ปัจจุบัน (ที่ Login อยู่)
 * GET /api/user/me (หรือ /auth/me แล้วแต่ Backend)
 */
export async function getCurrentUser() {
  try {
    const headers = getAuthHeader();
    // ‼️ Backend ของคุณอาจจะใช้ /auth/me หรือ /api/user/profile
    // ‼️ เช็กให้แน่ใจว่า Endpoint ถูกต้อง
    const res = await fetch(`${BASE_URL}/api/user/me`, { headers }); 

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || "Failed to fetch user data.");
    }
    return await res.json();
  } catch (error) {
    console.error("API Error: getCurrentUser", error);
    throw error;
  }
}