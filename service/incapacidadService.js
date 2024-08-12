// services/incapacidadService.js

const Incapacidad = require('../models/incapacidad');
const Colaborador = require('../models/colaborador');
const Cargo = require('../models/Cargo');
const { Op } = require('sequelize');
const moment = require('moment');

// Helper function to determine where clause based on cargo
const getWhereClauseByCargo = (cargo) => {
  if (['8', '1', '2', '4', '3'].includes(cargo)) {
    return {};
  } else if (cargo === '16') {
    return {
      '$colaborador_asociation.cargo$': { [Op.or]: ['17', '18', '19', '20', '21', '22'] }
    };
  } else if (cargo === '10') {
    return {
      '$colaborador_asociation.cargo$': { [Op.or]: ['11', '12', '13', '14', '15'] }
    };
  } else {
    return {}; // Default case, no additional filtering
  }
};

const createIncapacidad = async ({ documento_colaborador, archivo }) => {
  const fechaPublicacion = moment().format('YYYY-MM-DD'); // Fecha actual en formato 'yyyy-mm-dd'

  const incapacidad = await Incapacidad.create({
    documento_colaborador,
    archivo,
    fechaPublicacion,
    estadoIncapacidad: "Pendiente",
    estadoIncapacidadJefeArea: "Pendiente",
    estadoIncapacidadGestionHumana: "Pendiente"
  });

  return incapacidad;
};

const getAllIncapacidad = async (cargo) => {
  const whereClause = getWhereClauseByCargo(cargo);

  const incapacidades = await Incapacidad.findAll({
    where: whereClause,
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation',
        include: [
          {
            model: Cargo,
            attributes: ['cargo'],
            as: 'cargo_asociation'
          }
        ]
      }
    ]
  });

  return incapacidades;
};

const updateIncapacidad = async (documento, id, cargo, { estadoIncapacidad, estadoIncapacidadGestionHumana, estadoIncapacidadJefeArea }) => {
  const whereClause = {
    documento_colaborador: documento,
    id: id
  };

  let dataToUpdate = {};

  if (['8', '1', '2', '4', '3'].includes(cargo)) {
    dataToUpdate = {
      estadoIncapacidad,
      estadoIncapacidadGestionHumana
    };
  } else {
    dataToUpdate = {
      estadoIncapacidadJefeArea
    };
  }

  const [updatedRows] = await Incapacidad.update(dataToUpdate, { where: whereClause });

  return updatedRows;
};

module.exports = {
  createIncapacidad,
  getAllIncapacidad,
  updateIncapacidad
};
