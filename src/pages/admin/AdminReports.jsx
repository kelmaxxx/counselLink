import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminReports() {
  const { users } = useAuth();
  const students = users?.filter((u) => u.role === "student") || [];
  const counselors = users?.filter((u) => u.role === "counselor") || [];
  const reps = users?.filter((u) => u.role === "college_rep") || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total Students:</span>
              <span className="font-medium text-gray-900">{students.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Counselors:</span>
              <span className="font-medium text-gray-900">{counselors.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total College Reps:</span>
              <span className="font-medium text-gray-900">{reps.length}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Total Users:</span>
              <span className="font-medium text-gray-900">{users?.length || 0}</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            Export Report
          </button>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Activity</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Active Sessions:</span>
              <span className="font-medium text-gray-900">12</span>
            </div>
            <div className="flex justify-between">
              <span>Logins Today:</span>
              <span className="font-medium text-gray-900">45</span>
            </div>
            <div className="flex justify-between">
              <span>Requests Pending:</span>
              <span className="font-medium text-gray-900">3</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>System Uptime:</span>
              <span className="font-medium text-green-600">99.9%</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}