// src/pages/Students.jsx
import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  FileText,
  Download
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const COLLEGES = ["CICS", "COE", "CAS", "COB", "COL"];

const mockStudents = [
  { id: "1", name: "Juan Dela Cruz", studentId: "2024-00001", college: "CICS", year: "3rd Year", lastSession: "Nov 28, 2024", sessions: 5, status: "active" },
  { id: "2", name: "Maria Santos", studentId: "2024-00002", college: "COE", year: "2nd Year", lastSession: "Nov 25, 2024", sessions: 3, status: "active" },
  { id: "3", name: "Pedro Reyes", studentId: "2024-00003", college: "CAS", year: "4th Year", lastSession: "Nov 20, 2024", sessions: 8, status: "inactive" },
  { id: "4", name: "Ana Garcia", studentId: "2024-00004", college: "COB", year: "1st Year", lastSession: "Nov 15, 2024", sessions: 2, status: "active" },
  { id: "5", name: "Luis Mendoza", studentId: "2024-00005", college: "CICS", year: "3rd Year", lastSession: "Nov 10, 2024", sessions: 4, status: "active" },
  { id: "6", name: "Rosa Cruz", studentId: "2024-00006", college: "COE", year: "2nd Year", lastSession: "Nov 5, 2024", sessions: 6, status: "active" },
];

function downloadCSV(rows, filename = "students.csv") {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map(r => keys.map(k => `"${(r[k] ?? "").toString().replace(/"/g, '""')}"`).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ManageStudents() {
  const { users, createUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    studentId: "",
    college: COLLEGES[0],
    year: "1st Year",
    sessions: 0,
    status: "active"
  });

  const studentsSource = useMemo(() => {
    const ctxStudents = (users || []).filter(u => u.role === "student")
      .map(u => ({
        id: String(u.id || u.email),
        name: u.name || u.email,
        studentId: u.studentId || "",
        college: u.college || "N/A",
        year: u.year || "N/A",
        lastSession: u.lastSession || "N/A",
        sessions: u.sessions || 0,
        status: u.status || "active"
      }));
    const byId = {};
    [...mockStudents, ...ctxStudents].forEach(s => {
      byId[s.studentId || s.id] = s;
    });
    return Object.values(byId);
  }, [users]);

  const filteredStudents = useMemo(() => {
    return studentsSource.filter(student => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (student.name || "").toLowerCase().includes(q) ||
        (student.studentId || "").toLowerCase().includes(q);
      const matchesCollege = collegeFilter === "all" || student.college === collegeFilter;
      return matchesSearch && matchesCollege;
    });
  }, [studentsSource, searchQuery, collegeFilter]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);

    // Basic validation
    if (!newStudent.name || !newStudent.email || !newStudent.studentId) {
      alert("Please fill Name, Email and Student ID.");
      setAdding(false);
      return;
    }

    const res = createUser({
      name: newStudent.name,
      email: newStudent.email,
      password: "pass123",
      role: "student",
      college: newStudent.college,
      studentId: newStudent.studentId,
      extra: {
        year: newStudent.year,
        sessions: newStudent.sessions,
        status: newStudent.status,
        lastSession: newStudent.lastSession || "N/A"
      }
    });

    if (!res.success) {
      alert(res.message || "Failed to add user");
      setAdding(false);
      return;
    }

    // Clear form and close modal
    setNewStudent({ name: "", email: "", studentId: "", college: COLLEGES[0], year: "1st Year", sessions: 0, status: "active" });
    setShowAdd(false);
    setAdding(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-full">
        {/* Header actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start mb-6">
          <div className="flex gap-3 flex-1 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500"
                placeholder="Search by name or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <div className="mr-2 text-gray-600"><Filter /></div>
              <select
                className="px-3 py-2 rounded border bg-white"
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
              >
                <option value="all">All Colleges</option>
                {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => downloadCSV(filteredStudents, "students-export.csv")}
              className="flex items-center gap-2 px-4 py-2 rounded border hover:bg-gray-50"
            >
              <Download className="w-4 h-4" /> Export
            </button>

            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 rounded bg-maroon-500 text-white hover:bg-maroon-600"
            >
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-maroon-50">
                <Users className="h-5 w-5 text-maroon-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{studentsSource.length}</p>
                <p className="text-sm text-gray-500">Total Students</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{studentsSource.filter(s => s.status === "active").length}</p>
                <p className="text-sm text-gray-500">Active Cases</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{studentsSource.reduce((acc, s) => acc + (s.sessions || 0), 0)}</p>
                <p className="text-sm text-gray-500">Total Sessions</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredStudents.length}</p>
                <p className="text-sm text-gray-500">Filtered Results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">College</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Session</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sessions</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{student.studentId}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded border text-sm text-gray-700">{student.college}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{student.year}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{student.lastSession}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{student.sessions}</td>
                  <td className="px-4 py-3 text-sm">
                    {student.status === "active" ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">active</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="inline-flex items-center gap-2">
                      <button
                        title="View profile"
                        onClick={() => alert(`View ${student.name}`)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => alert(`Edit ${student.name}`)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => {
                          if (confirm(`Delete record for ${student.name}?`)) {
                            alert("Deleted (demo)");
                          }
                        }}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                    No records match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Add Student Record</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Full name" value={newStudent.name} onChange={(e)=>setNewStudent({...newStudent,name:e.target.value})} className="px-3 py-2 border rounded" />
                <input required placeholder="Email" value={newStudent.email} onChange={(e)=>setNewStudent({...newStudent,email:e.target.value})} className="px-3 py-2 border rounded" />
                <input required placeholder="Student ID" value={newStudent.studentId} onChange={(e)=>setNewStudent({...newStudent,studentId:e.target.value})} className="px-3 py-2 border rounded" />
                <select value={newStudent.college} onChange={(e)=>setNewStudent({...newStudent,college:e.target.value})} className="px-3 py-2 border rounded">
                  {COLLEGES.map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={newStudent.year} onChange={(e)=>setNewStudent({...newStudent,year:e.target.value})} className="px-3 py-2 border rounded">
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
                <select value={newStudent.status} onChange={(e)=>setNewStudent({...newStudent,status:e.target.value})} className="px-3 py-2 border rounded">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>setShowAdd(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" disabled={adding} className="px-4 py-2 rounded bg-maroon-500 text-white">
                  {adding ? "Adding..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}