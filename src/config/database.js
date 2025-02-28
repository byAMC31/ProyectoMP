require('dotenv').config();  // Cargar variables de entorno antes de cualquier otro import

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    dialectOptions: {
      encrypt: true,
      trustServerCertificate: true,
    },
    charset: 'utf8', 
  }
);

module.exports = sequelize;
