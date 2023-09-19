const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ciudad = sequelize.define('ciudad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ciudad: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  departamento: {
    type: DataTypes.INTEGER(3),
    allowNull: false,
  },

 
}, {
  tableName: 'ciudad',
  timestamps: false,
});

module.exports = Ciudad;
