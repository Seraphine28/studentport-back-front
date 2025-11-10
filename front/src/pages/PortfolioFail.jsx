// src/pages/PortfolioFail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileInput from "../components/FileInput"; // ถ้าอยากใช้ preview แบบ UploadPortfolio
import { getFailPortfolio } from "../api/fail"; // API ที่เราสร้างไว้

// ตัวเลือกเหมือน UploadPortfolio
const YEAR_OPTIONS = ["2020", "2021", "2022", "2023", "2024", "2025"];
const CATEGORY_OPTIONS = [
  "AI", "ML", "BI", "QA", "UX/UI", "Database", "Software Engineering",
  "IOT", "Gaming", "Web Development", "Coding", "Data Science",
  "Hackathon", "Bigdata", "Data Analytics"
];

export default function PortfolioFail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    title: "",
    university: "",
    year: "",
    category: "",
    description: "",
    feedback: "",
    coverImage: null,
    files: [],
  });

  useEffect(() => {
    let alive = true;
    const token = localStorage.getItem("token");

    (async () => {
      setLoading(true);
      setError("");
      try {
        const p = await getFailPortfolio(id, token);
        if (!alive) return;

        setData({
          title: p?.title ?? "",
          university: p?.university ?? p?.owner?.university ?? "",
          year: p?.year ?? p?.yearOfProject ?? "",
          category: p?.category ?? "",
          description: p?.desc ?? p?.description ?? "",
          feedback: p?.feedback ?? "(no feedback provided)",
          coverImage: p?.cover_img ?? null,
          files: Array.isArray(p?.files) ? p.files : [],
        });
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Failed to load rejected portfolio");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Loading…</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        backgroundColor: "#fd9061",
        fontFamily: "sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1000,
          backgroundColor: "#fd9061",
          borderRadius: 12,
          padding: 20,
          position: "relative",
        }}
      >
        {/* ปุ่ม resubmit */}
        <button
          onClick={() => navigate(`/student/resubmit/${id}`)}
          style={{
            position: "absolute",
            top: -5,
            right: 15,
            background: "transparent",
            border: "none",
            fontSize: 32,
            cursor: "pointer",
            lineHeight: 1,
          }}
          title="Resubmit"
          aria-label="Resubmit"
        >
          ✒️
        </button>

        <h2
          style={{
            textAlign: "center",
            color: "#000",
            marginBottom: 16,
            fontSize: 52,
            fontWeight: "bold",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Fail Status Error
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

        {/* Feedback */}
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #eee",
          }}
        >
          <strong>Feedback:</strong>
          <p style={{ marginTop: 6 }}>{data.feedback}</p>
        </div>

        {/* Form fields (readOnly) */}
        <Field label="Title" value={data.title} />
        <Field label="University" value={data.university} />
        <Field label="Year" value={data.year} />
        <Field label="Category" value={data.category} />

        {/* Cover Image */}
<div style={{ marginBottom: 12 }}>
  <label style={{ color: "#fff", display: "block", marginBottom: 6 }}>
    Cover Image:
  </label>
  {data.coverImage ? (
    <img
      src={data.coverImage}
      alt="Cover"
      style={{ maxWidth: "100%", borderRadius: 8, border: "1px solid #ccc" }}
    />
  ) : (
    <div
      style={{
        color: "#222",
        background: "#fff",
        padding: 8,
        borderRadius: 6,
        border: "1px solid #ccc",
      }}
    >
      (no cover image)
    </div>
  )}
</div>


        {/* Files */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Attached Files:</label>
          {data.files.length === 0 ? (
            <div style={{ color: "#222", background: "#fff", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}>
              (no attached files)
            </div>
          ) : (
            <ul style={{ paddingLeft: 20 }}>
              {data.files.map((f, idx) => {
                const name = typeof f === "string" ? f.split("/").slice(-1)[0] : f?.name || `file_${idx+1}`;
                const url  = typeof f === "string" ? f : f?.url || "#";
                return (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noreferrer">{name}</a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Description:</label>
          <textarea
            value={data.description}
            readOnly
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              resize: "none",
              minHeight: 100,
            }}
          />
        </div>

        {/* OK button */}
        <button
          onClick={() => navigate("/student/status")}
          style={{
            display: "block",
            margin: "0 auto",
            backgroundColor: "#419463",
            border: "none",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 6, color: "#fff" }}>{label} :</label>
      <input
        type="text"
        value={value}
        readOnly
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "#fff",
        }}
      />
    </div>
  );
}
