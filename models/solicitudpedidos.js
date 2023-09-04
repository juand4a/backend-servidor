const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Productos=require('./productos')
const EstadoSolicitud = require('./EstadoSolicitud');

const SolicitudPedidos = sequelize.define('solicitudpedidos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_producto: {
    type: DataTypes.INTEGER(4),
    allowNull: false,
  },
  documento_colaborador: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  estadoSolicitud: {
    type: DataTypes.INTEGER(5),
    allowNull: false,
  },
  descripcion: {
    type : DataTypes.STRING(255),
    allowNull: false,
  },
  precio: {
    type : DataTypes.INTEGER(10),
    allowNull: false,
  },
}, {
  tableName: 'solicitudpedidos',
  timestamps: false,
});
SolicitudPedidos.belongsTo(EstadoSolicitud, { foreignKey: 'estadoSolicitud', as: 'estado_asociation' });
SolicitudPedidos.belongsTo(Productos, { foreignKey: 'id_producto', as: 'producto_asociation' });

module.exports = SolicitudPedidos;
