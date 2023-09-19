const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Puntos = sequelize.define('puntos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  documento_colaborador: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  puntos: {
    type: DataTypes.INTEGER(4),
    allowNull: true,
  },
}, {
  tableName: 'puntos',
  timestamps: false,
});

module.exports = Puntos;
