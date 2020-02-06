// const pg = require('pg');

// const config = {
//     user: 'vagrant',
//     password: '123',
//     database: 'lightbnb',
//     host: 'localhost'
// };

// const client = new pg.Client(config);

// client.connect();

// module.exports = client;


const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

module.exports = {pool};