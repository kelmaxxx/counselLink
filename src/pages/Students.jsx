// src/pages/Students.jsx
import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { COLLEGES } from "../data/mockData";

export default function Students() {
  const { users, currentUser } = useAuth();
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [query, setQuery] = useState("");

  const students = useMemo(
    () => users?.filter((u) => u.role === "student") || [],
    [users]
  );

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesCollege = selectedCollege === "All" || s.college === selectedCollege;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.studentId || "").toLowerCase().includes(q);
      return matchesCollege && matchesQuery;
    });
  }, [students, selectedCollege, query]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Manage Student Records</h2>
        <div className="text-sm text-gray-600">Signed in as: {currentUser?.name} ({currentUser?.role})</div>
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded-xl mb-6 shadow">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 font-medium">College</label>
            <select
              className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-900"
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
            >
              <option value="All">All Colleges</option>
              {COLLEGES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mt-3 md:mt-0 flex-1">
            <input
              placeholder="Search student name, email or ID..."
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="mt-3 md:mt-0">
            <button className="px-4 py-2 bg-maroon-500 text-white rounded hover:bg-maroon-600 transition">Add New Record</button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-700 border-b border-gray-200">
              <th className="py-3 px-2 font-medium">Name</th>
              <th className="py-3 px-2 font-medium">College</th>
              <th className="py-3 px-2 font-medium">Student ID</th>
              <th className="py-3 px-2 font-medium">Email</th>
              <th className="py-3 px-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">No records match your filters.</td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-2 text-gray-900">{s.name}</td>
                <td className="py-3 px-2 text-gray-900">{s.college || "N/A"}</td>
                <td className="py-3 px-2 text-gray-900">{s.studentId || "—"}</td>
                <td className="py-3 px-2 text-sm text-gray-600">{s.email}</td>
                <td className="py-3 px-2">
                  {(currentUser?.role === "counselor" || currentUser?.role === "admin") ? (
                    <div className="flex gap-2">
                      <button className="text-maroon-600 hover:text-maroon-700 font-medium">View</button>
                      <button className="text-green-600 hover:text-green-700 font-medium">Edit</button>
                      <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}