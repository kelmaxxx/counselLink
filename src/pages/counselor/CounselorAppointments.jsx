import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppointments } from "../../context/AppointmentsContext";
import { useTests } from "../../context/TestsContext";

export default function CounselorAppointments() {
  const { currentUser } = useAuth();
  const { getAppointmentsForCurrentUser, acceptAppointment, rescheduleAppointment, rejectAppointment } = useAppointments();
  const { getTestsForCurrentUser, acceptTest, rescheduleTest, rejectTest } = useTests();
  
  const myAppointments = useMemo(() => getAppointmentsForCurrentUser(), [getAppointmentsForCurrentUser]);
  const myTests = useMemo(() => getTestsForCurrentUser(), [getTestsForCurrentUser]);

  const [rescheduleModal, setRescheduleModal] = useState({ open: false, apptId: null, date: "", timeSlot: "", note: "", type: "appointment" });

  const handleAccept = (id) => {
    const appt = myAppointments.find(a => a.id === id);
    // Accept to first preferred slot if timeSlot not explicitly chosen
    const slot = appt.timeSlot || (Array.isArray(appt.preferredSlots) ? appt.preferredSlots[0] : null);
    acceptAppointment({ id, date: appt.preferredDate, timeSlot: slot, note: null });
  };

  const handleReject = (id) => {
    const note = prompt("Optional note for rejection:") || null;
    rejectAppointment({ id, note });
  };

  const openReschedule = (id) => {
    setRescheduleModal({ open: true, apptId: id, date: "", timeSlot: "", note: "", type: "appointment" });
  };

  // Test handlers
  const handleAcceptTest = (id) => {
    const test = myTests.find(t => t.id === id);
    const slot = Array.isArray(test.preferredSlots) ? test.preferredSlots[0] : null;
    acceptTest({ id, date: test.preferredDate, timeSlot: slot, note: null });
  };

  const handleRejectTest = (id) => {
    const note = prompt("Optional note for rejection:") || null;
    rejectTest({ id, note });
  };

  const openRescheduleTest = (id) => {
    setRescheduleModal({ open: true, apptId: id, date: "", timeSlot: "", note: "", type: "test" });
  };

  const submitReschedule = () => {
    if (!rescheduleModal.date || !rescheduleModal.timeSlot) {
      alert("Select date and time");
      return;
    }
    if (rescheduleModal.type === "test") {
      rescheduleTest({ id: rescheduleModal.apptId, date: rescheduleModal.date, timeSlot: rescheduleModal.timeSlot, note: rescheduleModal.note });
    } else {
      rescheduleAppointment({ id: rescheduleModal.apptId, date: rescheduleModal.date, timeSlot: rescheduleModal.timeSlot, note: rescheduleModal.note });
    }
    setRescheduleModal({ open: false, apptId: null, date: "", timeSlot: "", note: "", type: "appointment" });
  };

  const timeLabel = (slot) => {
    const map = {
      "9:00-10:00": "9:00 - 10:00 AM",
      "10:00-11:00": "10:00 - 11:00 AM",
      "11:00-12:00": "11:00 - 12:00 PM",
      "1:00-2:00": "1:00 - 2:00 PM",
      "2:00-3:00": "2:00 - 3:00 PM",
      "3:00-4:00": "3:00 - 4:00 PM",
    };
    return map[slot] || slot;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Appointments & Test Requests</h2>

      {/* Appointments Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Counseling Appointments</h3>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow space-y-3">
          {myAppointments.length === 0 && (
            <p className="text-gray-600">No appointments yet.</p>
          )}

          {myAppointments.map((a) => (
          <div key={a.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-medium text-gray-900">{a.studentName} ({a.college || "N/A"})</p>
                <p className="text-sm text-gray-600">
                  Requested: {a.preferredDate} at {timeLabel(a.timeSlot)}
                </p>
                {a.scheduledDate && (
                  <p className="text-sm text-gray-700">
                    Scheduled: {a.scheduledDate} at {timeLabel(a.scheduledTimeSlot)}
                  </p>
                )}
                <p className="text-xs text-gray-500">Status: {a.status}</p>
                {a.note && <p className="text-xs text-gray-500">Note: {a.note}</p>}
                <p className="text-xs text-gray-400">Control #: {a.controlNo}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleAccept(a.id)} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Accept</button>
                <button onClick={() => openReschedule(a.id)} className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">Reschedule</button>
                <button onClick={() => handleReject(a.id)} className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                <a href={`/counselor/appointments/${a.id}/form`} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block">Open Counseling Form</a>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>

      {/* Psychological Test Requests Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Psychological Test Requests</h3>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow space-y-3">
          {myTests.length === 0 && (
            <p className="text-gray-600">No test requests yet.</p>
          )}

          {myTests.map((t) => (
            <div key={t.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-medium text-gray-900">{t.studentName} ({t.college || "N/A"})</p>
                  <p className="text-sm text-gray-600">Test Type: {t.testType}</p>
                  <p className="text-sm text-gray-600">
                    Requested: {t.preferredDate} at {Array.isArray(t.preferredSlots) ? t.preferredSlots.map(s => timeLabel(s)).join(', ') : 'N/A'}
                  </p>
                  {t.scheduledDate && (
                    <p className="text-sm text-gray-700">
                      Scheduled: {t.scheduledDate} at {timeLabel(t.scheduledTimeSlot)}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">Status: {t.status}</p>
                  {t.note && <p className="text-xs text-gray-500">Note: {t.note}</p>}
                  <p className="text-xs text-gray-400">Control #: {t.controlNo}</p>
                  {t.reason && <p className="text-xs text-gray-500">Reason: {t.reason}</p>}
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleAcceptTest(t.id)} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Accept</button>
                  <button onClick={() => openRescheduleTest(t.id)} className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">Reschedule</button>
                  <button onClick={() => handleRejectTest(t.id)} className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {rescheduleModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reschedule {rescheduleModal.type === "test" ? "Test" : "Appointment"}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={rescheduleModal.date} onChange={(e) => setRescheduleModal(s => ({ ...s, date: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Time Slot</label>
                <select className="w-full border rounded px-3 py-2" value={rescheduleModal.timeSlot} onChange={(e) => setRescheduleModal(s => ({ ...s, timeSlot: e.target.value }))}>
                  <option value="">Select a slot</option>
                  <option value="9:00-10:00">9:00 - 10:00 AM</option>
                  <option value="10:00-11:00">10:00 - 11:00 AM</option>
                  <option value="11:00-12:00">11:00 - 12:00 PM</option>
                  <option value="1:00-2:00">1:00 - 2:00 PM</option>
                  <option value="2:00-3:00">2:00 - 3:00 PM</option>
                  <option value="3:00-4:00">3:00 - 4:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2" value={rescheduleModal.note} onChange={(e) => setRescheduleModal(s => ({ ...s, note: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-2 bg-gray-200 rounded" onClick={() => setRescheduleModal({ open: false, apptId: null, date: "", timeSlot: "", note: "" })}>Cancel</button>
              <button className="px-3 py-2 bg-yellow-600 text-white rounded" onClick={submitReschedule}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}