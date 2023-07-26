const { DataTypes } = require('sequelize');
const sequelize = require('./database');


const PapelesEncuestaVehiculo = sequelize.define('papelesencuestavehiculo', {
  idEncuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idPapelVehiculo: {
    type: DataTypes.INTEGER(2),
    allowNull: false,
  },
  poseeDocumento: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
  },
  

}, {
  tableName: 'papelesencuestavehiculo',
  timestamps: false,
});

module.exports = PapelesEncuestaVehiculo;
