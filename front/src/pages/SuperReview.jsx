import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPortfolioById, reviewSuper} from "../api/review"; // ฟังก์ชัน API PUT /api/portfolio/:id/review

export default function SuperReview({  }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectComment, setRejectComment] = useState("");

useEffect(() => {
    async function fetchPortfolio() {
      try {
        // ✅ ดึงข้อมูลจริงจาก backend
        const data = await getPortfolioById(id);
        setPortfolio(data);
      } catch (err) {
        //console.error("❌ โหลดข้อมูลจาก backend ไม่สำเร็จ:", err.message);
        //setError("ไม่สามารถโหลดข้อมูล Portfolio ได้");
        console.warn("⚠️ โหลดข้อมูลจริงไม่ได้ ใช้ mock แทน:", err.message);

        // ✅ mock data สำหรับตอน backend ยังไม่พร้อม
        const mock = {
          title: "My Portfolio – Graphic Design",
          university: "ABC University",
          year: "2025",
          category: "UI/UX",
          description: "รวมผลงานออกแบบ UI ที่ทำในปี 2025",
          files: [
            { name: "design-portfolio.pdf", url: "#" },
            { name: "ui-wireframe.png", url: "#" },
            { name: "ux-flow.jpg", url: "#" },
          ],
          feedback: "ควรเพิ่มรายละเอียดในส่วน UX และโครงสร้างการออกแบบค่ะ",
        };
        setPortfolio(mock);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [id]);

  const handleApprove = async () => {
    try {
      await reviewSuper(id, { status: "approved" });
      navigate("/super/verify");
    } catch (err) {
      setError("Approve failed. Try again.");
      console.error(err);
    }
  };

  const handleReject = async () => {
    if (!rejectComment) {
      setError("กรุณาใส่ comment ก่อน Reject");
      return;
    }
    try {
      await reviewSuper(id, { status: "rejected", comment: rejectComment });
      navigate("/super/verify");
    } catch (err) {
      setError("Reject failed. Try again.");
      console.error(err);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Loading...</p>;

  return (
    <div style={{
      height: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      boxSizing: "border-box",
      backgroundColor: "#ffc1cc",
      overflow: "hidden",
      position: "relative",
      padding: 20,
      fontSize: 20,
      fontFamily: "sans-serif"
    }}>
      
      {/* กากบาทมุมบนขวา */}
      <button
        onClick={() => navigate("/super/verify")}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          border: "none",
          background: "transparent",
          fontSize: 50,
          fontWeight: "bold",
          cursor: "pointer",
          color: "#ffffffff"
        }}
      >×</button>

      <div style={{
        width: "100%",
        maxWidth: 1000,
        height: "100%",
        borderRadius: 12,
        padding: 20,
        boxSizing: "border-box",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffc1cc",
        overflowY: "auto",
      }}
      >
        <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;               /* ความกว้าง scroll */
          }
          ::-webkit-scrollbar-track {
            background: #f0f0f0;      /* สีพื้น scroll track */
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #85a2bfff; /* สี scroll thumb */
            border-radius: 4px;
          }
        `}
      </style>


        {error && <div style={{ color: "red", marginBottom: 15 }}>{error}</div>}

        {/* Title */}
        <div style={{ marginBottom: 10 ,color: "white"}}>
          <label>Title:</label>
          <input
            type="text"
            value={portfolio.title}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* University */}
        <div style={{ marginBottom: 10,color: "white" }}>
          <label>University:</label>
          <input
            type="text"
            value={portfolio.university}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Year */}
        <div style={{ marginBottom: 10,color: "white" }}>
          <label>Year:</label>
          <input
            type="text"
            value={portfolio.year}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: 10,color: "white" }}>
          <label>Category:</label>
          <input
            type="text"
            value={portfolio.category}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Attached Files */}
        <div style={{ marginBottom: 15,color: "white" }}>
          <label>Attached Files:</label>
          <ul style={{ paddingLeft: 20 }}>
            {portfolio.files.map((file, idx) => (
              <li key={idx}>
                <a href={file.url} target="_blank" rel="noreferrer">{file.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 15,color: "white" }}>
          <label>Description:</label>
          <textarea
            value={portfolio.description}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", resize: "none" }}
          />
        </div>

        {/* Reject comment */}
        <div style={{ marginBottom: 15 ,color: "white"}}>
          <label>Feedback (if rejecting):</label>
          <textarea
            value={rejectComment}
            onChange={e => setRejectComment(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", resize: "none" }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <button
            onClick={handleApprove}
            style={{
              backgroundColor: "#4CAF50",
              border: "none",
              color: "white",
              padding: "10px 25px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Approve
          </button>

          <button
            onClick={handleReject}
            style={{
              backgroundColor: "#f44336",
              border: "none",
              color: "white",
              padding: "10px 25px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}