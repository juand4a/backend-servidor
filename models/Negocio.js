const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definir el modelo `Negocio`
const Negocio = sequelize.define('Negocio', {
  nombre_negocio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nit_negocio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estrato_negocio: {
    type: DataTypes.STRING,
  },
  segmento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  celular_cliente: {
    type: DataTypes.STRING,
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
  },
  foto_antes: {
    type: DataTypes.STRING,
  },
  foto_despues: {
    type: DataTypes.STRING,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false, // Si no necesitas campos de createdAt y updatedAt
  tableName: 'negocios',
});

module.exports = Negocio;
