// src/components/SuperAdmin/VerifyAcc.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSuper from "../SuperAdmin/SidebarSuper";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
  getUserAdminView,
} from "../../api/adminApi";

export default function VerifyAcc() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดรายการผู้ใช้ที่รอตรวจ
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPendingUsers(); // GET /api/user/pending
        if (!mounted) return;
        const rows = (data || []).map((u) => ({
          _id: u._id,
          name: u.displayName || u.name || "Unknown",
          email: u.email || "",
          role: u.role || "Student",
          status: "Pending",
        }));
        setAccounts(rows);
      } catch (e) {
        console.error("Load pending users error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onApprove = async (id) => {
    try {
      await approveUser(id); // PUT /api/user/:id/approve
      setAccounts((prev) => prev.filter((x) => x._id !== id));
      alert("✅ Approved user");
    } catch (e) {
      console.error(e);
      alert("❌ Approve failed");
    }
  };

  const onReject = async (id) => {
    const ok = window.confirm("ยืนยัน Reject ผู้ใช้นี้?");
    if (!ok) return;
    try {
      await rejectUser(id); // DELETE /api/user/:id/reject
      setAccounts((prev) => prev.filter((x) => x._id !== id));
      alert("❌ Rejected user");
    } catch (e) {
      console.error(e);
      alert("❌ Reject failed");
    }
  };

  const handleStartReview = async (id) => {
    // (optional) prefetch รายละเอียดก่อน navigate
    try {
      await getUserAdminView(id); // GET /api/user/admin-view/:id
    } catch (_) {}
    navigate(`/super/user-approval/${id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex role-super">
      <SidebarSuper />
      <div className="main-container">
        <h2 className="page-title">Verify Accounts</h2>
        <p className="page-subtitle">
          Review pending user accounts and approve or reject.
        </p>

        {accounts.length === 0 ? (
          <p>ไม่มีบัญชีที่รอการตรวจ</p>
        ) : (
          <table className="verify-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name / Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, index) => (
                <tr key={acc._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="col-name">{acc.name}</div>
                    <div className="col-sub">{acc.email}</div>
                  </td>
                  <td>{acc.role}</td>
                  <td>
                    <span className={`status-badge ${acc.status.toLowerCase()}`}>
                      {acc.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      className="btn-secondary"
                      onClick={() => handleStartReview(acc._id)}
                    >
                      View
                    </button>
                    <button
                      className="btn-approve"
                      onClick={() => onApprove(acc._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => onReject(acc._id)}
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
