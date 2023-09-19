const Productos = require('../models/productos')
const Puntos = require('./../models/Puntos')
const EstadoSolicitud = require('../models/EstadoSolicitud');
const Solicitud = require('./../models/solicitudpedidos')
const moment = require('moment');
const { Op } = require('sequelize');
const Colaborador = require('../models/colaborador');

exports.getAllProducts = (req, res) => {
  Productos.findAll()

    .then(Productos => {
      res.json(Productos);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
    });
};

exports.createProducst = async (req, res) => {
  const {
    nombre,
    descripcion,
    precio,
    fecha_creacion,
    imagen_url

  } = req.body;

  try {
    // Crear la entrada
    const PuntosGuardados = await Productos.create({
      nombre,
      descripcion,
      precio,
      fecha_creacion,
      imagen_url
    });

    // Enviar una respuesta con el ID de la entrada creada y las encuestas del vehículo guardadas
    res.json({
      success: true,
      entradaId: PuntosGuardados.id
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
};

exports.getPuntosSumadosByDocumento = async (req, res) => {
  const documento = req.params.documento;
  try {
    const puntosSumados = await Puntos.sum('puntos', {
      where: {
        documento_colaborador: documento
      }
    });
    res.json({ puntosSumados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los puntos sumados por documento' });
  }
};

exports.getAllRequestClient = (req, res) => {
  Solicitud.findAll({
    include: [
      {
        model: EstadoSolicitud,
        attributes: ['estadoSolicitud'],
        as: 'estado_asociation'
      }, {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation'
      }
    ]
  })

    .then(Solicitud => {
      res.json(Solicitud);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
    });
};

exports.createRequest = async (req, res) => {
  const {
    id_producto,
    documento_colaborador,
    estadoSolicitud,
    descripcion,
    precio

  } = req.body;

  try {
    // Crear la entrada
    const RequestGuardados = await Solicitud.create({
      id_producto,
      documento_colaborador,
      estadoSolicitud,
      descripcion,
      precio
    });

    res.json({
      success: true,
      id: RequestGuardados.id
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
};
exports.updateR = async (req, res) => {
  const documentoColaborador = req.params.documento_colaborador;
  const solicitudId = req.params.solicitudId; // Agregar esta línea

  const { estadoSolicitud } = req.body;

  try {
    // Obtener la solicitud por ID y documento_colaborador
    const solicitud = await Solicitud.findOne({
      where: { id: solicitudId, documento_colaborador: documentoColaborador }, // Modificar la consulta
      include: [
        {
          model: Productos,
          attributes: ['precio'],
          as: 'producto_asociation'
        },
      ]
    });

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada para el colaborador.' });
    }

    // Actualizar el estado de la solicitud por ID
    await Solicitud.update({ estadoSolicitud }, { where: { id: solicitudId } });

    // Consultar los puntos acumulados por el documento_colaborador
    const puntosAcumulados = await Puntos.findOne({
      attributes: ['puntos'],
      where: { documento_colaborador: documentoColaborador }
    });

    console.log("Estado Solicitud:", estadoSolicitud);
    console.log("Puntos Acumulados:", puntosAcumulados.puntos);
    console.log("Precio del Producto:", solicitud.producto_asociation.precio);

    if (estadoSolicitud == 3 && puntosAcumulados.puntos >= solicitud.producto_asociation.precio) {
      console.log("Restar Puntos");
      // Restar los puntos restando el valor del precio
      const puntosRestantes = puntosAcumulados.puntos - solicitud.producto_asociation.precio;
      console.log("Puntos Restantes:", puntosRestantes);
      await Puntos.update({ puntos: puntosRestantes }, { where: { documento_colaborador: documentoColaborador } });
    }

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el estado en la base de datos.' });
  }
};

exports.getAllRequesByDocument = (req, res) => {
  const documento = req.params.documento;
  const whereClause = {
    documento_colaborador: {
      [Op.eq]: documento
    }
  };
  Solicitud.findAll({
    where: whereClause,
    include: [
      {
        model: EstadoSolicitud,
        attributes: ['estadoSolicitud'],
        as: 'estado_asociation'
      }, {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation'
      }
    ]
  })

    .then(Solicitud => {
      res.json(Solicitud);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
    });
};











