const Permisos = require('../models/permisos')
const Colaborador = require('../models/colaborador');
const Cargo = require('../models/Cargo');
const { Op } = require('sequelize');
const Sequelize = require('../config/database')


exports.createPermiso = async (req, res) => {
  const {
    documento_colaborador,
    descripcion,
    fechaPermiso,
  } = req.body;

  try {
    const fechaPublicacion = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato 'yyyy-mm-dd'

    // Crear la entrada
    const Permiso = await Permisos.create({
      documento_colaborador,
      descripcion,
      fechaPublicacion,
      fechaPermiso,
      estadoPermiso: "Pendiente",
      estadoPermisoJefeArea: "Pendiente",
      estadoPermsioGestionHumana: "Pendiente",
    });

    // Enviar una respuesta con el ID de la entrada creada y las encuestas del vehículo guardadas
    res.json({
      success: true,
      PermisoID: Permiso.id
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
};


  exports.updatePermisos = async (req, res) => {
    try {
      const documento = req.params.documento;
      const id = req.params.id;
      const cargo = req.params.cargo; // Obtén el valor de "cargo" como un parámetro de la solicitud.
  
      const whereClause = {
        documento_colaborador: documento,
        id: id
      };
  
      const { estadoPermiso,estadoPermsioGestionHumana,estadoPermisoJefeArea } = req.body;
  
      let dataToUpdate = {};
  
      if (cargo === '8' || cargo === '1' || cargo === '2' || cargo === '4'|| cargo === '3') {
        // Si cargo es igual a "15", actualiza los datos específicos para ese caso.
        dataToUpdate = {
          estadoPermiso,
          estadoPermsioGestionHumana
        };
      } else {
        // Si cargo es diferente, actualiza otros datos.
        dataToUpdate = {
          estadoPermisoJefeArea
        };
      }
  
      const [updatedRows] = await Permisos.update(dataToUpdate, { where: whereClause });
  
      if (updatedRows === 0) {
        return res.status(404).json({ error: 'Permiso no encontrado' });
      }
  
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el permiso' });
    }
  };
  
  
  exports.getAllPermisos = (req, res) => {
    const cargo = req.params.cargo; // Supongamos que obtienes el valor de cargo desde la solicitud.
  
    // Define un objeto que contiene la lógica de filtro basada en el valor de cargo.
    let whereClause = {};
  
    if (cargo === '8' || cargo === '1' || cargo === '2' || cargo === '4'|| cargo === '3') {
      whereClause = {};
    } else if (cargo === '16') {
      whereClause = {
        '$colaborador_asociation.cargo$': { [Op.or]: ['17', '18','19', '20','21', '22'] }
      };
    } else if (cargo === '10') {
      whereClause = {
        '$colaborador_asociation.cargo$': { [Op.or]: ['11', '12','13', '14','15'] }
      };
    }
  
    Permisos.findAll({
      where: whereClause,
      include: [
        {
          model: Colaborador,
          attributes: ['nombres', 'apellidos'],
          as: 'colaborador_asociation',
          include:[ 
            {
              model: Cargo,
              attributes: ['cargo'],
              as: 'cargo_asociation'
            }
          ]
        },
       
      ]
    })
      .then(Permisos => {
        res.json(Permisos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
      });
  };
  
  exports.getAllPermisosByColaborador = (req, res) => {
    const documento = req.params.documento;
    const whereClause = {
      documento_colaborador: {
        [Op.eq]: documento
      }
    };
    Permisos.findAll({
      where: whereClause,
      include: [
       {
          model: Colaborador,
          attributes: ['nombres', 'apellidos'],
          as: 'colaborador_asociation'
        }
      ]
    })
  
      .then(Permisos => {
        res.json(Permisos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
      });
  };
  
  exports.getAllPermisosCount = (req, res) => {
    const cargo = req.params.cargo; // Supongamos que obtienes el valor de cargo desde la solicitud.
  
    // Define un objeto que contiene la lógica de filtro basada en el valor de cargo.
    let whereClause = {};
  
    if (cargo === '8' || cargo === '1' || cargo === '2' || cargo === '4' || cargo === '3') {
      whereClause = {};
    } else if (cargo === '16') {
      whereClause = {
        '$colaborador_asociation.cargo$': { [Op.or]: ['17', '18', '19', '20', '21', '22'] }
      };
    } else if (cargo === '10') {
      whereClause = {
        '$colaborador_asociation.cargo$': { [Op.or]: ['11', '12', '13', '14', '15'] }
      };
    }
  
    Permisos.findAll({
      where: whereClause,
      attributes: [
        'descripcion', // Selecciona la descripción
        [Sequelize.fn('COUNT', Sequelize.col('descripcion')), 'cantidad'] // Cuenta la cantidad de descripciones
      ],
      group: ['descripcion'], // Agrupa por descripción
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
        },
      ]
    })
      .then(Permisos => {
        res.json(Permisos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
      });
  };
  