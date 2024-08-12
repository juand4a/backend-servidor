const Colaborador = require('../models/colaborador');
const Colillas = require('../models/colillaspagocolaborador');

const Sequelize = require('sequelize');





exports.createColillasForAllColaboradores = (req, res) => {
  const { fechaPago, fechaSubida, url, fechaPeriodoInicio, fechaPeriodoFin, facturaPago } = req.body;

  // Aquí, simplemente crea un registro en la tabla Colillas con información que aplique a todos los colaboradores
  Colillas.create({
    fechaPago: fechaPago,
    fechaSubida: fechaSubida,
    url: url, // Esto dependerá de cómo deseas manejar el URL para todos los colaboradores
    fechaPeriodoInicio: fechaPeriodoInicio,
    fechaPeriodoFin: fechaPeriodoFin,
    facturaPago: facturaPago
  })
    .then(colilla => {
      res.json(colilla); // Devuelve el registro de colilla creado
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al crear la colilla' });
    });
}
