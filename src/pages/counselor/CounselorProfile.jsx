import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function CounselorProfile() {
  const { currentUser } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Profile</h2>

      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow max-w-2xl">
        <div className="space-y-4">
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
            <p className="font-medium text-gray-900">Counselor</p>
          </div>
        </div>
        <button className="mt-6 w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
}