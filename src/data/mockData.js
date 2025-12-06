export const COLLEGES = ['CICS', 'COE', 'CBAA', 'CHS', 'CED', 'CO L', 'COA', 'CNSM', 'CSSH', 'CPA', 'KFCIASS','CFES', 'CFAS', 'CHTM'];

export const MOCK_USERS = [
  // Admin
  { id: 1, name: 'Director Lucman', email: 'admin@msu.edu.ph', password: 'admin123', role: 'admin', employeeId: '900000001' },

  // Counselors
  { id: 2, name: 'Sir Lucs', email: 'counselor@msu.edu.ph', password: 'counselor123', role: 'counselor', college: null, employeeId: '900000101' },
  { id: 3, name: 'Dr. Ahmed Rahman', email: 'counselor2@msu.edu.ph', password: 'counselor123', role: 'counselor', college: null, employeeId: '900000102' },
  { id: 4, name: 'Dr. Laila M.', email: 'counselor3@msu.edu.ph', password: 'counselor123', role: 'counselor', college: null, employeeId: '900000103' },
  { id: 5, name: 'Dr. Jose Perez', email: 'counselor4@msu.edu.ph', password: 'counselor123', role: 'counselor', college: null, employeeId: '900000104' },

  // College reps
  { id: 6, name: 'Prof. Ahmed Ali', email: 'rep2@msu.edu.ph', password: 'rep123', role: 'college_rep', college: 'COE', employeeId: '900000201' },
  { id: 7, name: 'Prof. Macatotong', email: 'rep@msu.edu.ph', password: 'rep123', role: 'college_rep', college: 'CICS', employeeId: '900000202' },
  { id: 8, name: 'Prof. Liza Cruz', email: 'rep3@msu.edu.ph', password: 'rep123', role: 'college_rep', college: 'CBAA', employeeId: '900000203' },

  // Students (25 students -> ids 9..33)
  { id: 9, name: 'Abdul Malik', email: 'student1@msu.edu.ph', password: 'pass123', role: 'student', college: 'CICS', studentId: '202329207'}
];