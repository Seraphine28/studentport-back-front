import React from "react";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      className="search"
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder || "Search…"}
    />
  );
}
