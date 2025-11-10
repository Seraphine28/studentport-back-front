// src/api/portfolioDraft.js
const BASE = "http://localhost:3000";

/**
 * Upload draft portfolio (save as draft)
 * @param {FormData} formData - form-data containing fields and images
 * @param {string} [token] - optional JWT token for authentication
 * @returns {Promise<object>} response JSON
 */
export async function uploadPortfolioDraft(formData, token) {
  const res = await fetch(`${BASE}/api/portfolio`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Draft upload failed");
  }

  return data; // { message, data }
}
