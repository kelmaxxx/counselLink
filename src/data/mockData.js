// src/data/mockData.js
export const COLLEGES = ['CICS', 'COE', 'CBA', 'CAS', 'CHED', 'CL', 'CME'];

export const MOCK_USERS = [
  // Admin
  { id: 1, name: 'Director Lucman', email: 'admin@msu.edu.ph', password: 'admin123', role: 'admin' },

  // Counselors
  { id: 2, name: 'Dr. Maria Santos', email: 'counselor@msu.edu.ph', password: 'counselor123', role: 'counselor', college: null },
  { id: 3, name: 'Dr. Ahmed Rahman', email: 'counselor2@msu.edu.ph', password: 'counselor123', role: 'counselor', college: null },
  { id: 4, name: 'Dr. Laila M.', email: 'counselor3@msu.edu.ph', password: 'counselor123', role: 'counselor', college: null },
  { id: 5, name: 'Dr. Jose Perez', email: 'counselor4@msu.edu.ph', password: 'counselor123', role: 'counselor', college: null },

  // College reps
  { id: 6, name: 'Prof. Ahmed Ali', email: 'rep@msu.edu.ph', password: 'rep123', role: 'college_rep', college: 'COE' },
  { id: 7, name: 'Prof. Hana Omar', email: 'rep2@msu.edu.ph', password: 'rep123', role: 'college_rep', college: 'CICS' },
  { id: 8, name: 'Prof. Liza Cruz', email: 'rep3@msu.edu.ph', password: 'rep123', role: 'college_rep', college: 'CBA' },

  // Students (25 students -> ids 9..33)
  { id: 9, name: 'Abdul Malik', email: 'student1@msu.edu.ph', password: 'pass123', role: 'student', college: 'CICS', studentId: 'S2025001' }
];