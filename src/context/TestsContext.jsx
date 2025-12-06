import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const TestsContext = createContext();

// We'll use a callback pattern to avoid circular dependency
let notificationCallback = null;

export function setTestNotificationCallback(callback) {
  notificationCallback = callback;
}

export function TestsProvider({ children }) {
  const { currentUser } = useAuth();
  const [tests, setTests] = useState(() => {
    const s = localStorage.getItem("psychTests");
    return s ? JSON.parse(s) : [];
  });

  const createTestRequest = ({ student, form }) => {
    const id = tests.reduce((m, t) => Math.max(m, t.id || 0), 0) + 1;
    const controlNo = `PT-${Date.now()}`;
    const req = {
      id,
      controlNo,
      status: "pending",
      studentId: student.studentId,
      studentUserId: student.id,
      studentName: student.name,
      college: student.college || null,
      phoneNumber: form.phoneNumber || "",
      preferredDate: form.date || "",
      preferredSlots: Array.isArray(form.preferredSlots) ? form.preferredSlots : [],
      testType: form.testType || "Psychological Test",
      reason: form.reason || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTests(prev => {
      const next = [req, ...prev];
      localStorage.setItem("psychTests", JSON.stringify(next));
      return next;
    });
    
    // Notify counselors (for simplicity, send to all counselors - you can refine this)
    if (notificationCallback) {
      notificationCallback({
        recipientId: null, // all users with counselor role will see it via filtering
        title: "New Test Request",
        message: `${student.name} has requested a ${form.testType || 'Psychological Test'} for ${form.date}.`,
        type: "info",
        link: "/counselor/appointments"
      });
    }
    
    return { success: true, request: req };
  };

  const updateTest = (id, updater) => {
    setTests(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...updater, updatedAt: new Date().toISOString() } : t);
      localStorage.setItem("psychTests", JSON.stringify(next));
      return next;
    });
  };

  const acceptTest = ({ id, date = null, timeSlot = null, note = null }) => {
    const test = tests.find(t => t.id === id);
    updateTest(id, { status: "accepted", scheduledDate: date, scheduledTimeSlot: timeSlot, note });
    
    // Notify student
    if (notificationCallback && test) {
      notificationCallback({
        recipientId: test.studentUserId,
        title: "Test Request Accepted",
        message: `Your ${test.testType || 'test'} request for ${date || test.preferredDate} has been accepted.`,
        type: "success",
        link: "/"
      });
    }
    
    return { success: true };
  };

  const rescheduleTest = ({ id, date, timeSlot, note = null }) => {
    const test = tests.find(t => t.id === id);
    updateTest(id, { status: "rescheduled", scheduledDate: date, scheduledTimeSlot: timeSlot, note });
    
    // Notify student
    if (notificationCallback && test) {
      notificationCallback({
        recipientId: test.studentUserId,
        title: "Test Rescheduled",
        message: `Your ${test.testType || 'test'} has been rescheduled to ${date} at ${timeSlot}.${note ? ' Note: ' + note : ''}`,
        type: "warning",
        link: "/"
      });
    }
    
    return { success: true };
  };

  const rejectTest = ({ id, note = null }) => {
    const test = tests.find(t => t.id === id);
    updateTest(id, { status: "rejected", note });
    
    // Notify student
    if (notificationCallback && test) {
      notificationCallback({
        recipientId: test.studentUserId,
        title: "Test Request Rejected",
        message: `Your ${test.testType || 'test'} request has been rejected.${note ? ' Reason: ' + note : ''}`,
        type: "error",
        link: "/"
      });
    }
    
    return { success: true };
  };

  const getTestsForCurrentUser = () => {
    if (!currentUser) return [];
    if (currentUser.role === "student") {
      return tests.filter(t => t.studentUserId === currentUser.id);
    }
    if (currentUser.role === "counselor") {
      return tests; // counselors see all test requests
    }
    // other roles could see all later
    return tests;
  };

  return (
    <TestsContext.Provider value={{ 
      tests, 
      createTestRequest, 
      getTestsForCurrentUser,
      acceptTest,
      rescheduleTest,
      rejectTest
    }}>
      {children}
    </TestsContext.Provider>
  );
}

export function useTests() {
  return useContext(TestsContext);
}
