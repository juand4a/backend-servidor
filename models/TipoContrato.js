const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoContrato = sequelize.define('tipocontrato', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipoContrato: {
    type: DataTypes.STRING(40),
    allowNull: false,
  }
 
}, {
  tableName: 'tipocontrato',
  timestamps: false,
});

module.exports = TipoContrato;
