// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const s = localStorage.getItem("currentUser");
    return s ? JSON.parse(s) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const authFetch = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  // login by identifier + password
  // For students: identifier is studentId (strict match)
  // For staff (admin, counselor, college_rep): identifier is email (case-insensitive)
  const login = async ({ identifier, password, role }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        return { success: false, message: data.message || "Login failed", status: data.status };
      }

      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      return { success: true, user: data.user };
    } catch (err) {
      setError("Unable to connect to server");
      return { success: false, message: "Unable to connect to server" };
    } finally {
      setLoading(false);
    }
  };

  // signup (adds to in-memory users, returns user) - FOR STUDENT: pending approval
  const signup = async ({ name, email, password, role = "student", college = null, studentId = null, phone = "", corFile }) => {
    setLoading(true);
    setError(null);
    try {
      let corMeta = {};
      if (corFile) {
        const formData = new FormData();
        formData.append("cor", corFile);
        const uploadResponse = await fetch(`${apiBase}/api/uploads/cor`, {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          setError(uploadData.message || "COR upload failed");
          return { success: false, message: uploadData.message || "COR upload failed" };
        }
        corMeta = {
          corUrl: uploadData.corUrl,
          corFileName: uploadData.corFileName,
          corFileType: uploadData.corFileType,
        };
      }

      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, college, studentId, phone, role, ...corMeta }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Registration failed");
        return { success: false, message: data.message || "Registration failed" };
      }
      return { success: true, message: data.message };
    } catch (err) {
      setError("Unable to connect to server");
      return { success: false, message: "Unable to connect to server" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  const fetchPendingRegistrations = async () => {
    const response = await authFetch(`${apiBase}/api/admin/pending-registrations`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Unable to load pending registrations");
    }
    return response.json();
  };

  const approveRegistration = async (userId, { program, yearLevel }) => {
    const response = await authFetch(
      `${apiBase}/api/admin/pending-registrations/${userId}/approve`,
      {
        method: "PUT",
        body: JSON.stringify({ program, yearLevel }),
      }
    );
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Unable to approve registration");
    }
    return response.json();
  };

  const rejectRegistration = async (userId, { reason }) => {
    const response = await authFetch(
      `${apiBase}/api/admin/pending-registrations/${userId}/reject`,
      {
        method: "PUT",
        body: JSON.stringify({ reason }),
      }
    );
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Unable to reject registration");
    }
    return response.json();
  };

  return (
    <AuthContext.Provider value={{ 
      users,
      currentUser,
      token,
      loading,
      error,
      login,
      signup,
      logout,
      setUsers,
      fetchPendingRegistrations,
      approveRegistration,
      rejectRegistration
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}