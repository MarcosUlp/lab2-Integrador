const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/editarPerfilController');
const requireLogin = require('../middlewares/requireLogin');

router.get('/', requireLogin, perfilController.editarPerfilForm);
router.post('/', requireLogin, perfilController.actualizarPerfil);

module.exports = router;
