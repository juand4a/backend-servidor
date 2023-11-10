const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const ElementosProteccion = sequelize.define('elementosproteccion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  elementosProteccion: {
    type: DataTypes.STRING(20),
    allowNull: false,
  }
  
}, {
  tableName: 'elementosproteccion',
  timestamps: false,
});


module.exports = ElementosProteccion;
