const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Devoluciones = sequelize.define('devoluciones', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mes: {
    type: DataTypes.STRING(12),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  codigo_vendedor: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },cliente: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },ruta: {
    type: DataTypes.INTEGER(3),
    allowNull: false,
  },motivo: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },valor_devolucion: {
    type: DataTypes.INTEGER(10),
    allowNull: false,
  },municipio: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },supervisor_unitario: {
    type: DataTypes.STRING(25),
    allowNull: false,
  }
 
}, {
  tableName: 'devoluciones',
  timestamps: false,
});

module.exports = Devoluciones;
