import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ManageUsers() {
  const { users } = useAuth();
  const [selectedRole, setSelectedRole] = useState("All");
  const [query, setQuery] = useState("");

  const nonStudentUsers = users?.filter((u) => u.role !== "student") || [];

  const filtered = useMemo(() => {
    return nonStudentUsers.filter((u) => {
      const matchesRole = selectedRole === "All" || u.role === selectedRole;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [nonStudentUsers, selectedRole, query]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Manage User Accounts</h2>

      <div className="bg-white border border-gray-200 p-4 rounded-xl mb-6 shadow">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 font-medium">Role</label>
            <select
              className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-900"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="counselor">Counselors</option>
              <option value="college_rep">College Representatives</option>
            </select>
          </div>

          <div className="mt-3 md:mt-0 flex-1">
            <input
              placeholder="Search user name or email..."
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="mt-3 md:mt-0 flex gap-2">
            <button className="px-4 py-2 bg-maroon-500 text-white rounded hover:bg-maroon-600 transition">Create Counselor</button>
            <button className="px-4 py-2 bg-maroon-600 text-white rounded hover:bg-maroon-700 transition">Create Rep</button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-700 border-b border-gray-200">
              <th className="py-3 px-2 font-medium">Name</th>
              <th className="py-3 px-2 font-medium">Role</th>
              <th className="py-3 px-2 font-medium">Email</th>
              <th className="py-3 px-2 font-medium">College</th>
              <th className="py-3 px-2 font-medium">Status</th>
              <th className="py-3 px-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">No users match your filters.</td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-2 text-gray-900">{u.name}</td>
                <td className="py-3 px-2 text-gray-900 capitalize">{u.role.replace('_', ' ')}</td>
                <td className="py-3 px-2 text-sm text-gray-600">{u.email}</td>
                <td className="py-3 px-2 text-gray-900">{u.college || "—"}</td>
                <td className="py-3 px-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-2">
                    <button className="text-maroon-600 hover:text-maroon-700 font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}