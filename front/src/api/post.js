router.post('/projects/:projectId/comments', auth, async (req, res) => {
    const projectId = req.params.projectId;
    // ดึงเฉพาะ text จาก body
    const { text } = req.body; 

    if (!text || text.trim() === "") {
        return res.status(400).json({ message: "Comment text is required." });
    }

    try {
        // 🛑 1. DATABASE LOGIC (ส่วนที่เพื่อนคุณต้องเติม)
        // 1.1 บันทึกคอมเมนต์ลง DB โดยใช้ req.user.id และ projectId
        // 1.2 ดึงข้อมูลที่เพิ่งบันทึกมา (หรือสร้าง Object) เพื่อส่งกลับไป

        const newCommentObject = {
             // 💡 ข้อมูลที่ Frontend ต้องใช้ (ดึงจาก req.user)
             id: Math.floor(Math.random() * 1000000), // ใช้ ID จริงจาก DB
             author: req.user.displayName || 'Unknown User', 
             role: req.user.role || 'Student', 
             text: text,
             initial: (req.user.displayName || 'U')[0].toUpperCase(),
        };

        // 🛑 2. SUCCESS RESPONSE: ส่ง Object ที่สมบูรณ์กลับไป
        return res.status(201).json({ 
            message: "Comment added successfully.", 
            data: newCommentObject 
        });

    } catch (err) {
        console.error("Post comment error:", err);
        return res.status(500).json({ message: "Server error during comment post." });
    }
});