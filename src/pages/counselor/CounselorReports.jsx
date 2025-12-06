import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTests } from "../../context/TestsContext";
import { useTestResults } from "../../context/TestResultsContext";
import { X } from "lucide-react";

export default function CounselorReports() {
  const { currentUser, users } = useAuth();
  const { getTestsForCurrentUser } = useTests();
  const { createTestResult } = useTestResults();

  const myTests = getTestsForCurrentUser ? getTestsForCurrentUser() : [];
  const completedTests = myTests.filter(t => t.status === 'accepted' || t.status === 'rescheduled');

  const [sendResultModal, setSendResultModal] = useState({ open: false });
  const [resultForm, setResultForm] = useState({
    testId: "",
    testName: "",
    completedDate: new Date().toISOString().split('T')[0],
    summary: "",
    recommendations: "",
  });

  const openSendResultModal = () => {
    setResultForm({
      testId: "",
      testName: "",
      completedDate: new Date().toISOString().split('T')[0],
      summary: "",
      recommendations: "",
    });
    setSendResultModal({ open: true });
  };

  const handleSendResult = (e) => {
    e.preventDefault();
    const selectedTest = completedTests.find(t => t.id === Number(resultForm.testId));
    if (!selectedTest) {
      alert("Please select a test");
      return;
    }

    const res = createTestResult({
      studentId: selectedTest.studentUserId,
      testName: resultForm.testName,
      completedDate: resultForm.completedDate,
      counselorName: currentUser?.name || "Counselor",
      summary: resultForm.summary,
      recommendations: resultForm.recommendations,
      pdfUrl: null,
    });

    if (res.success) {
      alert("Test result sent successfully!");
      setSendResultModal({ open: false });
    } else {
      alert("Failed to send test result");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generate Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Psychological Test Results</h3>
          <p className="text-gray-600 mb-4">Send test results to students who have completed psychological tests</p>
          <button onClick={openSendResultModal} className="w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            Send Test Results
          </button>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Counseling Reports</h3>
          <p className="text-gray-600 mb-4">Send reports to college representatives</p>
          <button className="w-full bg-maroon-500 text-white py-2 rounded-lg hover:bg-maroon-600 transition">
            Send to College Rep
          </button>
        </div>
      </div>

      {/* Send Test Result Modal */}
      {sendResultModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Psychological Test Result</h3>
              <button onClick={() => setSendResultModal({ open: false })} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSendResult} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student Test *</label>
                <select 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  value={resultForm.testId} 
                  onChange={(e) => {
                    const testId = e.target.value;
                    const test = completedTests.find(t => t.id === Number(testId));
                    setResultForm({ 
                      ...resultForm, 
                      testId, 
                      testName: test ? test.testType : "" 
                    });
                  }}
                >
                  <option value="">-- Select a completed test --</option>
                  {completedTests.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.studentName} - {t.testType} ({t.scheduledDate || t.preferredDate})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Name *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  value={resultForm.testName} 
                  onChange={(e) => setResultForm({ ...resultForm, testName: e.target.value })} 
                  placeholder="e.g., Career Interest Inventory"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completed Date *</label>
                <input 
                  type="date" 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  value={resultForm.completedDate} 
                  onChange={(e) => setResultForm({ ...resultForm, completedDate: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary / Results *</label>
                <textarea 
                  rows={5} 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  value={resultForm.summary} 
                  onChange={(e) => setResultForm({ ...resultForm, summary: e.target.value })} 
                  placeholder="Brief summary of test results and findings..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recommendations</label>
                <textarea 
                  rows={4} 
                  className="w-full border rounded px-3 py-2" 
                  value={resultForm.recommendations} 
                  onChange={(e) => setResultForm({ ...resultForm, recommendations: e.target.value })} 
                  placeholder="Recommended actions or next steps..."
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setSendResultModal({ open: false })} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-maroon-600 text-white rounded hover:bg-maroon-700">Send to Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}