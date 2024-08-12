const express = require('express');
const router = express.Router();
const colillas = require('../controllers/colillasController');

// Rutas CRUD de colaborador
router.post('/', colillas.createColillasForAllColaboradores);
// router.get('/', colillas.getAllColillas);

module.exports = router;
