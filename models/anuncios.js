const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Likes=require('./likes')

const Anuncios = sequelize.define('anuncios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  contenido: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  fechaPublicacion: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipoAnuncio: {
    type: DataTypes.STRING(25),
    allowNull: false,
  }, 
   documento_colaborador: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
 
}, {
  tableName: 'anuncios',
  timestamps: false,
});
Anuncios.hasMany(Likes, { foreignKey: 'anuncio_id', as: 'likes_asociation' });

module.exports = Anuncios;
