import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function RepProfile() {
  const { currentUser } = useAuth();

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
              <label className="text-sm text-gray-600">Role</label>
              <p className="font-medium text-gray-900">College Representative</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">College</label>
              <p className="font-medium text-maroon-600">{currentUser?.college}</p>
            </div>
          </div>
          <button className="mt-4 w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            Edit Profile
          </button>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsibilities</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-maroon-500 mr-3">•</span>
              <span>Access and review open counseling data for your college</span>
            </li>
            <li className="flex items-start">
              <span className="text-maroon-500 mr-3">•</span>
              <span>Request detailed student counseling records from DSA</span>
            </li>
            <li className="flex items-start">
              <span className="text-maroon-500 mr-3">•</span>
              <span>Generate and export reports for your college</span>
            </li>
            <li className="flex items-start">
              <span className="text-maroon-500 mr-3">•</span>
              <span>Collaborate with counselors on student welfare</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}