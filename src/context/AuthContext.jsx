// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { MOCK_USERS } from "../data/mockData";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const s = localStorage.getItem("users");
    return s ? JSON.parse(s) : MOCK_USERS;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const s = localStorage.getItem("currentUser");
    return s ? JSON.parse(s) : null;
  });

  // login by identifier + password
  // For students: identifier is studentId (strict match)
  // For staff (admin, counselor, college_rep): identifier is email (case-insensitive)
  const login = ({ identifier, password, role }) => {
    const found = users.find((u) => {
      const roleMatches = role ? u.role === role : true;
      if (!roleMatches) return false;
      if (u.role === "student") {
        return u.studentId?.toString() === identifier?.toString() && u.password === password;
      }
      // staff by email
      return (
        u.email?.toLowerCase() === identifier?.toLowerCase() &&
        u.password === password
      );
    });

    if (found) {
      setCurrentUser(found);
      localStorage.setItem("currentUser", JSON.stringify(found));
      return { success: true, user: found };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  };

  // signup (adds to in-memory users, returns user) - signs user in
  const signup = ({ name, email, password, role = "student", college = null, studentId = null }) => {
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email already in use" };
    }

    const newId = users.reduce((max, u) => Math.max(max, u.id || 0), 0) + 1;
    const newUser = {
      id: newId,
      name,
      email,
      password,
      role,
      college: role === "student" || role === "college_rep" ? college : null,
      studentId: role === "student" ? studentId : undefined
    };
    setUsers((prev) => {
      const next = [...prev, newUser];
      localStorage.setItem("users", JSON.stringify(next));
      return next;
    });
    setCurrentUser(newUser); // signup logs in
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  // createUser: add user without changing currentUser (for admin create)
  const createUser = ({ name, email, password = "pass123", role = "student", college = null, studentId = null, extra = {} }) => {
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email already in use" };
    }
    const newId = users.reduce((max, u) => Math.max(max, u.id || 0), 0) + 1;
    const newUser = {
      id: newId,
      name,
      email,
      password,
      role,
      college: role === "student" || role === "college_rep" ? college : null,
      studentId: role === "student" ? studentId : undefined,
      ...extra
    };
    setUsers((prev) => {
      const next = [...prev, newUser];
      localStorage.setItem("users", JSON.stringify(next));
      return next;
    });
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  // updateUser: update user profile
  const updateUser = (userId, updates) => {
    setUsers((prev) => {
      const next = prev.map(u => u.id === userId ? { ...u, ...updates } : u);
      localStorage.setItem("users", JSON.stringify(next));
      return next;
    });
    
    // If updating current user, update currentUser state too
    if (currentUser?.id === userId) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
    
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, login, signup, createUser, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}