const { DataTypes } = require('sequelize');
const sequelize = require('./database');


const NivelesEncuestaVehiculo = sequelize.define('nivelesencuestavehiculo', {
  idEncuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idParteNivelVehiculo: {
    type: DataTypes.INTEGER(2),
    allowNull: false,
  }
  

}, {
  tableName: 'nivelesencuestavehiculo',
  timestamps: false,
});

module.exports = NivelesEncuestaVehiculo;
