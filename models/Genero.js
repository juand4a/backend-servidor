const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Genero = sequelize.define('genero', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  genero: { // Cambio en el nombre de campo a minúsculas
    type: DataTypes.STRING(10),
    allowNull: false,
  },
}, {
  tableName: 'genero',
  timestamps: false,
});

module.exports = Genero;
