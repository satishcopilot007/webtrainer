-- Repair invalid/zero course prices in production.
-- Run this in phpMyAdmin on the production database after deployment.

UPDATE courses
SET price = CASE
  WHEN category_id = 2 THEN 25000
  WHEN category_id = 1 THEN 22000
  WHEN category_id = 3 THEN 18000
  ELSE 14999
END
WHERE price IS NULL OR price <= 0;

-- Optional sanity check
SELECT category_id, COUNT(*) AS zero_price_courses
FROM courses
WHERE price <= 0
GROUP BY category_id;
