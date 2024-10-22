const express = require('express');
const router = express.Router();
const PermisoController = require('../controllers/permisosController');

// Rutas CRUD de colaborador
router.post('/', PermisoController.createPermiso);
router.get('/:cargo', PermisoController.getAllPermisos);
router.get('/grafica-permisos/:cargo', PermisoController.getAllPermisosCount);
router.get('/permisos_documento/:documento', PermisoController.getAllPermisosByColaborador);
router.put('/actualizar/:documento/:id/:cargo',PermisoController.updatePermisos)
router.get('/notificaciones/permisos-pendientes', PermisoController.getPermisosPendientes);


module.exports = router;