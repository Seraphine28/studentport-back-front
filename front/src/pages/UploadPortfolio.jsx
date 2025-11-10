// src/pages/UploadPortfolio.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileInput from "../components/FileInput";
import { validateFiles } from "../utils/validators";
import { uploadPortfolio } from "../api/upload";

// ตัวเลือกที่ backend อนุญาต
const YEAR_OPTIONS = ["2020", "2021", "2022", "2023", "2024", "2025"];
const CATEGORY_OPTIONS = [
  "AI", "ML", "BI", "QA", "UX/UI", "Database", "Software Engineering",
  "IOT", "Gaming", "Web Development", "Coding", "Data Science",
  "Hackathon", "Bigdata", "Data Analytics"
];

export default function UploadPortfolio() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    university: "KMUTT",
    year: "",
    category: "",
    description: "",
    files: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onFilesChange = (files) => setForm((f) => ({ ...f, files }));

  function buildFormData(submitFlag /* "true" | "false" */) {
    const fd = new FormData();
    // ชื่อฟิลด์ต้องตรง backend
    fd.append("title", form.title.trim());
    fd.append("university", form.university);
    fd.append("year", form.year);         // backend คาด "year"
    fd.append("category", form.category); // backend คาด "category"
    fd.append("desc", form.description);  // backend คาด "desc"
    form.files.forEach((file) => fd.append("portfolioFiles", file)); // ชื่อคีย์ไฟล์
    fd.append("submit", submitFlag);      // "true" => pending, "false" => draft
    return fd;
  }

  // ตรวจข้อมูลพื้นฐานก่อนส่ง
  function validateBeforeSend(isSubmit) {
    if (!form.title.trim()) return "กรุณากรอก Title";
    if (!YEAR_OPTIONS.includes(String(form.year))) return "กรุณาเลือกปีให้ถูกต้อง (2020–2025)";
    if (!CATEGORY_OPTIONS.includes(form.category)) return "กรุณาเลือก Category ให้ถูกต้อง";

    // ต้องมีอย่างน้อย 1 ไฟล์
    const fileCheck = validateFiles(form.files);
    if (!fileCheck.ok) return fileCheck.msg;

    // ตอน Upload จริง (submit = true) อนุญาตเหมือน draft แต่ถ้าจะเพิ่มเงื่อนไขเพิ่มเติมก็ใส่ที่นี่
    return "";
  }

  async function send(submitFlag) {
    const token = localStorage.getItem("token") || undefined;

    try {
      setLoading(true);
      setError("");

      const errMsg = validateBeforeSend(submitFlag === "true");
      if (errMsg) throw new Error(errMsg);

      const fd = buildFormData(submitFlag);
      const res = await uploadPortfolio(fd, token);
      // res: { message, data }

      if (submitFlag === "true") {
        // อัปโหลดจริง -> ไปหน้าสถานะ/หน้าใดก็ได้
        navigate("/student/status");
      } else {
        // บันทึกดราฟท์ -> กลับหน้า Home (หรือคงอยู่หน้าฟอร์มก็ได้)
        navigate("/student/home");
      }
    } catch (e) {
      setError(e.message || "เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setLoading(false);
    }
  }

  const handleDraft = () => send("false");   // จะถูกบันทึกเป็น status = "draft"
  const handleUpload = (e) => {             // จะถูกบันทึกเป็น status = "pending"
    e.preventDefault();
    send("true");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffc1cc",
        display: "flex",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1000,
          background: "#ffc1cc",
          padding: 20,
          borderRadius: 12,
        }}
      >
        {/* ปุ่มปิด */}
        <button
          onClick={() => navigate("/student/home")}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            border: "none",
            background: "transparent",
            fontSize: 40,
            fontWeight: "bold",
            cursor: "pointer",
            color: "#fff",
            lineHeight: 1,
          }}
          aria-label="close"
          title="Close"
        >
          ×
        </button>

        <h2
          style={{
            textAlign: "center",
            color: "#5b8db8",
            marginBottom: 16,
            fontSize: 52,
            fontWeight: "bold",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Upload Portfolio
        </h2>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#ffe6e6",
              color: "#c62828",
              border: "1px solid #ffcdd2",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Title */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Title :</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="เช่น Smart IoT Home Controller"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                background: "#fff",
              }}
            />
          </div>

          {/* University (read-only) */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>University :</label>
            <input
              value={form.university}
              readOnly
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                background: "#f7f7f7",
                color: "#444",
              }}
            />
          </div>

          {/* Year */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Year of project/work/prize :</label>
            <select
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                background: "#fff",
              }}
            >
              <option value="">Select...</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Category :</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                background: "#fff",
              }}
            >
              <option value="">Select...</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Files */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>
              Attach Files (อย่างน้อย 1 รูป สูงสุด 10 รูป):
            </label>
            <FileInput files={form.files} onChange={onFilesChange} />
          </div>

          {/* Description */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Description :</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="สรุปผลงาน และรายละเอียดสำคัญ"
              rows={5}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                background: "#fff",
                resize: "vertical",
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <button
              type="button"
              onClick={handleDraft}
              disabled={loading}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                fontSize: 16,
                border: "1px solid #c0bdbd",
                background: "#c2bcbc",
                color: "#000",
                cursor: "pointer",
              }}
            >
              {loading ? "Saving..." : "Draft"}
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                fontSize: 16,
                border: "1px solid #5b8db8",
                background: "#5b8db8",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
