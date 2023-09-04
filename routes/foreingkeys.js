const express = require('express');
const router = express.Router();
const foreingkeysController = require('../controllers/controllerForeingKey');


router.get('/', foreingkeysController.getAllCiudad);

module.exports = router;