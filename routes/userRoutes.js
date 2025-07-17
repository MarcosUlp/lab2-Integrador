const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const { uploadPerfil, uploadPortada } = require('../middlewares/upload');
const requireLogin = require('../middlewares/requireLogin');
const userController = require('../controllers/userController');

// Ver mi perfil (ya lo hicimos antes con GET '/')
router.post('/subir-perfil', requireLogin, uploadPerfil.single('foto_perfil'), userController.subirPerfil);
router.post('/subir-portada', requireLogin, uploadPortada.single('foto_portada'), userController.subirPortada);

// Ver perfil de otro usuario
router.get('/perfilVisitado/:id', userController.perfilVisitado);

module.exports = router;

