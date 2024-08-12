// controllers/capacitacionController.js

const capacitacionService = require('../services/capacitacionService');

exports.createCapacitacion = async (req, res) => {
  const { descripcion, fecha, video } = req.body;

  try {
    const capacitacion = await capacitacionService.createCapacitacion({
      descripcion,
      fecha,
      video,
    });

    res.json({
      status: 'success',
      code: 200,
      message: 'Capacitación creada correctamente',
      data: capacitacion,
    });
  } catch (error) {
    console.error('Error al crear la capacitación:', error.message);
    res.status(500).json({ error: 'Ocurrió un error al crear la capacitación' });
  }
};

exports.getAllCapacitacion = async (req, res) => {
  try {
    const capacitaciones = await capacitacionService.getAllCapacitaciones();
    res.json({
      status: 'success',
      code: 200,
      message: 'Capacitaciones obtenidas correctamente',
      data: capacitaciones,
    });
  } catch (error) {
    console.error('Error al obtener las capacitaciones:', error.message);
    res.status(500).json({ error: 'Ocurrió un error al obtener las capacitaciones' });
  }
};
