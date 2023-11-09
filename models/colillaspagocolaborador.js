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
    allowNull: false
  ,
  },
  fechaPago: { 
    type: DataTypes.DATE,
    allowNull: false,
  },
  fechaSubida: { 
    type: DataTypes.DATE,
    allowNull: false,
  },
  url: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaPeriodoInicio: { 
    type: DataTypes.DATE,
    allowNull: false,
  },
  fechaPeriodoFin: { 
    type: DataTypes.DATE,
    allowNull: false,
  },
  facturaPago: { 
    type: DataTypes.INTEGER(11),
    allowNull: false,
  },
  
}, {
  tableName: 'colillaspagocolaborador',
  timestamps: false,
});

module.exports = Colillas;
