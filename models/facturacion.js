const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facturacion = sequelize.define('facturacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  colilla_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  colaborador_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  
  },
  pagina: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'facturacion',
  timestamps: false,
});

module.exports = Facturacion;
