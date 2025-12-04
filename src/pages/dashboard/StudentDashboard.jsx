// src/pages/dashboard/StudentDashboard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { currentUser, users } = useAuth();
  const myRecord = users?.find((u) => u.email === currentUser?.email) || currentUser;

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Student Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-medium">Welcome, {currentUser?.name}</h3>
          <p className="text-gray-400 text-sm mt-2">
            College: <span className="text-white font-medium">{myRecord?.college || "N/A"}</span>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Student ID: <span className="text-white font-medium">{myRecord?.studentId || "N/A"}</span>
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-medium">Appointment Status</h3>
          <p className="text-gray-400 text-sm mt-2">You have no upcoming appointments in this demo.</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-lg font-medium mb-3">Counseling & Test Results</h3>
        <p className="text-gray-400 text-sm">This demo shows test results and history in the full implementation.</p>
      </div>
    </div>
  );
}