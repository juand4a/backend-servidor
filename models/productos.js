const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Productos = sequelize.define('productos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(55),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(125),
    allowNull: false,
  },
  precio: {
    type: DataTypes.INTEGER(10),
    allowNull: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  imagen_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

}, {
  tableName: 'productos',
  timestamps: false,
});

module.exports = Productos;
