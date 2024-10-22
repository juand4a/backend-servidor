const express = require('express');
const router = express.Router();
const colaboradorController = require('../controllers/colaboradorController');
const  upload  = require('../middlewares/SubirFoto'); // Asegúrate de actualizar la ruta al archivo de configuración de multer

// Rutas CRUD de colaborador
router.get('/:cargo', colaboradorController.getAllColaboradores);
router.get('/total_genero/:cargo', colaboradorController.getAllColaboradoresByGenero);
router.get('/total_colaborador/:cargo', colaboradorController.getAllColaboradoresTotal);
router.get('/total_cargo', colaboradorController.getAllColaboradoresByCargo);
router.get('/total_cargo_aprendiz', colaboradorController.getAllColaboradoresByAprendiz);
router.get('/:id', colaboradorController.getColaboradorById);
router.post('/', colaboradorController.createColaborador);
router.put('/:documento_colaborador', colaboradorController.updateColaborador);
router.delete('/:id', colaboradorController.deleteColaborador);
router.get('/colaboradores/cargo17', colaboradorController.getColaboradoresByCargo17);
router.get('/colaboradores/multiple-cargos',colaboradorController.getColaboradoresByCodigoVendedor);
router.patch('/colaborador/:documento_colaborador', colaboradorController.updateColaboradorStatus);


module.exports = router;
