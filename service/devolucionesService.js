// services/devolucionesService.js

const Devoluciones = require('../models/devoluciones');
const { Op, fn, col } = require('sequelize');
const formatFecha = require('../utils/formatFecha');

const createDevolucion = async (devolucionData) => {
  return await Devoluciones.create(devolucionData);
};

const getDevolucionesByCodigoAndFecha = async (codigo_vendedor, fecha) => {
  const fechaSinHora = formatFecha(fecha);

  return await Devoluciones.findAll({
    where: {
      codigo_vendedor,
      ...(fechaSinHora && { fecha: { [Op.startsWith]: fechaSinHora } }),
    },
  });
};

const getAllDevoluciones = async () => {
  return await Devoluciones.findAll();
};

const getDevolucionesResumen = async (codigo_vendedor, fecha) => {
  const fechaSinHora = formatFecha(fecha);

  return await Devoluciones.findAll({
    attributes: [
      'ruta',
      'motivo',
      [fn('SUM', col('valor_devolucion')), 'total_monto'],
      'cliente',
    ],
    where: {
      codigo_vendedor,
      ...(fechaSinHora && { fecha: { [Op.startsWith]: fechaSinHora } }),
    },
    group: ['ruta', 'motivo', 'cliente'],
  });
};

const getDevolucionesResumenAdmin = async (codigo_vendedor, fecha, ruta) => {
  const fechaSinHora = formatFecha(fecha);

  return await Devoluciones.findAll({
    attributes: [
      'ruta',
      'motivo',
      [fn('SUM', col('valor_devolucion')), 'total_monto'],
      'cliente',
    ],
    where: {
      ...(codigo_vendedor && { codigo_vendedor }),
      ...(fechaSinHora && { fecha: { [Op.startsWith]: fechaSinHora } }),
      ...(ruta && { ruta }),
    },
    group: ['ruta', 'motivo', 'cliente'],
  });
};

module.exports = {
  createDevolucion,
  getDevolucionesByCodigoAndFecha,
  getAllDevoluciones,
  getDevolucionesResumen,
  getDevolucionesResumenAdmin,
};
