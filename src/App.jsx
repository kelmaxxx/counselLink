import React, { useState } from 'react';
import { Calendar, Users, FileText, Bell, LogOut, User, ClipboardList, BarChart3, Settings, BookOpen, AlertCircle } from 'lucide-react';

// Mock data for demonstration
const MOCK_USERS = {
  student: { id: 1, email: 'student@msu.edu.ph', password: 'student123', role: 'student', name: 'Abdul Malik Gampong', college: 'CICS' },
  counselor: { id: 2, email: 'counselor@msu.edu.ph', password: 'counselor123', role: 'counselor', name: 'Dr. Maria Santos' },
  college_rep: { id: 3, email: 'rep@msu.edu.ph', password: 'rep123', role: 'college_rep', name: 'Prof. Sue', college: 'COE' },
  admin: { id: 4, email: 'admin@msu.edu.ph', password: 'admin123', role: 'admin', name: 'Director Lucman' }
};

const COLLEGES = ['CICS', 'COE', 'CBAA', 'CSSH', 'CED', 'COL', 'CHS', 'COA','CNSM','CSPEAR','CPA'];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your appointment request has been approved', read: false },
    { id: 2, message: 'New psychological test results available', read: false }
  ]);

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  if (!currentUser) {
    return <LoginPage setCurrentUser={setCurrentUser} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        currentUser={currentUser} 
        activeView={activeView} 
        setActiveView={setActiveView}
        handleLogout={handleLogout}
      />
      <MainContent 
        currentUser={currentUser} 
        activeView={activeView}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </div>
  );
}

function LoginPage({ setCurrentUser }) {
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '', email: '', password: '', college: 'CICS', studentId: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const user = Object.values(MOCK_USERS).find(
      u => u.email === email && u.password === password && u.role === selectedRole
    );
    if (user) {
      setCurrentUser(user);
    } else {
      alert('Invalid credentials. Try:\nStudent: student@msu.edu.ph / student123\nCounselor: counselor@msu.edu.ph / counselor123\nCollege Rep: rep@msu.edu.ph / rep123\nAdmin: admin@msu.edu.ph / admin123');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    alert('Account created successfully! You can now login.');
    setShowSignup(false);
  };

  if (showSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-redb-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CounselLink</h1>
          <p className="text-gray-600 mb-6">MSU-Marawi City Student Registration</p>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={signupData.name}
                onChange={(e) => setSignupData({...signupData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={signupData.studentId}
                onChange={(e) => setSignupData({...signupData, studentId: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={signupData.college}
                onChange={(e) => setSignupData({...signupData, college: e.target.value})}
              >
                {COLLEGES.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={signupData.email}
                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition duration-200"
            >
              Create Account
            </button>
            
            <button
              type="button"
              onClick={() => setShowSignup(false)}
              className="w-full text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">CounselLink</h1>
        <p className="text-gray-600 mb-6">MSU-Marawi City Division of Student Affairs</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
          <div className="grid grid-cols-2 gap-2">
            {['student', 'counselor', 'college_rep', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`py-2 px-4 rounded-lg font-medium transition duration-200 ${
                  selectedRole === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`${selectedRole}@msu.edu.ph`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition duration-200"
          >
            Login
          </button>
        </form>
        
        {selectedRole === 'student' && (
          <button
            onClick={() => setShowSignup(true)}
            className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Don't have an account? Sign up
          </button>
        )}
      </div>
    </div>
  );
}

function Sidebar({ currentUser, activeView, setActiveView, handleLogout }) {
  const getNavItems = () => {
    switch (currentUser.role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'request-appointment', label: 'Request Appointment', icon: Calendar },
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ];
      case 'counselor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'manage-students', label: 'Manage Student Records', icon: Users },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
          { id: 'generate-reports', label: 'Generate Reports', icon: FileText },
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ];
      case 'college_rep':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'counseling-data', label: 'Open Counseling Data', icon: BookOpen },
          { id: 'request-data', label: 'Request Student Data', icon: ClipboardList },
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'manage-users', label: 'Manage User Accounts', icon: Settings },
          { id: 'announcements', label: 'Create Announcement', icon: AlertCircle },
          { id: 'reports', label: 'System Reports', icon: FileText },
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold mb-2">CounselLink</h1>
        <div className="text-sm text-gray-400">
          <div className="font-medium text-white">{currentUser.name}</div>
          <div className="capitalize">{currentUser.role.replace('_', ' ')}</div>
          {currentUser.college && <div className="text-blue-400">{currentUser.college}</div>}
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {getNavItems().map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                activeView === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
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
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function MainContent({ currentUser, activeView, notifications, setNotifications }) {
  const renderContent = () => {
    switch (currentUser.role) {
      case 'student':
        return <StudentViews activeView={activeView} currentUser={currentUser} notifications={notifications} />;
      case 'counselor':
        return <CounselorViews activeView={activeView} currentUser={currentUser} />;
      case 'college_rep':
        return <CollegeRepViews activeView={activeView} currentUser={currentUser} />;
      case 'admin':
        return <AdminViews activeView={activeView} currentUser={currentUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {renderContent()}
      </div>
    </div>
  );
}

function StudentViews({ activeView, currentUser, notifications }) {
  const [appointmentForm, setAppointmentForm] = useState({
    date: '', time: '', reason: ''
  });

  if (activeView === 'dashboard') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span className="text-gray-700">Latest Request</span>
                <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">Pending</span>
              </div>
              <p className="text-sm text-gray-600">Date: December 10, 2025 at 2:00 PM</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Psychological Test Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Stress Level Assessment</span>
                <span className="font-medium text-green-600">Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Career Interest Inventory</span>
                <span className="font-medium text-blue-600">Available</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-800">
            <strong>Welcome back, {currentUser.name}!</strong> You have {notifications.filter(n => !n.read).length} unread notifications.
          </p>
        </div>
      </div>
    );
  }

  if (activeView === 'request-appointment') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Request Counseling Appointment</h2>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <form onSubmit={(e) => {
            e.preventDefault();
            alert('Appointment request submitted successfully! You will be notified once approved.');
            setAppointmentForm({ date: '', time: '', reason: '' });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={appointmentForm.date}
                onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <select
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={appointmentForm.time}
                onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
              >
                <option value="">Select time</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Counseling</label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={appointmentForm.reason}
                onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
                placeholder="Please briefly describe why you are seeking counseling..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition duration-200"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (activeView === 'profile') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <p className="font-medium">{currentUser.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium">{currentUser.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">College</label>
                <p className="font-medium">{currentUser.college}</p>
              </div>
            </div>
            <button className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
              Edit Profile
            </button>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Counseling History</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium">Academic Guidance Session</p>
                <p className="text-sm text-gray-600">November 15, 2025 with Dr. Maria Santos</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-medium">Career Planning Consultation</p>
                <p className="text-sm text-gray-600">October 8, 2025 with Dr. Maria Santos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'notifications') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h2>
        
        <div className="bg-white rounded-lg shadow">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-4 border-b last:border-b-0 ${!notif.read ? 'bg-blue-50' : ''}`}>
              <p className="text-gray-800">{notif.message}</p>
              <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function CounselorViews({ activeView, currentUser }) {
  const [students] = useState([
    { id: 1, name: 'Juan Dela Cruz', college: 'CICS', status: 'Active', lastSession: '2025-11-15' },
    { id: 2, name: 'Maria Garcia', college: 'COE', status: 'Active', lastSession: '2025-11-20' },
    { id: 3, name: 'Ahmed Abdullah', college: 'CBA', status: 'Pending', lastSession: 'N/A' }
  ]);

  const [selectedCollege, setSelectedCollege] = useState('All');

  if (activeView === 'dashboard') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Counselor Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">New Requests</h3>
            <p className="text-4xl font-bold">5</p>
          </div>
          <div className="bg-green-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">Active Cases</h3>
            <p className="text-4xl font-bold">23</p>
          </div>
          <div className="bg-purple-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">This Week</h3>
            <p className="text-4xl font-bold">12</p>
          </div>
          <div className="bg-orange-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">Pending Reports</h3>
            <p className="text-4xl font-bold">3</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointment Requests</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Juan Dela Cruz (CICS)</p>
                <p className="text-sm text-gray-600">December 10, 2025 at 2:00 PM</p>
              </div>
              <div className="space-x-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Accept</button>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">Reschedule</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'manage-students') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Student Records</h2>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
              >
                <option value="All">All Colleges</option>
                {COLLEGES.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search students..."
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add New Record
            </button>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">College</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Session</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students
                .filter(s => selectedCollege === 'All' || s.college === selectedCollege)
                .map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{student.name}</td>
                  <td className="px-4 py-3 text-sm">{student.college}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{student.lastSession}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                    <button className="text-green-600 hover:text-green-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeView === 'generate-reports') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Generate Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Psychological Test Results</h3>
            <p className="text-gray-600 mb-4">Send test results to students</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Send Test Results
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Counseling Reports</h3>
            <p className="text-gray-600 mb-4">Send reports to college representatives</p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Send to College Rep
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div><h2 className="text-2xl font-bold text-gray-800">Counselor View - {activeView}</h2></div>;
}

function CollegeRepViews({ activeView, currentUser }) {
  if (activeView === 'dashboard') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">College Representative Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">Available Reports</h3>
            <p className="text-4xl font-bold">8</p>
          </div>
          <div className="bg-green-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">Pending Requests</h3>
            <p className="text-4xl font-bold">2</p>
          </div>
          <div className="bg-purple-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">Students ({currentUser.college})</h3>
            <p className="text-4xl font-bold">156</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'counseling-data') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Open Counseling Data</h2>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics - {currentUser.college}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-blue-600">234</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-green-600">45</p>
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-purple-600">189</p>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Print Report
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Save Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'request-data') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Request Student Counseling Data</h2>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <form onSubmit={(e) => {
            e.preventDefault();
            alert('Request submitted to DSA Administrator for approval.');
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Request</label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Explain why you need access to this student's data..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <div><h2 className="text-2xl font-bold text-gray-800">College Rep View - {activeView}</h2></div>;
}

function AdminViews({ activeView, currentUser }) {
  const [users] = useState([
    { id: 1, name: 'Dr. Maria Santos', role: 'Counselor', email: 'counselor@msu.edu.ph', status: 'Active' },
    { id: 2, name: 'Prof. Ahmed Ali', role: 'College Rep', email: 'rep@msu.edu.ph', status: 'Active', college: 'COE' }
  ]);

  if (activeView === 'dashboard') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Administrator Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">Total Users</h3>
            <p className="text-4xl font-bold">152</p>
          </div>
          <div className="bg-green-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">Counselors</h3>
            <p className="text-4xl font-bold">8</p>
          </div>
          <div className="bg-purple-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">College Reps</h3>
            <p className="text-4xl font-bold">7</p>
          </div>
          <div className="bg-orange-600 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium mb-2">Students</h3>
            <p className="text-4xl font-bold">1247</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'manage-users') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage User Accounts</h2>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>All Roles</option>
                <option>Counselors</option>
                <option>College Representatives</option>
              </select>
              <input
                type="text"
                placeholder="Search users..."
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Counselor Account
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Create College Rep Account
              </button>
            </div>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.role}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeView === 'announcements') {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Announcement</h2>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <form onSubmit={(e) => {
            e.preventDefault();
            alert('Announcement sent to all users!');
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Announcement Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                required
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Type your announcement message here..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>All Users</option>
                <option>Students Only</option>
                <option>Counselors Only</option>
                <option>College Representatives Only</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Send Announcement
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <div><h2 className="text-2xl font-bold text-gray-800">Admin View - {activeView}</h2></div>;
}

export default App;