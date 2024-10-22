const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const partesencuestavehiculo=require('./partesencuestavehiculo')
const papelesencuestavehiculo=require('./papelesencuestavehiculo')
const herramientasencuestavehiculo=require('./herramientasencuestavehiculo')
const nivelesencuestavehiculo=require('./nivelesencuestavehiculo')
const elementosproteccionencuestavehiculo=require('./elementosproteccionencuestavehiculo')
const puntos=require('./Puntos')
const encuestavehiculo=require('./encuestavehiculo')
const Colaborador=require('./colaborador')

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
    allowNull: true,
  },
  placa: {
    type: DataTypes.STRING(20),
    defaultValue: null,
  },
  tipo_vehiculo: {
    type: DataTypes.STRING(20),
    defaultValue: null,
  },
  foto_salida: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
 latitud_salida: {
    type: DataTypes.DECIMAL(9,6),
    defaultValue: null,
  },
  longitud_salida: {
    type: DataTypes.DECIMAL(9,6),
    defaultValue: null,
  },
  foto_entrada: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  latitud_entrada: {
    type: DataTypes.DECIMAL(9,6),
    defaultValue: null,
  },
  longitud_entrada: {
    type: DataTypes.DECIMAL(9,6),
    defaultValue: null,
  },kilometraje_salida: {
    type: DataTypes.STRING(10),
    allowNull: true
    },primer_cliente:{
      type: DataTypes.STRING(100),
      allowNull: true
    }

}, {
  tableName: 'entrada',
  timestamps: false,
});
Entrada.hasMany(partesencuestavehiculo);
Entrada.hasMany(papelesencuestavehiculo);
Entrada.hasMany(herramientasencuestavehiculo);
Entrada.hasMany(nivelesencuestavehiculo);
Entrada.hasMany(elementosproteccionencuestavehiculo);
Entrada.hasMany(encuestavehiculo)
Entrada.hasMany(puntos);

Entrada.belongsTo(Colaborador, { foreignKey: 'documento_colaborador', targetKey: 'documento', as: 'colaborador_asociation' });


module.exports = Entrada;
