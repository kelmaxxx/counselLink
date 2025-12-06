import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { COLLEGES } from "../../data/mockData";
import { X } from "lucide-react";

export default function ManageUsers() {
  const { users, createUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState("All");
  const [query, setQuery] = useState("");

  // Modals
  const [createModal, setCreateModal] = useState({ open: false, role: "" });
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null });

  // Form states
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    college: COLLEGES[0]
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    college: ""
  });

  const nonStudentUsers = users?.filter((u) => u.role !== "student") || [];

  const filtered = useMemo(() => {
    return nonStudentUsers.filter((u) => {
      const matchesRole = selectedRole === "All" || u.role === selectedRole;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [nonStudentUsers, selectedRole, query]);

  // Handlers
  const openCreateModal = (role) => {
    setCreateForm({ name: "", email: "", password: "password123", college: COLLEGES[0] });
    setCreateModal({ open: true, role });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const res = createUser({
      name: createForm.name,
      email: createForm.email,
      password: createForm.password,
      role: createModal.role,
      college: createModal.role === "college_rep" ? createForm.college : null
    });
    if (res.success) {
      alert(`${createModal.role === "counselor" ? "Counselor" : "College Representative"} created successfully!`);
      setCreateModal({ open: false, role: "" });
    } else {
      alert(res.message || "Failed to create user");
    }
  };

  const openEditModal = (user) => {
    setEditForm({ name: user.name, email: user.email, college: user.college || COLLEGES[0] });
    setEditModal({ open: true, user });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    // Update user in the users array
    const updatedUsers = users.map(u => 
      u.id === editModal.user.id 
        ? { ...u, name: editForm.name, email: editForm.email, college: u.role === "college_rep" ? editForm.college : u.college }
        : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("User updated successfully!");
    setEditModal({ open: false, user: null });
    window.location.reload(); // Reload to reflect changes
  };

  const openDeleteConfirm = (userId) => {
    setDeleteConfirm({ open: true, userId });
  };

  const handleDelete = () => {
    const updatedUsers = users.filter(u => u.id !== deleteConfirm.userId);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("User deleted successfully!");
    setDeleteConfirm({ open: false, userId: null });
    window.location.reload(); // Reload to reflect changes
  };

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
            <button onClick={() => openCreateModal("counselor")} className="px-4 py-2 bg-maroon-500 text-white rounded hover:bg-maroon-600 transition">Create Counselor</button>
            <button onClick={() => openCreateModal("college_rep")} className="px-4 py-2 bg-maroon-600 text-white rounded hover:bg-maroon-700 transition">Create Rep</button>
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
                    <button onClick={() => openEditModal(u)} className="text-maroon-600 hover:text-maroon-700 font-medium">Edit</button>
                    <button onClick={() => openDeleteConfirm(u.id)} className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {createModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create {createModal.role === "counselor" ? "Counselor" : "College Representative"}</h3>
              <button onClick={() => setCreateModal({ open: false, role: "" })} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  value={createForm.name} 
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  value={createForm.email} 
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  value={createForm.password} 
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} 
                />
              </div>
              {createModal.role === "college_rep" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College *</label>
                  <select 
                    className="w-full border rounded px-3 py-2" 
                    value={createForm.college} 
                    onChange={(e) => setCreateForm({ ...createForm, college: e.target.value })}
                  >
                    {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setCreateModal({ open: false, role: "" })} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-maroon-600 text-white rounded hover:bg-maroon-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <button onClick={() => setEditModal({ open: false, user: null })} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
                />
              </div>
              {editModal.user?.role === "college_rep" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College *</label>
                  <select 
                    className="w-full border rounded px-3 py-2" 
                    value={editForm.college} 
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  >
                    {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setEditModal({ open: false, user: null })} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-maroon-600 text-white rounded hover:bg-maroon-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">Confirm Delete</h3>
              <button onClick={() => setDeleteConfirm({ open: false, userId: null })} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm({ open: false, userId: null })} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}