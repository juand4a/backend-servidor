const express = require('express');
const router = express.Router();
const colaboradorController = require('../controllers/colaboradorController');

// Rutas CRUD de colaborador
router.get('/', colaboradorController.getAllColaboradores);
router.get('/:id', colaboradorController.getColaboradorById);
router.post('/', colaboradorController.createColaborador);
router.put('/:id', colaboradorController.updateColaborador);
router.delete('/:id', colaboradorController.deleteColaborador);

module.exports = router;
