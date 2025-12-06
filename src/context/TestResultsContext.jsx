import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const TestResultsContext = createContext();

export function TestResultsProvider({ children }) {
  const { currentUser } = useAuth();
  const [testResults, setTestResults] = useState(() => {
    const s = localStorage.getItem("testResults");
    return s ? JSON.parse(s) : [];
  });

  const createTestResult = ({ studentId, testName, completedDate, counselorName, summary, recommendations, pdfUrl = null }) => {
    const id = testResults.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1;
    const result = {
      id,
      studentId,
      testName,
      completedDate,
      counselorName,
      summary,
      recommendations,
      pdfUrl,
      createdAt: new Date().toISOString(),
    };
    setTestResults(prev => {
      const next = [result, ...prev];
      localStorage.setItem("testResults", JSON.stringify(next));
      return next;
    });
    return { success: true, result };
  };

  const getTestResultsForCurrentUser = () => {
    if (!currentUser) return [];
    if (currentUser.role === "student") {
      return testResults.filter(r => r.studentId === currentUser.studentId || r.studentId === currentUser.id);
    }
    // counselors/admins see all
    return testResults;
  };

  return (
    <TestResultsContext.Provider value={{
      testResults,
      createTestResult,
      getTestResultsForCurrentUser,
    }}>
      {children}
    </TestResultsContext.Provider>
  );
}

export function useTestResults() {
  return useContext(TestResultsContext);
}
