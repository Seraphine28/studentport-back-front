// src/api/review.js
const BASE = "http://localhost:3000";

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** ====== ใช้ทั้ง Advisor/Super: ดึงพอร์ตชิ้นเดียว ====== */
// review.js
export async function getPortfolioForReview(id, token) {
  const res = await fetch(`${BASE}/api/portfolio/admin-view/${id}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  if (!res.ok) throw new Error("Portfolio not found");
  return res.json();
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
      body: JSON.stringify({}), // approve ไม่ต้อง feedback
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Advisor approve failed");
    return data;
  } else if (action === "reject") {
    const res = await fetch(`${BASE}/api/portfolio/admin/${id}/approve/false`, {
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
  let isApprove = action === "approve" ? "true" : "false";

  const res = await fetch(`${BASE}/api/portfolio/super/${id}/approve/${isApprove}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json", 
      ...authHeader(token) 
    },
    body: JSON.stringify(action === "reject" ? { feedback: payload.feedback } : {}),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Super review failed");
  return data;
}


/* เผื่อไฟล์อื่นอ้างถึงชื่อเดิม */
export async function superApprove(id, token) {
  return reviewSuper(id, "approve", {}, token);
}
export async function superReject(id, feedback, token) {
  return reviewSuper(id, "reject", { feedback }, token);
}
