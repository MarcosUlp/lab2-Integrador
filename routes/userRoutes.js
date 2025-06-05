const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const userController = require('../controllers/userController');

router.get('/register', userController.showRegister);//mostrar formulario de registro
router.post('/register', userController.register);//Procesar formulario de registro

router.get('/login', userController.showLogin);//Mostrar formulario de login
router.post('/login', userController.login);//procesar login

router.post('/logout', userController.logout);//Logout
module.exports = router;
