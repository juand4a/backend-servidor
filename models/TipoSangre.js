const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoSangre = sequelize.define('tipoSangre', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  grupoSanguineo: { // Cambio en el nombre de campo a minúsculas
    type: DataTypes.STRING(5),
    allowNull: false,
  },
}, {
  tableName: 'gruposanguineo',
  timestamps: false,
});

module.exports = TipoSangre;
