const express = require('express');
const router = express.Router();
const entradaController = require('../controllers/entradaController');

// Rutas CRUD de entrada
router.get('/', entradaController.getAllEntrada); // Obtener todas las entradas

// Rutas de estadísticas y filtrado
router.get('/topTardes', entradaController.getTopLateEntrants); // Obtener los colaboradores con más entradas tardías
router.get('/buscar-estadisticaMes/:documento/:fecha', entradaController.getEntradasByMonthEstadistica); // Estadísticas por mes

// Rutas de búsqueda por documento
router.get('/buscar/:documento', entradaController.getEntradaByDocumento); // Buscar todas las entradas por documento
router.get('/buscar-entradas/:documento/:fecha', entradaController.getEntradaByDocumentoYFecha); // Buscar entradas por documento y fecha
router.get('/buscar-entradasMes/:documento/:fecha', entradaController.getEntradasByMonth); // Buscar entradas del mes por documento y fecha

// Rutas de búsqueda por fecha y cargo
router.get('/cargo/:fecha/:cargo', entradaController.getEntrada); // Obtener entradas por fecha y cargo
router.get('/:fecha', entradaController.getEntradaByFecha); // Obtener entradas por fecha (esta ruta es la más general y debería ir al final)

// Rutas para crear y actualizar entradas
router.post('/', entradaController.createEntrada); // Crear una nueva entrada
router.put('/actualizar/:documento/:fecha', entradaController.updateEntrada); // Actualizar una entrada por documento y fecha

module.exports = router;
