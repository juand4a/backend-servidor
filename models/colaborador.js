const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Genero = require('./Genero');
const Cargo = require('./Cargo');

const Colaborador = sequelize.define('colaborador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  documento: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  nombres: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  genero: {
    type: DataTypes.INTEGER(2),
    defaultValue: null,
  },
  celular: {
    type: DataTypes.STRING(15),
    defaultValue: null,
  },
  fechaNacimiento: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  fechaIngreso: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  cargo: {
    type: DataTypes.INTEGER(3),
    allowNull: false,
  },
  salario: {
    type: DataTypes.INTEGER(9),
    defaultValue: null,
  },
  ciudadNacimiento: {
    type: DataTypes.INTEGER(5),
    defaultValue: null,
  },
  ciudadResidencia: {
    type: DataTypes.INTEGER(5),
    defaultValue: null,
  },
  direccionResidencia: {
    type: DataTypes.STRING(60),
    defaultValue: null,
  },
  tipoContrato: {
    type: DataTypes.INTEGER(2),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  pw: {
    type: DataTypes.STRING(256),
    defaultValue: null,
  },
  estadoEmpleado: {
    type: DataTypes.INTEGER(11),
    defaultValue: null,
  },
  estadoCuenta: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  qrCodeUrl: {
    type: DataTypes.STRING(256),
    defaultValue: null,
  },
  fotoUrl: {
    type: DataTypes.STRING(200),
    defaultValue: null,
  },
  jefeInmediato: {
    type: DataTypes.INTEGER(11),
    defaultValue: null,
  },
  eps: {
    type: DataTypes.INTEGER(3),
    defaultValue: null,
  },
  afp: {
    type: DataTypes.INTEGER(1),
    defaultValue: null,
  },
  grupoSanguineo: {
    type: DataTypes.INTEGER(2),
    defaultValue: null,
  },
  estrato: {
    type: DataTypes.INTEGER(2),
    defaultValue: null,
  },
  estadoCivil: {
    type: DataTypes.INTEGER(2),
    defaultValue: null,
  },
  telefonoFijo: {
    type: DataTypes.STRING(20),
    defaultValue: null,
  },
  estatura: {
    type: DataTypes.INTEGER(3),
    defaultValue: null,
  },
  peso: {
    type: DataTypes.INTEGER(3),
    defaultValue: null,
  },
  
}, {
  tableName: 'colaborador',
  timestamps: false,
});
Colaborador.belongsTo(Genero, { foreignKey: 'genero', as: 'genero_asociation' });
Colaborador.belongsTo(Cargo, { foreignKey: 'cargo', as: 'cargo_asociation' });

module.exports = Colaborador;
