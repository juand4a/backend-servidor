const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const NivelesVehiculo = sequelize.define('nivelesvehiculo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parteNivelVehiculo: {
    type: DataTypes.STRING(40),
    allowNull: false,
  }
  
}, {
  tableName: 'nivelesvehiculo',
  timestamps: false,
});


module.exports = NivelesVehiculo;
