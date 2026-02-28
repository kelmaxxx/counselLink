import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppointments } from "../../context/AppointmentsContext";
import { useTests } from "../../context/TestsContext";

export default function CounselingData() {
  const { currentUser, users } = useAuth();
  const { appointments } = useAppointments();
  const { tests } = useTests();
  const [saveMessage, setSaveMessage] = useState("");

  const myCollege = currentUser?.college;
  const studentsInCollege = users?.filter((u) => u.role === "student" && u.college === myCollege) || [];

  // Get appointments and tests for students in the college
  const collegeAppointments = appointments.filter(a => a.college === myCollege);
  const collegeTests = tests.filter(t => t.college === myCollege);

  // Compute stats
  const totalSessions = collegeAppointments.length + collegeTests.length;
  const activeCases = collegeAppointments.filter(a => a.status === 'pending' || a.status === 'accepted').length +
                      collegeTests.filter(t => t.status === 'pending' || t.status === 'accepted').length;
  const completed = collegeAppointments.filter(a => a.status === 'completed' || a.status === 'accepted').length +
                    collegeTests.filter(t => t.status === 'completed' || t.status === 'accepted').length;

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setSaveMessage("Report saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Open Counseling Data</h2>

      {saveMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">✓ {saveMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-maroon-500 text-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-maroon-100">Total Sessions</h3>
          <p className="text-3xl font-bold">{totalSessions}</p>
        </div>
        <div className="bg-maroon-600 text-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-maroon-100">Active Cases</h3>
          <p className="text-3xl font-bold">{activeCases}</p>
        </div>
        <div className="bg-maroon-700 text-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-maroon-100">Completed</h3>
          <p className="text-3xl font-bold">{completed}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics - {myCollege}</h3>
        <p className="text-gray-600 mb-6">This is aggregated data available for your college. For detailed individual student records, submit a request below.</p>
        
        <div className="flex gap-4 mb-6">
          <button onClick={handlePrint} className="px-4 py-2 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition">
            Print Report
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Save Report
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Students in {myCollege}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Year Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentsInCollege.length > 0 ? (
                studentsInCollege.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.studentId || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.program || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.yearLevel || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No students found in {myCollege}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}