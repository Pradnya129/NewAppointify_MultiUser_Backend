// config/db.js

require('dotenv').config(); // ✅ Must be at the top

const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Optional: verify connection
sequelize.authenticate()
  .then(() => console.log('✅ DB connected successfully'))
  .catch((err) => console.error('❌ DB connection error:', err));

module.exports = sequelize;
