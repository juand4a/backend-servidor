// services/solicitudService.js

const Solicitud = require('../models/solicitudpedidos');
const Puntos = require('../models/Puntos');
const EstadoSolicitud = require('../models/EstadoSolicitud');
const Colaborador = require('../models/colaborador');
const Productos = require('../models/productos');

const createRequest = async (data) => {
  return await Solicitud.create(data);
};

const getAllRequests = async () => {
  return await Solicitud.findAll({
    include: [
      {
        model: EstadoSolicitud,
        attributes: ['estadoSolicitud'],
        as: 'estado_asociation',
      },
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation',
      },
    ],
  });
};

const getAllRequestsByDocument = async (documento) => {
  return await Solicitud.findAll({
    where: { documento_colaborador: documento },
    include: [
      {
        model: EstadoSolicitud,
        attributes: ['estadoSolicitud'],
        as: 'estado_asociation',
      },
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation',
      },
    ],
  });
};

const updateRequestStatus = async (documento_colaborador, solicitudId, estadoSolicitud) => {
  const solicitud = await Solicitud.findOne({
    where: { id: solicitudId, documento_colaborador },
    include: [
      {
        model: Productos,
        attributes: ['precio'],
        as: 'producto_asociation',
      },
    ],
  });

  if (!solicitud) {
    throw new Error('Solicitud no encontrada para el colaborador.');
  }

  await Solicitud.update({ estadoSolicitud }, { where: { id: solicitudId } });

  const puntosAcumulados = await Puntos.findOne({
    attributes: ['puntos'],
    where: { documento_colaborador },
  });

  if (estadoSolicitud === 3 && puntosAcumulados.puntos >= solicitud.producto_asociation.precio) {
    const puntosRestantes = puntosAcumulados.puntos - solicitud.producto_asociation.precio;
    await Puntos.update({ puntos: puntosRestantes }, { where: { documento_colaborador } });
  }
};

const getPuntosSumadosByDocumento = async (documento) => {
  return await Puntos.sum('puntos', { where: { documento_colaborador: documento } });
};

module.exports = {
  createRequest,
  getAllRequests,
  getAllRequestsByDocument,
  updateRequestStatus,
  getPuntosSumadosByDocumento,
};
