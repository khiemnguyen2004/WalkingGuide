require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  ssl: { rejectUnauthorized: false } // Enable SSL for Render
});

pool.connect()
  .then(() => console.log('Kết nối PostgreSQL thành công'))
  .catch((err) => console.error('Lỗi kết nối PostgreSQL:', err.stack));

module.exports = pool;
