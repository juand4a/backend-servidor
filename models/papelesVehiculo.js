const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const PapelesVehiculo = sequelize.define('papelesvehiculo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  papel: {
    type: DataTypes.STRING(60),
    allowNull: false,
  }
  
}, {
  tableName: 'papelesvehiculo',
  timestamps: false,
});


module.exports = PapelesVehiculo;
