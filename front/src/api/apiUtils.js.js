// src/api/utils.js

export const BASE_URL = "http://127.0.0.1:3000"; // 🚨 URL ฐานของ Backend

export function getAuthHeader() {
    const token = localStorage.getItem('authToken'); // ดึง Token จาก Local Storage
    if (!token) {
        throw new Error("Authentication Failed: No token found. Please log in.");
    }
    return {
        'Authorization': `Bearer ${token}`,
    };
}