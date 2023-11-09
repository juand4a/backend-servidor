const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Colaborador = require('./colaborador');

const Permisos = sequelize.define('permisos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  documento_colaborador: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  fechaPublicacion: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fechaPermiso: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estadoPermiso: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  estadoPermisoJefeArea: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  estadoPermsioGestionHumana: {
    type: DataTypes.STRING(11),
    allowNull: false,
  }
 
 
}, {
  tableName: 'permisos',
  timestamps: false,
});
Permisos.belongsTo(Colaborador, { foreignKey: 'documento_colaborador', targetKey: 'documento', as: 'colaborador_asociation' });


module.exports = Permisos;
