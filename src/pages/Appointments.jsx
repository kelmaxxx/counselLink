// src/pages/Appointments.jsx
import React from "react";

export default function Appointments() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Appointments</h2>

      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
        <p className="text-gray-600">No appointments available.</p>
      </div>
    </div>
  );
}