// src/components/AdvisorAdmin/AdvisorReview.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPortfolioById,          // GET /api/portfolio/:id
  advisorApprovePortfolio,   // PUT /api/portfolioadmin/:id/approve
  advisorRejectPortfolio,    // PUT /api/portfolio/:id/reject  (body: { feedback })
} from "../../api/adminApi";     // <-- ปรับ path ให้ตรงโปรเจกต์ของหนู

export default function AdvisorReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getPortfolioById(id); // ต้องมี token + role AdvisorAdmin
        setPortfolio(data);
      } catch (e) {
        console.error("load portfolio error:", e);
        setError("ไม่สามารถโหลดข้อมูล Portfolio ได้ (อาจต้องมี token หรือ route ไม่ตรง)");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onApprove = async () => {
    try {
      await advisorApprovePortfolio(id); // pending -> in_process
      alert("✅ ส่งต่อให้ Super Admin แล้ว");
      navigate("/advisor/verify");       // เปลี่ยนปลายทางตามหน้า list ของหนู
    } catch (e) {
      console.error(e);
      setError("Approve ล้มเหลว (อาจไม่มีสิทธิ์ หรือพอร์ตไม่ใช่สถานะ pending)");
    }
  };

  const onReject = async () => {
    if (!feedback.trim()) {
      setError("กรุณาใส่ Feedback ก่อน Reject");
      return;
    }
    try {
      await advisorRejectPortfolio(id, feedback.trim()); // ต้องอยู่สถานะ pending เท่านั้น
      alert("❌ Reject แล้ว");
      navigate("/advisor/verify");
    } catch (e) {
      console.error(e);
      setError("Reject ล้มเหลว (อาจไม่มีสิทธิ์ หรือพอร์ตไม่ใช่สถานะ pending)");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Loading...</p>;
  if (error)   return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!portfolio) return <p style={{ textAlign: "center" }}>ไม่พบข้อมูลพอร์ต</p>;

  const files = Array.isArray(portfolio.files) ? portfolio.files : [];
  const fileName = (p) => (typeof p === "string" ? p.split(/[\\/]/).pop() : String(p));

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

        {/* Title */}
        <div style={{ marginBottom: 10 }}>
          <label>Title:</label>
          <input
            type="text"
            value={portfolio.title || ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* University */}
        <div style={{ marginBottom: 10 }}>
          <label>University:</label>
          <input
            type="text"
            value={portfolio.university || portfolio.owner?.university || ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Year */}
        <div style={{ marginBottom: 10 }}>
          <label>Year:</label>
          <input
            type="text"
            value={portfolio.year ?? ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: 10 }}>
          <label>Category:</label>
          <input
            type="text"
            value={portfolio.category || ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Attached Files */}
        <div style={{ marginBottom: 15 }}>
          <label>Attached Files:</label>
          {files.length === 0 ? (
            <p>-</p>
          ) : (
            <ul style={{ paddingLeft: 20 }}>
              {files.map((p, idx) => (
                <li key={idx}>
                  <a href="#" onClick={(e)=>e.preventDefault()}>
                    {fileName(p)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Description (field จริงคือ desc) */}
        <div style={{ marginBottom: 15 }}>
          <label>Description:</label>
          <textarea
            value={portfolio.desc || ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", resize: "none" }}
          />
        </div>

        {/* Feedback (จำเป็นสำหรับ Reject) */}
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
            onClick={onApprove}
            style={{
              backgroundColor: "#4CAF50", border: "none", color: "white",
              padding: "10px 25px", borderRadius: 6, cursor: "pointer", fontWeight: "bold"
            }}
          >
            Approve (ส่งให้ Super)
          </button>

          <button
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
