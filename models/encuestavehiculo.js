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


const ElementosProteccionEncuestaVehiculo = require('./elementosproteccionencuestavehiculo');
const HerramientasProteccionEncuestaVehiculo = require('./herramientasencuestavehiculo');
const NivelesEncuestaVehiculo = require('./nivelesencuestavehiculo');
const PapelesEncuestaVehiculo = require('./papelesencuestavehiculo');
const Colaborador=require('./colaborador')

// Configuración de asociaciones
EncuestaVehiculo.hasMany(ElementosProteccionEncuestaVehiculo, { foreignKey: 'idEncuesta', as: 'elementosProteccion' });
EncuestaVehiculo.hasMany(HerramientasProteccionEncuestaVehiculo, { foreignKey: 'idEncuesta', as: 'herramientasProteccion' });
EncuestaVehiculo.hasMany(NivelesEncuestaVehiculo, { foreignKey: 'idEncuesta', as: 'nivelesVehiculo' });
EncuestaVehiculo.hasMany(PapelesEncuestaVehiculo, { foreignKey: 'idEncuesta', as: 'papelesVehiculo' });
EncuestaVehiculo.belongsTo(Colaborador, { foreignKey: 'idColaborador', targetKey: 'documento', as: 'colaborador_asociation' });


module.exports = EncuestaVehiculo;
