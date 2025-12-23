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
      // Check if student account is approved
      if (found.role === "student" && found.status === "pending_approval") {
        return { 
          success: false, 
          message: "Your account is pending approval. Please wait for admin verification.",
          status: "pending_approval"
        };
      }

      if (found.role === "student" && found.status === "rejected") {
        return { 
          success: false, 
          message: "Your account was rejected. Reason: " + (found.rejectionReason || "Please contact admin."),
          status: "rejected"
        };
      }

      setCurrentUser(found);
      localStorage.setItem("currentUser", JSON.stringify(found));
      return { success: true, user: found };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  };

  // signup (adds to in-memory users, returns user) - FOR STUDENT: pending approval
  const signup = ({ name, email, password, role = "student", college = null, studentId = null, phone = "", corImage = null }) => {
    // Check for duplicate email
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email already in use" };
    }

    // Check for duplicate student ID (for students)
    if (role === "student" && studentId && users.find((u) => u.studentId === studentId)) {
      return { success: false, message: "Student ID already registered" };
    }

    // Validate MSU email for students
    if (role === "student" && !email.toLowerCase().endsWith("@msu.edu.ph")) {
      return { success: false, message: "Please use your MSU institutional email (@msu.edu.ph)" };
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
      phone: phone || "",
      
      // COR Verification fields (for students)
      status: role === "student" ? "pending_approval" : "approved",
      corImage: role === "student" ? corImage : null,
      program: null,  // Admin will set after reviewing COR
      yearLevel: null, // Admin will set after reviewing COR
      
      // Tracking
      submittedAt: new Date().toISOString(),
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
      canLogin: role !== "student", // Students can't login until approved
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setUsers((prev) => {
      const next = [...prev, newUser];
      localStorage.setItem("users", JSON.stringify(next));
      return next;
    });

    // For students: don't log them in (pending approval)
    // For other roles: log them in immediately
    if (role !== "student") {
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    }

    return { 
      success: true, 
      user: newUser,
      message: role === "student" 
        ? "Registration submitted! Please wait for admin approval (24-48 hours)." 
        : "Account created successfully!"
    };
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

  // approveRegistration: admin approves student registration
  const approveRegistration = (userId, { program, yearLevel, approvedBy }) => {
    setUsers((prev) => {
      const next = prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            status: "approved",
            program,
            yearLevel,
            approvedBy,
            approvedAt: new Date().toISOString(),
            canLogin: true,
            updatedAt: new Date().toISOString()
          };
        }
        return u;
      });
      localStorage.setItem("users", JSON.stringify(next));
      return next;
    });
    return { success: true };
  };

  // rejectRegistration: admin rejects student registration
  const rejectRegistration = (userId, { reason, rejectedBy }) => {
    setUsers((prev) => {
      const next = prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            status: "rejected",
            rejectionReason: reason,
            rejectedBy,
            rejectedAt: new Date().toISOString(),
            canLogin: false,
            updatedAt: new Date().toISOString()
          };
        }
        return u;
      });
      localStorage.setItem("users", JSON.stringify(next));
      return next;
    });
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ 
      users, 
      currentUser, 
      login, 
      signup, 
      createUser, 
      logout, 
      updateUser,
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