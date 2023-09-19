const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cargo = sequelize.define('cargo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cargo: {
    type: DataTypes.STRING(35),
    allowNull: false,
  },
  area: {
    type: DataTypes.INTEGER(2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
  },
 
}, {
  tableName: 'cargo',
  timestamps: false,
});

module.exports = Cargo;
