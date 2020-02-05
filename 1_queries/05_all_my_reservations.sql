SELECT
  r.property_id, p.owner_id, p.title, p.description, 
  p.thumbnail_photo_url, p.cover_photo_url, 
  p.cost_per_night, p.parking_spaces, p.number_of_bathrooms, p.number_of_bedrooms, 
  p.country, p.street, p.city, p.province, p.post_code, p.active,
  r.id reservation_id, cost_per_night, start_date, end_date, AVG(rating) average_rating

FROM reservations r
INNER JOIN properties p on r.property_id = p.id
INNER JOIN property_reviews pr ON pr.property_id = p.id AND pr.guest_id = r.guest_id
WHERE r.guest_id = 1
  AND end_date <= now()::date
GROUP BY r.id, p.id
ORDER BY start_date DESC;