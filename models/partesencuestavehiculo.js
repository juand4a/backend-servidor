const { DataTypes } = require('sequelize');
const sequelize = require('./database');


const PartesEncuestaVehiculo = sequelize.define('partesencuestavehiculo', {
  idEncuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idParteVehiculo: {
    type: DataTypes.INTEGER(2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
  },
  

}, {
  tableName: 'partesencuestavehiculo',
  timestamps: false,
});

module.exports = PartesEncuestaVehiculo;
