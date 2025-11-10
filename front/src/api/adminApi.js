// src/api/adminApi.js
const BASE = "http://localhost:3000";

// แนบ token ถ้ามี
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ======================================
   🟨 PORTFOLIO (Advisor / SuperAdmin)
   ====================================== */

// GET: pending portfolios (Advisor)
export async function getPendingPortfolios() {
  const res = await fetch(`${BASE}/api/portfolio/pending`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to load pending portfolios");
  return res.json();
}

// GET: portfolio detail (ใช้ตอน admin-view หรือ Super/Advisor ดูพอร์ตเดี่ยว)
export async function getPortfolioById(id) {
  const res = await fetch(`${BASE}/api/portfolio/admin-view/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to load portfolio detail");
  return res.json();
}

/* ---------- Advisor ---------- */
// PUT: approve (pending → in_process)
export async function advisorApprovePortfolio(id) {
  const res = await fetch(`${BASE}/api/portfolio/admin/${id}/approve/true`, {
    method: "PUT",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Advisor approve failed");
  return res.json();
}

// PUT: reject (pending → rejected)
export async function advisorRejectPortfolio(id, feedback) {
  const res = await fetch(`${BASE}/api/portfolio/admin/${id}/approve/false`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ feedback }),
  });
  if (!res.ok) throw new Error("Advisor reject failed");
  return res.json();
}

/* ---------- SuperAdmin ---------- */
// GET: portfolios ที่สถานะ in_process
export async function getInProcessPortfolios() {
  const res = await fetch(`${BASE}/api/portfolio/inProcess`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to load inProcess portfolios");
  return res.json();
}

// PUT: approve (in_process → approved)
export async function superApprovePortfolio(id) {
  const res = await fetch(`${BASE}/api/portfolio/super/${id}/approve/true`, {
    method: "PUT",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Super approve failed");
  return res.json();
}

// PUT: reject (ใช้ endpoint เดียวกับของ Advisor)
export async function superRejectPortfolio(id, feedback) {
  return advisorRejectPortfolio(id, feedback);
}

/* ======================================
   🟩 USER (Approve / Reject)
   ====================================== */

// GET: pending users (ยังไม่ approve)
export async function getPendingUsers() {
  const res = await fetch(`${BASE}/api/user/pending`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to load pending users");
  return res.json();
}

// GET: user detail (admin-view)
export async function getUserAdminView(id) {
  const res = await fetch(`${BASE}/api/user/admin-view/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to load user detail");
  return res.json();
}

// PUT: approve user
export async function approveUser(id) {
  const res = await fetch(`${BASE}/api/user/${id}/approve`, {
    method: "PUT",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Approve user failed");
  return res.json();
}

// DELETE: reject user
export async function rejectUser(id) {
  const res = await fetch(`${BASE}/api/user/${id}/reject`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Reject user failed");
  return res.json();
}
