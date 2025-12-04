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
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Counselor Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-maroon-500 text-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-maroon-100">Total Students</h3>
          <p className="text-3xl font-bold">{students.length}</p>
        </div>
        <div className="bg-maroon-600 text-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-maroon-100">Your Role</h3>
          <p className="text-3xl font-bold">{currentUser?.name}</p>
        </div>
        <div className="bg-maroon-700 text-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-maroon-100">College Distribution</h3>
          <ul className="text-sm mt-2">
            {Object.entries(studentsByCollege).map(([c, n]) => (
              <li key={c} className="text-maroon-50">
                {c}: <span className="font-medium">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Appointment Requests</h3>
        <p className="text-gray-600">This panel will list pending requests in the full implementation.</p>
      </div>
    </div>
  );
}