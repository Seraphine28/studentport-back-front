// src/components/SuperAdmin/VerifyPortfolioSuper.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ปรับ path ให้ตรงโปรเจ็กต์ของหนู (บางโปรเจ็กต์ใช้ "Super-Admin")
import SidebarSuper from "../SuperAdmin/SidebarSuper";
import {
  getInProcessPortfolios,
  superApprovePortfolio,
  superRejectPortfolio,
} from "../../api/adminApi";

export default function VerifyPortfolioSuper() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดงานสถานะ in_process
  useEffect(() => {
    (async () => {
      try {
        const data = await getInProcessPortfolios();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Load in_process error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onApprove = async (id) => {
    try {
      await superApprovePortfolio(id);
      // เอาออกจากตารางเมื่ออนุมัติสำเร็จ
      setRows((prev) => prev.filter((x) => x._id !== id));
      alert("✅ Approved");
    } catch (e) {
      console.error(e);
      alert("❌ Approve failed");
    }
  };

  const onReject = async (id) => {
    const feedback = prompt("เหตุผลในการ Reject:");
    if (!feedback) return;
    try {
      await superRejectPortfolio(id, feedback);
      setRows((prev) => prev.filter((x) => x._id !== id));
      alert("❌ Rejected");
    } catch (e) {
      console.error(e);
      alert("❌ Reject failed");
    }
  };

  const goDetail = (id) => navigate(`/super/review/${id}`);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex role-super">
      <SidebarSuper />
      <div className="main-container">
        <h2 className="page-title">Final Approval (Super Admin)</h2>
        <p className="page-subtitle">Review items forwarded by Advisor, then approve or reject.</p>

        {rows.length === 0 ? (
          <p>ไม่มีพอร์ตที่รออนุมัติ</p>
        ) : (
          <table className="verify-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Student</th>
                <th>Status</th>
                <th>Files</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>
                  <td>{p.title}</td>
                  <td>{p.owner?.displayName || "Unknown"}</td>
                  <td>
                    <span className={`status-badge ${String(p.status || "").toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    {(p.files || []).slice(0, 2).map((f, idx) => (
                      <div key={idx} className="file-chip">{f}</div>
                    ))}
                    {(p.files || []).length > 2 && <span>+ more</span>}
                  </td>
                  <td className="flex gap-2">
                    <button className="btn-secondary" onClick={() => goDetail(p._id)}>
                      View
                    </button>
                    <button className="btn-approve" onClick={() => onApprove(p._id)}>
                      Approve
                    </button>
                    <button className="btn-reject" onClick={() => onReject(p._id)}>
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
