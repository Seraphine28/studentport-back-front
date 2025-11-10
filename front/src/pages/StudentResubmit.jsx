// src/pages/StudentResubmit.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileInput from "../components/FileInput";
import { validateFiles } from "../utils/validators";
import { resubmitPortfolio } from "../api/resubmit";
import { getMyPortfolios } from "../api/portfolio"; // ดึง /mine

const YEAR_OPTIONS = ["2020", "2021", "2022", "2023", "2024", "2025"];
const CATEGORY_OPTIONS = [
  "AI", "ML", "BI", "QA", "UX/UI", "Database", "Software Engineering",
  "IOT", "Gaming", "Web Development", "Coding", "Data Science",
  "Hackathon", "Bigdata", "Data Analytics"
];

export default function StudentResubmit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    university: "KMUTT",
    year: "",
    category: "",
    description: "",
    files: [],
  });
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // โหลดพอร์ตที่ reject แล้วมาแก้ไข
  useEffect(() => {
    const token = localStorage.getItem("token") || undefined;
    let alive = true;
    (async () => {
      try {
        const allPortfolios = await getMyPortfolios(token);
        if (!alive) return;

        const data = allPortfolios.find(p => p._id === id && p.status === "rejected");
        if (!data) {
          setError("Portfolio นี้ไม่สามารถแก้ไขได้หรือไม่พบข้อมูล");
          return;
        }

        setForm({
          title: data.title || "",
          university: data.university || "KMUTT",
          year: String(data.year || ""),
          category: data.category || "",
          description: data.desc || "",
          files: Array.isArray(data.files) ? data.files : [],
        });

        if (data.cover_img) {
          setCoverImage(data.cover_img);
        }
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูล Portfolio ได้");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const onFilesChange = (files) => setForm((f) => ({ ...f, files }));

  function buildFormData() {
    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("university", form.university);
    fd.append("year", form.year);
    fd.append("category", form.category);
    fd.append("desc", form.description);
    fd.append("submit", "true");

    if (coverImage instanceof File) fd.append("cover_img", coverImage);
    form.files.forEach((file) => fd.append("portfolioFiles", file));

    return fd;
  }

  function validateBeforeSend() {
    if (!form.title.trim()) return "กรุณากรอก Title";
    if (!YEAR_OPTIONS.includes(String(form.year))) return "กรุณาเลือกปีให้ถูกต้อง (2020–2025)";
    if (!CATEGORY_OPTIONS.includes(form.category)) return "กรุณาเลือก Category ให้ถูกต้อง";

    const fileCheck = validateFiles(form.files);
    if (!fileCheck.ok) return fileCheck.msg;

    if (!coverImage) return "กรุณาเลือก Cover Image";

    return "";
  }

  const handleResubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || undefined;

    const errMsg = validateBeforeSend();
    if (errMsg) return setError(errMsg);

    setLoading(true);
    setError("");

    try {
      const fd = buildFormData();
      await resubmitPortfolio(id, fd, token);
      navigate("/student/status");
    } catch (err) {
      setError(err.message || "Resubmit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fd9061",
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
          background: "#fd9061",
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
          Resubmit Portfolio
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

        <form onSubmit={handleResubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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

          {/* Cover Image */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>
              Cover Image (Only image):
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0] || coverImage)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                background: "#fff",
              }}
            />
            {coverImage && typeof coverImage === "string" && (
              <img
                src={coverImage}
                alt="Current cover"
                style={{ marginTop: 8, maxHeight: 150, borderRadius: 8 }}
              />
            )}
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

          {/* Submit */}
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
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
              {loading ? "Resubmitting..." : "Resubmit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
