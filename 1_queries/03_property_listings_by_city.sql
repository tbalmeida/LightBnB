SELECT p.*, AVG(rating) average_rating
FROM properties p
INNER JOIN property_reviews pr ON p.id = pr.property_id
WHERE city like '%ancouv%'
GROUP BY p.id, title, cost_per_night
HAVING AVG(rating) >= 4
ORDER BY cost_per_night ASC
LIMIT 10;