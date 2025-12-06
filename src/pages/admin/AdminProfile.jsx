import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminProfile() {
  const { currentUser } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrator Information</h3>
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
              <label className="text-sm text-gray-600">Role</label>
              <p className="font-medium text-maroon-600">System Administrator</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Access Level</label>
              <p className="font-medium text-gray-900">Full System Access</p>
            </div>
          </div>
          <button className="mt-4 w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            Edit Profile
          </button>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Permissions</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-maroon-500 mr-3">✓</span>
              <span>Manage all user accounts (Create, Edit, Delete)</span>
            </li>
            <li className="flex items-start">
              <span className="text-maroon-500 mr-3">✓</span>
              <span>Create and send system announcements</span>
            </li>
            <li className="flex items-start">
              <span className="text-maroon-500 mr-3">✓</span>
              <span>Generate system reports and analytics</span>
            </li>
            <li className="flex items-start">
              <span className="text-maroon-500 mr-3">✓</span>
              <span>Approve/deny data access requests</span>
            </li>
            <li className="flex items-start">
              <span className="text-maroon-500 mr-3">✓</span>
              <span>Monitor system activity and logs</span>
            </li>
            <li className="flex items-start">
              <span className="text-maroon-500 mr-3">✓</span>
              <span>Configure system settings</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}