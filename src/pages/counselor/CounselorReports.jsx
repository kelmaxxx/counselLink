import React from "react";

export default function CounselorReports() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generate Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Psychological Test Results</h3>
          <p className="text-gray-600 mb-4">Send test results to students</p>
          <button className="w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            Send Test Results
          </button>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Counseling Reports</h3>
          <p className="text-gray-600 mb-4">Send reports to college representatives</p>
          <button className="w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            Send to College Rep
          </button>
        </div>
      </div>
    </div>
  );
}