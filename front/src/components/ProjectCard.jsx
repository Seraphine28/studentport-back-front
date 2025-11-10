import React from "react";
import "./NormalCard.css";
import { Link } from "react-router-dom";

export default function ProjectCard({
  id, title, name, university, year, category, description, image,
}) {
  const detailPath = `/project/${id}`; // หน้าอ่าน public

  return (
    <Link
      to={detailPath}
      className="card normal-card"
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
      aria-label={`Open project ${title}`}
    >
      <div className="card-top">
        <h3 className="card-title">{title}</h3>
      </div>

      <img
        src={image || "https://via.placeholder.com/600x320?text=Project"}
        alt={title}
        className="card-img"
        loading="lazy"
      />

      <div className="card-content" style={{ paddingBottom: 16 }}>
        <p><strong>Name:</strong> {name || "-"}</p>
        <p><strong>University:</strong> {university || "-"}</p>
        <p><strong>Year:</strong> {year || "-"}</p>
        <p><strong>Category:</strong> {category || "-"}</p>
        <p className="desc" style={{
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>
          <strong>Description:</strong> {description || "-"}
        </p>
      </div>
    </Link>
  );
}
