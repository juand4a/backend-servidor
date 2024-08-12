// utils/formatFecha.js

const moment = require('moment');

const formatFecha = (fecha) => {
  if (!fecha) return null;
  const fechaISO8601 = moment(fecha, 'YYYY-MM-DD').toISOString();
  return fechaISO8601.split('T')[0]; // Devuelve solo la parte de la fecha
};

module.exports = formatFecha;
