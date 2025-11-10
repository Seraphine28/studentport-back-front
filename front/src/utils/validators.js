export function validateFiles(files) {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!files || files.length === 0) return { ok: false, msg: "ต้องเลือกไฟล์อย่างน้อย 1 ไฟล์" };
  if (files.length > 10) return { ok: false, msg: "ไม่เกิน 10 ไฟล์" };
  for (const f of files) {
    if (!allowedTypes.includes(f.type)) return { ok: false, msg: "ชนิดไฟล์ไม่รองรับ" };
    if (f.size > 10 * 1024 * 1024) return { ok: false, msg: "ไฟล์ใหญ่เกิน 10MB" };
  }
  return { ok: true };
}