const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');



router.get('/', productosController.getAllProducts);
router.get('/solicitudes', productosController.getAllRequestClient);
router.get('/buscar-puntos/:documento', productosController.getPuntosSumadosByDocumento);
router.get('/buscar-solicitudes/:documento', productosController.getAllRequesByDocument);
router.post('/', productosController.createProducst);
router.put('/:documento_colaborador/:solicitudId',productosController.updateR)
router.post('/solicitud', productosController.createRequest);
module.exports = router;