// src/components/SuperAdmin/SidebarSuper.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./SidebarSuper.css"; // ✅ เพิ่มไฟล์แยก theme ของ Super Admin

export default function SidebarSuper() {
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
        <li><Link to="/super/verify">Verify Portfolio from Advisor</Link></li>
        <li><Link to="/super/verify-acc">Verify Account New User</Link></li>
        <li><Link to="/">Log Out</Link></li>
      </ul>
    </aside>
  );
}

