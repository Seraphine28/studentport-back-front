// src/components/Recruiter/HomeRecruiter.jsx
import React, { useEffect, useMemo, useState } from "react";
import SidebarRecru from "../Recruiter/SidebarRecru";       // ✅ sidebar ฝั่ง Recruiter
import ProjectCard from "../ProjectCard";         // ปรับ path ให้ตรงตำแหน่งไฟล์จริง

const BASE = "http://localhost:3000"; // CRA proxy

export default function HomeRecruiter() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filters (ทำฝั่งหน้า เพราะ back /public ไม่รองรับ query)
  const [q, setQ] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE}/api/portfolio/public`);
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        const data = await res.json();
        if (!alive) return;
        setRaw(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Failed to load portfolios");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const items = useMemo(() => {
    const mapped = raw.map(it => {
      const imgPath = (it.files || []).find(p => /\.(png|jpe?g|gif)$/i.test(p));
      return {
        id: it._id || it.id,
        title: it.title || "",
        name: it.owner?.displayName || "",
        university: it.university || it.owner?.university || "",
        year: it.year ?? "",
        category: it.category || "",
        description: it.desc || it.description || "",
        image: imgPath ? `/${imgPath}` : "", // ต้องเสิร์ฟ static ไฟล์จาก back จึงจะแสดงรูปได้
      };
    });

    return mapped.filter(x => {
      const passQ = !q || (x.title + " " + x.description + " " + x.category)
        .toLowerCase().includes(q.toLowerCase());
      const passYear = !year || String(x.year) === String(year);
      const passCat  = !category || x.category === category;
      return passQ && passYear && passCat;
    });
  }, [raw, q, year, category]);

  return (
    <div className="flex role-recruiter">
      <SidebarRecru />

      <main className="main-content" style={{ marginLeft: 270, padding: 20, width: "100%" }}>
        <div className="top-bar" style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <input
            className="search"
            placeholder="Search title / description / category"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1 }}
          />
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All years</option>
            {["2020","2021","2022","2023","2024","2025"].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {[
              "AI","ML","BI","QA","UX/UI","Database","Software Engineering",
              "IOT","Gaming","Web Development","Coding","Data Science",
              "Hackathon","Bigdata","Data Analytics"
            ].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading && <div>Loading…</div>}
        {error && <div style={{ color: "crimson" }}>{error}</div>}
        {!loading && !error && items.length === 0 && <div>No public portfolios yet</div>}

        <div className="grid">
          {items.map((p) => <ProjectCard key={p.id} {...p} />)}
        </div>
      </main>
    </div>
  );
}
