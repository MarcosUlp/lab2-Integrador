const express = require('express');
const router = express.Router();
const notiController = require('../controllers/notificacionController');
const requireLogin = require('../middlewares/requireLogin');

router.get('/', requireLogin, notiController.listar);
router.post('/marcar-vistas', requireLogin, notiController.marcarVistas);

module.exports = router;
