const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Herramientas=require('./herramientasVehiculo')


const HerramientasEncuestaVehiculo = sequelize.define('herramientasencuestavehiculo', {
  idEncuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idHerramientaVehiculo: {
    type: DataTypes.INTEGER(2),
    allowNull: false,
  },
  verificado: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
  },
  

}, {
  tableName: 'herramientasencuestavehiculo',
  timestamps: false,
});

HerramientasEncuestaVehiculo.belongsTo(Herramientas, { foreignKey: 'idHerramientaVehiculo', as: 'herramientasencuestavehiculo_asociation' });


module.exports = HerramientasEncuestaVehiculo;
