const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Portafolio = sequelize.define('portafolio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  portafolio: {
    type: DataTypes.STRING(15),
    allowNull: false,
  }
 
}, {
  tableName: 'portafolio',
  timestamps: false,
});

module.exports = Portafolio;
