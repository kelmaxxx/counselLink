USE counselink;

INSERT INTO users (name, email, password, role, status)
VALUES
  ('Director Lucman', 'admin@msu.edu.ph', '$2a$10$e5a9uhM1O0rHDZZh9DAfh.d46AsPPjEF4lXt8.lquC3qF5dW9Tcdm', 'admin', 'approved'),
  ('Counselor Amina', 'counselor@msu.edu.ph', '$2a$10$e5a9uhM1O0rHDZZh9DAfh.d46AsPPjEF4lXt8.lquC3qF5dW9Tcdm', 'counselor', 'approved'),
  ('Rep Salim', 'rep@msu.edu.ph', '$2a$10$e5a9uhM1O0rHDZZh9DAfh.d46AsPPjEF4lXt8.lquC3qF5dW9Tcdm', 'college_rep', 'approved');
