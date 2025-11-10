// src/api/user.js

import { getAuthHeader, BASE_URL } from './utils';

// GET /api/user - ดึงข้อมูลผู้ใช้ปัจจุบัน
export async function getCurrentUser() {
    try {
        const headers = getAuthHeader();
        const res = await fetch(`${BASE_URL}/api/user`, {
            headers,
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to fetch user data.");
        }
        return await res.json();
    } catch (error) {
        console.error("API Error: getCurrentUser", error);
        throw error;
    }
}