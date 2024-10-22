// services/entradaService.js
const fs = require('fs');
const path = require('path');
const Entrada = require('../models/entrada');
const Colaborador = require('../models/colaborador');
const { Op, literal } = require('sequelize');
const moment = require('moment');
const PartesEncuestaVehiculo=require("./../models/partesencuestavehiculo")
const HerramientasEncuestaVehiculo=require("./../models/herramientasencuestavehiculo")
const NivelesEncuestaVehiculo=require("./../models/nivelesencuestavehiculo")
const PapelesEncuestaVehiculo=require("./../models/papelesencuestavehiculo")
const ElementosProteccionEncuesta=require("./../models/elementosproteccionencuestavehiculo");
const Cargo = require('../models/Cargo');
const sequelize = require('../config/database');
const EncuestaVehiculo = require('../models/encuestavehiculo');

const getAllEntradas = async () => {
  return await Entrada.findAll({
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos', 'documento', 'correo'],
        as: 'colaborador_asociation',
      },
    ],
  });
};

const getEntradasByMonth = async (documento, fecha) => {
  const yearMonth = moment(fecha, 'YYYY-MM').format('YYYY-MM');
  const startDate = moment(yearMonth, 'YYYY-MM').startOf('month').toISOString();
  const endDate = moment(yearMonth, 'YYYY-MM').endOf('month').toISOString();

  return await Entrada.findAll({
    where: {
      documento_colaborador: documento,
      fecha: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos', 'documento', 'correo'],
        as: 'colaborador_asociation',
      },
    ],
  });
};

const getEntradaByFecha = async (fecha) => {
  const fechaSinHora = moment(fecha, 'YYYY-MM-DD').format('YYYY-MM-DD');
  return await Entrada.findAll({
    where: { fecha: { [Op.startsWith]: fechaSinHora } },
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos'],
        as: 'colaborador_asociation',
      },
    ],
  });
};

const getEntrada = async (fecha, cargo) => {
  const fechaSinHora = moment(fecha, 'YYYY-MM-DD').format('YYYY-MM-DD');
  const whereClause = { fecha: { [Op.startsWith]: fechaSinHora } };

  // Ajuste de las condiciones de filtrado basadas en el cargo
  let filtrarPorCargo = false; // Variable para indicar si se debe filtrar por cargo

  switch (cargo) {
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '8':
      // No se aplica filtro específico, se muestran todas las asistencias
      break;
    case '10':
      // Mostrar solo las asistencias de los cargos 11, 12, 13, 14, 15
      whereClause['$colaborador_asociation.cargo$'] = { [Op.in]: ['11', '12', '13', '14', '15'] };
      filtrarPorCargo = true;
      break;
    case '16':
    case '17':
      // Mostrar solo las asistencias de los cargos 17, 18, 19, 20, 21, 22
      whereClause['$colaborador_asociation.cargo$'] = { [Op.in]: ['17', '18', '19', '20', '21', '22'] };
      filtrarPorCargo = true;
      break;
    default:
      // No se muestran asistencias si no se cumple con ninguna condición
      return [];
  }

  // Obtener colaboradores y entradas de manera eficiente, filtrando por estado_cuenta activo
  const [colaboradores, entradas] = await Promise.all([
    Colaborador.findAll({
      attributes: ['documento', 'nombres', 'apellidos', 'fotoUrl', 'estadoCuenta'], // Agregar estado_cuenta
      where: {
        estadoCuenta: 1, // Solo traer colaboradores activos (estado_cuenta = 1)
      },
      include: [
        {
          model: Cargo,
          attributes: ['cargo'],
          as: 'cargo_asociation',
        },
      ],
    }),
    Entrada.findAll({
      where: whereClause,
      include: [
        {
          model: Colaborador,
          attributes: ['documento', 'cargo'],
          as: 'colaborador_asociation',
        },
      ],
    }),
  ]);

  // Si se necesita filtrar por cargo y no hay entradas encontradas, devolvemos una lista vacía
  if (filtrarPorCargo && entradas.length === 0) {
    return [];
  }

  // Mapear entradas por documento del colaborador
  const entradasPorDocumento = entradas.reduce((acc, entrada) => {
    acc[entrada.documento_colaborador] = entrada;
    return acc;
  }, {});

  // Función para determinar el tipo de llegada basado en el cargo
  const determinarTipoLlegada = (entradaHora, cargo) => {
    if (['1', '2', '3', '4', '5', '8'].includes(cargo)) {
      return 'Llegada Sin Restricción';
    } else if (['10', '11', '12', '13', '14', '15'].includes(cargo)) {
      const horaLimite = moment('05:00:00', 'HH:mm:ss');
      return entradaHora.isAfter(horaLimite) ? 'Llegada Tarde' : 'A Tiempo';
    } else if (['16', '17', '18', '19', '20', '21', '22'].includes(cargo)) {
      const horaLimite = moment('06:00:00', 'HH:mm:ss');
      return entradaHora.isAfter(horaLimite) ? 'Llegada Tarde' : 'A Tiempo';
    } else {
      return 'Asistencia Marcada';
    }
  };

  return colaboradores.map((colaborador) => {
    const entradaColaborador = entradasPorDocumento[colaborador.documento];
    let tipoLlegada = 'No Marcó Asistencia';
    let entradaData = null;

    if (entradaColaborador) {
      const entradaHora = moment(entradaColaborador.entrada, 'HH:mm:ss');
      tipoLlegada = determinarTipoLlegada(entradaHora, colaborador.cargo_asociation?.cargo);
      entradaData = {
        documento: entradaColaborador.documento_colaborador,
        fecha: entradaColaborador.fecha,
        entrada: entradaColaborador.entrada,
        salida: entradaColaborador.salida,
        cliente: entradaColaborador.cliente,
        kilometraje: entradaColaborador.kilometraje,
        placa: entradaColaborador.placa,
        tipo_vehiculo: entradaColaborador.tipo_vehiculo,
        foto_salida: entradaColaborador.foto_salida,
        latitud_salida: entradaColaborador.latitud_salida,
        longitud_salida: entradaColaborador.longitud_salida,
        foto_entrada: entradaColaborador.foto_entrada,
        latitud_entrada: entradaColaborador.latitud_entrada,
        longitud_entrada: entradaColaborador.longitud_entrada,
        kilometraje_salida: entradaColaborador.kilometraje_salida,
        kilometraje_salida: entradaColaborador.kilometraje_salida,
        primer_cliente:entradaColaborador.primer_cliente
      };
    }

    return {
      nombre: colaborador.nombres,
      apellido: colaborador.apellidos,
      documento: colaborador.documento,
      fotoUrl: colaborador.fotoUrl,
      tipoLlegada,
      entradaData,
      cargo: colaborador.cargo_asociation ? colaborador.cargo_asociation.cargo : 'Sin cargo',
    };
  });
};





// Función para crear una entrada con los datos de las encuestas
const createEntrada = async (entradaData, encuestasData) => {
  try {
    const partesEncuestaVehiculo = typeof encuestasData.partesEncuestaVehiculo === 'string'
      ? JSON.parse(encuestasData.partesEncuestaVehiculo || '[]')
      : encuestasData.partesEncuestaVehiculo || [];

    const papelesEncuestaVehiculo = typeof encuestasData.papelesEncuestaVehiculo === 'string'
      ? JSON.parse(encuestasData.papelesEncuestaVehiculo || '[]')
      : encuestasData.papelesEncuestaVehiculo || [];

    const herramientasEncuestaVehiculo = typeof encuestasData.herramientasEncuestaVehiculo === 'string'
      ? JSON.parse(encuestasData.herramientasEncuestaVehiculo || '[]')
      : encuestasData.herramientasEncuestaVehiculo || [];

    const nivelesEncuestaVehiculo = typeof encuestasData.nivelesEncuestaVehiculo === 'string'
      ? JSON.parse(encuestasData.nivelesEncuestaVehiculo || '[]')
      : encuestasData.nivelesEncuestaVehiculo || [];

    const elementosProteccionEncuesta = typeof encuestasData.elementosProteccionEncuesta === 'string'
      ? JSON.parse(encuestasData.elementosProteccionEncuesta || '[]')
      : encuestasData.elementosProteccionEncuesta || [];

    if (!Array.isArray(partesEncuestaVehiculo) ||
      !Array.isArray(papelesEncuestaVehiculo) ||
      !Array.isArray(herramientasEncuestaVehiculo) ||
      !Array.isArray(nivelesEncuestaVehiculo) ||
      !Array.isArray(elementosProteccionEncuesta)) {
      throw new Error('Uno o más de los datos de encuesta no son arrays válidos.');
    }

    const t = await sequelize.transaction();

    try {
      // Crear la entrada vehicular
      const nuevaEntrada = await Entrada.create(entradaData, { transaction: t });

      // Crear los detalles de la encuesta (partes, herramientas, niveles, papeles, elementos de protección)
      await PartesEncuestaVehiculo.bulkCreate(
        partesEncuestaVehiculo.map(partes => ({
          idEncuesta: nuevaEntrada.id,
          idParteVehiculo: partes.idParteVehiculo,
          estado: partes.estado,
        })),
        { transaction: t }
      );

      await HerramientasEncuestaVehiculo.bulkCreate(
        herramientasEncuestaVehiculo.map(herramienta => ({
          idEncuesta: nuevaEntrada.id,
          idHerramientaVehiculo: herramienta.idHerramientaVehiculo,
          verificado: herramienta.verificado,
        })),
        { transaction: t }
      );

      await NivelesEncuestaVehiculo.bulkCreate(
        nivelesEncuestaVehiculo.map(nivel => ({
          idEncuesta: nuevaEntrada.id,
          idParteNivelVehiculo: nivel.idParteNivelVehiculo,
        })),
        { transaction: t }
      );

      await PapelesEncuestaVehiculo.bulkCreate(
        papelesEncuestaVehiculo.map(papeles => ({
          idEncuesta: nuevaEntrada.id,
          idPapelVehiculo: papeles.idPapelVehiculo,
          poseeDocumento: papeles.poseeDocumento,
        })),
        { transaction: t }
      );

      await ElementosProteccionEncuesta.bulkCreate(
        elementosProteccionEncuesta.map(elemento => ({
          idEncuesta: nuevaEntrada.id,
          idElementoProteccion: elemento.idElementoProteccion,
          verificado: elemento.verificado,
        })),
        { transaction: t }
      );

      // Finalmente, crear el registro en la tabla `EncuestaVehiculo`
      const nuevaEncuestaVehiculo = await EncuestaVehiculo.create({
        idColaborador: entradaData.documento_colaborador,
        placa: entradaData.placa,
        observaciones: entradaData.observaciones || 'N/A',
        kilometraje: entradaData.kilometraje,
        fecha: entradaData.fecha,
      }, { transaction: t });

      // Confirmar la transacción
      await t.commit();

      return { nuevaEntrada, nuevaEncuestaVehiculo };
    } catch (error) {
      // En caso de error, revertir la transacción
      await t.rollback();
      console.error('Error al crear la entrada y sus encuestas:', error);
      throw new Error('Error al procesar la solicitud.');
    }
  } catch (error) {
    console.error('Error al parsear los datos de la encuesta:', error);
    throw new Error('Uno o más de los datos de encuesta no son válidos.');
  }
};



const updateEntrada = async (documento, fecha, updateData) => {
  const fechaISO8601 = moment(fecha, 'YYYY-MM-DD').toISOString();
  const fechaSinHora = fechaISO8601.split('T')[0];

  const whereClause = {
    documento_colaborador: documento,
    fecha: {
      [Op.startsWith]: fechaSinHora,
    },
  };

  const [updatedRows] = await Entrada.update(updateData, { where: whereClause });

  return updatedRows;
};

const getEntradasByMonthEstadistica = async (documento, fecha) => {
  const yearMonth = moment(fecha, 'YYYY-MM').format('YYYY-MM');
  const startDate = moment(yearMonth, 'YYYY-MM').startOf('month').toISOString();
  const endDate = moment(yearMonth, 'YYYY-MM').endOf('month').toISOString();

  const entradas = await Entrada.findAll({
    where: {
      documento_colaborador: documento,
      fecha: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos', 'documento', 'correo'],
        as: 'colaborador_asociation',
      },
    ],
  });

  let totalAsistencias = 0;
  let entradasPuntuales = 0;
  let llegadasTarde = 0;
  let totalHorasTrabajadas = 0;

  entradas.forEach((entrada) => {
    totalAsistencias++;
    const horaEntrada = moment(entrada.entrada, 'HH:mm:ss');
    if (horaEntrada.isSameOrBefore(moment('07:00:00', 'HH:mm:ss'))) {
      entradasPuntuales++;
    } else {
      llegadasTarde++;
    }

    if (entrada.hora_salida) {
      const horaSalida = moment(entrada.salida, 'HH:mm:ss');
      const horasTrabajadas = horaSalida.diff(horaEntrada, 'hours', true);
      totalHorasTrabajadas += horasTrabajadas;
    }
  });

  return {
    totalAsistencias,
    entradasPuntuales,
    llegadasTarde,
    totalHorasTrabajadas,
  };
};

const getTopLateEntrants = async () => {
  const topLateEntrants = await Entrada.findAll({
    attributes: [[literal('COUNT(*)'), 'cantidadLlegadasTarde']],
    include: [
      {
        model: Colaborador,
        attributes: ['nombres', 'apellidos', 'documento', 'correo', 'fotoUrl'],
        as: 'colaborador_asociation',
      },
    ],
    where: {
      fecha: {
        [Op.gte]: moment().startOf('month').format('YYYY-MM-DD'),
      },
      entrada: {
        [Op.gt]: '07:00:00',
      },
    },
    group: ['colaborador_asociation.documento'],
    order: [[literal('cantidadLlegadasTarde'), 'DESC']],
    limit: 2,
  });

  return topLateEntrants;
};
const getEntradaByDocumento = async (documento) => {
    return await Entrada.findAll({
      where: { documento_colaborador: documento },
      include: [
        {
          model: Colaborador,
          attributes: ['nombres', 'apellidos', 'documento', 'correo'],
          as: 'colaborador_asociation',
        },
      ],
    });
  };
  const getEntradaByDocumentoYFecha = async (documento, fecha) => {
    const fechaSinHora = moment(fecha, 'YYYY-MM-DD').format('YYYY-MM-DD');
    return await Entrada.findAll({
      where: {
        documento_colaborador: documento,
        fecha: {
          [Op.startsWith]: fechaSinHora,
        },
      },
      include: [
        {
          model: Colaborador,
          attributes: ['nombres', 'apellidos', 'documento', 'correo'],
          as: 'colaborador_asociation',
        },
      ],
    });
  };

module.exports = {
  getAllEntradas,
  getEntradasByMonth,
  getEntradaByFecha,
  getEntrada,
  createEntrada,
  updateEntrada,
  getEntradasByMonthEstadistica,
  getTopLateEntrants,
  getEntradaByDocumento,
  getEntradaByDocumentoYFecha
};
