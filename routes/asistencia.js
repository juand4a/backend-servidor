const express = require('express');
const router = express.Router();
const entradaController = require('../controllers/entradaController');

// Rutas CRUD de colaborador
router.get('/', entradaController.getAllEntrada);
router.get('/:id', entradaController.getEntradaById);
router.post('/', entradaController.createEntrada);
router.put('/:documento_colaborador',entradaController.updateEntrada)


module.exports = router;