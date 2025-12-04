// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Calendar, Users, FileText, Bell, LogOut, User,
  ClipboardList, BarChart3, Settings, BookOpen, AlertCircle
} from "lucide-react";

function Sidebar({ currentUser: propUser, activeView, setActiveView, handleLogout }) {
  const { currentUser: ctxUser } = useAuth();
  const currentUser = propUser || ctxUser;
  const navigate = useNavigate();

  // Map item id to route path used in this app
  const idToPath = {
    dashboard: "/",
    "request-appointment": "/appointments",
    profile: "/",
    notifications: "/",
    "manage-students": "/students",
    appointments: "/appointments",
    "generate-reports": "/reports",
    "counseling-data": "/reports",
    "request-data": "/",
    "manage-users": "/settings",
    announcements: "/",
    reports: "/reports",
  };

  const getNavItems = () => {
    if (!currentUser) return [];
    switch (currentUser.role) {
      case "student":
        return [
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "request-appointment", label: "Request Appointment", icon: Calendar },
          { id: "profile", label: "My Profile", icon: User },
          { id: "notifications", label: "Notifications", icon: Bell }
        ];
      case "counselor":
        return [
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "manage-students", label: "Manage Students", icon: Users },
          { id: "appointments", label: "Appointments", icon: Calendar },
          { id: "generate-reports", label: "Generate Reports", icon: FileText },
          { id: "profile", label: "My Profile", icon: User },
          { id: "notifications", label: "Notifications", icon: Bell }
        ];
      case "college_rep":
        return [
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "counseling-data", label: "Open Counseling Data", icon: BookOpen },
          { id: "request-data", label: "Request Student Data", icon: ClipboardList },
          { id: "profile", label: "My Profile", icon: User },
          { id: "notifications", label: "Notifications", icon: Bell }
        ];
      case "admin":
        return [
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "manage-users", label: "Manage User Accounts", icon: Settings },
          { id: "announcements", label: "Create Announcement", icon: AlertCircle },
          { id: "reports", label: "System Reports", icon: FileText },
          { id: "profile", label: "My Profile", icon: User },
          { id: "notifications", label: "Notifications", icon: Bell }
        ];
      default:
        return [];
    }
  };

  if (!currentUser) {
    // Render an empty sidebar so layout doesn't crash while user isn't set
    return (
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">CounselLink</h1>
        </div>
      </div>
    );
  }

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">CounselLink</h1>
        <div className="mt-2 text-sm text-gray-300">
          <div className="font-medium text-white">{currentUser.name}</div>
          <div className="capitalize">{currentUser.role?.replace('_', ' ')}</div>
          {currentUser.college && <div className="text-blue-400">{currentUser.college}</div>}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                // keep previous behavior if parent passed setActiveView
                if (setActiveView) setActiveView(item.id);
                const path = idToPath[item.id] || "/";
                navigate(path);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeView === item.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;