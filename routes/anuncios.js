const express = require('express');
const router = express.Router();
const anunciosController = require('../controllers/anunciosController');

// Rutas CRUD de colaborador
router.post('/', anunciosController.createAnuncio);
router.get('/', anunciosController.getAllAnuncios);
router.get('/anuncio_birthday', anunciosController.getAllAnunciosCumpleaños);


module.exports = router;