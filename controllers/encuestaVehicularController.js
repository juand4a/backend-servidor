const ElementosProteccionEncuestaVehiculo = require('../models/elementosproteccionencuestavehiculo');
const ElementosProteccion = require('../models/elementosproteccion');
const Herramientas = require('../models/herramientasVehiculo');
const HerramientasProteccionEncuestaVehiculo = require('../models/herramientasencuestavehiculo');
const Niveles = require('../models/nivelesvehiculo');
const NivelesEncuestaVehiculo = require('../models/nivelesencuestavehiculo');
const EncuestaVehiculo = require('../models/encuestavehiculo');
const Papeles = require('../models/papelesVehiculo');
const PapelesEncuestaVehiculo = require('../models/papelesencuestavehiculo');



const Sequelize = require('sequelize');


exports.getCountAndNameByIdElementoProteccion = (req, res) => {
    ElementosProteccionEncuestaVehiculo.findAll({
      attributes: [
        'idElementoProteccion',
        [Sequelize.fn('COUNT', 'idElementoProteccion'), 'count'],
      ],
      include: [{
        model: ElementosProteccion, // Reemplaza 'OtraTabla' con el nombre de tu tabla relacionada
        attributes: ['elementosProteccion'],
        as: 'elementosProteccion_asociation'
    }],
      group: ['idElementoProteccion']
    })
      .then(counts => {
        res.json(counts);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener los recuentos' });
      });
  };
  
  
exports.getHerramientasPorcentaje = (req, res) => {
    HerramientasProteccionEncuestaVehiculo.findAll({
      attributes: [
        'idHerramientaVehiculo',
        [Sequelize.fn('COUNT', 'idHerramientaVehiculo'), 'count'],
      ],
      include: [{
        model: Herramientas, // Reemplaza 'OtraTabla' con el nombre de tu tabla relacionada
        attributes: ['herramienta'],
        as: 'herramientasencuestavehiculo_asociation'
    }],
      group: ['idHerramientaVehiculo']
    })
      .then(counts => {
        res.json(counts);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener los recuentos' });
      });
  };
  

  exports.getNivelesPorcentaje = (req, res) => {
    NivelesEncuestaVehiculo.findAll({
      attributes: [
        'idParteNivelVehiculo',
        [Sequelize.fn('COUNT', 'idParteNivelVehiculo'), 'count'],
      ],
      include: [{
        model: Niveles, // Reemplaza 'OtraTabla' con el nombre de tu tabla relacionada
        attributes: ['parteNivelVehiculo'],
        as: 'nivelesencuestavehiculo_asociation'
    }],
      group: ['idParteNivelVehiculo']
   
    })
      .then(counts => {
        res.json(counts);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener los recuentos' });
      });
  };
  
  exports.getPapelesPorcentaje = (req, res) => {
    PapelesEncuestaVehiculo.findAll({
      attributes: [
        'idPapelVehiculo',
        [Sequelize.fn('COUNT', 'idPapelVehiculo'), 'count'],
      ],
      include: [{
        model: Papeles, // Reemplaza 'OtraTabla' con el nombre de tu tabla relacionada
        attributes: ['papel'],
        as: 'papelesencuestavehiculo_asociation'
    }],
      group: ['idPapelVehiculo']
    })
      .then(counts => {
        res.json(counts);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener los recuentos' });
      });
  };
  