// src/components/shared/Filters.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Filter.css"; // ถ้ามีไฟล์สไตล์ของ filters

export default function Filters({ onFilter }) {
  // multi-select
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // popup states
  const [showYearPopup, setShowYearPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

  // refs สำหรับตรวจคลิกนอก
  const yearRef = useRef(null);
  const catRef = useRef(null);

  const years = ["2020", "2021", "2022", "2023", "2024", "2025"];
  const categories = [
    "AI", "ML", "BI", "QA", "UX/UI", "Database", "Software Engineering",
    "IOT", "Gaming", "Web Development", "Coding", "Data Science",
    "Hackathon", "Bigdata", "Data Analytics"
  ];

  // ปิด popup เมื่อคลิกนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (yearRef.current && !yearRef.current.contains(e.target)) setShowYearPopup(false);
      if (catRef.current && !catRef.current.contains(e.target)) setShowCategoryPopup(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // แจ้ง parent ทุกครั้งที่ค่า filter เปลี่ยน
  useEffect(() => {
    onFilter?.(selectedYears, selectedCategories);
  }, [selectedYears, selectedCategories, onFilter]);

  const toggleValue = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const renderMultiFilter = (label, values, setValues, showPopup, setShowPopup, options, ref) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: 8,
        fontSize: 12,
        position: "relative",
        maxWidth: 260
      }}
      ref={ref}
    >
      <label style={{ color: "#333", marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
        {label}
      </label>

      <div style={{ position: "relative", width: "100%" }}>
        {/* ปุ่มเปิด/ปิด popup */}
        <div
          onClick={() => setShowPopup(!showPopup)}
          style={{
            width: "100%",
            padding: "10px 36px 10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "#fff",
            fontSize: 13,
            cursor: "pointer",
            boxSizing: "border-box",
            minHeight: 38,
            display: "flex",
            alignItems: "center"
          }}
        >
          {values.length > 0 ? values.join(", ") : "Select..."}
          <span
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: showPopup ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)",
              fontSize: 12,
              transition: "transform 0.2s",
              userSelect: "none"
            }}
          >
            ▼
          </span>
        </div>

        {/* ตัวเลือก */}
        {showPopup && options?.length > 0 && (
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
              marginTop: 4,
              maxHeight: 180,
              overflowY: "auto",
              boxShadow: "0 6px 14px rgba(0,0,0,0.08)"
            }}
          >
            {options.map((opt) => {
              const isSelected = values.includes(opt);
              return (
                <div
                  key={opt}
                  onClick={() => toggleValue(values, setValues, opt)}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    background: isSelected ? "#eaf2ff" : "#fff",
                    fontWeight: isSelected ? 700 : 400
                  }}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="filters" style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span className="filters-label" style={{ fontWeight: 700, marginRight: 4 }}>Filters:</span>
      {renderMultiFilter("Year", selectedYears, setSelectedYears, showYearPopup, setShowYearPopup, years, yearRef)}
      {renderMultiFilter("Category", selectedCategories, setSelectedCategories, showCategoryPopup, setShowCategoryPopup, categories, catRef)}
    </div>
  );
}

