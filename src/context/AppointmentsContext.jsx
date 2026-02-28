import React, { createContext, useContext, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const AppointmentsContext = createContext();

// We'll use a callback pattern to avoid circular dependency
let notificationCallback = null;

export function setNotificationCallback(callback) {
  notificationCallback = callback;
}

export function AppointmentsProvider({ children }) {
  const { users = [], currentUser, token } = useAuth();
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const [appointments, setAppointments] = useState(() => {
    const s = localStorage.getItem("appointments");
    return s ? JSON.parse(s) : [];
  });

  const counselors = useMemo(() => (users || []).filter(u => u.role === "counselor"), [users]);

  const autoAssignCounselorId = (student) => {
    // Try find counselor with matching college, else first available counselor
    const byCollege = counselors.find(c => c.college && c.college === student.college);
    return (byCollege || counselors[0] || {}).id || null;
  };

  const createAppointment = async ({ student, form }) => {
    const preferredSlots = Array.isArray(form.preferredSlots) ? form.preferredSlots : (form.timeSlot ? [form.timeSlot] : []);

    const response = await fetch(`${apiBase}/api/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        preferredDate: form.date,
        preferredSlots,
        isUrgent: form.isUrgent,
        phoneNumber: form.phoneNumber,
        reason: form.reason,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Failed to submit appointment" };
    }

    return { success: true, appointment: data };
  };

  const updateAppointment = (id, updater) => {
    setAppointments(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...updater, updatedAt: new Date().toISOString() } : a);
      localStorage.setItem("appointments", JSON.stringify(next));
      return next;
    });
  };

  const fetchAppointments = async () => {
    const response = await fetch(`${apiBase}/api/appointments`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Unable to load appointments");
    }
    return data;
  };

  const acceptAppointment = async ({ id, date = null, timeSlot = null, note = null }) => {
    const response = await fetch(`${apiBase}/api/appointments/${id}/accept`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ date, timeSlot, note }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Unable to accept appointment" };
    }
    return { success: true };
  };

  const rescheduleAppointment = async ({ id, date, timeSlot, note = null }) => {
    const response = await fetch(`${apiBase}/api/appointments/${id}/reschedule`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ date, timeSlot, note }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Unable to reschedule appointment" };
    }
    return { success: true };
  };

  const rejectAppointment = async ({ id, note = null }) => {
    const response = await fetch(`${apiBase}/api/appointments/${id}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ note }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Unable to reject appointment" };
    }
    return { success: true };
  };

  const getAppointmentsForCurrentUser = () => appointments;

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
      fetchAppointments,
      saveSessionForm,
    }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentsContext);
}
