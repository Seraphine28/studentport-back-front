// =======================================================
// 🚨 API 2: คอมเมนต์
// Endpoint: GET /api/projects/:projectId/comments
// =======================================================
router.get('/projects/:projectId/comments', (req, res) => {
    const projectId = req.params.projectId;

    // 🛑 1. DATABASE LOGIC: ส่วนนี้ต้องถูกแทนที่ด้วยการเชื่อมต่อ DB จริง
    const projectData = mockDbData[projectId];
    
    if (!projectData || !projectData.comments) {
        // หากไม่พบโปรเจกต์ หรือโปรเจกต์ไม่มีคอมเมนต์
        return res.json([]); // ส่ง Array ว่างกลับไป
    }

    // 🛑 2. SUCCESS RESPONSE: ส่ง Array ของคอมเมนต์กลับไป
    res.json(projectData.comments);
});