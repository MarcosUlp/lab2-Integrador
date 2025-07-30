const express = require('express');
const router = express.Router();
const notiController = require('../controllers/notificacionesController');
const requireLogin = require('../middlewares/requireLogin');

router.get('/listado', requireLogin, notiController.listar);
router.post('/marcar-vistas', requireLogin, notiController.marcarVistas);
// routes/notificaciones.js
router.get('/api/recientes', requireLogin, notiController.obtenerRecientes);

module.exports = router;
