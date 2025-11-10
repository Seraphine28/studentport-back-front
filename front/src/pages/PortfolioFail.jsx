// src/pages/PortfolioFail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "";

export default function PortfolioFail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [data, setData]         = useState({
    title: "",
    university: "",
    year: "",
    category: "",
    description: "",
    feedback: "",
    files: [],            // ✅ กัน map error
  });

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        // ✅ ฝั่ง back มี GET /api/portfolio/detail/:id (ต้อง login)
        // ถ้าระบบมี JWT ให้ใส่ header Authorization ตรงนี้ได้
        const res = await fetch(`${API_BASE}/api/portfolio/detail/${id}`, {
          // headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Fetch failed (${res.status}). ${text.slice(0,160)}`);
        }

        const p = await res.json(); // ตัวเดียว (ไม่ใช่ array)
        if (!alive) return;

        setData({
          title:       p?.title ?? "",
          university:  p?.university ?? p?.owner?.university ?? "",
          year:        p?.year ?? p?.yearOfProject ?? "",
          category:    p?.category ?? "",
          description: p?.desc ?? p?.description ?? "",
          feedback:    p?.feedback ?? "(no feedback provided)",
          files:       Array.isArray(p?.files) ? p.files : [],   // ✅ ป้องกัน map error
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
          maxWidth: 720,
          backgroundColor: "#fd9061",
          borderRadius: 12,
          padding: 20,
          position: "relative",
        }}
      >
        {/* ปุ่มกลับไปแก้/ส่งใหม่ */}
        <button
          onClick={() => navigate(`/student/resubmit/${id}`)}
          style={{
            position: "absolute",
            top: -35,
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

        {/* title */}
        <h2
          style={{
            textAlign: "center",
            color: "#000",
            marginBottom: 12,
            fontSize: 42,
            fontWeight: 800,
          }}
        >
          Fail Status Error
        </h2>

        {/* error */}
        {error && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #f44336",
              color: "#b71c1c",
              padding: 10,
              borderRadius: 8,
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* feedback */}
        <div
          style={{
            width: "100%",
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

        {/* fields */}
        <Field label="Title" value={data.title} />
        <Field label="University" value={data.university} />
        <Field label="Year" value={data.year} />
        <Field label="Category" value={data.category} />

        {/* files */}
        <div style={{ marginBottom: 12, color: "#fff" }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Attached Files:
          </label>
          {data.files.length === 0 ? (
            <div style={{ color: "#222", background: "#fff", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}>
              (no attached files)
            </div>
          ) : (
            <ul style={{ paddingLeft: 20 }}>
              {data.files.map((f, idx) => {
                // รองรับทั้ง array เป็น string path หรือ object {name,url}
                const name = typeof f === "string" ? f.split("/").slice(-1)[0] : f?.name || `file_${idx+1}`;
                const url  = typeof f === "string" ? f : f?.url || "#";
                return (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noreferrer">
                      {name}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* description */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: "#fff", marginBottom: 6, display: "block" }}>
            Description:
          </label>
          <textarea
            value={data.description}
            readOnly
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
              resize: "none",
              background: "#fff",
              minHeight: 100,
            }}
          />
        </div>

        {/* OK */}
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

/** input readOnly สวย ๆ */
function Field({ label, value }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ color: "#fff", marginBottom: 6, display: "block" }}>
        {label} :
      </label>
      <input
        type="text"
        value={value}
        readOnly
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "#fff",
        }}
      />
    </div>
  );
}
