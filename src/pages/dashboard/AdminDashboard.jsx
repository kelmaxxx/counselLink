// src/pages/dashboard/AdminDashboard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { users, currentUser } = useAuth();
  const students = users?.filter((u) => u.role === "student") || [];
  const counselors = users?.filter((u) => u.role === "counselor") || [];
  const reps = users?.filter((u) => u.role === "college_rep") || [];

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Administrator Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-600 p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold">{users?.length || 0}</p>
        </div>
        <div className="bg-green-600 p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium">Counselors</h3>
          <p className="text-3xl font-bold">{counselors.length}</p>
        </div>
        <div className="bg-purple-600 p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium">College Reps</h3>
          <p className="text-3xl font-bold">{reps.length}</p>
        </div>
        <div className="bg-orange-600 p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium">Students</h3>
          <p className="text-3xl font-bold">{students.length}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-lg font-medium mb-3">System Controls</h3>
        <p className="text-gray-400">Manage user accounts and announcements from "Manage User Accounts" and "Create Announcement".</p>
      </div>
    </div>
  );
}