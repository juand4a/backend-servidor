// controllers/incapacidadController.js

const incapacidadService = require('../services/incapacidadService');

exports.createIncapacidad = async (req, res) => {
  try {
    const incapacidad = await incapacidadService.createIncapacidad(req.body);
    res.json({ success: true, PermisoID: incapacidad.id });
  } catch (error) {
    console.error('Error al crear la incapacidad:', error);
    res.status(500).json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
};

exports.getAllIncapacidad = async (req, res) => {
  try {
    const incapacidades = await incapacidadService.getAllIncapacidad(req.params.cargo);
    res.json(incapacidades);
  } catch (error) {
    console.error('Error al obtener las incapacidades:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
  }
};

exports.updateIncapacidad = async (req, res) => {
  try {
    const { documento, id, cargo } = req.params;
    const updatedRows = await incapacidadService.updateIncapacidad(documento, id, cargo, req.body);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar la incapacidad:', error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el permiso' });
  }
};
