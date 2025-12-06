// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { COLLEGES } from "../data/mockData";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  const [selectedRole, setSelectedRole] = useState("student");

  const [loginForm, setLoginForm] = useState({
    identifier: "", // email for staff, studentId for students
    password: ""
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    college: COLLEGES[0],
    studentId: ""
  });

  const handleLoginChange = (e) =>
    setLoginForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSignupChange = (e) =>
    setSignupForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const res = login({ identifier: loginForm.identifier, password: loginForm.password, role: selectedRole });
    if (!res.success) {
      alert("Invalid credentials. Try demo accounts listed below.");
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const res = signup({
      name: signupForm.name,
      email: signupForm.email,
      password: signupForm.password,
      role: signupForm.role,
      college: signupForm.college,
      studentId: signupForm.studentId
    });
    if (!res.success) {
      alert(res.message || "Signup failed");
    } else {
      navigate("/", { replace: true });
    }
  };

  if (isSignup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-maroon-500 to-maroon-700 px-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-maroon-700 mb-2">CounselLink</h1>
          <p className="text-gray-600 mb-6">MSU-Marawi City Division of Student Affairs</p>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input name="name" value={signupForm.name} onChange={handleSignupChange} required
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" value={signupForm.email} onChange={handleSignupChange} required
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select name="role" value={signupForm.role} onChange={handleSignupChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500">
                <option value="student">Student</option>
                <option value="counselor">Counselor</option>
                <option value="college_rep">College Representative</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {signupForm.role === "student" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input name="studentId" value={signupForm.studentId} onChange={handleSignupChange}
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500" />
              </div>
            )}

            {(signupForm.role === "student" || signupForm.role === "college_rep") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                <select name="college" value={signupForm.college} onChange={handleSignupChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500">
                  {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input name="password" type="password" value={signupForm.password} onChange={handleSignupChange} required
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input name="confirmPassword" type="password" value={signupForm.confirmPassword} onChange={handleSignupChange} required
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500" />
            </div>

            <button type="submit" className="w-full bg-maroon-500 text-white py-3 rounded-lg hover:bg-maroon-600 font-medium transition">Create Account</button>

            <button type="button" onClick={() => setIsSignup(false)} className="w-full mt-3 text-maroon-600 hover:text-maroon-700 font-medium">Back to Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-maroon-500 to-maroon-700 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-maroon-700 mb-2">CounselLink</h1>
        <p className="text-gray-600 mb-6">MSU-Marawi City Division of Student Affairs</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Role</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "student", label: "Student" },
              { value: "counselor", label: "Counselor" },
              { value: "college_rep", label: "College Rep" },
              { value: "admin", label: "Admin" }
            ].map(role => (
              <button key={role.value} type="button" onClick={() => setSelectedRole(role.value)}
                      className={`py-2 px-3 rounded-lg font-medium transition ${selectedRole === role.value ? 'bg-maroon-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{selectedRole === 'student' ? 'ID Number' : 'Email'}</label>
            <input
              name="identifier"
              value={loginForm.identifier}
              onChange={handleLoginChange}
              type={selectedRole === 'student' ? 'text' : 'email'}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500"
              placeholder={selectedRole === 'student' ? 'e.g., 202329207' : `${selectedRole}@msu.edu.ph`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" value={loginForm.password} onChange={handleLoginChange} type="password" required
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500" />
          </div>

          <button type="submit" className="w-full bg-maroon-500 text-white py-3 rounded-lg hover:bg-maroon-600 font-medium transition">Login</button>
        </form>

        {selectedRole === "student" && (
          <button type="button" onClick={() => setIsSignup(true)} className="w-full mt-4 text-maroon-600 hover:text-maroon-700 font-medium">Don't have an account? Sign up</button>
        )}
      </div>
    </div>
  );
}