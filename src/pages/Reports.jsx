// src/pages/Reports.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppointments } from "../../context/AppointmentsContext";
import { useTests } from "../../context/TestsContext";
import { useTestResults } from "../../context/TestResultsContext";
import { BarChart2, Users, Calendar, FileText, TrendingUp, Download } from "lucide-react";

function StatCard({ icon: Icon, label, count, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    accepted: "bg-green-100 text-green-800 border border-green-300",
    confirmed: "bg-green-100 text-green-800 border border-green-300",
    rejected: "bg-red-100 text-red-800 border border-red-300",
    rescheduled: "bg-blue-100 text-blue-800 border border-blue-300",
    completed: "bg-gray-100 text-gray-800 border border-gray-300",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || statusStyles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function Reports() {
  const { currentUser, users } = useAuth();
  const { getAppointmentsForCurrentUser } = useAppointments();
  const { getTestsForCurrentUser } = useTests();
  const { getTestResultsForCurrentUser } = useTestResults();

  const appointments = getAppointmentsForCurrentUser();
  const tests = getTestsForCurrentUser();
  const testResults = getTestResultsForCurrentUser();

  // Compute statistics
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed" || a.status === "accepted"
  ).length;
  const pendingAppointments = appointments.filter((a) => a.status === "pending").length;
  const totalTests = tests.length;
  const completedTests = tests.filter((t) => t.status === "accepted" || t.status === "completed").length;
  const totalResults = testResults.length;

  // College distribution (for counselors/admins)
  const collegeDistribution =
    currentUser?.role !== "student"
      ? users
          .filter((u) => u.role === "student")
          .reduce((acc, student) => {
            const college = student.college || "Unassigned";
            acc[college] = (acc[college] || 0) + 1;
            return acc;
          }, {})
      : {};

  // Recent activity (last 5 appointments)
  const recentActivity = appointments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleExport = () => {
    alert("Export feature coming soon!");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <button
          onClick={handleExport}
          className="bg-maroon-500 text-white px-4 py-2 rounded-lg hover:bg-maroon-600 transition font-medium flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Calendar}
          label="Total Appointments"
          count={totalAppointments}
          color="bg-maroon-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Completed Appointments"
          count={completedAppointments}
          color="bg-green-500"
        />
        <StatCard
          icon={Calendar}
          label="Pending Appointments"
          count={pendingAppointments}
          color="bg-yellow-500"
        />
        <StatCard
          icon={FileText}
          label="Total Test Requests"
          count={totalTests}
          color="bg-blue-500"
        />
        <StatCard
          icon={BarChart2}
          label="Completed Tests"
          count={completedTests}
          color="bg-purple-500"
        />
        <StatCard
          icon={FileText}
          label="Test Results"
          count={totalResults}
          color="bg-indigo-500"
        />
      </div>

      {/* College Distribution (for non-students) */}
      {currentUser?.role !== "student" && Object.keys(collegeDistribution).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-maroon-500" />
            <h2 className="text-2xl font-semibold text-gray-900">Student Distribution by College</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(collegeDistribution).map(([college, count]) => (
              <div key={college} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-700">{college}</span>
                <span className="bg-maroon-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-maroon-500" />
            <h2 className="text-2xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {recentActivity.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-maroon-300 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{apt.studentName}</p>
                  <p className="text-sm text-gray-600">{apt.preferredDate}</p>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recentActivity.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow p-12 text-center">
          <BarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No data available</p>
          <p className="text-gray-500 text-sm">Reports and analytics will appear here once you have appointments and tests.</p>
        </div>
      )}
    </div>
  );
}
