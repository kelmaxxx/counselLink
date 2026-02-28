import { query } from "../config/db.js";

const normalizeDate = (value) => {
  if (!value) return null;
  if (typeof value === "string" && value.includes("T")) {
    return value.split("T")[0];
  }
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  return value;
};

export const acceptAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, timeSlot, note } = req.body;
  const counselorId = req.user?.id;

  if (!date || !timeSlot) {
    return res.status(400).json({ message: "Date and time slot are required" });
  }

  const normalizedDate = normalizeDate(date);

  await query(
    "UPDATE appointments SET status='approved', counselor_id=?, scheduled_date=?, scheduled_time=?, counselor_action_note=?, updated_at=NOW() WHERE id=?",
    [counselorId, normalizedDate, timeSlot, note || null, id]
  );

  return res.json({ message: "Appointment approved" });
};

export const rejectAppointment = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const counselorId = req.user?.id;

  await query(
    "UPDATE appointments SET status='rejected', counselor_id=?, counselor_action_note=?, updated_at=NOW() WHERE id=?",
    [counselorId, note || null, id]
  );

  return res.json({ message: "Appointment rejected" });
};

export const rescheduleAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, timeSlot, note } = req.body;
  const counselorId = req.user?.id;

  if (!date || !timeSlot) {
    return res.status(400).json({ message: "Date and time slot are required" });
  }

  const normalizedDate = normalizeDate(date);

  await query(
    "UPDATE appointments SET status='rescheduled', counselor_id=?, scheduled_date=?, scheduled_time=?, counselor_action_note=?, updated_at=NOW() WHERE id=?",
    [counselorId, normalizedDate, timeSlot, note || null, id]
  );

  return res.json({ message: "Appointment rescheduled" });
};
