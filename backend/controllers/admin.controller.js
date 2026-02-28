import { query } from "../config/db.js";

export const pendingRegistrations = async (_req, res) => {
  const rows = await query(
    "SELECT id, name, email, student_id AS studentId, college, status, cor_url AS corUrl, cor_file_name AS corFileName, cor_file_type AS corFileType FROM users WHERE role='student' AND status='pending_approval'"
  );
  return res.json(rows);
};

export const approveRegistration = async (req, res) => {
  const { id } = req.params;
  const { program, yearLevel } = req.body;

  await query(
    "UPDATE users SET status='approved', program=?, year_level=?, updated_at=NOW() WHERE id = ?",
    [program || null, yearLevel || null, id]
  );
  return res.json({ message: "Approved" });
};

export const rejectRegistration = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  await query(
    "UPDATE users SET status='rejected', rejection_reason=?, updated_at=NOW() WHERE id = ?",
    [reason || null, id]
  );
  return res.json({ message: "Rejected" });
};
