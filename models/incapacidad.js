const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Colaborador = require('./colaborador');

const Incapacidad = sequelize.define('incapacidad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  documento_colaborador: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  archivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaPublicacion: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estadoIncapacidad: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  estadoIncapacidadJefeArea: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  estadoIncapacidadGestionHumana: {
    type: DataTypes.STRING(11),
    allowNull: false,
  }
 
 
}, {
  tableName: 'incapacidad',
  timestamps: false,
});
Incapacidad.belongsTo(Colaborador, { foreignKey: 'documento_colaborador', targetKey: 'documento', as: 'colaborador_asociation' });


module.exports = Incapacidad;
