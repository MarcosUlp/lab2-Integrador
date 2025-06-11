const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { uploadPerfil, uploadPortada } = require('../middlewares/upload');

router.get('/register', userController.showRegister);//mostrar formulario de registro
router.post('/register', userController.register);//Procesar formulario de registro

router.get('/login', userController.showLogin);//Mostrar formulario de login
router.post('/login', userController.login);//procesar login


router.get('/logout', userController.logout);//Logout

router.post('/subir-perfil', requireLogin, uploadPerfil.single('foto'), usuarioController.subirPerfil);
router.post('/subir-portada', requireLogin, uploadPortada.single('foto'), usuarioController.subirPortada);

module.exports = router;
