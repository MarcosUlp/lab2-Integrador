const express = require('express');
const router = express.Router();
const busquedaController = require('../controllers/busquedaController');
const requireLogin = require('../middlewares/requireLogin');

router.get('/', busquedaController.buscar); // ejemplo: /buscar?q=algo

module.exports = router;
