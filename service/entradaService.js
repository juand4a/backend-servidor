// services/entradaService.js

const Entrada = require('../models/entrada');
const Colaborador = require('../models/colaborador');
const { Op, literal } = require('sequelize');
const moment = require('moment');

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
  let whereClause = { fecha: { [Op.startsWith]: fechaSinHora } };

  if (cargo === '9') {
    whereClause['$colaborador_asociation.cargo$'] = { [Op.or]: ['10', '6'] };
  } else if (cargo === '4') {
    whereClause['$colaborador_asociation.cargo$'] = '5';
  }

  const colaboradores = await Colaborador.findAll({
    attributes: ['documento', 'nombres', 'apellidos', 'fotoUrl'],
    include: [
      {
        model: Cargo,
        attributes: ['cargo'],
        as: 'cargo_asociation',
      },
    ],
  });

  const entradas = await Entrada.findAll({
    where: whereClause,
    include: [
      {
        model: Colaborador,
        attributes: ['documento', 'cargo'],
        as: 'colaborador_asociation',
      },
    ],
  });

  const horaEntradaEst = moment('07:00:00', 'HH:mm:ss');
  const entradasPorDocumento = entradas.reduce((acc, entrada) => {
    acc[entrada.documento_colaborador] = entrada;
    return acc;
  }, {});

  return colaboradores.map((colaborador) => {
    const entradaColaborador = entradasPorDocumento[colaborador.documento];
    let tipoLlegada;
    let entradaData = null;

    if (!entradaColaborador) {
      tipoLlegada = 'No Marcó Asistencia';
    } else {
      const entradaHora = moment(entradaColaborador.entrada, 'HH:mm:ss');

      if (entradaHora.isBefore(horaEntradaEst)) {
        tipoLlegada = 'Llegada Temprana';
      } else if (entradaHora.isAfter(horaEntradaEst)) {
        tipoLlegada = 'Llegada Tarde';
      } else {
        tipoLlegada = 'A Tiempo';
      }

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

const createEntrada = async (entradaData, encuestasData) => {
  const nuevaEntrada = await Entrada.create(entradaData);

  const {
    partesEncuestaVehiculo,
    papelesEncuestaVehiculo,
    herramientasEncuestaVehiculo,
    nivelesEncuestaVehiculo,
  } = encuestasData;

  const partesEncuestaGuardadas = await PartesEncuestaVehiculo.bulkCreate(
    partesEncuestaVehiculo.map((partes) => ({
      idEncuesta: nuevaEntrada.id,
      idParteVehiculo: partes.idParteVehiculo,
      estado: partes.estado,
    }))
  );

  const herramientasEncuestaGuardadas = await HerramientasEncuestaVehiculo.bulkCreate(
    herramientasEncuestaVehiculo.map((herramienta) => ({
      idEncuesta: nuevaEntrada.id,
      idHerramientaVehiculo: herramienta.idHerramientaVehiculo,
      verificado: herramienta.verificado,
    }))
  );

  const nivelesEncuestaGuardadas = await NivelesEncuestaVehiculo.bulkCreate(
    nivelesEncuestaVehiculo.map((herramienta) => ({
      idEncuesta: nuevaEntrada.id,
      idParteNivelVehiculo: herramienta.idParteNivelVehiculo,
    }))
  );

  const papelesEncuestaGuardados = await PapelesEncuestaVehiculo.bulkCreate(
    papelesEncuestaVehiculo.map((papeles) => ({
      idEncuesta: nuevaEntrada.id,
      idPapelVehiculo: papeles.idPapelVehiculo,
      poseeDocumento: papeles.poseeDocumento,
    }))
  );

  const EncuestaGuardados = await EncuestaVehiculo.create({
    idColaborador: nuevaEntrada.documento_colaborador,
    placa: nuevaEntrada.placa,
    observaciones: 'N/A',
    kilometraje: nuevaEntrada.kilometraje,
    fecha: nuevaEntrada.fecha,
  });

  return {
    nuevaEntrada,
    partesEncuestaGuardadas,
    herramientasEncuestaGuardadas,
    nivelesEncuestaGuardadas,
    papelesEncuestaGuardados,
    EncuestaGuardados,
  };
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
