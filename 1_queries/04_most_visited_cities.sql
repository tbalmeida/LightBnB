SELECT city, count(r.id) total_reservations
FROM properties p
INNER JOIN reservations r ON p.id = r.property_id
GROUP BY city
ORDER BY count(r.id) DESC;