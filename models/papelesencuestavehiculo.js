const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Papeles=require('./papelesVehiculo')

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
PapelesEncuestaVehiculo.belongsTo(Papeles, { foreignKey: 'idPapelVehiculo', as: 'papelesencuestavehiculo_asociation' });

module.exports = PapelesEncuestaVehiculo;
