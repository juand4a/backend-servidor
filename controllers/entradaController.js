// controllers/entradaController.js

const entradaService = require('../service/entradaService');

exports.getAllEntrada = async (req, res) => {
  try {
    const entradas = await entradaService.getAllEntradas();
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
  }
};
exports.getEntradaByDocumento = async (req, res) => {
  try {
    const { documento } = req.params;
    const entradas = await entradaService.getEntradaByDocumento(documento);

    if (entradas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron entradas para el documento especificado' });
    }
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas por documento:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por documento' });
  }
};
exports.getEntradaByDocumentoYFecha = async (req, res) => {
  try {
    const { documento, fecha } = req.params;
    const entradas = await entradaService.getEntradaByDocumentoYFecha(documento, fecha);

    if (entradas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron entradas para el documento y la fecha especificados' });
    }
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas por documento y fecha:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por documento y fecha' });
  }
};


exports.getEntradasByMonth = async (req, res) => {
  try {
    const { documento, fecha } = req.params;
    const entradas = await entradaService.getEntradasByMonth(documento, fecha);

    if (entradas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron entradas para el documento y el mes especificados' });
    }
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas por documento y mes:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por documento y mes' });
  }
};

exports.getEntradaByFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    const entradas = await entradaService.getEntradaByFecha(fecha);

    if (entradas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron entradas para la fecha especificada' });
    }
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas por fecha:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por fecha' });
  }
};

exports.getEntrada = async (req, res) => {
  try {
    const { fecha, cargo } = req.params;
    const resultados = await entradaService.getEntrada(fecha, cargo);
    res.json(resultados);
  } catch (err) {
    console.error('Error al obtener las entradas por fecha y cargo:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por fecha y cargo' });
  }
};

exports.createEntrada = async (req, res) => {
  try {
    const { documento_colaborador } = req.body;
    // Determinar si se debe usar la URL de S3 o el camino local
    const fotoEntradaPath = req.file.location || req.file.path; // Usa 'location' para producción con S3 y 'path' para desarrollo

    const entradaData = {
      ...req.body,
      foto_entrada: fotoEntradaPath
    };

    const encuestasData = {
      partesEncuestaVehiculo: entradaData.partesEncuestaVehiculo,
      papelesEncuestaVehiculo: entradaData.papelesEncuestaVehiculo,
      herramientasEncuestaVehiculo: entradaData.herramientasEncuestaVehiculo,
      nivelesEncuestaVehiculo: entradaData.nivelesEncuestaVehiculo,
    };

    const result = await entradaService.createEntrada(entradaData, encuestasData);
    res.json({
      success: true,
      entradaId: result.nuevaEntrada.id,
      foto_entrada: entradaData.foto_entrada,
      // Otros campos si es necesario
    });
  } catch (error) {
    console.error('Error al guardar la entrada:', error);
    res.status(500).json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
};


exports.updateEntrada = async (req, res) => {
  try {
    const { documento_colaborador, fecha } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó una imagen de salida' });
    }

    const fotoEntradaPath = req.file.location || req.file.path; // Usa 'location' para producción con S3 y 'path' para desarrollo

    const updateData = {
      ...req.body,
      foto_salida: fotoEntradaPath
    };

    const updatedRows = await entradaService.updateEntrada(documento_colaborador, fecha, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Colaborador no encontrado o la fecha no coincide' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error al actualizar la entrada:', err);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el colaborador' });
  }
};

exports.getEntradasByMonthEstadistica = async (req, res) => {
  try {
    const { documento, fecha } = req.params;
    const estadisticas = await entradaService.getEntradasByMonthEstadistica(documento, fecha);

    res.json(estadisticas);
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las estadísticas' });
  }
};

exports.getTopLateEntrants = async (req, res) => {
  try {
    const topLateEntrants = await entradaService.getTopLateEntrants();
    res.json(topLateEntrants);
  } catch (err) {
    console.error('Error al obtener las personas con más entradas tardías:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las personas con más entradas tardías' });
  }
};
