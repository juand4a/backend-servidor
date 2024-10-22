const express = require('express');
const router = express.Router();
const negociosController = require('../controllers/negociosController');

// Rutas para manejar los negocios
router.post('/negocios', negociosController.createNegocio);
router.get('/negocios', negociosController.getAllNegocios);
router.get('/negocios/:id', negociosController.getNegocioById);
router.put('/negocios/:id', negociosController.updateNegocio);
router.delete('/negocios/:id', negociosController.deleteNegocio);

module.exports = router;
