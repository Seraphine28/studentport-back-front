// src/api/review.js
const BASE = "";

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** ====== ใช้ทั้ง Advisor/Super: ดึงพอร์ตชิ้นเดียว ====== */
export async function getPortfolioById(id, token) {
  const res = await fetch(`${BASE}/api/portfolio/${id}`, {
    headers: { ...authHeader(token) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Get portfolio by id failed");
  return data;
}

/** ====== ที่ปรึกษา (AdvisorAdmin) อนุมัติ/รีเจกต์ ======
 * approve: PUT /api/portfolio/admin/:id/approve
 * reject : PUT /api/portfolio/:id/reject  {feedback}
 */
export async function reviewAdvisor(id, action, payload = {}, token) {
  if (action === "approve") {
    const res = await fetch(`${BASE}/api/portfolio/admin/${id}/approve/true`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader(token) },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Advisor approve failed");
    return data;
  } else if (action === "reject") {
    const res = await fetch(`${BASE}/api/portfolio/admin/${id}/false`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader(token) },
      body: JSON.stringify({ feedback: payload.feedback || "" }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Advisor reject failed");
    return data;
  }
  throw new Error("reviewAdvisor: unknown action");
}

/** ====== ซูเปอร์ (SuperAdmin) อนุมัติ/รีเจกต์ ======
 * approve: PUT /api/portfolio/super/:id/approve
 * reject : PUT /api/portfolio/:id/reject  {feedback}
 */
export async function reviewSuper(id, action, payload = {}, token) {
  if (action === "approve") {
    const res = await fetch(`${BASE}/api/portfolio/super/${id}/approve/true`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader(token) },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Super approve failed");
    return data;
  } else if (action === "reject") {
    const res = await fetch(`${BASE}/api/portfolio/super/${id}/false`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader(token) },
      body: JSON.stringify({ feedback: payload.feedback || "" }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Super reject failed");
    return data;
  }
  throw new Error("reviewSuper: unknown action");
}

/* เผื่อไฟล์อื่นอ้างถึงชื่อเดิม */
export async function superApprove(id, token) {
  return reviewSuper(id, "approve", {}, token);
}
export async function superReject(id, feedback, token) {
  return reviewSuper(id, "reject", { feedback }, token);
}
