const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

module.exports = {
  getUserWithId: (id) => {
    // return Promise.resolve(users[id]);
    return pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    .then(res => res.rows[0])
    .catch(err => null)
  },

  getUserWithEmail: (email) => {
    return pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()])
    .then(res => res.rows[0])
    .catch(err => null)
  },

  getAllReservations: (guest_id, limit = 10) => {
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
    .then(res => res.rows)
    .catch(err => null);
  },

  addUser: (user) => {
    return pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`
      , [user.name, user.email.toLowerCase(), user.password] )
    .then(res => res.rows[0])
    .catch(err => null)
  },

  getAllProperties: (options, limit = 10) => {
    const queryParams = [];
    let connector = `WHERE`;
    
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id `;
  
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `${connector} city LIKE $${queryParams.length} `;
      connector = `AND`;
    }
    
    if (options.owner_id) {
      queryParams.push(`${options.owner_id}`);
      queryString += `${connector} owner_id = $${queryParams.length} `;
      connector = `AND`;
    }
  
    if (options.minimum_price_per_night) {
      queryParams.push(`${options.minimum_price_per_night}`);
      queryString += `${connector} cost_per_night/100 >= $${queryParams.length} `;
      connector = `AND`;
    }
  
    if (options.maximum_price_per_night) {
      queryParams.push(`${options.maximum_price_per_night}`);
      queryString += `${connector} cost_per_night/100 <= $${queryParams.length} `;
      connector = `AND`;
    }
  
    queryString += ` GROUP BY properties.id `
  
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
  },

  addProperty: (property) => {
 
    property["cost_per_night"] = property["cost_per_night"] * 100;
    
    formValues = Object.values(property);
    return pool.query(
    `INSERT INTO properties 
        (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;`,
    [...formValues])
    .then(res => res.rows)
    .catch(err => console.log(err))
  }
}