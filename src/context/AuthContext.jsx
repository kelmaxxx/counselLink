// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import { MOCK_USERS } from "../data/mockData";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState(null);

  // login by email + password (role optional)
  const login = ({ email, password, role }) => {
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        (role ? u.role === role : true)
    );
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  };

  // signup (adds to in-memory users, returns user)
  const signup = ({ name, email, password, role = "student", college = null, studentId = null }) => {
    // check email exists
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
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}