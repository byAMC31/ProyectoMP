const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Ensure this path is correct

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordChangedAt: {
    type: DataTypes.DATE,  // Nuevo campo para registrar cuando cambia la contraseña
    allowNull: true,
  }
}, {
  timestamps: false,  // No timestamps
  tableName: 'users',  // Table name
});

module.exports = User;