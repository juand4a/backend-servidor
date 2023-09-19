const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const ElementosProteccionEncuestaVehiculo = sequelize.define('elementosproteccionencuestavehiculo', {
  idEncuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idElementoProteccion: {
    type: DataTypes.INTEGER(2),
    allowNull: false,
  },
  verificado: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
  },
  

}, {
  tableName: 'elementosproteccionencuestavehiculo',
  timestamps: false,
});

module.exports = ElementosProteccionEncuestaVehiculo;
