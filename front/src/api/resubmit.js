// src/api/resubmit.js
const BASE = "http://localhost:3000";

/**
 * Resubmit portfolio
 * @param {string|number} id - Portfolio ID
 * @param {FormData} formData - FormData object { title, desc, file[] }
 * @param {string} [token] - Bearer token (optional)
 * @returns {Promise<Object>} - { message }
 */
export async function resubmitPortfolio(id, formData, token) {
  const res = await fetch(`${BASE}/api/portfolio/${id}/edit`, {
    method: "PUT",
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
      // ห้ามใส่ Content-Type ตอนใช้ FormData
    },
    body: formData
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (!res.ok) {
    throw new Error(data.message || "Resubmit failed");
  }

  return data; // { message }
}
