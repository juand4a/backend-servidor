const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Niveles=require('./nivelesvehiculo')

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
NivelesEncuestaVehiculo.belongsTo(Niveles, { foreignKey: 'idParteNivelVehiculo', as: 'nivelesencuestavehiculo_asociation' });


module.exports = NivelesEncuestaVehiculo;
