const Entrada = require('../models/entrada');
const PartesEncuestaVehiculo = require('../models/partesencuestavehiculo');
const PapelesEncuestaVehiculo = require('../models/papelesencuestavehiculo'); // Asegúrate de que la ruta del archivo sea correcta
const HerramientasEncuestaVehiculo=require('../models/herramientasencuestavehiculo');
const NivelesEncuestaVehiculo=require('../models/nivelesencuestavehiculo');
const ElementosProteccionEncuestaVehiculo=require('../models/elementosproteccionencuestavehiculo');
const Puntos=require('./../models/Puntos')
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
    foto_cliente,
   partesEncuestaVehiculo,
    papelesEncuestaVehiculo,
    herramientasEncuestaVehiculo,
    nivelesEncuestaVehiculo,
    elementosProteccionEncuestaVehiculo,
    puntos
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
      foto_cliente,
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

    // Aquí puedes usar directamente papelesEncuestaVehiculo sin inicializarlo nuevamente
    const papelesEncuestaGuardados = await PapelesEncuestaVehiculo.bulkCreate(
      papelesEncuestaVehiculo.map((papeles) => ({
        idEncuesta: nuevaEntrada.id,
        idPapelVehiculo: papeles.idPapelVehiculo,
        poseeDocumento: papeles.poseeDocumento,
      }))
    );
    
    if (nuevaEntrada.documento_colaborador) {
      const puntosValue = (nuevaEntrada.entrada <= '24:00:00') ? 1 : 0;
    
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
      elementosEncuestaGuardadas
  
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
};
// Actualizar un colaborador
exports.updateEntrada = (req, res) => {
  const entradaId = req.params.documento_colaborador
  const {salida,cliente} = req.body;

  Entrada.update({ salida,cliente}, { where: { documento_colaborador: entradaId ,}  })
    .then(result => {
      if (result[0] === 0) {
        return res.status(404).json({ error: 'Colaborador no encontrado' });
      }
      res.json({ success: true});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el colaborador' });
    });
};
