\c lightbnb

-- Users
INSERT INTO users (id, name, email, password) VALUES 
  (1, 'Joe Walker', 'jw@provider.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  (2, 'Jack Daniel', 'jd@provider.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  (3, 'Jim Macalan', 'macalan@provider.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

ALTER SEQUENCE users_id_seq RESTART WITH 4;

-- Properties
INSERT INTO properties ( id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, 
  parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) VALUES 
  ( 1, 1, 'Awesome Downtown view', 'Unit located at the 30th floor, recently renovated', 'my_url', 'my_cover_url', 90, 
  1, 1.5, 2, 'Canada', '134 2nd Street SW', 'Calgary', 'AB', 'T2R', true),

( 2, 1, 'Great place, walking distante to anything', 'Townhouse near the Nordic Centre', 'my_url', 'my_cover_url', 130, 
  2, 3, 2, 'Canada', '10 Three Sisters Parkway', 'Canmore', 'AB', 'T6Z', true),

( 3, 2, 'Finished basement, fully furnished', 'Private entrance and a parking spot.', 'my_url', 'my_cover_url', 65, 
  1, 1, 1, 'Canada', '19th Street NW', 'Calgary', 'AB', 'T2D', true);

ALTER SEQUENCE properties_id_seq RESTART WITH 4;

-- Reservations
INSERT INTO reservations (id, start_date, end_date, property_id, guest_id) VALUES 
(1, '2019-10-01', '2019-10-15', 1, 2),
(2, '2019-12-20', '2019-12-30', 1, 3),
(3, '2019-11-10', '2019-11-25', 3, 1);
ALTER SEQUENCE reservations_id_seq RESTART WITH 4;

-- Reviews
INSERT INTO property_reviews (reservation_id, property_id, guest_id, message, rating) VALUES
(1, 1, 2, 'Great location, the view is nice!', 4),
(2, 1, 3, 'The best getaway! Not as busy as Banff, and so close to trails and the town', 5),
(3, 3, 1, 'It worked nicely and has a great price point too', 4);
ALTER SEQUENCE property_reviews_id_seq RESTART WITH 4;