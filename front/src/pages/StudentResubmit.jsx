// src/pages/StudentResubmit.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileInput from "../components/FileInput";
import { validateFiles } from "../utils/validators";
import { resubmitPortfolio } from "../api/resubmit";
import { getMyPortfolios } from "../api/portfolio";

export default function StudentResubmit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // NOTE: ทำให้ year/category เป็นสตริงเดียว (ให้ตรงกับ back)
  const [form, setForm] = useState({
    title: "",
    university: "KMUTT",
    year: "",
    category: "",
    description: "",
    files: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // popup filter เดิมยังใช้ได้ แต่ internal เป็นสตริง
  const [showYearPopup, setShowYearPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const yearRef = useRef(null);
  const catRef = useRef(null);

  const filters = {
    yearOptions: ["2020", "2021", "2022", "2023", "2024", "2025"],
    categoryOptions: [
      "AI", "ML", "BI", "QA", "UX/UI", "Database", "Software Engineering",
      "IOT", "Gaming", "Web Development", "Coding", "Data Science",
      "Hackathon", "Bigdata", "Data Analytics",
    ],
  };

  // โหลดข้อมูลเดิมมากรอก (ถ้าเรียกไม่ได้ → mock)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getMyPortfolios(id); // ถ้ายังไม่มี endpoint นี้จะ throw
        if (!alive) return;
        setForm((f) => ({
          ...f,
          title: data?.title || "",
          university: data?.university || "KMUTT",
          year: String(data?.year ?? data?.yearOfProject ?? "") || "",
          category: data?.category || "",
          description: data?.desc || data?.description || "",
          files: Array.isArray(data?.files) ? data.files : [],
        }));
      } catch (e) {
        // fallback mock เพื่อให้เทส UI ได้
        if (!alive) return;
        setForm((f) => ({
          ...f,
          title: "Mock Portfolio Title",
          university: "KMUTT",
          year: "2024",
          category: "Design",
          description: "This is mock portfolio content for testing.",
          files: [],
        }));
      }
    })();
    return () => { alive = false; };
  }, [id]);

  // รับไฟล์จาก FileInput
  const handleFileChange = (files) => setForm((s) => ({ ...s, files }));

  // เลือกค่าใน popup (ทำเป็นสตริงเดียว)
  const renderSingleSelect = (label, value, setValue, show, setShow, options, ref) => (
    <div
      ref={ref}
      style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: 6, fontSize: 12, position: "relative" }}
    >
      <label style={{ color: "white", marginBottom: 4, fontSize: 20 }}>{label}</label>
      <div style={{ position: "relative", width: "100%" }}>
        <div
          onClick={() => setShow(!show)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
            fontSize: 12,
            boxSizing: "border-box",
          }}
        >
          {value || "Select..."}
          <span
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: show ? "translateY(-50%) rotate(180deg)" : "translateY(-50%) rotate(0deg)",
              fontSize: 12,
              transition: "transform 0.2s",
              userSelect: "none",
            }}
          >
            ▼
          </span>
        </div>

        {show && options && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 8,
              zIndex: 10,
              marginTop: 2,
              maxHeight: 150,
              overflowY: "auto",
            }}
          >
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setValue(opt);
                  setShow(false);
                }}
                style={{
                  padding: "6px 10px",
                  cursor: "pointer",
                  background: value === opt ? "#d8e9ff" : "white",
                  fontWeight: value === opt ? "bold" : "normal",
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ปิด popup เมื่อคลิกนอก
  useEffect(() => {
    const onClick = (e) => {
      if (yearRef.current && !yearRef.current.contains(e.target)) setShowYearPopup(false);
      if (catRef.current && !catRef.current.contains(e.target)) setShowCategoryPopup(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // ส่งฟอร์ม Resubmit → ตรงกับ back: POST /api/portfolio  (files: portfolioFiles)
  const handleResubmit = async (e) => {
    e.preventDefault();

    const v = validateFiles(form.files);
    if (!v.ok) return setError(v.msg);

    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("desc", form.description.trim());
      fd.append("university", form.university || "KMUTT");
      fd.append("year", String(form.year || "").trim());        // back รับชื่อ year
      fd.append("category", String(form.category || "").trim());
      fd.append("submit", "true");                               // ให้เป็น pending

      // ชื่อคีย์ไฟล์ต้องเป็น portfolioFiles ให้ตรงกับ upload.array("portfolioFiles", 10)
      form.files.forEach((file) => fd.append("portfolioFiles", file));

      await resubmitPortfolio(id, fd); // ฟังก์ชันนี้ต้องยิงไปที่ POST /api/portfolio ภายใน
      navigate("/student/home");
    } catch (err) {
      setError(err.message || "Resubmit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#fd9061ff",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        padding: 20,
        fontSize: 20,
        fontFamily: "sans-serif",
      }}
    >
      {/* ปุ่มปิด */}
      <button
        onClick={() => navigate("/student/fail-status-error")}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          border: "none",
          background: "transparent",
          fontSize: 50,
          fontWeight: "bold",
          cursor: "pointer",
          color: "#ffffffff",
        }}
      >
        ×
      </button>

      <div
        style={{
          width: "100%",
          maxWidth: 1000,
          height: "100%",
          backgroundColor: "#fd9061ff",
          borderRadius: 12,
          padding: 20,
          boxSizing: "border-box",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <style>
          {`
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 4px; }
            ::-webkit-scrollbar-thumb { background-color: #85a2bfff; border-radius: 4px; }
          `}
        </style>

        <h2
          style={{
            textAlign: "center",
            color: "#050403ff",
            marginBottom: 10,
            fontSize: 55,
            fontWeight: "bold",
            fontFamily: "Poppins",
          }}
        >
          Edit Portfolio
        </h2>

        {error && <div style={{ color: "red", marginBottom: 15 }}>{error}</div>}

        <form onSubmit={handleResubmit} style={{ display: "flex", flexDirection: "column" }}>
          {/* Title */}
          <div style={{ marginBottom: 6 }}>
            <label style={{ color: "white", display: "block", marginBottom: 4 }}>Title :</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          {/* University */}
          <div style={{ marginBottom: 10, color: "white" }}>
            <label>University:</label>
            <input
              type="text"
              value={form.university}
              readOnly
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          {/* Year / Category (single-select) */}
          {renderSingleSelect("Year of project/work/prize :", form.year, (v) => setForm({ ...form, year: v }),
            showYearPopup, setShowYearPopup, filters.yearOptions, yearRef)}

          {renderSingleSelect("Category :", form.category, (v) => setForm({ ...form, category: v }),
            showCategoryPopup, setShowCategoryPopup, filters.categoryOptions, catRef)}

          {/* Files */}
          <div style={{ marginBottom: 6 }}>
            <label style={{ color: "white", display: "block", marginBottom: 4 }}>
              Attach Files (at least one picture max ten picture) :
            </label>
            <FileInput files={form.files} onChange={handleFileChange} />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 6 }}>
            <label style={{ color: "white", display: "block", marginBottom: 4 }}>Description :</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          {/* Submit */}
          <div style={{ margin: "0 auto", marginTop: 15 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: 220,
                padding: 10,
                borderRadius: 8,
                fontSize: 16,
                border: "1px solid #edd54eff",
                background: "#ffd900ff",
                color: "#000000ff",
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
