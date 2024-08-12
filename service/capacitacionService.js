// services/capacitacionService.js

const Capacitacion = require('../models/capacitacion');

const createCapacitacion = async (capacitacionData) => {
  try {
    const capacitacion = await Capacitacion.create(capacitacionData);
    return capacitacion;
  } catch (error) {
    throw new Error('Error al crear la capacitación');
  }
};

const getAllCapacitaciones = async () => {
  try {
    const capacitaciones = await Capacitacion.findAll();
    return capacitaciones;
  } catch (error) {
    throw new Error('Error al obtener las capacitaciones');
  }
};

module.exports = {
  createCapacitacion,
  getAllCapacitaciones,
};
