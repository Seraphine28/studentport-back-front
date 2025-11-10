import React, { useEffect, useState } from "react";
import "./UserApprovalDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import { getUserAdminView, approveUser, rejectUser } from "../../api/adminApi";

export default function UserApprovalDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // /super/user-approval/:id

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลจริงจาก API
  useEffect(() => {
    (async () => {
      try {
        const data = await getUserAdminView(id);
        setUser({
          role: data.role,
          firstName: data.firstName || data.givenName || "",
          lastName: data.lastName || data.familyName || "",
          email: data.email || "",
          password: "********",
          cardUrl: data.cardUrl || "",
          submittedAt: data.createdAt
            ? new Date(data.createdAt).toLocaleString()
            : "-",
          forwardedStatus: data.status || "Pending",
        });
      } catch (e) {
        console.error("Load user detail error:", e);
        alert("ไม่สามารถโหลดข้อมูลผู้ใช้ได้ (อาจต้องมี token หรือ route ผิด)");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleApprove = async () => {
    try {
      await approveUser(id);
      alert("✅ Approved user!");
      navigate(-1);
    } catch (e) {
      console.error(e);
      alert("❌ Approve failed (อาจไม่มี token)");
    }
  };

  const handleReject = async () => {
    const ok = window.confirm("ยืนยัน Reject ผู้ใช้นี้?");
    if (!ok) return;
    try {
      await rejectUser(id);
      alert("❌ Rejected user!");
      navigate(-1);
    } catch (e) {
      console.error(e);
      alert("❌ Reject failed (อาจไม่มี token)");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>ไม่พบข้อมูลผู้ใช้</p>;

  const isStudent = user.role === "Student";

  return (
    <div className="approval-page theme-student">
      <div className="approval-header">
        <h1>{isStudent ? "Student" : "Recruiter"} Account Verification</h1>
        <div className="header-row">
          <div>
            Forwarded Status: <b>{user.forwardedStatus}</b> · Submitted at:{" "}
            {user.submittedAt}
          </div>
          <button className="back-link" onClick={() => navigate(-1)}>
            ⬅️ Back
          </button>
        </div>
      </div>

      <div className="approval-card">
        <div className="form-row">
          <div className="form-item">
            <label>Role :</label>
            <input readOnly value={user.role} />
          </div>
        </div>

        <div className="form-row two">
          <div className="form-item">
            <label>First name :</label>
            <input readOnly value={user.firstName} />
          </div>
          <div className="form-item">
            <label>Surname :</label>
            <input readOnly value={user.lastName} />
          </div>
        </div>

        <div className="form-row two">
          <div className="form-item">
            <label>Email Address (Organization) :</label>
            <input readOnly value={user.email} />
          </div>
          <div className="form-item">
            <label>Password :</label>
            <input readOnly type="password" value={user.password} />
          </div>
        </div>

        <div className="form-row">
          <label className="block-label">
            {isStudent
              ? "Attach your student ID card :"
              : "Attach your employee ID card :"}
          </label>

          {user.cardUrl ? (
            <div className="card-box">
              <div className="card-box-inner">
                <img src={user.cardUrl} alt="User Card" />
                <div className="card-caption">User Card</div>
              </div>
            </div>
          ) : (
            <p>No card uploaded</p>
          )}
        </div>

        <div className="action-row">
          <button className="btn btn-approve" onClick={handleApprove}>
            Approve
          </button>
          <button className="btn btn-reject" onClick={handleReject}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
