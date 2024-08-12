const express = require('express');
const router = express.Router();
const loginController = require('../controllers/authController');

// Ruta de inicio de sesión
router.post('/login', loginController.login);
router.post('/logout', loginController.logout);
router.post('/send-code', loginController.sendCodeByEmail);
router.post('/verify-code', loginController.verifyCode);
router.put('/update-password', loginController.updatePassword);

module.exports = router;
