const express = require('express');
const router = express.Router();
const IncapacidadController = require('../controllers/incapacidadController');

// Rutas CRUD de colaborador
router.post('/', IncapacidadController.createIncapacidad);
 router.get('/:cargo', IncapacidadController.getAllIncapacidad);
// router.get('/grafica-permisos/:cargo', PermisoController.getAllPermisosCount);
// router.get('/permisos_documento/:documento', PermisoController.getAllPermisosByColaborador);
 router.put('/actualizar/:documento/:id/:cargo',IncapacidadController.updateIncapacidad)


module.exports = router;