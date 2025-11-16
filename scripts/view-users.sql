-- View all users in the database
SELECT * FROM "User";

-- View users with formatted output
SELECT 
  id,
  email,
  name,
  role,
  "createdAt",
  "updatedAt"
FROM "User"
ORDER BY "createdAt" DESC;

-- Count total users
SELECT COUNT(*) as total_users FROM "User";

-- View specific user by email
-- SELECT * FROM "User" WHERE email = 'user@example.com';

