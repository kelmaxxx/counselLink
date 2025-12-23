// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { COLLEGES } from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle } from "lucide-react";

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
    role: "student", // Always student for public signup
    college: COLLEGES[0],
    studentId: "",
    phone: "",
    corImage: null
  });
  
  const [corPreview, setCorPreview] = useState(null);

  const handleLoginChange = (e) =>
    setLoginForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSignupChange = (e) =>
    setSignupForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCorUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG) or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignupForm((p) => ({ ...p, corImage: reader.result }));
      setCorPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

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

    // Validate student-specific requirements
    if (signupForm.role === "student") {
      if (!signupForm.studentId) {
        alert("Student ID is required");
        return;
      }
      if (!signupForm.corImage) {
        alert("Please upload your Certificate of Registration (COR)");
        return;
      }
      if (!signupForm.email.toLowerCase().endsWith("@msu.edu.ph")) {
        alert("Please use your MSU institutional email (@msu.edu.ph)");
        return;
      }
    }

    const res = signup({
      name: signupForm.name,
      email: signupForm.email,
      password: signupForm.password,
      role: signupForm.role,
      college: signupForm.college,
      studentId: signupForm.studentId,
      phone: signupForm.phone,
      corImage: signupForm.corImage
    });
    
    if (!res.success) {
      alert(res.message || "Signup failed");
    } else {
      if (signupForm.role === "student") {
        // Show pending approval message
        alert(res.message || "Registration submitted! Please wait for admin approval.");
        setIsSignup(false); // Go back to login
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  if (isSignup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-maroon-500 to-maroon-700 px-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-maroon-700 mb-2">CounseLink</h1>
          <p className="text-gray-600 mb-6">MSU-Marawi City Division of Student Affairs</p>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input name="name" value={signupForm.name} onChange={handleSignupChange} required
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {signupForm.role === "student" ? "Institutional Email (@msu.edu.ph) *" : "Email *"}
              </label>
              <input 
                name="email" 
                type="email" 
                value={signupForm.email} 
                onChange={handleSignupChange} 
                required
                placeholder={signupForm.role === "student" ? "yourname@msu.edu.ph" : "email@example.com"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500" 
              />
              {signupForm.role === "student" && (
                <p className="text-xs text-gray-500 mt-1">Use your official MSU email address</p>
              )}
            </div>

            {/* Role is always "student" for public signup - no need to show dropdown */}

            {signupForm.role === "student" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                  <input 
                    name="studentId" 
                    value={signupForm.studentId} 
                    onChange={handleSignupChange}
                    required
                    placeholder="e.g., 202329207"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                  <input 
                    name="phone" 
                    type="tel"
                    value={signupForm.phone} 
                    onChange={handleSignupChange}
                    placeholder="09XX XXX XXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500" 
                  />
                </div>
              </>
            )}

            {(signupForm.role === "student" || signupForm.role === "college_rep") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College *</label>
                <select name="college" value={signupForm.college} onChange={handleSignupChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500">
                  {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {signupForm.role === "student" && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={18} className="text-maroon-600" />
                  Certificate of Registration (COR) *
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Upload a clear photo/scan of your COR. This will be reviewed by admin for verification.
                  (JPG, PNG, or PDF • Max 5MB)
                </p>
                
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={handleCorUpload}
                  className="hidden"
                  id="cor-upload"
                />
                
                {!corPreview ? (
                  <label
                    htmlFor="cor-upload"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-maroon-300 text-maroon-600 rounded-lg hover:bg-maroon-50 cursor-pointer transition font-medium"
                  >
                    <Upload size={20} />
                    Choose File
                  </label>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <CheckCircle size={18} />
                      File uploaded successfully!
                    </div>
                    {signupForm.corImage?.startsWith('data:image') && (
                      <img 
                        src={corPreview} 
                        alt="COR Preview" 
                        className="w-full h-40 object-contain border border-gray-200 rounded-lg bg-white"
                      />
                    )}
                    {signupForm.corImage?.startsWith('data:application/pdf') && (
                      <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
                        <FileText size={24} className="text-red-500" />
                        <span className="text-sm text-gray-700">PDF file uploaded</span>
                      </div>
                    )}
                    <label
                      htmlFor="cor-upload"
                      className="inline-block text-sm text-maroon-600 hover:text-maroon-700 cursor-pointer font-medium"
                    >
                      Change file
                    </label>
                  </div>
                )}
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
        <h1 className="text-3xl font-bold text-maroon-700 mb-2">CounseLink</h1>
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