const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Eps = sequelize.define('empresapromotorasalud', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eps: {
    type: DataTypes.STRING(45),
    allowNull: false,
  }
 
}, {
  tableName: 'empresapromotorasalud',
  timestamps: false,
});

module.exports = Eps;
