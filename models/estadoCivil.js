const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EstadoCivil = sequelize.define('estadocivil', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  estadoCivil: {
    type: DataTypes.STRING(25),
    allowNull: false,
  }
 
}, {
  tableName: 'estadocivil',
  timestamps: false,
});

module.exports = EstadoCivil;
