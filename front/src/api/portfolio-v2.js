// 🚨 ดึง Portfolio ของตัวเอง (สำหรับ Status/Profile Page)
// GET /api/portfolio/mine (ดึงรายการงานทั้งหมด)
//[cite_start]// ใช้สำหรับแสดง Project Cards ในหน้า Status/Profile [cite: 67, 110]

export async function getMyPortfolios() {
    try {
        const headers = getAuthHeader();
        [cite_start]// Endpoint: /api/portfolio/mine [cite: 67]
        const res = await fetch(`${BASE_URL}/api/portfolio/mine`, { headers }); 

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to fetch user portfolios.");
        }
        return await res.json();
    } catch (error) {
        console.error("API Error: getMyPortfolios", error);
        throw error;
    }
}