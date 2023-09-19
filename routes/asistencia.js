const express = require('express');
const router = express.Router();
const entradaController = require('../controllers/entradaController');

// Rutas CRUD de colaborador
router.get('/', entradaController.getAllEntrada);
router.get('/:fecha', entradaController.getEntradaByFecha);
router.get('/buscar-entradas/:documento/:fecha', entradaController.getEntradaByDocumentoYFecha);
router.get('/buscar-entradasMes/:documento/:fecha', entradaController.getEntradasByMonth);
router.get('/buscar-entradas/:documento', entradaController.getEntradaByDocumento);
router.post('/', entradaController.createEntrada);
router.put('/actualizar/:documento/:fecha',entradaController.updateEntrada)


module.exports = router;