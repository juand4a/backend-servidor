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

const getAllPermisosByCargo = async (cargo) => {
  let whereClause = {};

  // Define el filtro según el cargo
  if ([1, 2, 3, 4, 8].includes(cargo)) {
    // Mostrar todos los permisos
    whereClause = {};
  } else if (cargo === 10) {
    whereClause = {
      '$colaborador_asociation.cargo_asociation.cargo$': [11, 12, 13, 14, 15],
    };
  } else if (cargo === 16) {
    whereClause = {
      '$colaborador_asociation.cargo_asociation.cargo$': [17, 18, 19, 20, 21, 22],
    };
  } else {
    return [];
  }

  // Obtiene los permisos con los detalles del colaborador
  const permisos = await Permisos.findAll({
    where: whereClause,
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos', 'jefeInmediato'],
        as: 'colaborador_asociation',
        include: [
          {
            model: Cargo,
            attributes: ['cargo'],
            as: 'cargo_asociation',
          },
        ],
      },
    ],
  });

  // Busca los detalles del jefe para cada permiso
  const permisosConDetallesJefe = await Promise.all(permisos.map(async (permiso) => {
    // Verificar si colaborador_asociation y jefeInmediato existen
    const jefeDocumento = permiso.colaborador_asociation?.jefeInmediato;

    if (!jefeDocumento) {
      return {
        ...permiso.toJSON(),
        jefeDetalles: null
      };
    }

    const jefe = await Colaborador.findOne({
      where: { documento: jefeDocumento },
      attributes: ['nombres', 'apellidos'],
      include: [
        {
          model: Cargo,
          attributes: ['cargo'],
          as: 'cargo_asociation'
        }
      ]
    });

    return {
      ...permiso.toJSON(),
      jefeDetalles: jefe ? {
        nombres: jefe.nombres,
        apellidos: jefe.apellidos,
        cargo: jefe.cargo_asociation ? jefe.cargo_asociation.cargo : null,
      } : null
    };
  }));

  return permisosConDetallesJefe;
};

const getAllPermisosByColaborador = async (documento) => {
  // Obtén los permisos del colaborador
  const permisos = await Permisos.findAll({
    where: { documento_colaborador: documento },
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos', 'jefeInmediato'],
        as: 'colaborador_asociation'
      }
    ]
  });

  // Itera sobre cada permiso para obtener detalles del jefe
  const permisosConDetallesJefe = await Promise.all(permisos.map(async (permiso) => {
    // Verifica si existe jefeInmediato para el colaborador asociado
    const jefeDocumento = permiso.colaborador_asociation?.jefeInmediato;

    if (!jefeDocumento) {
      return {
        ...permiso.toJSON(),
        jefeDetalles: null
      };
    }

    // Busca los detalles del jefe
    const jefe = await Colaborador.findOne({
      where: { documento: jefeDocumento },
      attributes: ['nombres', 'apellidos'],
      include: [
        {
          model: Cargo,
          attributes: ['cargo'],
          as: 'cargo_asociation'
        }
      ]
    });

    return {
      ...permiso.toJSON(),
      jefeDetalles: jefe ? {
        nombres: jefe.nombres,
        apellidos: jefe.apellidos,
        cargo: jefe.cargo_asociation ? jefe.cargo_asociation.cargo : null,
      } : null
    };
  }));

  return permisosConDetallesJefe;
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

const getPermisosPendientes = async () => {
  try {
    // Buscar permisos con cualquier estado en "Pendiente"
    const permisosPendientes = await Permisos.findAll({
      where: {
        [Op.or]: [
          { estadoPermiso: 'Pendiente' },
          { estadoPermisoJefeArea: 'Pendiente' },
          { estadoPermsioGestionHumana: 'Pendiente' }
        ]
      },
      include: [
        {
          model: Colaborador,
          attributes: ['nombres', 'apellidos'],
          as: 'colaborador_asociation'
        }
      ]
    });

    return permisosPendientes;
  } catch (error) {
    console.error('Error al obtener permisos pendientes:', error);
    throw error;
  }
}

module.exports = {
  createPermiso,
  updatePermisos,
  getAllPermisosByCargo,
  getAllPermisosByColaborador,
  getAllPermisosCount,
  getPermisosPendientes
};
