const express = require('express');
const router = express.Router();
const entradaController = require('../controllers/entradaController');
const  upload  = require('../middlewares/multerConfig'); // Asegúrate de actualizar la ruta al archivo de configuración de multer
const  uploadS  = require('../middlewares/multerConfigSalida'); // Asegúrate de actualizar la ruta al archivo de configuración de multer

// Rutas CRUD de entrada
router.get('/', entradaController.getAllEntrada); // Obtener todas las entradas

// Rutas de estadísticas y filtrado
router.get('/topTardes', entradaController.getTopLateEntrants); // Obtener los colaboradores con más entradas tardías
router.get('/buscar-estadisticaMes/:documento/:fecha', entradaController.getEntradasByMonthEstadistica); // Estadísticas por mes

// Rutas de búsqueda por documento
router.get('/buscar/:documento', entradaController.getEntradaByDocumento); // Buscar todas las entradas por documento
router.get('/buscar-entradas/:documento/:fecha', entradaController.getEntradaByDocumentoYFecha); // Buscar entradas por documento y fecha
router.get('/buscar-entradasMes/:documento/:fecha', entradaController.getEntradasByMonth); // Buscar entradas del mes por documento y fecha

// Rutas de búsqueda por fecha y cargo
router.get('/cargo/:fecha/:cargo', entradaController.getEntrada); // Obtener entradas por fecha y cargo
router.get('/:fecha', entradaController.getEntradaByFecha); // Obtener entradas por fecha (esta ruta es la más general y debería ir al final)

// Rutas para crear y actualizar entradas
router.post('/', upload.single('foto_entrada'), entradaController.createEntrada); // Asegúrate de que el nombre del campo ('foto_entrada') coincida con el nombre del campo en el formulario de carga
router.put('/actualizar/:documento_colaborador/:fecha', uploadS.single('foto_salida'), entradaController.updateEntrada); // Actualizar una entrada por documento y fecha

module.exports = router;
