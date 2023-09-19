const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const estadoSolicitud = sequelize.define('estadoSolicitud', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  estadoSolicitud: { // Cambio en el nombre de campo a minúsculas
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'estadoSolicitud',
  timestamps: false,
});

module.exports = estadoSolicitud;
