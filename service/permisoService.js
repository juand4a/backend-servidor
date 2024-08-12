// services/permisoService.js

const Permisos = require('../models/permisos');
const Colaborador = require('../models/colaborador');
const Cargo = require('../models/Cargo');
const { Op } = require('sequelize');
const Sequelize = require('../config/database');
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
    return {}; // Default case
  }
};

const createPermiso = async (data) => {
  const fechaPublicacion = moment().format('YYYY-MM-DD');

  return await Permisos.create({
    ...data,
    fechaPublicacion,
    estadoPermiso: "Pendiente",
    estadoPermisoJefeArea: "Pendiente",
    estadoPermsioGestionHumana: "Pendiente",
  });
};

const updatePermisos = async (documento, id, cargo, updateData) => {
  const whereClause = { documento_colaborador: documento, id };

  let dataToUpdate = {};

  if (['8', '1', '2', '4', '3'].includes(cargo)) {
    dataToUpdate = {
      estadoPermiso: updateData.estadoPermiso,
      estadoPermsioGestionHumana: updateData.estadoPermsioGestionHumana,
    };
  } else {
    dataToUpdate = {
      estadoPermisoJefeArea: updateData.estadoPermisoJefeArea,
    };
  }

  const [updatedRows] = await Permisos.update(dataToUpdate, { where: whereClause });
  return updatedRows;
};

const getAllPermisos = async (cargo) => {
  const whereClause = getWhereClauseByCargo(cargo);

  return await Permisos.findAll({
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
};

const getAllPermisosByColaborador = async (documento) => {
  return await Permisos.findAll({
    where: { documento_colaborador: documento },
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation'
      }
    ]
  });
};

const getAllPermisosCount = async (cargo) => {
  const whereClause = getWhereClauseByCargo(cargo);

  return await Permisos.findAll({
    where: whereClause,
    attributes: [
      'descripcion',
      [Sequelize.fn('COUNT', Sequelize.col('descripcion')), 'cantidad']
    ],
    group: ['descripcion'],
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
};

module.exports = {
  createPermiso,
  updatePermisos,
  getAllPermisos,
  getAllPermisosByColaborador,
  getAllPermisosCount,
};
