const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Capacitacion = sequelize.define('capacitacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  video: {
    type: DataTypes.STRING,
    allowNull: false,
  }
 
}, {
  tableName: 'capacitacion',
  timestamps: false,
});

module.exports = Capacitacion;
