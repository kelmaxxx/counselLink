import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function StudentProfile() {
  const { currentUser, users } = useAuth();
  const myRecord = users?.find((u) => u.email === currentUser?.email) || currentUser;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <p className="font-medium text-gray-900">{currentUser?.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-medium text-gray-900">{currentUser?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">College</label>
              <p className="font-medium text-gray-900">{myRecord?.college || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Student ID</label>
              <p className="font-medium text-gray-900">{myRecord?.studentId || "N/A"}</p>
            </div>
          </div>
          <button className="mt-4 w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            Edit Profile
          </button>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Counseling History</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-maroon-500 pl-4 py-2">
              <p className="font-medium text-gray-900">Academic Guidance Session</p>
              <p className="text-sm text-gray-600">November 15, 2025 with Dr. Maria Santos</p>
            </div>
            <div className="border-l-4 border-maroon-500 pl-4 py-2">
              <p className="font-medium text-gray-900">Career Planning Consultation</p>
              <p className="text-sm text-gray-600">October 8, 2025 with Dr. Maria Santos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}