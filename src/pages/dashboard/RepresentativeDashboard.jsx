// src/pages/dashboard/RepresentativeDashboard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function RepresentativeDashboard() {
  const { currentUser, users } = useAuth();
  const myCollege = currentUser?.college;
  const studentsInCollege = users?.filter((u) => u.role === "student" && u.college === myCollege) || [];

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">College Representative Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-600 p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium">College</h3>
          <p className="text-2xl font-bold">{myCollege || "N/A"}</p>
        </div>
        <div className="bg-green-600 p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium">Students (This College)</h3>
          <p className="text-3xl font-bold">{studentsInCollege.length}</p>
        </div>
        <div className="bg-purple-600 p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium">Available Reports</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-lg font-medium mb-3">Open Counseling Data</h3>
        <p className="text-gray-400">Use "Request Student Counseling Data" to request restricted records.</p>
      </div>
    </div>
  );
}