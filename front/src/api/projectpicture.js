// =======================================================
// 🚨 API 1: รายละเอียดโปรเจกต์และรูปภาพ
// Endpoint: GET /api/projects/:projectId/details
// =======================================================
router.get('/projects/:projectId/details', (req, res) => {
    const projectId = req.params.projectId;

    // 🛑 1. DATABASE LOGIC: ส่วนนี้ต้องถูกแทนที่ด้วยการเชื่อมต่อ DB จริง
    // ใช้ mockDbData เป็นตัวอย่าง
    const project = mockDbData[projectId];

    if (!project) {
        // หากไม่พบโปรเจกต์
        return res.status(404).json({ error: 'Project details not found' });
    }

    // 🛑 2. SUCCESS RESPONSE: ส่งข้อมูลกลับในรูปแบบที่ Frontend คาดหวัง
    res.json({
        id: projectId,
        title: project.title,
        name: project.namr,
        university: project.university,
        year: project.year,
        description: project.description,
        // 💡 สำคัญ: ต้องส่ง Array ของ URL รูปภาพ
        images: project.images
        // เพิ่มฟิลด์อื่นๆ เช่น name, university ที่ Frontend คาดหวัง
    });
});