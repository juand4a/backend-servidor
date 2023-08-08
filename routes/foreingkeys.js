const express = require('express');
const router = express.Router();
const foreingkeysController = require('../controllers/controllerForeingKey');


router.get('/', foreingkeysController.getAllGenero);

module.exports = router;