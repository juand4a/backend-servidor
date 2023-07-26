const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Genero = sequelize.define('genero', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Genero: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
 
}, {
  tableName: 'genero',
  timestamps: false,
});

module.exports = Genero;
