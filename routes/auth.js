const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Mostrar formularios
router.get('/register', authController.showRegister);
router.get('/login', authController.showLogin);

// Procesar formularios
router.post('/register', authController.register);
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
