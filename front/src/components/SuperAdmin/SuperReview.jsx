// ✅ ปรับ path import ให้ตรงตำแหน่งจริงของไฟล์ในโปรเจกต์หนู
// ถ้าไฟล์นี้อยู่ที่ src/components/SuperAdmin/SuperReview.jsx
// และ adminApi.js อยู่ที่ src/components/api/adminApi.js ให้ใช้ "../api/adminApi"
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPortfolioById,
  superApprovePortfolio,
  // superRejectPortfolio, // ❌ back ชุดนี้ไม่มี reject ฝั่ง Super
} from "../../api/adminApi";

export default function SuperReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getPortfolioById(id); // GET /api/portfolio/:id
        setPortfolio(data);
      } catch (err) {
        console.error("load portfolio error:", err);
        setError("ไม่สามารถโหลดข้อมูล Portfolio ได้ (อาจต้องมี token หรือ route ไม่ตรง)");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleApprove = async () => {
    try {
      await superApprovePortfolio(id); // PUT /api/portfoliosuper/:id/approve ผ่าน proxy
      alert("✅ Approved");
      navigate("/super/verify");
    } catch (err) {
      console.error(err);
      setError("Approve failed (อาจไม่มี token / สิทธิ์ไม่พอ)");
    }
  };

  // ❌ back ปัจจุบันไม่รองรับ reject ที่ขั้น Super
  const handleReject = () => {
    alert("ขั้น Super ยังไม่มี endpoint สำหรับ Reject ใน backend นี้ค่ะ");
  };

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Loading...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!portfolio) return <p style={{ textAlign: "center" }}>ไม่พบข้อมูลพอร์ต</p>;

  // ช่วยแสดงไฟล์: backend ส่งเป็นพาธสตริง เช่น "uploads/abc.pdf"
  const files = Array.isArray(portfolio.files) ? portfolio.files : [];
  const fileName = (p) => (typeof p === "string" ? p.split(/[\\/]/).pop() : String(p));

  return (
    <div style={{
      height: "100vh", width: "100%", display: "flex", justifyContent: "center",
      flexDirection: "column", boxSizing: "border-box", backgroundColor: "#ffc1cc",
      overflow: "hidden", position: "relative", padding: 20, fontSize: 20, fontFamily: "sans-serif"
    }}>
      {/* กากบาทปิด */}
      <button
        onClick={() => navigate("/super/verify")}
        style={{
          position: "absolute", top: 20, right: 20, border: "none",
          background: "transparent", fontSize: 50, fontWeight: "bold",
          cursor: "pointer", color: "#ffffff"
        }}
      >×</button>

      <div style={{
        width: "100%", maxWidth: 1000, height: "100%", borderRadius: 12, padding: 20,
        boxSizing: "border-box", margin: "0 auto", display: "flex", flexDirection: "column",
        backgroundColor: "#ffc1cc", overflowY: "auto",
      }}>
        <style>{`
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 4px; }
          ::-webkit-scrollbar-thumb { background-color: #85a2bf; border-radius: 4px; }
        `}</style>

        {/* Title */}
        <div style={{ marginBottom: 10, color: "white" }}>
          <label>Title:</label>
          <input
            type="text"
            value={portfolio.title || ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* University */}
        <div style={{ marginBottom: 10, color: "white" }}>
          <label>University:</label>
          <input
            type="text"
            value={portfolio.university || portfolio.owner?.university || ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Year */}
        <div style={{ marginBottom: 10, color: "white" }}>
          <label>Year:</label>
          <input
            type="text"
            value={portfolio.year ?? ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: 10, color: "white" }}>
          <label>Category:</label>
          <input
            type="text"
            value={portfolio.category || ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Attached Files */}
        <div style={{ marginBottom: 15, color: "white" }}>
          <label>Attached Files:</label>
          {files.length === 0 ? (
            <p>-</p>
          ) : (
            <ul style={{ paddingLeft: 20 }}>
              {files.map((p, idx) => (
                <li key={idx}>
                  {/* ถ้า backend เสิร์ฟไฟล์ได้ ให้เปลี่ยน href เป็น `/` + พาธไฟล์ */}
                  <a href="#" onClick={(e)=>e.preventDefault()}>
                    {fileName(p)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Description (field จริงคือ desc) */}
        <div style={{ marginBottom: 15, color: "white" }}>
          <label>Description:</label>
          <textarea
            value={portfolio.desc || ""}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", resize: "none" }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <button
            onClick={handleApprove}
            style={{
              backgroundColor: "#4CAF50", border: "none", color: "white",
              padding: "10px 25px", borderRadius: 6, cursor: "pointer", fontWeight: "bold"
            }}
          >
            Approve
          </button>

          <button
            onClick={handleReject}
            style={{
              backgroundColor: "#9e9e9e", border: "none", color: "white",
              padding: "10px 25px", borderRadius: 6, cursor: "not-allowed", fontWeight: "bold"
            }}
            disabled
            title="backend ปัจจุบันไม่รองรับ Reject ในขั้น Super"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
