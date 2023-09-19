const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const EncuestaVehiculo = sequelize.define('encuestavehiculo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idColaborador: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
  },
  placa: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  kilometraje: {
    type: DataTypes.INTEGER(8),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  

}, {
  tableName: 'encuestavehiculo',
  timestamps: false,
});

module.exports = EncuestaVehiculo;
