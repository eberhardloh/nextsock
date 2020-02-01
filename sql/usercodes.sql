SELECT
   users.id,
   SUBSTR(MD5(CONCAT(users.id, users.email)), users.id % 24 + 1, 8) AS usercode,
   users.username,
   users.role
FROM users
