import React, { createContext, useContext, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const AppointmentsContext = createContext();

// We'll use a callback pattern to avoid circular dependency
let notificationCallback = null;

export function setNotificationCallback(callback) {
  notificationCallback = callback;
}

export function AppointmentsProvider({ children }) {
  const { users, currentUser } = useAuth();
  const [appointments, setAppointments] = useState(() => {
    const s = localStorage.getItem("appointments");
    return s ? JSON.parse(s) : [];
  });

  const counselors = useMemo(() => users.filter(u => u.role === "counselor"), [users]);

  const autoAssignCounselorId = (student) => {
    // Try find counselor with matching college, else first available counselor
    const byCollege = counselors.find(c => c.college && c.college === student.college);
    return (byCollege || counselors[0] || {}).id || null;
  };

  const createAppointment = ({ student, form }) => {
    const id = appointments.reduce((m, a) => Math.max(m, a.id || 0), 0) + 1;
    const controlNo = `APT-${Date.now()}`;
    const counselorId = autoAssignCounselorId(student);

    const preferredSlots = Array.isArray(form.preferredSlots) ? form.preferredSlots : (form.timeSlot ? [form.timeSlot] : []);

    const appt = {
      id,
      controlNo,
      status: "pending",
      isUrgent: !!form.isUrgent,
      reason: form.reason || "",
      phoneNumber: form.phoneNumber || "",
      preferredDate: form.date,
      timeSlot: form.timeSlot || null,
      preferredSlots,
      scheduledDate: null, // set when accepted/rescheduled
      scheduledTimeSlot: null,
      studentId: student.studentId,
      studentUserId: student.id,
      studentName: student.name,
      college: student.college || null,
      counselorId,
      note: null,
      intakeForm: {
        dateToday: new Date().toISOString().split('T')[0],
        nameOptional: form.nameOptional || "",
        idNo: student.studentId,
        college: student.college || null,
        phoneNumber: form.phoneNumber || "",
        preferredAppointmentDate: form.date,
        isUrgent: !!form.isUrgent,
        preferredSlots,
        studentSignature: null,
        authorizedSignature: null,
      },
      sessionForm: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAppointments((prev) => {
      const next = [appt, ...prev];
      localStorage.setItem("appointments", JSON.stringify(next));
      return next;
    });
    
    // Notify counselor
    if (notificationCallback && counselorId) {
      notificationCallback({
        recipientId: counselorId,
        title: "New Appointment Request",
        message: `${student.name} has requested an appointment for ${form.date}.`,
        type: "info",
        link: "/counselor/appointments"
      });
    }
    
    return { success: true, appointment: appt };
  };

  const updateAppointment = (id, updater) => {
    setAppointments(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...updater, updatedAt: new Date().toISOString() } : a);
      localStorage.setItem("appointments", JSON.stringify(next));
      return next;
    });
  };

  const acceptAppointment = ({ id, date = null, timeSlot = null, note = null }) => {
    const appt = appointments.find(a => a.id === id);
    updateAppointment(id, { status: "accepted", scheduledDate: date, scheduledTimeSlot: timeSlot, note });
    
    // Notify student
    if (notificationCallback && appt) {
      notificationCallback({
        recipientId: appt.studentUserId,
        title: "Appointment Accepted",
        message: `Your appointment request for ${date || appt.preferredDate} has been accepted.`,
        type: "success",
        link: "/"
      });
    }
    
    return { success: true };
  };

  const rescheduleAppointment = ({ id, date, timeSlot, note = null }) => {
    const appt = appointments.find(a => a.id === id);
    updateAppointment(id, { status: "rescheduled", scheduledDate: date, scheduledTimeSlot: timeSlot, note });
    
    // Notify student
    if (notificationCallback && appt) {
      notificationCallback({
        recipientId: appt.studentUserId,
        title: "Appointment Rescheduled",
        message: `Your appointment has been rescheduled to ${date} at ${timeSlot}.${note ? ' Note: ' + note : ''}`,
        type: "warning",
        link: "/"
      });
    }
    
    return { success: true };
  };

  const rejectAppointment = ({ id, note = null }) => {
    const appt = appointments.find(a => a.id === id);
    updateAppointment(id, { status: "rejected", note });
    
    // Notify student
    if (notificationCallback && appt) {
      notificationCallback({
        recipientId: appt.studentUserId,
        title: "Appointment Rejected",
        message: `Your appointment request has been rejected.${note ? ' Reason: ' + note : ''}`,
        type: "error",
        link: "/"
      });
    }
    
    return { success: true };
  };

  const getAppointmentsForCurrentUser = () => {
    if (!currentUser) return [];
    if (currentUser.role === "student") {
      return appointments.filter(a => a.studentUserId === currentUser.id);
    }
    if (currentUser.role === "counselor") {
      return appointments.filter(a => a.counselorId === currentUser.id);
    }
    // admins/others see all
    return appointments;
  };

  const saveSessionForm = (id, data) => {
    updateAppointment(id, { sessionForm: data });
    return { success: true };
  };

  return (
    <AppointmentsContext.Provider value={{
      appointments,
      createAppointment,
      acceptAppointment,
      rescheduleAppointment,
      rejectAppointment,
      getAppointmentsForCurrentUser,
      saveSessionForm,
    }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentsContext);
}
