// controllers/permisoController.js

const permisoService = require('./../service/permisoService');

exports.createPermiso = async (req, res) => {
  try {
    const permiso = await permisoService.createPermiso(req.body);
    res.json({ success: true, PermisoID: permiso.id });
  } catch (error) {
    console.error('Error al crear el permiso:', error);
    res.status(500).json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
};

exports.updatePermisos = async (req, res) => {
  try {
    const { documento, id, cargo } = req.params;
    const updatedRows = await permisoService.updatePermisos(documento, id, cargo, req.body);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar el permiso:', error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el permiso' });
  }
};

exports.getAllPermisos = async (req, res) => {
  try {
    const cargo = parseInt(req.params.cargo, 10); // Convertir el parámetro cargo a número
    const permisos = await permisoService.getAllPermisosByCargo(cargo);

    // Si el array de permisos está vacío y el cargo no es permitido
    if (permisos.length === 0 && ![1, 2, 3, 4, 8, 10, 16].includes(cargo)) {
      return res.status(403).json({ error: 'No tiene permiso para ver estos datos.' });
    }

    // Devolver los permisos
    res.json(permisos);
  } catch (error) {
    console.error('Error al obtener los permisos:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas.' });
  }
};

exports.getAllPermisosByColaborador = async (req, res) => {
  try {
    const permisos = await permisoService.getAllPermisosByColaborador(req.params.documento);
    res.json(permisos);
  } catch (error) {
    console.error('Error al obtener los permisos por colaborador:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
  }
};

exports.getAllPermisosCount = async (req, res) => {
  try {
    const permisos = await permisoService.getAllPermisosCount(req.params.cargo);
    res.json(permisos);
  } catch (error) {
    console.error('Error al obtener el conteo de permisos:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
  }
};

exports.getPermisosPendientes = async (req, res) => {
  try {
    const permisosPendientes = await permisoService.getPermisosPendientes();

    if (permisosPendientes.length === 0) {
      return res.status(200).json({
        message: 'No hay permisos pendientes',
        permisos: []
      });
    }

    // Si hay permisos pendientes, devolverlos
    res.json({
      message: 'Permisos pendientes encontrados',
      permisos: permisosPendientes,
    });
  } catch (error) {
    console.error('Error al obtener permisos pendientes:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los permisos pendientes' });
  }
};