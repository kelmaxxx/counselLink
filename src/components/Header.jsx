// src/components/Header.jsx
import React from "react";
import { Bell, User } from "lucide-react";

export default function Header({ currentUser }) {
  return (
    <header className="bg-maroon-500 border-b border-maroon-700 shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-white">CounselLink</h1>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-maroon-600 rounded-lg transition">
            <Bell className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-maroon-100" />
            <span className="text-white font-medium">
              {currentUser?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}