const express = require('express');
const router = express.Router();
const EncuestaVehiculo = require('../controllers/encuestaVehicularController');

// Rutas CRUD de colaborador
router.get('/encuestaVehicular/:fecha', EncuestaVehiculo.getEncuestasVehicularesConColaboradorYCargoYDetalles);
router.get('/elementosProteccion', EncuestaVehiculo.getCountAndNameByIdElementoProteccion);
router.get('/herramientasVehiculo', EncuestaVehiculo.getHerramientasPorcentaje);
router.get('/nivelesVehiculo', EncuestaVehiculo.getNivelesPorcentaje);
router.get('/papelesVehiculo', EncuestaVehiculo.getPapelesPorcentaje);


module.exports = router;
