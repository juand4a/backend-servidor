const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Colaborador=require('./colaborador')
const Comentarios = sequelize.define('comentarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  anuncio_id: { // Cambio en el nombre de campo a minúsculas
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idUsuario: { // Cambio en el nombre de campo a minúsculas
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comentario: { // Cambio en el nombre de campo a minúsculas
    type: DataTypes.STRING(255),
    allowNull: false,
  },  
  fecha: { // Cambio en el nombre de campo a minúsculas
    type: DataTypes.DATE,
    allowNull: false,
  },
  
}, {
  tableName: 'comentarios',
  timestamps: false,
});
Comentarios.belongsTo(Colaborador, { foreignKey: 'idUsuario', as: 'colaborador_asociation' });


module.exports = Comentarios;
