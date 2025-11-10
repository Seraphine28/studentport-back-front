// src/components/AdminAdvisor/VerifyPortfolioAdvisor.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdvi from "../AdminAdvisor/SidebarAdvi";
import {
  getPendingPortfolios,
  advisorApprovePortfolio,
  advisorRejectPortfolio,
} from "../../api/adminApi";

export default function VerifyPortfolioAdvisor() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก backend ตอนเปิดหน้า
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPendingPortfolios();
        setPortfolios(data);
      } catch (err) {
        console.error("Error fetching portfolios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // เริ่มรีวิว (อนุมัติ = ส่งต่อให้ SuperAdmin)
  const handleStartReview = async (id) => {
    try {
      await advisorApprovePortfolio(id);
      alert("✅ ส่งต่อให้ SuperAdmin แล้ว!");
      // อัปเดตสถานะในหน้า
      setPortfolios((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: "in_process" } : p
        )
      );
    } catch (err) {
      alert("❌ ไม่สามารถส่งต่อได้");
      console.error(err);
    }
  };

  // ปฏิเสธ
  const handleReject = async (id) => {
    const feedback = prompt("กรอกเหตุผลที่ Reject:");
    if (!feedback) return;
    try {
      await advisorRejectPortfolio(id, feedback);
      alert("❌ ปฏิเสธพอร์ตแล้ว");
      // ลบออกจาก list
      setPortfolios((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Reject ไม่สำเร็จ");
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex role-advisor">
      <SidebarAdvi />
      <div className="main-container">
        <h2 className="page-title">Verify Portfolios (Advisor Stage)</h2>
        <p className="page-subtitle">
          Review and forward approved portfolios to Super Admin.
        </p>

        {portfolios.length === 0 ? (
          <p>ไม่มีพอร์ตที่รอตรวจ</p>
        ) : (
          <table className="verify-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Student</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>
                  <td>{p.title}</td>
                  <td>{p.owner?.displayName || "Unknown"}</td>
                  <td>
                    <span
                      className={`status-badge ${p.status.toLowerCase()}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-approve"
                      disabled={p.status !== "pending"}
                      onClick={() => handleStartReview(p._id)}
                    >
                      Forward
                    </button>
                    <button
                      className="btn-reject"
                      disabled={p.status !== "pending"}
                      onClick={() => handleReject(p._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
