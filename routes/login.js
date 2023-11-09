const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Ruta de inicio de sesión
router.post('/', loginController.login);
router.post('/logout', loginController.logout);
router.post('/codigo', loginController.sendCodeByEmail);
router.post('/verificacion_codigo', loginController.verifyCode);
router.put('/update', loginController.updatePassword);

module.exports = router;
