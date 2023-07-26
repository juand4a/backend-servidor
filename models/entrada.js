const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const partesencuestavehiculo=require('./partesencuestavehiculo')
const papelesencuestavehiculo=require('./papelesencuestavehiculo')
const herramientasencuestavehiculo=require('./herramientasencuestavehiculo')
const nivelesencuestavehiculo=require('./nivelesencuestavehiculo')

const Entrada = sequelize.define('entrada', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  documento_colaborador: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  entrada: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  salida: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  cliente: {
    type: DataTypes.STRING(35),
    allowNull: false,
  },
  kilometraje: {
    type: DataTypes.INTEGER(2),
    defaultValue: null,
  },
  placa: {
    type: DataTypes.STRING(20),
    defaultValue: null,
  },
  tipo_vehiculo: {
    type: DataTypes.STRING(20),
    defaultValue: null,
  },

}, {
  tableName: 'entrada',
  timestamps: false,
});
Entrada.hasMany(partesencuestavehiculo);
Entrada.hasMany(papelesencuestavehiculo);
Entrada.hasMany(herramientasencuestavehiculo);
Entrada.hasMany(nivelesencuestavehiculo);

module.exports = Entrada;
