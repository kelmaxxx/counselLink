import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminReports() {
  const { token } = useAuth();
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiBase}/api/reports/admin`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to load report");
      }
      setReportData(data);
    } catch (err) {
      setError(err.message || "Unable to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [token]);

  const students = reportData?.users?.student || 0;
  const counselors = reportData?.users?.counselor || 0;
  const reps = reportData?.users?.college_rep || 0;
  const totalAppointments = reportData?.totals?.appointments || 0;
  const totalTests = reportData?.totals?.tests || 0;
  const pendingRequests = reportData?.totals?.pendingRequests || 0;

  const appointmentStatuses = {
    pending: reportData?.appointmentStatuses?.pending || 0,
    accepted: reportData?.appointmentStatuses?.accepted || reportData?.appointmentStatuses?.approved || 0,
    rejected: reportData?.appointmentStatuses?.rejected || 0,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewDetails = () => {
    if (!reportData) return;
    const payload = {
      generatedAt: new Date().toISOString(),
      ...reportData,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-report.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
          <button onClick={handlePrint} className="mt-4 w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            Export Report
          </button>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Activity</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total Appointments:</span>
              <span className="font-medium text-gray-900">{totalAppointments}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Test Requests:</span>
              <span className="font-medium text-gray-900">{totalTests}</span>
            </div>
            <div className="flex justify-between">
              <span>Requests Pending:</span>
              <span className="font-medium text-gray-900">{pendingRequests}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>System Uptime:</span>
              <span className="font-medium text-green-600">99.9%</span>
            </div>
          </div>
          <button onClick={handleViewDetails} className="mt-4 w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            View Details
          </button>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Status Breakdown</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-medium text-yellow-600">{appointmentStatuses.pending}</span>
            </div>
            <div className="flex justify-between">
              <span>Accepted:</span>
              <span className="font-medium text-green-600">{appointmentStatuses.accepted}</span>
            </div>
            <div className="flex justify-between">
              <span>Rejected:</span>
              <span className="font-medium text-red-600">{appointmentStatuses.rejected}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Total:</span>
              <span className="font-medium text-gray-900">{totalAppointments}</span>
            </div>
          </div>
          <button onClick={handlePrint} className="mt-4 w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}