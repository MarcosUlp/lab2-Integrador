// routes/inicio.js
const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/requireLogin');
const inicioController = require('../controllers/inicioController');

router.get('/', requireLogin, inicioController.mostrarInicio);
router.get('/albumes', requireLogin, inicioController.mostrarAlbumesBuscados);

module.exports = router;
