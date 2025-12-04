// src/pages/Dashboard.jsx
import React from "react";

export default function Dashboard() {
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium">Upcoming Appointments</h3>
          <p className="text-gray-400 text-sm">0 appointments today.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium">Pending Requests</h3>
          <p className="text-gray-400 text-sm">No pending requests.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium">Students Counseled</h3>
          <p className="text-gray-400 text-sm">0 this week.</p>
        </div>
      </div>
    </div>
  );
}
