const Entrada = require('../models/entrada');
const PartesEncuestaVehiculo = require('../models/partesencuestavehiculo');
const PapelesEncuestaVehiculo = require('../models/papelesencuestavehiculo');
const EncuestaVehiculo=require('../models/encuestavehiculo')
const HerramientasEncuestaVehiculo=require('../models/herramientasencuestavehiculo');
const NivelesEncuestaVehiculo=require('../models/nivelesencuestavehiculo');
const ElementosProteccionEncuestaVehiculo=require('../models/elementosproteccionencuestavehiculo');
const Puntos=require('./../models/Puntos')
const Cargo=require('./../models/Cargo')
const multer = require('multer');
const upload = multer(); 


const Colaborador=require('./../models/colaborador')

const moment = require('moment');
const { Op } = require('sequelize');
 
// Obtener todos los colaboradores
exports.getAllEntrada = (req, res) => {
  Entrada.findAll()
  
    .then(entrada => {
      res.json(entrada);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
    });
};
exports.getEntradasByMonth = (req, res) => {
  const documento = req.params.documento;
  const fecha = req.params.fecha;

  const yearMonth = moment(fecha, 'YYYY-MM').format('YYYY-MM');

  const startDate = moment(yearMonth, 'YYYY-MM').startOf('month').toISOString();
  const endDate = moment(yearMonth, 'YYYY-MM').endOf('month').toISOString();

  const whereClause = {
    documento_colaborador: {
      [Op.eq]: documento
    },
    fecha: {
      [Op.between]: [startDate, endDate]
    }
  };

  Entrada.findAll({
    where: whereClause,
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation'
      }
    ]
  })
    .then(entradas => {
      if (entradas.length === 0) {
        return res.status(404).json({ error: 'No se encontraron entradas para el documento y el mes especificados' });
      }
      res.json(entradas);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por documento y mes' });
    });
}
// Obtener un colaborador por FECHA
exports.getEntradaByFecha = (req, res) => {
  const fecha = req.params.fecha;

  // Parsea la fecha usando Moment.js para asegurarte de que esté en formato ISO8601
  const fechaISO8601 = moment(fecha, 'YYYY-MM-DD').toISOString();

  // Elimina la información de hora de la fecha proporcionada para buscar por igualdad
  const fechaSinHora = fechaISO8601.split('T')[0];

  Entrada.findAll({ 
    where: { fecha: { [Op.startsWith]: fechaSinHora } },
    include: [
      {
        model: Colaborador,
        attributes: ['nombres','apellidos'], // O los atributos que quieras obtener del Colaborador
        as: 'colaborador_asociation'
      }
    ]
  })
    .then(entradas => {
      if (entradas.length === 0) {
        return res.status(404).json({ error: 'No se encontraron entradas para la fecha especificada' });
      }
      res.json(entradas);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por fecha' });
    });
};
exports.getEntrada = (req, res) => {
  const fecha = req.params.fecha;
  const cargo = req.params.cargo; // Supongamos que obtienes el valor de cargo desde la solicitud.

  // Parsea la fecha usando Moment.js para asegurarte de que esté en formato ISO8601
  const fechaISO8601 = moment(fecha, 'YYYY-MM-DD').toISOString();

  // Elimina la información de hora de la fecha proporcionada para buscar por igualdad
  const fechaSinHora = fechaISO8601.split('T')[0];

  // Define un objeto que contiene la lógica de filtro basada en el valor de cargo.
  let whereClause = {};

  if (cargo === '12' || cargo === '1' || cargo === '2' || cargo === '15') {
    // Si cargo es 12, 1, 2 o 15, no aplicamos ningún filtro adicional.
    whereClause = { fecha: { [Op.startsWith]: fechaSinHora } };
  } else if (cargo === '9') {
    // Si cargo es 9, filtramos por colaboradores con cargo 10 o 6.
    whereClause = {
      fecha: { [Op.startsWith]: fechaSinHora },
      '$colaborador_asociation.cargo$': { [Op.or]: ['10', '6'] }
    };
  } else if (cargo === '4') {
    // Si cargo es 4, filtramos por colaboradores con cargo 5.
    whereClause = {
      fecha: { [Op.startsWith]: fechaSinHora },
      '$colaborador_asociation.cargo$': '5'
    };
  }

  Entrada.findAll({
    where: whereClause,
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation'
      }
    ]
  })
    .then(entradas => {
      if (entradas.length === 0) {
        return res.status(404).json({ error: 'No se encontraron entradas para la fecha y cargo especificados' });
      }
      res.json(entradas);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por fecha y cargo' });
    });
};

exports.getEntradaByDocumentoYFecha = (req, res) => {
  const documento = req.params.documento;
  const fecha = req.params.fecha;

  const fechaISO86012 = moment(fecha, 'YYYY-MM-DD').toISOString();

  // Elimina la información de hora de la fecha proporcionada para buscar por igualdad
  const fechaSinHora2 = fechaISO86012.split('T')[0];

  const whereClause = {
    documento_colaborador: {
      [Op.eq]: documento
    }
  };

  if (fecha) {
    whereClause.fecha = {
      [Op.startsWith]: fechaSinHora2
    };
  }

  Entrada.findAll({
    where: whereClause,
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation'
      }
    ]
  })
    .then(entradas => {
      if (entradas.length === 0) {
        return res.status(404).json({ error: 'No se encontraron entradas para el documento y la fecha especificados' });
      }
      res.json(entradas);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por documento y fecha' });
    });
};
exports.getEntradaByDocumento= (req, res) => {
  const documento = req.params.documento;

  const whereClause = {
    documento_colaborador: {
      [Op.eq]: documento
    }
  };

  Entrada.findAll({
    where: whereClause,
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation'
      }
    ]
  })
    .then(entradas => {
      if (entradas.length === 0) {
        return res.status(404).json({ error: 'No se encontraron entradas para el documento y la fecha especificados' });
      }
      res.json(entradas);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por documento y fecha' });
    });
};

// Crear un nueva entrada
exports.createEntrada = async (req, res) => {
  const {
    documento_colaborador,
    fecha,
    entrada,
    salida,
    cliente,
    kilometraje,
    placa,
    tipo_vehiculo,
    foto_salida,
    foto_entrada,
   partesEncuestaVehiculo,
    papelesEncuestaVehiculo,
    herramientasEncuestaVehiculo,
    nivelesEncuestaVehiculo,
    elementosProteccionEncuestaVehiculo,
  
  } = req.body;

  try {
    // Crear la entrada
    const nuevaEntrada = await Entrada.create({
      documento_colaborador,
      fecha,
      entrada,
      salida,
      cliente,
      kilometraje,
      placa,
      tipo_vehiculo,
      foto_salida,
      foto_entrada
    });

    // Guardar las partes de la encuesta del vehículo
    if (!Array.isArray(papelesEncuestaVehiculo)) {
      console.error('papelesEncuestaVehiculo no es un array válido.');
      return res.status(400).json({ error: 'papelesEncuestaVehiculo no es un array válido.' });
    }
    const partesEncuestaGuardadas = await PartesEncuestaVehiculo.bulkCreate(
      partesEncuestaVehiculo.map((partes) => ({
        idEncuesta: nuevaEntrada.id,
        idParteVehiculo: partes.idParteVehiculo,
        estado: partes.estado,
      }))
    );

    const herramientasEncuestaGuardadas=await HerramientasEncuestaVehiculo.bulkCreate(
      herramientasEncuestaVehiculo.map((herramienta)=>({
         idEncuesta:nuevaEntrada.id,
         idHerramientaVehiculo:herramienta.idHerramientaVehiculo,
         verificado:herramienta.verificado
      }))
    )
    const elementosEncuestaGuardadas=await ElementosProteccionEncuestaVehiculo.bulkCreate(
      elementosProteccionEncuestaVehiculo.map((elemento)=>({
         idEncuesta:nuevaEntrada.id,
         idElementoProteccion:elemento.idElementoProteccion,
         verificado:elemento.verificado
      }))
    )
    const nivelesEncuestaGuardadas=await NivelesEncuestaVehiculo.bulkCreate(
      nivelesEncuestaVehiculo.map((herramienta)=>({
         idEncuesta:nuevaEntrada.id,
         idParteNivelVehiculo:herramienta.idParteNivelVehiculo
      }))
    )

    const papelesEncuestaGuardados = await PapelesEncuestaVehiculo.bulkCreate(
      papelesEncuestaVehiculo.map((papeles) => ({
        idEncuesta: nuevaEntrada.id,
        idPapelVehiculo: papeles.idPapelVehiculo,
        poseeDocumento: papeles.poseeDocumento,
      }))
    );
    const EncuestaGuardados = await EncuestaVehiculo.create({
      idColaborador:nuevaEntrada.documento_colaborador ,
      placa:nuevaEntrada.placa,
      observaciones:"N/A",
      kilometraje:nuevaEntrada.kilometraje,
      fecha:nuevaEntrada.fecha,
    });
    
    
    if (nuevaEntrada.documento_colaborador) {
      const puntosValue = (nuevaEntrada.entrada <= '6:00:00') ? 1 : 0;
    
      // Verificar si ya existe un registro en la tabla puntos con el mismo documento_colaborador
      const existingPuntos = await Puntos.findOne({
        where: { documento_colaborador: nuevaEntrada.documento_colaborador },
        attributes: ['id', 'documento_colaborador', 'fecha', 'puntos']
      });
      
    
      if (existingPuntos) {
        // Si existe, actualiza el campo puntos sumándole el valor recibido
        await existingPuntos.increment('puntos', { by: puntosValue });
      } else {
        // Si no existe, crea un nuevo registro
        const puntosData = {
          documento_colaborador: nuevaEntrada.documento_colaborador,
          fecha: nuevaEntrada.fecha,
          puntos: puntosValue
        };
    
        try {
          const puntosGuardados = await Puntos.create(puntosData);
        } catch (error) {
          console.error('Error al guardar datos en la otra tabla:', error);
        }
      }
    } else {
      console.error('El campo documento_colaborador no está definido en nuevaEntrada');
    }
    
    
    
    // Enviar una respuesta con el ID de la entrada creada y las encuestas del vehículo guardadas
    res.json({
      success: true,
      entradaId: nuevaEntrada.id,
      partesEncuestaGuardadas,
      papelesEncuestaGuardados, 
      herramientasEncuestaGuardadas,
      nivelesEncuestaGuardadas,
      elementosEncuestaGuardadas,
      EncuestaGuardados
  
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
};



exports.updateEntrada = async (req, res) => {
  try {
    const documento = req.params.documento;
    const fecha = req.params.fecha;

    if (!fecha) {
      return res.status(400).json({ error: 'La fecha es un parámetro obligatorio.' });
    }

    // Convierte la fecha proporcionada en formato ISO8601
    const fechaISO8601 = moment(fecha, 'YYYY-MM-DD').toISOString();

    // Elimina la información de hora de la fecha para buscar por igualdad
    const fechaSinHora = fechaISO8601.split('T')[0];

    const whereClause = {
      documento_colaborador: documento,
      fecha: {
        [Op.startsWith]: fechaSinHora
      }
    };

    const { salida, cliente,foto_salida } = req.body;

    const [updatedRows] = await Entrada.update(
      { salida, cliente,foto_salida },
      { where: whereClause }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Colaborador no encontrado o la fecha no coincide' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el colaborador' });
  }
};

