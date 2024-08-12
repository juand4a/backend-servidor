// controllers/devolucionesController.js

const devolucionesService = require('../service/devolucionesService');

exports.createDevoluciones = async (req, res) => {
  try {
    const devolucionData = req.body;
    const devolucion = await devolucionesService.createDevolucion(devolucionData);

    res.json({
      status: 'success',
      code: 200,
      message: 'Devolución agregada correctamente',
      data: devolucion,
    });
  } catch (err) {
    console.error('Error al crear la devolución:', err);
    res.status(500).json({ error: 'Ocurrió un error al crear la devolución' });
  }
};

exports.getDevolucionesByCodigoAndFecha = async (req, res) => {
  try {
    const { codigo_vendedor, fecha } = req.params;
    const devoluciones = await devolucionesService.getDevolucionesByCodigoAndFecha(codigo_vendedor, fecha);

    if (devoluciones.length === 0) {
      return res.status(404).json({ error: 'No se encontraron devoluciones para el código de vendedor y la fecha especificados' });
    }

    res.json(devoluciones);
  } catch (err) {
    console.error('Error al obtener devoluciones:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las devoluciones por código de vendedor y fecha' });
  }
};

exports.getAllDevoluciones = async (req, res) => {
  try {
    const devoluciones = await devolucionesService.getAllDevoluciones();
    res.json(devoluciones);
  } catch (err) {
    console.error('Error al obtener todas las devoluciones:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener todas las devoluciones' });
  }
};

exports.getDevolucionesResumen = async (req, res) => {
  try {
    const { codigo_vendedor, fecha } = req.params;
    const devoluciones = await devolucionesService.getDevolucionesResumen(codigo_vendedor, fecha);

    if (devoluciones.length === 0) {
      return res.status(404).json({ error: 'No se encontraron devoluciones para el código de vendedor y la fecha especificados' });
    }

    const groupedData = groupDevolucionesData(devoluciones);
    res.json(groupedData);
  } catch (err) {
    console.error('Error al obtener el resumen de devoluciones:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener el resumen de devoluciones' });
  }
};

exports.getDevolucionesResumenAdmin = async (req, res) => {
  try {
    const { codigo_vendedor, fecha, ruta } = req.query;
    const devoluciones = await devolucionesService.getDevolucionesResumenAdmin(codigo_vendedor, fecha, ruta);

    if (devoluciones.length === 0) {
      return res.status(404).json({ error: 'No se encontraron devoluciones para los filtros especificados' });
    }

    const groupedData = groupDevolucionesData(devoluciones);
    res.json({
      ...groupedData,
      totalDevoluciones: devoluciones.length,
    });
  } catch (err) {
    console.error('Error al obtener el resumen de devoluciones:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener el resumen de devoluciones' });
  }
};

// Función auxiliar para agrupar datos de devoluciones
const groupDevolucionesData = (devoluciones) => {
  return devoluciones.reduce((acc, item) => {
    const { ruta, motivo, cliente, total_monto } = item.dataValues;

    if (!acc.rutas[ruta]) {
      acc.rutas[ruta] = { name: `Ruta ${ruta}`, count: 0 };
    }
    acc.rutas[ruta].count += 1;

    if (!acc.motivos[motivo]) {
      acc.motivos[motivo] = { name: motivo, count: 0 };
    }
    acc.motivos[motivo].count += 1;

    if (!acc.clientes[cliente]) {
      acc.clientes[cliente] = { name: cliente, count: 0 };
    }
    acc.clientes[cliente].count += 1;

    acc.totalMonto += parseFloat(total_monto);

    return acc;
  }, { rutas: {}, motivos: {}, clientes: {}, totalMonto: 0 });
};
