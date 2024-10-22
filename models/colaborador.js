const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Genero = require('./Genero');
const Cargo = require('./Cargo');
const TipoSangre = require('./TipoSangre')
const TipoContrato = require('./TipoContrato')
const Ciudad = require('./Ciudad')
const Eps = require('./eps')
const Afp = require('./afp')
const Portafolio = require('./portafolio')
const EstadoCivil = require('./estadoCivil')
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
    type: DataTypes.STRING,
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
  celularCorporativo: {
    type: DataTypes.STRING(15),
    defaultValue: null,
  },
  portafolioId: {
    type: DataTypes.INTEGER(2),
    defaultValue: null,
  },
  serial_zebra: {
    type: DataTypes.STRING(17),
    defaultValue: null,
  },
  serial_tablet: {
    type: DataTypes.STRING(17),
    defaultValue: null,
  },
  placa: {
    type: DataTypes.STRING(10),
    defaultValue: null,
  },
  codigoVendedor:{
    type:DataTypes.STRING(10),
    defaultValue:null
  }

}, {
  tableName: 'colaborador',
  timestamps: false,
});
Colaborador.belongsTo(Genero, { foreignKey: 'genero', as: 'genero_asociation' });
Colaborador.belongsTo(Cargo, { foreignKey: 'cargo', as: 'cargo_asociation' });
Colaborador.belongsTo(TipoSangre, { foreignKey: 'grupoSanguineo', as: 'tipoSangre_asociation' });
Colaborador.belongsTo(TipoContrato, { foreignKey: 'tipoContrato', as: 'tipoContrato_asociation' });
Colaborador.belongsTo(Ciudad, { foreignKey: 'ciudadNacimiento', as: 'ciudadNacimiento_asociation' });
Colaborador.belongsTo(Ciudad, { foreignKey: 'ciudadResidencia', as: 'ciudadResidencia_asociation' });
Colaborador.belongsTo(Eps, { foreignKey: 'eps', as: 'eps_asociation' });
Colaborador.belongsTo(Afp, { foreignKey: 'afp', as: 'afp_asociation' });
Colaborador.belongsTo(Portafolio, { foreignKey: 'portafolioId', as: 'portafolio_asociation' });
Colaborador.belongsTo(EstadoCivil, { foreignKey: 'estadoCivil', as: 'estadoCivil_asociation' });
// Relación de un colaborador con su jefe inmediato
Colaborador.belongsTo(Colaborador, {
  foreignKey: 'jefeInmediato',  // Clave que almacena el documento del jefe
  targetKey: 'documento',       // Campo en el modelo Colaborador al que apunta 'jefeInmediato'
  as: 'jefe_asociation'
});

module.exports = Colaborador;
