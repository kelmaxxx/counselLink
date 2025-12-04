// src/pages/dashboard/CounselorDashboard.jsx
import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { COLLEGES } from "../../data/mockData";

export default function CounselorDashboard() {
  const { currentUser, users } = useAuth();
  const students = users?.filter((u) => u.role === "student") || [];

  const studentsByCollege = useMemo(() => {
    return COLLEGES.reduce((acc, col) => {
      acc[col] = students.filter((s) => s.college === col).length;
      return acc;
    }, {});
  }, [students]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Counselor Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-600 p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium">Total Students</h3>
          <p className="text-3xl font-bold">{students.length}</p>
        </div>
        <div className="bg-green-600 p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium">Your Role</h3>
          <p className="text-3xl font-bold">{currentUser?.name}</p>
        </div>
        <div className="bg-purple-600 p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium">College Distribution</h3>
          <ul className="text-sm mt-2">
            {Object.entries(studentsByCollege).map(([c, n]) => (
              <li key={c} className="text-gray-200">
                {c}: <span className="font-medium">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-lg font-medium mb-3">Recent Appointment Requests</h3>
        <p className="text-gray-400">This panel will list pending requests in the full implementation.</p>
      </div>
    </div>
  );
}