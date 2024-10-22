const express = require('express');
const router = express.Router();
const likesComentariosController = require('../controllers/interaccionesController');

// Rutas CRUD de colaborador

router.post('/crearLikes/:anuncioId/:id', likesComentariosController.createLikes);
router.post('/crearComentarios/:anuncioId/:id', likesComentariosController.createComentarios);
router.get('/comentariosAnuncio/:anuncioId', likesComentariosController.getComentariosPorAnuncio);



module.exports = router;
