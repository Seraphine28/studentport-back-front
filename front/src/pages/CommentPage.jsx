// src/pages/CommentPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./CommentPage.css";

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:5000";
const USE_BACKEND =
  String(process.env.REACT_APP_USE_BACKEND || "true").toLowerCase() === "true";

// แสดง 1 บล็อกคอมเมนต์
function CommentBlock({ author, role, text, initial }) {
  return (
    <div className="comment-block">
      <div className="comment-header">
        <div className="author-initial">{initial || (author?.[0] || "U")}</div>
        <div className="author-info">
          <span className="author-name">{author}</span>
          <span className="author-role">&lt;{role}&gt;</span>
        </div>
      </div>
      <p className="comment-text">{`“${text}”`}</p>
    </div>
  );
}

export default function CommentPage() {
  const { id, projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // โหมด public ถ้า path เป็น /project/:id/public (เราแมพ param ชื่อ id)
  const isPublic = useMemo(() => location.pathname.includes("/public"), [location]);
  const pid = id || projectId;

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);

  const [imgIndex, setImgIndex] = useState(0);

  const [newText, setNewText] = useState("");
  const [posting, setPosting] = useState(false);
  const MAX_LEN = 300; // จำกัดอักขระคอมเมนต์

  // โหลดข้อมูลโปรเจ็กต์ + คอมเมนต์
  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        if (!USE_BACKEND) {
          // mock minimal
          const mock = {
            title: "Project Alpha",
            name: "Rainbow Pinky",
            university: "KMUTT",
            description: "AI research paper on neural networks.",
            images: [
              "https://via.placeholder.com/900x520?text=Image+1",
              "https://via.placeholder.com/900x520?text=Image+2",
              "https://via.placeholder.com/900x520?text=Image+3",
            ],
            comments: [
              { id: 1, author: "Lovely Boy", role: "recruiter", text: "so good", initial: "L" },
              { id: 2, author: "Sunny Kissed", role: "student", text: "OMG", initial: "S" },
              { id: 3, author: "Professor P", role: "lecturer", text: "Excellent potential.", initial: "P" },
            ],
          };
          if (!alive) return;
          setProject(mock);
          setComments(mock.comments);
          setLoading(false);
          return;
        }

        const url = isPublic
          ? `${API_BASE}/api/portfolio/${pid}/public`
          : `${API_BASE}/api/portfolio/detail/${pid}`;

        const res = await fetch(url);
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(`Fetch failed (${res.status}). ${t.slice(0, 120)}`);
        }
        const data = await res.json();

        // map ฟิลด์ให้ตรง
        const mapped = {
          title: data.title,
          name: data.owner?.displayName || data.name || "",
          university: data.owner?.university || data.university || "",
          description: data.description || data.desc || "",
          images: data.images?.length ? data.images.map(x => (x.startsWith("http") ? x : `${API_BASE}${x}`)) : [],
        };
        const mappedComments = (data.comments || []).map((c, i) => ({
          id: c._id || i,
          author: c.user?.displayName || c.author || "Unknown",
          role: c.role || c.user?.role || "guest",
          text: c.text || "",
          initial: (c.user?.displayName || c.author || "U").slice(0, 1).toUpperCase(),
        }));

        if (!alive) return;
        setProject(mapped);
        setComments(mappedComments);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, [pid, isPublic]);

  const total = project?.images?.length || 0;

  const onPost = async (e) => {
    e.preventDefault();
    if (isPublic) return; // โหมด public ไม่ให้โพสต์ (ปรับได้ตามนโยบาย)
    if (!newText.trim() || posting) return;

    setPosting(true);
    try {
      if (!USE_BACKEND) {
        // mock add
        setTimeout(() => {
          setComments(prev => [
            ...prev,
            { id: Date.now(), author: "Current User", role: "student", text: newText.trim(), initial: "C" },
          ]);
          setNewText("");
          setPosting(false);
        }, 250);
        return;
      }

      const res = await fetch(`${API_BASE}/api/portfolio/${pid}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" /* , Authorization: `Bearer ${token}` */ },
        body: JSON.stringify({ text: newText.trim() }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Post failed (${res.status}). ${t.slice(0, 120)}`);
      }
      const data = await res.json();
      // backend คืน comments ทั้งชุด
      const mapped = (data.comments || []).map((c, i) => ({
        id: c._id || i,
        author: c.user?.displayName || "Unknown",
        role: c.role || "guest",
        text: c.text || "",
        initial: (c.user?.displayName || "U").slice(0, 1).toUpperCase(),
      }));
      setComments(mapped);
      setNewText("");
    } catch (err) {
      alert(err.message || "Post comment error");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="loading-page">Loading…</div>;
  if (!project) return <div className="error-page">Project not found.</div>;

  return (
    <div className="comment-page-container">
      <div className="header-row">
        <h2 className="page-title">
          {isPublic ? "Public Project" : "Project Detail"}
        </h2>

        <div className="status-right">
          {/* สถานะ/เวลาส่ง – ถ้ามีข้อมูลก็แสดงได้ที่นี่ */}
          <button className="back-button" onClick={() => navigate(-1)}>
            ⬅️ Back
          </button>
        </div>
      </div>

      <div className="comment-page-grid">
        {/* LEFT: รูป + รายละเอียด */}
        <section className="project-display-section">
          <div className="image-viewer">
            <img
              src={project.images?.[imgIndex] || "https://via.placeholder.com/900x520?text=No+Image"}
              alt={`Project Image ${imgIndex + 1}`}
              className="project-main-image"
            />

            {imgIndex > 0 && (
              <button
                type="button"
                className="nav-button prev-button"
                onClick={() => setImgIndex(i => Math.max(i - 1, 0))}
              >
                ‹
              </button>
            )}
            {imgIndex < total - 1 && (
              <button
                type="button"
                className="nav-button next-button"
                onClick={() =>
                  setImgIndex(i => Math.min(i + 1, (project.images?.length || 1) - 1))
                }
              >
                ›
              </button>
            )}

            <div className="image-pagination">
              {project.images?.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === imgIndex ? "active" : ""}`}
                  onClick={() => setImgIndex(i)}
                />
              ))}
            </div>
          </div>

          <div className="project-details">
            <p><strong>Title:</strong> {project.title}</p>
            <p><strong>Name:</strong> {project.name}</p>
            <p><strong>University:</strong> {project.university}</p>
            <p><strong>Description:</strong> {project.description}</p>
          </div>
        </section>

        {/* RIGHT: คอมเมนต์ + ฟอร์ม */}
        <aside className="comments-section">
          {comments.map((c) => (
            <CommentBlock key={c.id} {...c} />
          ))}

          {/* ฟอร์มคอมเมนต์ — ปิดในโหมด public */}
          {!isPublic && (
            <form className="comment-form" onSubmit={onPost}>
              <textarea
                value={newText}
                onChange={(e) => {
                  const v = e.target.value.slice(0, MAX_LEN);
                  setNewText(v);
                }}
                placeholder="Add your comment here..."
                rows={3}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <small style={{ opacity: 0.7 }}>
                  {newText.length}/{MAX_LEN}
                </small>
                <button type="submit" disabled={!newText.trim() || posting}>
                  {posting ? "Posting…" : "Post Comment"}
                </button>
              </div>
            </form>
          )}

          <div className="comments-placeholder">&lt;comments&gt;</div>
        </aside>
      </div>
    </div>
  );
}
