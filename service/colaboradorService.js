// services/colaboradorService.js

const Colaborador = require('../models/colaborador');
const Genero = require('../models/Genero');
const Cargo = require('../models/Cargo');
const Ciudad = require('../models/Ciudad');
const tipoSangre = require('../models/TipoSangre');
const tipoContrato = require('../models/TipoContrato');
const Eps = require('../models/eps');
const Afp = require('../models/afp');
const Portafolio = require('../models/portafolio');
const EstadoCivil = require('../models/estadoCivil');
const { Op, literal } = require('sequelize');
const sequelize = require('../config/database');

const createColaborador = async (colaboradorData) => {
  try {
    const colaborador = await Colaborador.create(colaboradorData);
    return colaborador;
  } catch (error) {
    throw new Error('Error al crear el colaborador');
  }
};

const getAllColaboradores = async () => {
  return await Colaborador.findAll({
    include: [
      { model: Genero, attributes: ['genero'], as: 'genero_asociation' },
      { model: Cargo, attributes: ['cargo', 'area'], as: 'cargo_asociation' },
      { model: tipoSangre, attributes: ['grupoSanguineo'], as: 'tipoSangre_asociation' },
      { model: tipoContrato, attributes: ['tipoContrato'], as: 'tipoContrato_asociation' },
      { model: Ciudad, attributes: ['ciudad'], as: 'ciudadNacimiento_asociation' },
      { model: Ciudad, attributes: ['ciudad'], as: 'ciudadResidencia_asociation' },
      { model: Eps, attributes: ['eps'], as: 'eps_asociation' },
      { model: Afp, attributes: ['afp'], as: 'afp_asociation' },
      { model: Portafolio, attributes: ['portafolio'], as: 'portafolio_asociation' },
      { model: EstadoCivil, attributes: ['estadoCivil'], as: 'estadoCivil_asociation' },
    ],
  });
};

const getColaboradorById = async (id) => {
  return await Colaborador.findByPk(id, {
    include: [
      { model: Genero, attributes: ['genero'], as: 'genero_asociation' },
      { model: Cargo, attributes: ['cargo'], as: 'cargo_asociation' },
      { model: tipoContrato, attributes: ['tipoContrato'], as: 'tipoContrato_asociation' },
    ],
  });
};

const updateColaborador = async (documento, colaboradorData) => {
  const [updatedRows] = await Colaborador.update(colaboradorData, { where: { documento } });
  return updatedRows;
};

const deleteColaborador = async (id) => {
  const deletedRows = await Colaborador.destroy({ where: { id } });
  return deletedRows;
};

const getAllColaboradoresByGenero = async (cargo) => {
  let whereClause = {};

  if (cargo === '16') {
    whereClause = { cargo: { [Op.or]: ['17', '18', '19', '20', '21', '22'] } };
  } else if (cargo === '10') {
    whereClause = { cargo: { [Op.or]: ['11', '12', '13', '14', '15'] } };
  }

  const result = await Colaborador.findAll({
    where: whereClause,
    attributes: [
      [sequelize.literal("SUM(CASE WHEN genero = '1' THEN 1 ELSE 0 END)"), 'masculino'],
      [sequelize.literal("SUM(CASE WHEN genero = '2' THEN 1 ELSE 0 END)"), 'femenino'],
      [sequelize.literal("SUM(CASE WHEN genero = '3' THEN 1 ELSE 0 END)"), 'lgbtq'],
    ],
  });

  return result[0].dataValues;
};

const getAllColaboradoresTotal = async (cargo) => {
  let whereClause = {};

  if (cargo === '16') {
    whereClause = { cargo: { [Op.or]: ['17', '18', '19', '20', '21', '22'] } };
  } else if (cargo === '10') {
    whereClause = { cargo: { [Op.or]: ['11', '12', '13', '14', '15'] } };
  }

  return await Colaborador.count({ where: whereClause });
};

const getAllColaboradoresByCargo = async () => {
  const result = await Colaborador.findAll({
    attributes: [
      [sequelize.literal("SUM(CASE WHEN cargo = '1' THEN 1 ELSE 0 END)"), 'GerenteGeneral'],
      [sequelize.literal("SUM(CASE WHEN cargo = '2' THEN 1 ELSE 0 END)"), 'Administrador'],
      [sequelize.literal("SUM(CASE WHEN cargo = '3' THEN 1 ELSE 0 END)"), 'CoordinadorDesarrolloHumano'],
      // ... Otros cargos aquí
    ],
  });

  return result[0].dataValues;
};

const getAllColaboradoresByAprendiz = async () => {
  const result = await Colaborador.findAll({
    attributes: [
      [sequelize.literal("SUM(CASE WHEN cargo = '11' THEN 1 ELSE 0 END)"), 'Aprendiz'],
    ],
  });

  return result[0].dataValues;
};

module.exports = {
  createColaborador,
  getAllColaboradores,
  getColaboradorById,
  updateColaborador,
  deleteColaborador,
  getAllColaboradoresByGenero,
  getAllColaboradoresTotal,
  getAllColaboradoresByCargo,
  getAllColaboradoresByAprendiz,
};
