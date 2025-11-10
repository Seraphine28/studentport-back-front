import React from "react";

export default function FileInput({ files, onChange }) {
  const handleChange = (e) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 10 * 1024 * 1024;
    let newFiles = Array.from(e.target.files);

  // filter ไฟล์ไม่รองรับ
    const invalidFiles = newFiles.filter(f => !allowedTypes.includes(f.type));
    const largeFiles = newFiles.filter(f => f.size > maxSize);
    if (invalidFiles.length > 0) {
        alert("ชนิดไฟล์ไม่รองรับ");
    }
    if (largeFiles.length > 0) {
      alert("ไฟล์ใหญ่เกิน 10MB ");
    }

  // ตัดไฟล์ไม่รองรับออก
    newFiles = newFiles.filter(f => allowedTypes.includes(f.type));
    let combinedFiles = [...files, ...newFiles];

    if (combinedFiles.length > 10) {
      alert("เลือกไฟล์ได้ไม่เกิน 10 ไฟล์");
      combinedFiles = combinedFiles.slice(0, 10);
    }

    onChange(combinedFiles);
  };

  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={handleChange}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          background: "#fff",
          boxSizing: "border-box",
          marginBottom: 10,
        }}
      />

      {files.length > 0 && (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {files.map((file, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#d3d3d3ff",
                padding: "3px 6px",
                borderRadius: 6,
                fontSize: 12
              }}
            >
              <span style={{ marginRight: 5 }}>{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




