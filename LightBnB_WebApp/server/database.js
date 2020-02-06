// const db = require('./db');
const {pool} = require('./db');

// const properties = require('./json/properties.json');
// const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }
// exports.getUserWithEmail = getUserWithEmail;
const getUserWithEmail = function(email){
  return pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()])
  .then(res => res.rows[0])
  .catch(err => null)
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  // return Promise.resolve(users[id]);
  return pool.query(`SELECT * FROM users WHERE id = $1`, [id])
  .then(res => res.rows[0])
  .catch(err => null)
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);

  return pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`
    , [user.name, user.email.toLowerCase(), user.password] )
  .then(res => res.rows[0])
  .catch(err => null)
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const query = `SELECT r.property_id, p.owner_id, p.title, p.description, p.thumbnail_photo_url, p.cover_photo_url, 
    p.cost_per_night, p.parking_spaces, p.number_of_bathrooms, p.number_of_bedrooms, 
    p.country, p.street, p.city, p.province, p.post_code, p.active,
    r.id reservation_id, cost_per_night, start_date, end_date, AVG(rating) average_rating
    FROM reservations r
    INNER JOIN properties p on r.property_id = p.id
    INNER JOIN property_reviews pr ON pr.property_id = p.id AND pr.guest_id = r.guest_id
    WHERE r.guest_id = $1
      AND end_date <= now()::date
    GROUP BY r.id, p.id
    ORDER BY start_date DESC
    LIMIT $2;`
  return pool.query(query, [guest_id, limit])
  .then(res => res.rows[0])
  .catch(err => null)
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let connector = `WHERE`;
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id `;

  console.log("options", options)
  
  // city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `${connector} city LIKE $${queryParams.length} `;
    connector = `AND`;
  }
  
  // owner_id
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `${connector} owner_id = $${queryParams.length} `;
    connector = `AND`;
  }

  // minimum_price_per_night,
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `${connector} cost_per_night/100 >= $${queryParams.length} `;
    connector = `AND`;
  }

  // maximum_price_per_night,
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `${connector} cost_per_night/100 <= $${queryParams.length} `;
    connector = `AND`;
  }

  queryString += ` GROUP BY properties.id `

  // minimum_rating
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  } 

  queryParams.push(limit);
  
  queryString += ` ORDER BY cost_per_night LIMIT $${queryParams.length};`;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
  .then(res => res.rows)
  .catch(err => Error);
}

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
