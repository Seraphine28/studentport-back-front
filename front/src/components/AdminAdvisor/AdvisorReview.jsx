// src/components/AdvisorAdmin/AdvisorReview.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPortfolioForReview, reviewAdvisor } from "../../api/review";

export default function AdvisorReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");


  useEffect(() => {
    (async () => {
      
      try {
        const data = await getPortfolioForReview(id, token);
        setPortfolio(data);
      } catch (e) {
        console.error("load portfolio error:", e);
        setError("ไม่สามารถโหลดข้อมูล Portfolio ได้ (อาจต้องมี token หรือ route ไม่ตรง)");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  const onApprove = async () => {
  try {
    await reviewAdvisor(id, "approve", {}, token);
    navigate("/advisor/verify");
  } catch (e) {
    setError(e.message || "Approve ล้มเหลว");
  }
};


  const onReject = async () => {
  if (!feedback.trim()) {
    // ❌ ยังไม่ใส่ feedback → แสดง error บนหน้านี้
    setError("กรุณาใส่ Feedback ก่อน Reject");
    return; // หยุด ไม่ navigate
  }
  try {
    await reviewAdvisor(id, "reject", { feedback: feedback.trim() }, token);
    // ✅ ถ้า reject สำเร็จ → navigate ไป /advisor/verify
    navigate("/advisor/verify");
  } catch (e) {
    // ❌ ถ้า server error → แสดง error บนหน้าเดิม
    setError(e.message || "Reject ล้มเหลว");
  }
};



  if (loading) return <p style={{ textAlign: "center" }}>⏳ Loading...</p>;
  if (!portfolio) return <p style={{ textAlign: "center" }}>ไม่พบข้อมูลพอร์ต</p>;

  const files = Array.isArray(portfolio.files) ? portfolio.files : [];
  const fileName = (f) => (typeof f === "string" ? f.split(/[\\/]/).pop() : f?.name || `file`);

  return (
    <div style={{
      height: "100vh", width: "100%", display: "flex", justifyContent: "center",
      flexDirection: "column", boxSizing: "border-box", backgroundColor: "#fff1b8",
      overflow: "hidden", position: "relative", padding: 20, fontSize: 20, fontFamily: "sans-serif"
    }}>
      {/* ปุ่มปิด */}
      <button
        onClick={() => navigate("/advisor/verify")}
        style={{
          position: "absolute", top: 20, right: 20, border: "none",
          background: "transparent", fontSize: 50, fontWeight: "bold",
          cursor: "pointer", color: "#444"
        }}
      >×</button>

      <div style={{
        width: "100%", maxWidth: 1000, height: "100%", borderRadius: 12, padding: 20,
        boxSizing: "border-box", margin: "0 auto", display: "flex", flexDirection: "column",
        backgroundColor: "#fff1b8", overflowY: "auto",
      }}>
        <style>{`
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 4px; }
          ::-webkit-scrollbar-thumb { background-color: #bfbfbf; border-radius: 4px; }
        `}</style>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#ffe6e6",
              color: "#c62828",
              border: "1px solid #ffcdd2",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}



        {/* Fields */}
        {["title", "university", "year", "category"].map((key) => (
          <div key={key} style={{ marginBottom: 10 }}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type="text"
              value={key === "university" ? (portfolio.university || portfolio.owner?.university || "") : portfolio[key] || ""}
              readOnly
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </div>
        ))}


        {/* Cover Image */}
<div style={{ marginBottom: 15 }}>
  <label>Cover Image:</label>
  {portfolio.cover_img ? (
    <img
      src={portfolio.cover_img}
      alt="Cover"
      style={{ maxWidth: "100%", borderRadius: 6, border: "1px solid #ccc" }}
    />
  ) : (
    <div
      style={{
        padding: 8,
        border: "1px solid #ccc",
        borderRadius: 6,
        background: "#fff",
        color: "#222",
      }}
    >
      (no cover image)
    </div>
  )}
</div>

        {/* Files */}
        <div style={{ marginBottom: 15 }}>
          <label>Attached Files:</label>
          {files.length === 0 ? (
            <p>-</p>
          ) : (
            <ul style={{ paddingLeft: 20 }}>
              {files.map((f, idx) => (
                <li key={idx}>
                  <a href={f?.url || "#"} target="_blank" rel="noreferrer">{fileName(f)}</a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 15 }}>
          <label>Description:</label>
          <textarea
            value={portfolio.desc || ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", resize: "none" }}
          />
        </div>

        {/* Feedback */}
        <div style={{ marginBottom: 15 }}>
          <label>Feedback (for Reject):</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="ใส่เหตุผลในการ Reject (บังคับ)"
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", resize: "none" }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <button
            type="button"
            onClick={onApprove}
            style={{
              backgroundColor: "#4CAF50", border: "none", color: "white",
              padding: "10px 25px", borderRadius: 6, cursor: "pointer", fontWeight: "bold"
            }}
          >
            Approve
          </button>

          <button
            type="button"
            onClick={onReject}
            style={{
              backgroundColor: "#f44336", border: "none", color: "white",
              padding: "10px 25px", borderRadius: 6, cursor: "pointer", fontWeight: "bold"
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
