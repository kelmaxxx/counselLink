// src/components/Header.jsx
import React from "react";
import { Bell, User } from "lucide-react";

export default function Header({ currentUser }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-white">CounseLink</h1>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition">
            <Bell className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-300" />
            <span className="text-white font-medium">
              {currentUser?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
