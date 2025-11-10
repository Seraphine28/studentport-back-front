import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileInput from "../components/FileInput";
import { validateFiles } from "../utils/validators";
import { uploadPortfolio } from "../api/upload";
import { editPortfolio } from "../api/edit";
import { getPortfolio } from "../api/portfolio";

const YEAR_OPTIONS = ["2020", "2021", "2022", "2023", "2024", "2025"];
const CATEGORY_OPTIONS = [
  "AI", "ML", "BI", "QA", "UX/UI", "Database", "Software Engineering",
  "IOT", "Gaming", "Web Development", "Coding", "Data Science",
  "Hackathon", "Bigdata", "Data Analytics"
];

export default function EditPortfolio() {
  const navigate = useNavigate();
  const { id } = useParams(); // รับ id จาก URL เช่น /student/edit/:id

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

  // 🔹 โหลดข้อมูล draft เดิมจาก backend
  useEffect(() => {
  const token = localStorage.getItem("token");

  // ถ้ายังไม่มี id ให้ return
  if (!id) {
    console.log("No portfolio id yet, start with empty form");
    return;
  }

  async function fetchData() {
    try {
      const data = await getPortfolio(id, token);

      setForm({
        title: data.title || "",
        university: data.university || "KMUTT",
        year: data.year || "",
        category: data.category || "",
        description: data.desc || "",
        files: data.portfolioFiles || [], // ถ้า undefined ให้เป็น array ว่าง
      });

      setCoverImage(data.cover_img || null);
    } catch (err) {
      console.error("Load draft error:", err);
      setError("ไม่สามารถโหลดข้อมูลได้");
      // fallback: form ว่างเหมือนหน้า upload
      setForm({
        title: "",
        university: "KMUTT",
        year: "",
        category: "",
        description: "",
        files: [],
      });
      setCoverImage(null);
    }
  }

  fetchData();
}, [id]);


  const onFilesChange = (files) => setForm((f) => ({ ...f, files }));

  function buildFormData(submitFlag) {
    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("university", form.university);
    fd.append("year", form.year);
    fd.append("category", form.category);
    fd.append("desc", form.description);
    fd.append("submit", submitFlag);

    if (coverImage) fd.append("cover_img", coverImage);
    form.files.forEach((file) => fd.append("portfolioFiles", file));
    return fd;
  }

  function validateBeforeSend() {
    if (!form.title.trim()) return "กรุณากรอก Title";
    if (!YEAR_OPTIONS.includes(String(form.year))) return "กรุณาเลือกปีให้ถูกต้อง (2020–2025)";
    if (!CATEGORY_OPTIONS.includes(form.category)) return "กรุณาเลือก Category ให้ถูกต้อง";

    const fileCheck = validateFiles(form.files);
    if (!fileCheck.ok) return fileCheck.msg;
    return "";
  }

  async function send(submitFlag) {
    const token = localStorage.getItem("token") || undefined;

    try {
      setLoading(true);
      setError("");

      if (submitFlag === "true") {
        const errMsg = validateBeforeSend();
        if (errMsg) throw new Error(errMsg);
        if (!coverImage) throw new Error("กรุณาเลือก Cover Image");
      }

      const fd = buildFormData(submitFlag);

      // 🔹 ถ้า draft → PUT (แก้ของเดิม)
      // 🔹 ถ้า upload → POST (สร้างใหม่)
      const res =
        submitFlag === "true"
          ? await uploadPortfolio(fd, token)
          : await editPortfolio(id, fd, token);

      if (submitFlag === "true") {
        navigate("/student/status");
      } else {
        navigate("/student/home");
      }
    } catch (e) {
      setError(e.message || "เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setLoading(false);
    }
  }

  const handleDraft = () => send("false");
  const handleUpload = (e) => {
    e.preventDefault();
    send("true");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fd9061",
        display: "flex",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 1000, background: "#fd9061", padding: 20, borderRadius: 12 }}>
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
          }}
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
          }}
        >
          Edit Portfolio
        </h2>

        {error && (
          <div style={{
            marginBottom: 12,
            padding: "10px 12px",
            borderRadius: 8,
            background: "#ffe6e6",
            color: "#c62828",
            border: "1px solid #ffffffff",
            fontSize: 14,
          }}>
          {error}
        </div>
        )}
        <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 8 }}>Title :</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="เช่น Smart IoT Home Controller"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
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

          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Year :</label>
            <select
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
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

          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>
              Cover Image (Only image):
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0] || null)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
              }}
            />
          </div>

          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Attach Files:</label>
            <FileInput files={form.files || []} onChange={onFilesChange} />
          </div>

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
                background: "#fff",
              }}
            />
          </div>

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
                background: "#c2bcbc",
                border: "1px solid #c0bdbdff",
              }}
            >
              {loading ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                fontSize: 16,
                background: "#5b8db8",
                color: "#fff",
                border: "1px solid #c0bdbdff",
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
