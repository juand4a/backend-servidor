const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Colillas = sequelize.define('colillaspagocolaborador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  docid: {
    type: DataTypes.INTEGER(11),
    allowNull: true
  ,
  },
  fechaPago: { 
    type: DataTypes.DATE,
    allowNull: true,
  },
  fechaSubida: { 
    type: DataTypes.DATE,
    allowNull: false,
  },
  url: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
  fechaPeriodoInicio: { 
    type: DataTypes.DATE,
    allowNull: true,
  },
  fechaPeriodoFin: { 
    type: DataTypes.DATE,
    allowNull: true,
  },
  facturaPago: { 
    type: DataTypes.INTEGER(11),
    allowNull: true,
  },
  
}, {
  tableName: 'colillaspagocolaborador',
  timestamps: false,
});

module.exports = Colillas;
