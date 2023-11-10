const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const HerramientasVehiculo = sequelize.define('herramientasvehiculo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  herramienta: {
    type: DataTypes.STRING(30),
    allowNull: false,
  }
  
}, {
  tableName: 'herramientasvehiculo',
  timestamps: false,
});


module.exports = HerramientasVehiculo;
