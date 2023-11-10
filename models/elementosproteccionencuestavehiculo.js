const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ElementosProteccion=require('./elementosproteccion')


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

ElementosProteccionEncuestaVehiculo.belongsTo(ElementosProteccion, { foreignKey: 'idElementoProteccion', as: 'elementosProteccion_asociation' });


module.exports = ElementosProteccionEncuestaVehiculo;
