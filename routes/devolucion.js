const express = require('express');
const router = express.Router();
const devolucionesController = require('../controllers/devolucionesController');

router.post('/', devolucionesController.createDevoluciones);
router.get('/devoluciones_vendedor/:codigo_vendedor/:fecha', devolucionesController.getDevolucionesByCodigoAndFecha);

// Ruta para obtener devoluciones solo por fecha

// Ruta para obtener todas las devoluciones
router.get('/devoluciones', devolucionesController.getAllDevoluciones);

router.get('/devoluciones_resumen/:codigo_vendedor/:fecha', devolucionesController.getDevolucionesResumen);
router.get('/devoluciones_admin', devolucionesController.getDevolucionesResumenAdmin);


module.exports = router;