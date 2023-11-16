const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Afp = sequelize.define('adminfondopension', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  afp: {
    type: DataTypes.STRING(45),
    allowNull: false,
  }
 
}, {
  tableName: 'adminfondopension',
  timestamps: false,
});

module.exports = Afp;
