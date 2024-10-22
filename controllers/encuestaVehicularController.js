const ElementosProteccionEncuestaVehiculo = require('../models/elementosproteccionencuestavehiculo');
const ElementosProteccion = require('../models/elementosproteccion');
const Herramientas = require('../models/herramientasVehiculo');
const HerramientasProteccionEncuestaVehiculo = require('../models/herramientasencuestavehiculo');
const Niveles = require('../models/nivelesvehiculo');
const NivelesEncuestaVehiculo = require('../models/nivelesencuestavehiculo');
const EncuestaVehiculo = require('../models/encuestavehiculo');
const Papeles = require('../models/papelesVehiculo');
const PapelesEncuestaVehiculo = require('../models/papelesencuestavehiculo');
const Colaborador = require('../models/colaborador');
const Cargo = require('../models/Cargo');


const Sequelize = require('sequelize');

exports.getEncuestasVehicularesConColaboradorYCargoYDetalles = async (req, res) => {
  const fecha = req.params.fecha;  // Recibe la fecha desde la solicitud

  try {
    // Recuperar todos los colaboradores y sus cargos, solo los activos (estado_cuenta = 1)
    const colaboradores = await Colaborador.findAll({
      where: {
        estadoCuenta: 1  // Solo incluir colaboradores activos
      },
      include: [{
        model: Cargo,
        attributes: ['cargo'],
        as: 'cargo_asociation'
      }],
      attributes: ['documento', 'nombres', 'apellidos', 'fotoUrl']  // Asegúrate de incluir el documento
    });

    // Log para verificar los colaboradores recuperados
    console.log('Colaboradores recuperados:', colaboradores.map(c => ({ documento: c.documento, nombres: c.nombres, apellidos: c.apellidos })));

    // Con los documentos de los colaboradores, ahora buscamos las encuestas vehiculares por fecha
    const encuestas = await EncuestaVehiculo.findAll({
      where: Sequelize.where(Sequelize.fn('date', Sequelize.col('fecha')), '=', fecha),
      attributes: ['id', 'idColaborador', 'fecha', 'placa', 'kilometraje', 'observaciones']
    });

    // Log para verificar las encuestas recuperadas
    console.log('Encuestas encontradas:', encuestas.map(e => ({ id: e.id, idColaborador: e.idColaborador, fecha: e.fecha })));

    // Si hay encuestas, ahora busca los detalles por cada id de encuesta
    const encuestasConDetalles = await Promise.all(encuestas.map(async encuesta => {
      const elementosProteccion = await ElementosProteccionEncuestaVehiculo.findAll({
        where: { idEncuesta: encuesta.id },
        include: [{
          model: ElementosProteccion,
          attributes: ['elementosProteccion'],
          as: 'elementosProteccion_asociation'
        }],
      });
      const herramientasProteccion = await HerramientasProteccionEncuestaVehiculo.findAll({
        where: { idEncuesta: encuesta.id },
        include: [{
          model: Herramientas,
          attributes: ['herramienta'],
          as: 'herramientasencuestavehiculo_asociation'
        }]
      });
      const nivelesVehiculo = await NivelesEncuestaVehiculo.findAll({
        where: { idEncuesta: encuesta.id },
        include: [{
          model: Niveles,
          attributes: ['parteNivelVehiculo'],
          as: 'nivelesencuestavehiculo_asociation'
        }]
      });
      const papelesVehiculo = await PapelesEncuestaVehiculo.findAll({
        where: { idEncuesta: encuesta.id },
        include: [{
          model: Papeles,
          attributes: ['papel'],
          as: 'papelesencuestavehiculo_asociation'
        }]
      });

      return {
        ...encuesta.toJSON(),
        elementosProteccion,
        herramientasProteccion,
        nivelesVehiculo,
        papelesVehiculo
      };
    }));

    // Crear un mapa de idColaborador que tienen encuestas marcadas
    const idColaboradoresConEncuesta = new Set(encuestas.map(encuesta => String(encuesta.idColaborador).trim()));

    // Log de los idColaboradores que tienen encuestas marcadas
    console.log('Colaboradores con encuestas marcadas (idColaborador):', Array.from(idColaboradoresConEncuesta));

    // Construir la respuesta combinando los datos necesarios
    const respuesta = colaboradores.map(colaborador => {
      const colaboradorDocumento = String(colaborador.documento).trim();
      const tieneEncuesta = idColaboradoresConEncuesta.has(colaboradorDocumento);
      
      console.log(`Colaborador: ${colaborador.nombres} ${colaborador.apellidos}, Documento: ${colaborador.documento}, Tiene encuesta: ${tieneEncuesta}`);

      if (tieneEncuesta) {
        // Encuentra la encuesta específica para este colaborador
        const encuestaDetalles = encuestasConDetalles.find(e => String(e.idColaborador).trim() === colaboradorDocumento);

        // Log para verificar si se encontró la encuesta correcta
        if (!encuestaDetalles) {
          console.error(`No se encontró la encuesta para el colaborador con documento: ${colaborador.documento}`);
        }

        return {
          ...encuestaDetalles, // Devuelve la encuesta con todos los detalles
          colaborador_asociation: {
            documento: colaborador.documento,
            nombres: colaborador.nombres,
            apellidos: colaborador.apellidos,
            fotoUrl: colaborador.fotoUrl,
            cargo_asociation: colaborador.cargo_asociation
          },
          mensaje: 'Marcó asistencia vehicular'
        };
      } else {
        // Para colaboradores sin encuesta marcada
        return {
          nombres: colaborador.nombres,
          apellidos: colaborador.apellidos,
          cargo: colaborador.cargo_asociation ? colaborador.cargo_asociation.cargo : 'Cargo no especificado',
          fotoUrl: colaborador.fotoUrl,
          mensaje: 'No marcó asistencia vehicular'
        };
      }
    });

    res.json(respuesta);  // Envía la respuesta combinada
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las encuestas vehiculares y colaboradores' });
  }
};





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
  