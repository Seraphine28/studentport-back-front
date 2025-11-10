import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import "./SidebarStu.css";

export default function SidebarStu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage (ข้อมูลที่เก็บไว้หลังการล็อกอิน)
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
  }, []);

  // ถ้ายังไม่มีข้อมูลผู้ใช้ให้แสดงข้อความเตือน
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="circle">{user.name.charAt(0)}</div> {/* แสดงตัวอักษรแรกจากชื่อ */}
        <h3>{user.name}</h3>
        <p className="role">role : {user.role}</p>
      </div>

      <ul className="menu">
        <li><Link to="/student/status">Profile</Link></li>
        <li><Link to="/student/portfolio-form">Upload portfolio</Link></li> {/* ลิงก์ไป UploadPortfolio.jsx */}
        <li><Link to="/logout">Log Out</Link></li>
      </ul>
    </aside>
  );
}
