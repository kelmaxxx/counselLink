import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function CounselingData() {
  const { currentUser, users } = useAuth();
  const myCollege = currentUser?.college;
  const studentsInCollege = users?.filter((u) => u.role === "student" && u.college === myCollege) || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Open Counseling Data</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-maroon-500 text-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-maroon-100">Total Sessions</h3>
          <p className="text-3xl font-bold">234</p>
        </div>
        <div className="bg-maroon-600 text-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-maroon-100">Active Cases</h3>
          <p className="text-3xl font-bold">45</p>
        </div>
        <div className="bg-maroon-700 text-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-maroon-100">Completed</h3>
          <p className="text-3xl font-bold">189</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics - {myCollege}</h3>
        <p className="text-gray-600 mb-6">This is aggregated data available for your college. For detailed individual student records, submit a request below.</p>
        
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition">
            Print Report
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Save Report
          </button>
        </div>
      </div>
    </div>
  );
}