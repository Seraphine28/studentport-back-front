// src/pages/WorkStatusPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import NormalCard from "../components/NormalCard";
import "./StatusPage.css";

import { getMyPortfolios, updateVisibility } from "../api/portfolio";

const USE_BACKEND = String(process.env.REACT_APP_USE_BACKEND || "true").toLowerCase() === "true";

export default function WorkStatusPage({ showControls }) {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // mock โปรไฟล์
  const [profileData] = useState({
    name: "Rainbow Pinky",
    university: "KMUTT",
    contact: "rainbowpink@kmutt.ac.th",
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true); setError("");
      try {
        if (!USE_BACKEND) {
          setProjects([]); return;
        }
        const raw = await getMyPortfolios(/* token */);
        const mapped = raw.map((it) => ({
          id:         it._id || it.id,
          title:      it.title,
          description:it.desc || it.description,
          name:       it.owner?.displayName || "Me",
          university: it.university || it.owner?.university || "KMUTT",
          year:       it.yearOfProject || it.year,
          category:   it.category,
          image:      (it.files && it.files[0]) || (it.images && it.images[0]) || "",
          status:     (it.statusV2 || it.status || "").replace(/_/g," ").replace(/\b\w/g, s=>s.toUpperCase()),
          isPublic:   it.visibility === "public",
        }));
        if (alive) setProjects(mapped);
      } catch (e) {
        if (alive) setError(e.message || "Load portfolios error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    return isEditing
      ? projects.filter((p) => ["Draft","Failed"].includes(p.status))
      : projects;
  }, [isEditing, projects]);

  return (
    <>
      <button
        type="button"
        onClick={() => navigate("/student/home")}
        aria-label="Home"
        style={{ position: "fixed", top: 12, right: 16, background: "transparent", border: 0, fontSize: 40, cursor: "pointer", lineHeight: 1, zIndex: 1000 }}
      >
        🏠
      </button>

      <div className="profile-container">
        <div className="profile-header-wrapper">
          <ProfileHeader
            name={profileData.name}
            university={profileData.university}
            contact={profileData.contact}
            showEdit={isEditing}
            onClickEdit={() => setIsEditing(true)}
            onClickSave={() => setIsEditing(false)}
            showControls={showControls}
          />
        </div>

        {loading && <div style={{ margin: "16px 0" }}>Loading…</div>}
        {error && <div style={{ margin: "16px 0", color: "crimson" }}>{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ margin: "16px 0", color: "#666" }}>
            ไม่มีผลงานให้แสดง
          </div>
        )}

        <main className="status-projects-grid">
          {filtered.map((p) => (
            <NormalCard
              key={p.id}
              {...p}
              onVisibilityChange={async (id, checked) => {
                // optimistic UI
                setProjects((prev) => prev.map(x => x.id === id ? { ...x, isPublic: checked } : x));
                try {
                  await updateVisibility(id, checked /*, token */);
                } catch (e) {
                  // rollback
                  setProjects((prev) => prev.map(x => x.id === id ? { ...x, isPublic: !checked } : x));
                  alert(e.message || "Update visibility failed");
                }
              }}
              editMode={["Draft","Failed"].includes(p.status) && isEditing}
            />
          ))}
        </main>
      </div>
    </>
  );
}
