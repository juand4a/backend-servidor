const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Likes = sequelize.define('likes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  anuncio_id: { // Cambio en el nombre de campo a minúsculas
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_id: { // Cambio en el nombre de campo a minúsculas
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'likes',
  timestamps: false,
});

module.exports = Likes;
