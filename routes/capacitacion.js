const express = require('express');
const router = express.Router();
const capacitacionController = require('../controllers/capacitacionController');

// Rutas CRUD de colaborador
router.post('/', capacitacionController.crateCapacitacion);
router.get('/', capacitacionController.getAllCapacitacion);


module.exports = router;