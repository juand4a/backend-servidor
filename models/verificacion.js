const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Verificación = sequelize.define('verificacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  correo: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
 
}, {
  tableName: 'verificacion',
  timestamps: false,
});



module.exports = Verificación;