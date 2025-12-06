// src/pages/dashboard/StudentDashboard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppointments } from "../../context/AppointmentsContext";
import { useTests } from "../../context/TestsContext";
import { CalendarDays, CheckCircle2, Clock3, FileText, ArrowRight, Calendar, User2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { currentUser, users } = useAuth();
  const myRecord = users?.find((u) => u.email === currentUser?.email) || currentUser;

  const { getAppointmentsForCurrentUser } = useAppointments?.() || {};
  const myAppointments = getAppointmentsForCurrentUser ? getAppointmentsForCurrentUser() : [];
  
  const { getTestsForCurrentUser } = useTests?.() || {};
  const myTests = getTestsForCurrentUser ? getTestsForCurrentUser() : [];

  // Compute upcoming, pending, etc.
  const upcoming = myAppointments.filter(a => a.status === 'accepted' || a.status === 'rescheduled');
  const pending = myAppointments.filter(a => a.status === 'pending');
  
  const upcomingTests = myTests.filter(t => t.status === 'accepted' || t.status === 'rescheduled');
  const pendingTests = myTests.filter(t => t.status === 'pending');

  const upcomingCount = upcoming.length + upcomingTests.length;
  const completedCount = 5; // placeholder until we track completed
  const pendingCount = pending.length + pendingTests.length;
  const testResultsCount = 2; // placeholder

  // Determine next item (appointment or test, earliest accepted/rescheduled by scheduledDate)
  const sortByDateTime = (a, b) => {
    const da = new Date(a.scheduledDate || a.preferredDate || 0).getTime();
    const db = new Date(b.scheduledDate || b.preferredDate || 0).getTime();
    return da - db;
  };
  
  const allUpcoming = [
    ...upcoming.map(a => ({ ...a, type: 'appointment' })),
    ...upcomingTests.map(t => ({ ...t, type: 'test' }))
  ];
  const allPending = [
    ...pending.map(a => ({ ...a, type: 'appointment' })),
    ...pendingTests.map(t => ({ ...t, type: 'test' }))
  ];
  
  const next = [...allUpcoming].sort(sortByDateTime)[0] || allPending[0] || null;

  const counselorName = (next && next.type === 'appointment') ? (users?.find(u => u.id === next.counselorId)?.name || "") : "";
  const nextAppt = next ? {
    title: next.type === 'test' ? `${next.testType} Request` : 'General Counseling Session',
    counselor: next.type === 'test' ? 'Counseling Office' : (counselorName || 'Assigned Counselor'),
    date: next.scheduledDate || next.preferredDate || 'TBD',
    time: next.scheduledTimeSlot || next.timeSlot || (Array.isArray(next.preferredSlots) ? next.preferredSlots[0] : 'TBD'),
    status: next.status === 'accepted' ? 'Confirmed' : (next.status === 'rescheduled' ? 'Rescheduled' : 'Pending'),
    type: next.type
  } : null;

  return (
    <div className="">
      {/* Welcome Banner */}
      <div className="bg-maroon-600 text-white px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-1">Welcome back, {currentUser?.name?.split(' ')[0] || 'Student'}!</h2>
          <p className="text-maroon-100 text-sm mb-3">Your counseling journey matters. We're here to support you.</p>
          <Link to="/student/request-appointment" className="inline-flex items-center gap-2 bg-maroon-500 hover:bg-maroon-400 transition px-3 py-2 rounded-lg font-medium text-sm">
            Request Appointment <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-4 relative z-0">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow border-l-4 border-maroon-500 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
                <div className="text-2xl font-bold text-gray-900">{upcomingCount}</div>
                <p className="text-xs text-gray-500">Next: {nextAppt ? nextAppt.date : 'None scheduled'}</p>
              </div>
              <div className="bg-maroon-100 text-maroon-600 p-2 rounded-full">
                <CalendarDays size={18} />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow border-l-4 border-maroon-500 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Sessions</p>
                <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
                <p className="text-xs text-gray-500">This semester</p>
              </div>
              <div className="bg-maroon-100 text-maroon-600 p-2 rounded-full">
                <CheckCircle2 size={18} />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow border-l-4 border-maroon-500 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
                <p className="text-xs text-gray-500">All caught up!</p>
              </div>
              <div className="bg-maroon-100 text-maroon-600 p-2 rounded-full">
                <Clock3 size={18} />
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow border-l-4 border-maroon-500 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Test Results</p>
                <div className="text-2xl font-bold text-gray-900">{testResultsCount}</div>
                <p className="text-xs text-gray-500">Available to view</p>
              </div>
              <div className="bg-maroon-100 text-maroon-600 p-2 rounded-full">
                <FileText size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Main two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upcoming Appointment/Test */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upcoming {nextAppt?.type === 'test' ? 'Test' : 'Appointment'}</h3>
                <p className="text-sm text-gray-600">Your next scheduled {nextAppt?.type === 'test' ? 'psychological test' : 'session'}</p>
              </div>
            </div>

            {nextAppt ? (
              <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-maroon-100 text-maroon-700 rounded-full"><Calendar size={18} /></div>
                  <div>
                    <p className="font-medium text-gray-900">{nextAppt.title || 'General Counseling Session'}</p>
                    <p className="text-sm text-gray-600">with {nextAppt.counselor || 'Assigned Counselor'}</p>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${nextAppt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : nextAppt.status === 'Rescheduled' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{nextAppt.status}</span>
                </div>

                <div className="flex items-center gap-6 mt-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2"><Calendar size={16} /> {nextAppt.date}</div>
                  <div className="flex items-center gap-2"><Clock3 size={16} /> {nextAppt.time}</div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Reschedule</button>
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50 text-center text-gray-600">
                <p>No upcoming appointments. Request one to get started!</p>
              </div>
            )}
          </div>

          {/* Right: Psychological Test Results */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Psychological Test Results</h3>
                <p className="text-sm text-gray-600">Your latest assessment results</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {[{ name: 'Career Interest Inventory', date: 'Completed Nov 20, 2024' }, { name: 'Personality Assessment', date: 'Completed Oct 18, 2024' }].map((r, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-600">{r.date}</p>
                  </div>
                  <button className="text-teal-700 font-medium hover:underline">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}