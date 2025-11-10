import React, { useState } from "react";
import "./UserApprovalDetail.css";
import { useNavigate } from "react-router-dom";


export default function UserApprovalDetail() {
  // mock ข้อมูลตัวอย่าง (เปลี่ยนค่าได้ตามจริง)
  const [user] = useState({
    role: "Student",                 // "Student" หรือ "Recruiter"
    firstName: "Nicha",
    lastName: "Chitonnom",
    email: "nicha.chi@kmutt.ac.th",
    password: "********",
    cardUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Thai_Student_ID_Card_Sample.png/600px-Thai_Student_ID_Card_Sample.png",
    submittedAt: "2025-11-01 13:45",
    forwardedStatus: "In Process",
  });

  const isStudent = user.role === "Student";

  const handleApprove = () => alert("✅ Approved (mock)");
  const handleReject  = () => alert("❌ Rejected (mock)");

  const navigate = useNavigate();

  return (
    <div className="approval-page theme-student">
      <div className="approval-header">
  <h1>Student Account Verification</h1>
  
  <div className="header-row">
    <div>
      Forwarded Status: <b>In Process</b> · Submitted at: 2025-11-01 13:45
    </div>

    <button className="back-link" onClick={() => navigate(-1)}>
      ⬅️ Back
    </button>
  </div>
</div>


      {/* กล่องฟอร์มหลัก */}
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
            {isStudent ? "Attach your student ID card :" : "Attach your employee ID card :"}
          </label>

          <div className="card-box">
            <div className="card-box-inner">
              {/* หากโหลดรูปไม่ขึ้นจะเห็นไอคอนแตกตามตัวอย่างได้ */}
              <img src={user.cardUrl} alt="User Card" />
              <div className="card-caption">User Card</div>
            </div>
          </div>
        </div>

        <div className="action-row">
          <button className="btn btn-approve" onClick={handleApprove}>Approve</button>
          <button className="btn btn-reject" onClick={handleReject}>Reject</button>
        </div>
      </div>
    </div>
  );
}
