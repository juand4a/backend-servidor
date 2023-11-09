const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Area = sequelize.define('areacargo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  area: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  estado: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
  },
 
}, {
  tableName: 'areacargo',
  timestamps: false,
});



module.exports = Area;