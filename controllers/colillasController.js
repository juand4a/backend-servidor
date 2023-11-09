const Colaborador = require('../models/colaborador');
const Colillas = require('../models/colillaspagocolaborador');
const Sequelize = require('sequelize');
const { PDFDocument } = require('pdf-lib');





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



exports.getOneColillaPerFechaPago = (req, res) => {
  Colillas.findAll({
    attributes: ['id','fechaPago', 'fechaSubida', 'url', 'fechaPeriodoInicio', 'fechaPeriodoFin', 'facturaPago'],
    group: ['fechaPago'], // Agrupar por fecha de pago
    raw: true, // Obtener resultados como objetos JSON sin instancias de Sequelize
    order: [[Sequelize.literal('MIN(id)'), 'ASC']], // Ordenar por el ID mínimo (o puedes usar otro criterio)
  })
    .then(colillas => {
      res.json(colillas);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las colillas' });
    });
};


exports.getOneColillaPerFechaPagoD = (req, res) => {
  Colillas.findAll({
    attributes: ['id', 'fechaPago', 'fechaSubida', 'url', 'fechaPeriodoInicio', 'fechaPeriodoFin', 'facturaPago'],
    group: ['fechaPago'], // Agrupar por fecha de pago
    raw: true, // Obtener resultados como objetos JSON sin instancias de Sequelize
    order: [[Sequelize.literal('MIN(id)'), 'ASC']], // Ordenar por el ID mínimo (o puedes usar otro criterio)
  })
    .then(colillas => {
      res.json(colillas);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las colillas' });
    });
};

  
  